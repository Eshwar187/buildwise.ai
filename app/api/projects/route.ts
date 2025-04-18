import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getProjectsByUserId, getUserByClerkId, createProject, createFloorPlan } from "@/lib/mongodb-models"
import { connectToDatabase } from "@/lib/mongodb"
import { copyFloorPlanTemplate } from "@/lib/floor-plan-utils"

// Add cache headers to improve performance
const cacheHeaders = {
  "Cache-Control": "max-age=10, stale-while-revalidate=59"
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await getUserByClerkId(userId)
    if (!user) {
      // If user not found, return empty projects array instead of error
      return NextResponse.json({ projects: [] })
    }

    // Get projects for this user
    console.log(`Getting projects for Clerk user ID: ${userId}`)
    const projects = await getProjectsByUserId(userId)
    console.log(`Retrieved ${projects.length} projects from database for user ${userId}`)

    // Log the first project if available for debugging
    if (projects.length > 0) {
      console.log('First project:', {
        id: projects[0]._id,
        name: projects[0].name,
        userId: projects[0].userId
      })
    }

    return NextResponse.json({ projects }, { headers: cacheHeaders })
  } catch (error) {
    console.error("Error fetching projects:", error)
    // Return empty projects array instead of error
    return NextResponse.json({ projects: [] }, { headers: cacheHeaders })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

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

    // Use the createProject function from mongodb-models
    const project = await createProject({
      userId,
      name: body.name,
      description: body.description,
      landDimensions: body.landDimensions,
      landUnit: body.landUnit || "sq ft",
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
    })

    // Check if a floor plan template was selected
    if (body.floorPlanTemplateId) {
      try {
        console.log(`Copying floor plan template ${body.floorPlanTemplateId} to project ${project._id.toString()}`);

        // Copy the floor plan template to the project
        const imageUrl = copyFloorPlanTemplate(body.floorPlanTemplateId, project._id.toString());
        console.log(`Template copied successfully, image URL: ${imageUrl}`);

        // Create a floor plan record
        const floorPlan = await createFloorPlan({
          projectId: project._id.toString(),
          userId,
          imageUrl,
          aiPrompt: "Template floor plan",
          description: `Floor plan based on template ${body.floorPlanTemplateId}`,
          generatedBy: "template", // Using template as the generator type
        });

        console.log(`Floor plan record created: ${floorPlan?._id || 'unknown'}`);
      } catch (templateError) {
        console.error("Error copying floor plan template:", templateError);
        // Continue even if template copying fails
      }
    }

    // Return the created project
    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

