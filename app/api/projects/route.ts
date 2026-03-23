import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { copyFloorPlanTemplate } from "@/lib/floor-plan-utils"
import { errorResponse, successResponse } from "@/lib/api"
import { projectCreateSchema } from "@/lib/validation"
import { createUserProject, listUserProjects } from "@/lib/project-fallback"

const cacheHeaders = {
  "Cache-Control": "max-age=10, stale-while-revalidate=59",
}

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

export async function GET() {
  try {
    const userId = await getAuthFromCookies()

    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const supabase = await createClient()
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (projectsError) {
      if (isMissingProjectsTable(projectsError)) {
        console.warn("Supabase table public.projects not found, using local fallback storage.")
        const fallbackProjects = listUserProjects(userId).map(mapProjectToFrontend)
        return successResponse({ projects: fallbackProjects }, { headers: cacheHeaders })
      }
      console.error("Error fetching projects:", projectsError)
      return errorResponse("Failed to fetch projects", 500, "database_error")
    }

    const formattedProjects = (projects || []).map(mapProjectToFrontend)
    return successResponse({ projects: formattedProjects }, { headers: cacheHeaders })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthFromCookies()

    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const parsedBody = await request.json().catch(() => null)
    const body = projectCreateSchema.safeParse(parsedBody)

    if (!body.success) {
      return errorResponse(
        body.error.issues[0]?.message || "Project name and description are required",
        400,
        "validation_error",
        body.error.flatten()
      )
    }

    const projectInput = body.data
    const supabase = await createClient()

    const projectData = {
      user_id: userId,
      name: projectInput.name,
      description: projectInput.description,
      land_dimensions: projectInput.landDimensions,
      land_unit: projectInput.landUnit || "sq ft",
      budget: projectInput.budget,
      currency: projectInput.currency || "USD",
      location: projectInput.location,
      preferences: projectInput.preferences,
      status: "Planning",
    }

    const { data: project, error: insertError } = await supabase
      .from("projects")
      .insert(projectData)
      .select()
      .single()

    if (insertError || !project) {
      if (isMissingProjectsTable(insertError)) {
        console.warn("Supabase table public.projects not found, saving project to local fallback storage.")
        const fallbackProject = createUserProject(userId, {
          name: projectInput.name,
          description: projectInput.description,
          land_dimensions: projectInput.landDimensions,
          land_unit: projectInput.landUnit || "sq ft",
          budget: projectInput.budget,
          currency: projectInput.currency || "USD",
          location: projectInput.location,
          preferences: projectInput.preferences as Record<string, unknown>,
          status: "Planning",
          designer_recommendations: [],
          material_recommendations: [],
          energy_recommendations: [],
        })
        return successResponse({ project: mapProjectToFrontend(fallbackProject) }, { status: 201 })
      }
      console.error("Error inserting project:", insertError)
      return errorResponse("Failed to create project", 500, "database_error")
    }

    if (projectInput.floorPlanTemplateId) {
      try {
        const imageUrl = copyFloorPlanTemplate(projectInput.floorPlanTemplateId, project.id)

        if (imageUrl) {
          const { error: fpError } = await supabase.from("floor_plans").insert({
            project_id: project.id,
            user_id: userId,
            image_url: imageUrl,
            ai_prompt: "Template floor plan",
            description: `Floor plan based on template ${projectInput.floorPlanTemplateId}`,
            generated_by: "template",
          })

          if (fpError) {
            console.error("Error creating floor plan record:", fpError)
          }
        }
      } catch (templateError) {
        console.error("Error copying floor plan template:", templateError)
      }
    }

    if (projectInput.floorPlan?.imageUrl) {
      const { error: floorPlanError } = await supabase.from("floor_plans").insert({
        project_id: project.id,
        user_id: userId,
        image_url: projectInput.floorPlan.imageUrl,
        ai_prompt: projectInput.floorPlan.aiPrompt || "",
        description: projectInput.floorPlan.description || "",
        generated_by: projectInput.floorPlan.generatedBy || "gemini",
      })

      if (floorPlanError) {
        console.error("Error saving inline floor plan:", floorPlanError)
      }
    }

    const formattedProject = mapProjectToFrontend(project)
    return successResponse({ project: formattedProject }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return errorResponse("Internal server error", 500)
  }
}
