import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// POST endpoint to add a designer to a project's recommendations
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
      .select('id, user_id, designer_recommendations')
      .eq('id', projectId)
      .single()

    if (projError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get designer ID from request
    const { designerId } = await req.json()
    if (!designerId) {
      return NextResponse.json({ error: "Designer ID is required" }, { status: 400 })
    }

    // Add the designer to the project's recommendations if not already added
    const designerRecommendations: string[] = project.designer_recommendations || []
    if (!designerRecommendations.includes(designerId)) {
      designerRecommendations.push(designerId)
    }

    // Update the project
    const { error: updateError } = await supabase
      .from('projects')
      .update({ designer_recommendations: designerRecommendations })
      .eq('id', projectId)

    if (updateError) {
      console.error("Error updating project:", updateError)
      return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      designerRecommendations
    }, { status: 200 })
  } catch (error: any) {
    console.error("Error adding designer recommendation:", error)
    return NextResponse.json(
      { error: error.message || "Failed to add designer recommendation" },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove a designer from a project's recommendations
export async function DELETE(
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
      .select('id, user_id, designer_recommendations')
      .eq('id', projectId)
      .single()

    if (projError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get designer ID from query param or body
    const url = new URL(req.url)
    let designerId = url.searchParams.get("designerId")

    if (!designerId) {
      try {
        const body = await req.json()
        designerId = body.designerId
      } catch {
        // no body
      }
    }

    if (!designerId) {
      return NextResponse.json({ error: "Designer ID is required" }, { status: 400 })
    }

    // Remove the designer from the project's recommendations
    const designerRecommendations: string[] = (project.designer_recommendations || []).filter(
      (id: string) => id !== designerId
    )

    // Update the project
    const { error: updateError } = await supabase
      .from('projects')
      .update({ designer_recommendations: designerRecommendations })
      .eq('id', projectId)

    if (updateError) {
      console.error("Error updating project:", updateError)
      return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      designerRecommendations
    }, { status: 200 })
  } catch (error: any) {
    console.error("Error removing designer recommendation:", error)
    return NextResponse.json(
      { error: error.message || "Failed to remove designer recommendation" },
      { status: 500 }
    )
  }
}
