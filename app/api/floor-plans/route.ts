import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { saveImageToPublic } from "@/lib/image-storage"

// Function to generate floor plan description using Gemini API
async function generateFloorPlanDescription(prompt: string) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined")
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a detailed floor plan description for the following requirements: ${prompt}.
                  Include room dimensions, layout suggestions, and energy efficiency considerations.
                  Format the response in a structured way with sections for each room and area.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("Gemini API error:", data)
      throw new Error(`Gemini API error: ${data.error?.message || "Unknown error"}`)
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("Error generating floor plan description:", error)
    throw error
  }
}

// Function to generate floor plan image using Groq API
async function generateFloorPlanImage(description: string) {
  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not defined")
    }

    const response = await fetch("https://api.groq.com/openai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        prompt: `Create a detailed, professional architectural floor plan based on this description: ${description}.
        The floor plan should be top-down view, with clear room labels, dimensions, and a clean, modern design.
        Use a color scheme that's easy to read with walls in black, rooms in light colors, and furniture indicated.`,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Groq API error:", data)
      throw new Error(`Groq API error: ${data.error?.message || "Unknown error"}`)
    }

    return data.data[0].url
  } catch (error) {
    console.error("Error generating floor plan image:", error)
    throw error
  }
}

// POST endpoint to generate a floor plan
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, prompt } = await req.json()
    if (!projectId || !prompt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the project exists and belongs to the user
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('id, user_id')
      .eq('id', projectId)
      .single()

    if (projError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    if (project.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Generate floor plan description using Gemini
    const description = await generateFloorPlanDescription(prompt)

    // Generate floor plan image using Groq
    const apiImageUrl = await generateFloorPlanImage(description)

    // Save the image to the public folder
    console.log("Saving floor plan image to public folder...")
    const localImageUrl = await saveImageToPublic(apiImageUrl, projectId, 'floor-plan')
    console.log("Image saved to:", localImageUrl)

    // Save the floor plan to the database
    const { data: floorPlan, error: insertError } = await supabase
      .from('floor_plans')
      .insert({
        project_id: projectId,
        user_id: userId,
        image_url: localImageUrl,
        ai_prompt: prompt,
        description,
        generated_by: "gemini",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error saving floor plan:", insertError)
      return NextResponse.json({ error: "Failed to save floor plan" }, { status: 500 })
    }

    return NextResponse.json({ success: true, floorPlan }, { status: 201 })
  } catch (error: any) {
    console.error("Error generating floor plan:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate floor plan" },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve floor plans for a project
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const projectId = url.searchParams.get("projectId")
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId parameter" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the project exists and belongs to the user
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('id, user_id')
      .eq('id', projectId)
      .single()

    if (projError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    if (project.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Return the floor plans for this project
    const { data: floorPlans, error } = await supabase
      .from('floor_plans')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching floor plans:", error)
      return NextResponse.json({ floorPlans: [] }, { status: 200 })
    }

    return NextResponse.json({ floorPlans: floorPlans || [] }, { status: 200 })
  } catch (error: any) {
    console.error("Error retrieving floor plans:", error)
    return NextResponse.json(
      { error: error.message || "Failed to retrieve floor plans" },
      { status: 500 }
    )
  }
}
