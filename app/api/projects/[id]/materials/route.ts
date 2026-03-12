import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// POST endpoint to add a material to a project's recommendations
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
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id, material_recommendations')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get material ID from request
    const { materialId } = await req.json()
    if (!materialId) {
      return NextResponse.json({ error: "Material ID is required" }, { status: 400 })
    }

    // Add the material to the project's recommendations if not already added
    const materialRecommendations = project.material_recommendations || []
    if (!materialRecommendations.includes(materialId)) {
      materialRecommendations.push(materialId)
    }

    // Update the project
    const { error: updateError } = await supabase
      .from('projects')
      .update({ material_recommendations: materialRecommendations })
      .eq('id', projectId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      materialRecommendations
    }, { status: 200 })
  } catch (error: any) {
    console.error("Error adding material recommendation:", error)
    return NextResponse.json(
      { error: error.message || "Failed to add material recommendation" },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove a material from a project's recommendations
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
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id, material_recommendations')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get material ID from request
    const url = new URL(req.url)
    let materialId = url.searchParams.get("materialId")

    if (!materialId) {
      // Try to get from request body
      try {
        const body = await req.json()
        materialId = body.materialId
      } catch (e) {
        // Body might be empty
      }
    }

    if (!materialId) {
      return NextResponse.json({ error: "Material ID is required" }, { status: 400 })
    }

    // Remove the material from the project's recommendations
    const materialRecommendations = project.material_recommendations || []
    const updatedRecommendations = materialRecommendations.filter(
      (id: string) => id !== materialId
    )

    // Update the project
    const { error: updateError } = await supabase
      .from('projects')
      .update({ material_recommendations: updatedRecommendations })
      .eq('id', projectId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      materialRecommendations: updatedRecommendations
    }, { status: 200 })
  } catch (error: any) {
    console.error("Error removing material recommendation:", error)
    return NextResponse.json(
      { error: error.message || "Failed to remove material recommendation" },
      { status: 500 }
    )
  }
}

