import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// POST endpoint to add a floor plan to a project
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: projectId } = await params
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the project to verify ownership
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

    // Get floor plan data from request
    const floorPlanData = await req.json()

    // Insert the floor plan into the floor_plans table
    const { data: floorPlan, error: insertError } = await supabase
      .from('floor_plans')
      .insert({
        project_id: projectId,
        user_id: userId,
        image_url: floorPlanData.imageUrl,
        description: floorPlanData.description || "",
        dimensions: floorPlanData.dimensions || null,
        rooms: floorPlanData.rooms || null,
        generated_by: floorPlanData.generatedBy || "gemini",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error saving floor plan:", insertError)
      return NextResponse.json({ error: "Failed to save floor plan" }, { status: 500 })
    }

    return NextResponse.json({ success: true, floorPlan }, { status: 201 })
  } catch (error: any) {
    console.error("Error adding floor plan:", error)
    return NextResponse.json(
      { error: error.message || "Failed to add floor plan" },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve floor plans for a project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: projectId } = await params
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the project to verify ownership
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
