import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createFloorPlan, getProjectById } from "@/lib/mongodb-models"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.projectId || !body.landArea || !body.landUnit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if the project exists and belongs to the user
    const project = await getProjectById(body.projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // In a real app, you would call the Hugging Face API here
    // const response = await fetch('https://api.huggingface.co/models/...', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     inputs: `Generate a floor plan for a ${body.landArea} ${body.landUnit} building`,
    //   }),
    // });

    // const result = await response.json();
    // const imageUrl = result.output_url; // This would be the URL to the generated image

    // For now, we'll use a placeholder
    const aiPrompt = `Generate a floor plan for a ${body.landArea} ${body.landUnit} ${body.buildingType || "building"} with ${body.rooms || "3"} rooms`
    const imageUrl = "/placeholder.svg?height=600&width=800"

    // Save the floor plan to the database
    const floorPlan = await createFloorPlan({
      projectId: body.projectId,
      userId,
      imageUrl,
      aiPrompt,
    })

    return NextResponse.json(floorPlan)
  } catch (error) {
    console.error("Error generating floor plan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

