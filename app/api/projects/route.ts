import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { copyFloorPlanTemplate } from "@/lib/floor-plan-utils"

// Add cache headers to improve performance
const cacheHeaders = {
  "Cache-Control": "max-age=10, stale-while-revalidate=59"
}

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

export async function GET(request: Request) {
  try {
    const userId = await getAuthFromCookies()
    console.log('GET /api/projects - Auth userId:', userId)

    if (!userId) {
      console.log('GET /api/projects - No userId found in auth')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get projects for this user
    console.log(`GET /api/projects - Getting projects for user ${userId}`)
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error("Error fetching projects:", projectsError)
      return NextResponse.json({ projects: [] }, { headers: cacheHeaders })
    }

    const formattedProjects = (projects || []).map(mapProjectToFrontend)

    return NextResponse.json({ projects: formattedProjects }, { headers: cacheHeaders })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ projects: [] }, { headers: cacheHeaders })
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthFromCookies()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json({ error: "Project name and description are required" }, { status: 400 })
    }

    if (!body.landDimensions || !body.landDimensions.length || !body.landDimensions.width) {
      return NextResponse.json({ error: "Land dimensions are required" }, { status: 400 })
    }

    if (!body.budget) {
      return NextResponse.json({ error: "Budget is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert project
    const projectData = {
      user_id: userId,
      name: body.name,
      description: body.description,
      land_dimensions: body.landDimensions,
      land_unit: body.landUnit || "sq ft",
      budget: body.budget,
      currency: body.currency || "USD",
      location: body.location || {
        country: "",
        state: "",
        city: "",
      },
      preferences: body.preferences || {
        rooms: {
          bedrooms: 2,
          bathrooms: 2,
          kitchen: true,
          livingRoom: true,
          diningRoom: true,
          study: false,
          garage: false,
        },
        style: "Modern",
        stories: 1,
        energyEfficient: true,
        accessibility: false,
        outdoorSpace: true
      },
      status: "Planning"
    }

    const { data: project, error: insertError } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (insertError || !project) {
      console.error("Error inserting project:", insertError)
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    // Check if a floor plan template was selected
    if (body.floorPlanTemplateId) {
      try {
        console.log(`Copying floor plan template ${body.floorPlanTemplateId} to project ${project.id}`);

        // Copy the floor plan template to the project
        const imageUrl = copyFloorPlanTemplate(body.floorPlanTemplateId, project.id);
        console.log(`Template copied successfully, image URL: ${imageUrl}`);
        
        // Create a floor plan record
        const { error: fpError } = await supabase
          .from('floor_plans')
          .insert({
            project_id: project.id,
            user_id: userId,
            image_url: imageUrl,
            ai_prompt: "Template floor plan",
            description: `Floor plan based on template ${body.floorPlanTemplateId}`,
            generated_by: "template"
          })

        if (fpError) {
          console.error("Error creating floor plan record:", fpError)
        }
      } catch (templateError) {
        console.error("Error copying floor plan template:", templateError);
      }
    }

    const formattedProject = mapProjectToFrontend(project)
    return NextResponse.json({ project: formattedProject })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

