import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { 
  getMaterialById, 
  getMaterialsByCategory, 
  getAllMaterials, 
  createMaterial,
  updateMaterial,
  deleteMaterial
} from "@/lib/mongodb-models"

// GET endpoint to retrieve materials
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const materialId = url.searchParams.get("id")
    const category = url.searchParams.get("category")

    // If materialId is provided, return that specific material
    if (materialId) {
      const material = await getMaterialById(materialId)
      if (!material) {
        return NextResponse.json({ error: "Material not found" }, { status: 404 })
      }
      return NextResponse.json({ material }, { status: 200 })
    }

    // If category is provided, return materials for that category
    if (category) {
      const materials = await getMaterialsByCategory(category)
      return NextResponse.json({ materials }, { status: 200 })
    }

    // Otherwise, return all materials
    const materials = await getAllMaterials()
    return NextResponse.json({ materials }, { status: 200 })
  } catch (error: any) {
    console.error("Error retrieving materials:", error)
    return NextResponse.json(
      { error: error.message || "Failed to retrieve materials" },
      { status: 500 }
    )
  }
}

// POST endpoint to create a new material
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (in a real app, you would check the user's role)
    // For now, we'll assume they can proceed

    const materialData = await req.json()
    
    // Validate required fields
    const requiredFields = [
      "name", 
      "category", 
      "description", 
      "costPerUnit", 
      "unit", 
      "currency", 
      "sustainability", 
      "durability", 
      "energyEfficiency", 
      "locallyAvailable"
    ]
    
    for (const field of requiredFields) {
      if (materialData[field] === undefined) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create the material
    const material = await createMaterial(materialData)
    return NextResponse.json({ success: true, material }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating material:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create material" },
      { status: 500 }
    )
  }
}

// PUT endpoint to update a material
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
      return NextResponse.json({ error: "Missing material ID" }, { status: 400 })
    }

    // Verify the material exists
    const material = await getMaterialById(id)
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    // Update the material
    const result = await updateMaterial(id, updateData)
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to update material" }, { status: 500 })
    }

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating material:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update material" },
      { status: 500 }
    )
  }
}

// DELETE endpoint to delete a material
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
      return NextResponse.json({ error: "Missing material ID" }, { status: 400 })
    }

    // Verify the material exists
    const material = await getMaterialById(id)
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    // Delete the material
    const result = await deleteMaterial(id)
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete material" }, { status: 500 })
    }

    return NextResponse.json({ success: true, deletedCount: result.deletedCount }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting material:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete material" },
      { status: 500 }
    )
  }
}
