import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import path from "path"
import fs from "fs"

// Function to generate material recommendations using Gemini API
async function generateMaterialRecommendations(projectData: any, retryCount = 0, maxRetries = 2) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    console.log("GEMINI_API_KEY available:", !!GEMINI_API_KEY)

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined")
    }

    console.log("Generating material recommendations using Gemini API...")

    // Prepare the prompt for Gemini
    const prompt = `
      Generate material recommendations for a construction project with the following details:
      - Building type: ${projectData.preferences?.style || 'Modern'} style
      - Budget: ${projectData.budget} ${projectData.currency || 'USD'}
      - Location: ${projectData.location?.city || ''}, ${projectData.location?.state || ''}, ${projectData.location?.country || ''}
      - Size: ${projectData.landDimensions?.length || 0} x ${projectData.landDimensions?.width || 0} ${projectData.landUnit || 'sq ft'}
      - Rooms: ${projectData.preferences?.rooms?.bedrooms || 2} bedrooms, ${projectData.preferences?.rooms?.bathrooms || 2} bathrooms
      - Energy efficient: ${projectData.preferences?.energyEfficient ? 'Yes' : 'No'}
      - Accessibility features: ${projectData.preferences?.accessibility ? 'Yes' : 'No'}
      - Outdoor space: ${projectData.preferences?.outdoorSpace ? 'Yes' : 'No'}
      - Additional description: ${projectData.description || ''}

      For each material, provide:
      1. Name
      2. Category (Flooring, Roofing, Insulation, Windows, Foundation, Electrical, Plumbing, Finishes, etc.)
      3. Description (50-100 words)
      4. Cost per unit (in ${projectData.currency || 'USD'})
      5. Unit of measurement
      6. Sustainability rating (1-10)
      7. Durability rating (1-10)
      8. Energy efficiency rating (1-10)
      9. Whether it's locally available (true/false)

      Format the response as a JSON array of material objects. Each object should have the following structure:
      {
        "name": "Material Name",
        "category": "Category",
        "description": "Description text",
        "costPerUnit": 100,
        "unit": "sq ft",
        "currency": "${projectData.currency || 'USD'}",
        "sustainability": 8,
        "durability": 9,
        "energyEfficiency": 7,
        "locallyAvailable": true
      }

      Provide at least 8 different materials across various categories that would be appropriate for this project.

      IMPORTANT: Your response must be a valid JSON array only, with no additional text before or after.
    `

    // Call Gemini API with timeout
    console.log("Making request to Gemini API...")

    // Create an AbortController to handle timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response;
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a construction materials expert. Provide detailed, accurate material recommendations based on project requirements.

${prompt}

IMPORTANT: Your response must be a valid JSON array only, with no additional text before or after.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          }
        }),
        signal: controller.signal
      })

      console.log("Gemini API response status:", response.status)

      // Clear the timeout since we got a response
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Gemini API error:", errorData)
        throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`)
      }
    } catch (fetchError) {
      // Clear the timeout
      clearTimeout(timeoutId);

      // Check if this was a timeout
      if (fetchError.name === 'AbortError') {
        throw new Error('Groq API request timed out after 30 seconds');
      }

      // Re-throw other errors
      throw fetchError;
    }

    const data = await response.json()
    console.log("Gemini API response received, parsing content...")

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
      console.error("Unexpected Gemini API response format:", JSON.stringify(data))
      throw new Error("Unexpected response format from Gemini API")
    }

    const content = data.candidates[0].content.parts[0].text
    console.log("Content length:", content.length)
    console.log("Content preview:", content.substring(0, 100) + "...")

    // Extract JSON from the response
    let materials
    try {
      // Try to parse the entire response as JSON
      console.log("Attempting to parse entire content as JSON...")
      materials = JSON.parse(content)
      console.log("Successfully parsed content as JSON")
    } catch (e) {
      console.log("Failed to parse entire content as JSON, trying to extract JSON array...")
      // If that fails, try to extract JSON from the text
      const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s)
      if (jsonMatch) {
        console.log("Found JSON array in content, parsing...")
        materials = JSON.parse(jsonMatch[0])
        console.log("Successfully parsed extracted JSON")
      } else {
        console.error("Could not find JSON array in content")
        throw new Error("Failed to parse materials JSON from response")
      }
    }

    console.log(`Parsed ${materials.length} materials from response`)

    // Add image URLs and other missing fields
    const enhancedMaterials = materials.map((material: any, index: number) => {
      // Map categories to image files
      const categoryImageMap: Record<string, string> = {
        "Flooring": "hardwood-floor.jpg",
        "Windows": "window.jpg",
        "Insulation": "insulation.jpg",
        "Roofing": "solar-roof.jpg",
        "Foundation": "concrete.jpg",
        "Electrical": "wiring.jpg",
        "Plumbing": "concrete.jpg", // Fallback
        "Finishes": "hardwood-floor.jpg", // Fallback
      }

      // Get image based on category or use a default
      const imageFile = categoryImageMap[material.category] ||
                        Object.values(categoryImageMap)[index % Object.values(categoryImageMap).length]

      return {
        ...material,
        _id: `generated-material-${index + 1}`,
        imageUrl: `/images/materials/${imageFile}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return enhancedMaterials
  } catch (error) {
    console.error(`Error generating material recommendations (attempt ${retryCount + 1}/${maxRetries + 1}):`, error)

    // Retry logic
    if (retryCount < maxRetries) {
      console.log(`Retrying... (${retryCount + 1}/${maxRetries})`)
      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, retryCount) * 1000
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return generateMaterialRecommendations(projectData, retryCount + 1, maxRetries)
    }

    throw error
  }
}

// POST endpoint to generate real-time material recommendations
export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user ID
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to generate materials." }, { status: 401 })
    }

    const projectData = await req.json()

    if (!projectData) {
      return NextResponse.json({ error: "Missing project data" }, { status: 400 })
    }

    console.log("Received project data for material recommendations:", {
      style: projectData.preferences?.style,
      budget: projectData.budget,
      location: projectData.location
    })

    // Generate material recommendations
    console.log("Generating material recommendations...")
    const materials = await generateMaterialRecommendations(projectData)
    console.log(`Generated ${materials.length} material recommendations`)

    return NextResponse.json({
      success: true,
      materials
    }, { status: 200 })
  } catch (error: any) {
    console.error("Error generating real-time material recommendations:", error)

    // Return error response with no fallback data
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to generate material recommendations",
      materials: []
    }, { status: 500 })
  }
}
