import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getProjectById, updateProject } from "@/lib/mongodb-models"
import { ObjectId } from "mongodb"

// POST endpoint to add a floor plan to a project
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Get the project to verify ownership
    const project = await getProjectById(projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get floor plan data from request
    const floorPlanData = await req.json()

    // Create a new floor plan object
    const floorPlan = {
      _id: new ObjectId(),
      projectId,
      userId,
      imageUrl: floorPlanData.imageUrl,
      description: floorPlanData.description || "",
      dimensions: floorPlanData.dimensions || undefined,
      rooms: floorPlanData.rooms || undefined,
      generatedBy: floorPlanData.generatedBy || "gemini",
      createdAt: new Date(),
    }

    // Add the floor plan to the project
    const floorPlans = project.floorPlans || []
    floorPlans.push(floorPlan)

    // Update the project
    await updateProject(projectId, { floorPlans })

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
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Get the project to verify ownership
    const project = await getProjectById(projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Return the floor plans
    return NextResponse.json({ floorPlans: project.floorPlans || [] }, { status: 200 })
  } catch (error: any) {
    console.error("Error retrieving floor plans:", error)
    return NextResponse.json(
      { error: error.message || "Failed to retrieve floor plans" },
      { status: 500 }
    )
  }
}
