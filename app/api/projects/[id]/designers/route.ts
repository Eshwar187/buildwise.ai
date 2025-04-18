import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getProjectById, updateProject } from "@/lib/mongodb-models"

// POST endpoint to add a designer to a project's recommendations
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
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

    // Get designer ID from request
    const { designerId } = await req.json()
    if (!designerId) {
      return NextResponse.json({ error: "Designer ID is required" }, { status: 400 })
    }

    // Add the designer to the project's recommendations if not already added
    const designerRecommendations = project.designerRecommendations || []
    if (!designerRecommendations.includes(designerId)) {
      designerRecommendations.push(designerId)
    }

    // Update the project
    await updateProject(projectId, { designerRecommendations })

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
  { params }: { params: { id: string } }
) {
  try {
    const { userId } =await auth()
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

    // Get designer ID from request
    const url = new URL(req.url)
    const designerId = url.searchParams.get("designerId")

    if (!designerId) {
      // Try to get from request body
      const body = await req.json()
      if (!body.designerId) {
        return NextResponse.json({ error: "Designer ID is required" }, { status: 400 })
      }
    }

    // Remove the designer from the project's recommendations
    const designerRecommendations = project.designerRecommendations || []
    const updatedRecommendations: string[] = designerRecommendations.filter(
      (id: string) => id !== designerId
    )

    // Update the project
    await updateProject(projectId, { designerRecommendations: updatedRecommendations })

    return NextResponse.json({
      success: true,
      designerRecommendations: updatedRecommendations
    }, { status: 200 })
  } catch (error: any) {
    console.error("Error removing designer recommendation:", error)
    return NextResponse.json(
      { error: error.message || "Failed to remove designer recommendation" },
      { status: 500 }
    )
  }
}
