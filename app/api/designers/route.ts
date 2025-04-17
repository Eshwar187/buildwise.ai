import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { 
  getDesignerById, 
  getDesignersByLocation, 
  getAllDesigners, 
  createDesigner,
  updateDesigner,
  deleteDesigner
} from "@/lib/mongodb-models"

// GET endpoint to retrieve designers
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const designerId = url.searchParams.get("id")
    const country = url.searchParams.get("country")
    const state = url.searchParams.get("state")
    const city = url.searchParams.get("city")

    // If designerId is provided, return that specific designer
    if (designerId) {
      const designer = await getDesignerById(designerId)
      if (!designer) {
        return NextResponse.json({ error: "Designer not found" }, { status: 404 })
      }
      return NextResponse.json({ designer }, { status: 200 })
    }

    // If location parameters are provided, return designers for that location
    if (country && state) {
      const designers = await getDesignersByLocation(country, state, city || undefined)
      return NextResponse.json({ designers }, { status: 200 })
    }

    // Otherwise, return all designers
    const designers = await getAllDesigners()
    return NextResponse.json({ designers }, { status: 200 })
  } catch (error: any) {
    console.error("Error retrieving designers:", error)
    return NextResponse.json(
      { error: error.message || "Failed to retrieve designers" },
      { status: 500 }
    )
  }
}

// POST endpoint to create a new designer
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (in a real app, you would check the user's role)
    // For now, we'll assume they can proceed

    const designerData = await req.json()
    
    // Validate required fields
    const requiredFields = ["name", "email", "phone", "specialization", "experience", "location", "availability"]
    for (const field of requiredFields) {
      if (!designerData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate location fields
    const locationFields = ["country", "state", "city"]
    for (const field of locationFields) {
      if (!designerData.location[field]) {
        return NextResponse.json({ error: `Missing required location field: ${field}` }, { status: 400 })
      }
    }

    // Create the designer
    const designer = await createDesigner(designerData)
    return NextResponse.json({ success: true, designer }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating designer:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create designer" },
      { status: 500 }
    )
  }
}

// PUT endpoint to update a designer
export async function PUT(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (in a real app, you would check the user's role)
    // For now, we'll assume they can proceed

    const { id, ...updateData } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing designer ID" }, { status: 400 })
    }

    // Verify the designer exists
    const designer = await getDesignerById(id)
    if (!designer) {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 })
    }

    // Update the designer
    const result = await updateDesigner(id, updateData)
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to update designer" }, { status: 500 })
    }

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating designer:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update designer" },
      { status: 500 }
    )
  }
}

// DELETE endpoint to delete a designer
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (in a real app, you would check the user's role)
    // For now, we'll assume they can proceed

    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing designer ID" }, { status: 400 })
    }

    // Verify the designer exists
    const designer = await getDesignerById(id)
    if (!designer) {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 })
    }

    // Delete the designer
    const result = await deleteDesigner(id)
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete designer" }, { status: 500 })
    }

    return NextResponse.json({ success: true, deletedCount: result.deletedCount }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting designer:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete designer" },
      { status: 500 }
    )
  }
}
