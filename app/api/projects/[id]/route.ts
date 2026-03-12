import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// Helpers to map Supabase snake_case to frontend camelCase expectations
function mapProjectToFrontend(p: any) {
  if (!p) return null
  return {
    ...p,
    _id: p.id,
    userId: p.user_id,
    landDimensions: p.land_dimensions,
    landUnit: p.land_unit,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    designerRecommendations: p.designer_recommendations,
    materialRecommendations: p.material_recommendations,
    energyRecommendations: p.energy_recommendations
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthFromCookies()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: projectId } = await params
    const supabase = await createClient()

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if the user owns this project
    if (project.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(mapProjectToFrontend(project))
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthFromCookies()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: projectId } = await params
    const supabase = await createClient()

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (deleteError) {
      console.error("Error deleting project:", deleteError)
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
