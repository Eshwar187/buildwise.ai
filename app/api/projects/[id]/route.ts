import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { errorResponse, successResponse } from "@/lib/api"
import { deleteUserProject, getUserProject } from "@/lib/project-fallback"

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
    energyRecommendations: p.energy_recommendations,
  }
}

function isMissingProjectsTable(error: unknown) {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "PGRST205"
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthFromCookies()

    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const { id: projectId } = await params
    const supabase = await createClient()

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (projectError || !project) {
      if (isMissingProjectsTable(projectError)) {
        const fallbackProject = getUserProject(userId, projectId)
        if (!fallbackProject) {
          return errorResponse("Project not found", 404, "not_found")
        }
        return successResponse({ project: mapProjectToFrontend(fallbackProject) })
      }
      return errorResponse("Project not found", 404, "not_found")
    }

    if (project.user_id !== userId) {
      return errorResponse("Forbidden", 403, "forbidden")
    }

    return successResponse({ project: mapProjectToFrontend(project) })
  } catch (error) {
    console.error("Error fetching project:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthFromCookies()

    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const { id: projectId } = await params
    const supabase = await createClient()

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, user_id")
      .eq("id", projectId)
      .single()

    if (projectError || !project) {
      if (isMissingProjectsTable(projectError)) {
        const deleted = deleteUserProject(userId, projectId)
        if (!deleted) {
          return errorResponse("Project not found", 404, "not_found")
        }
        return successResponse({})
      }
      return errorResponse("Project not found", 404, "not_found")
    }

    if (project.user_id !== userId) {
      return errorResponse("Forbidden", 403, "forbidden")
    }

    const { error: deleteError } = await supabase.from("projects").delete().eq("id", projectId)

    if (deleteError) {
      console.error("Error deleting project:", deleteError)
      return errorResponse("Failed to delete project", 500, "database_error")
    }

    return successResponse({})
  } catch (error) {
    console.error("Error deleting project:", error)
    return errorResponse("Internal server error", 500)
  }
}
