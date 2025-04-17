import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getProjectById, updateProject } from "@/lib/mongodb-models"

// POST endpoint to add a material to a project's recommendations
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

    // Get material ID from request
    const { materialId } = await req.json()
    if (!materialId) {
      return NextResponse.json({ error: "Material ID is required" }, { status: 400 })
    }

    // Add the material to the project's recommendations if not already added
    const materialRecommendations = project.materialRecommendations || []
    if (!materialRecommendations.includes(materialId)) {
      materialRecommendations.push(materialId)
    }

    // Update the project
    await updateProject(projectId, { materialRecommendations })

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

    // Get material ID from request
    const url = new URL(req.url)
    const materialId = url.searchParams.get("materialId")

    if (!materialId) {
      // Try to get from request body
      const body = await req.json()
      if (!body.materialId) {
        return NextResponse.json({ error: "Material ID is required" }, { status: 400 })
      }
    }

    // Remove the material from the project's recommendations
    const materialRecommendations = project.materialRecommendations || []
    const updatedRecommendations = materialRecommendations.filter(
      id => id !== materialId
    )

    // Update the project
    await updateProject(projectId, { materialRecommendations: updatedRecommendations })

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
