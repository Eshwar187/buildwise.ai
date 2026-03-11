import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// GET endpoint to retrieve materials
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const url = new URL(req.url)
    const materialId = url.searchParams.get("id")
    const category = url.searchParams.get("category")

    // If materialId is provided, return that specific material
    if (materialId) {
      const { data: material, error } = await supabase
        .from("materials")
        .select("*")
        .eq("id", materialId)
        .single()
        
      if (error || !material) {
        return NextResponse.json({ error: "Material not found" }, { status: 404 })
      }
      return NextResponse.json({ material }, { status: 200 })
    }

    // If category is provided, return materials for that category
    if (category) {
      const { data: materials, error } = await supabase
        .from("materials")
        .select("*")
        .eq("category", category)
        
      if (error) {
        throw error
      }
      return NextResponse.json({ materials: materials || [] }, { status: 200 })
    }

    // Otherwise, return all materials
    const { data: materials, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false })
      
    if (error) {
      throw error
    }
    return NextResponse.json({ materials: materials || [] }, { status: 200 })
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
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const materialData = await req.json()
    const supabase = await createClient()
    
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
    const { data: material, error } = await supabase
      .from("materials")
      .insert([{
        name: materialData.name,
        category: materialData.category,
        description: materialData.description,
        cost_per_unit: materialData.costPerUnit,
        unit: materialData.unit,
        currency: materialData.currency,
        sustainability: materialData.sustainability,
        durability: materialData.durability,
        energy_efficiency: materialData.energyEfficiency,
        locally_available: materialData.locallyAvailable,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
      
    if (error) {
      throw error
    }
      
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
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, ...updateData } = await req.json()
    const supabase = await createClient()

    if (!id) {
      return NextResponse.json({ error: "Missing material ID" }, { status: 400 })
    }

    // Map camelCase to snake_case for Supabase
    const supabaseUpdateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (updateData.name !== undefined) supabaseUpdateData.name = updateData.name
    if (updateData.category !== undefined) supabaseUpdateData.category = updateData.category
    if (updateData.description !== undefined) supabaseUpdateData.description = updateData.description
    if (updateData.costPerUnit !== undefined) supabaseUpdateData.cost_per_unit = updateData.costPerUnit
    if (updateData.unit !== undefined) supabaseUpdateData.unit = updateData.unit
    if (updateData.currency !== undefined) supabaseUpdateData.currency = updateData.currency
    if (updateData.sustainability !== undefined) supabaseUpdateData.sustainability = updateData.sustainability
    if (updateData.durability !== undefined) supabaseUpdateData.durability = updateData.durability
    if (updateData.energyEfficiency !== undefined) supabaseUpdateData.energy_efficiency = updateData.energyEfficiency
    if (updateData.locallyAvailable !== undefined) supabaseUpdateData.locally_available = updateData.locallyAvailable

    const { data, error } = await supabase
      .from("materials")
      .update(supabaseUpdateData)
      .eq("id", id)
      .select()
      
    if (error) {
      throw error
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Material not found or update failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true, modifiedCount: data.length }, { status: 200 })
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
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    const supabase = await createClient()

    if (!id) {
      return NextResponse.json({ error: "Missing material ID" }, { status: 400 })
    }

    const { error, count } = await supabase
      .from("materials")
      .delete({ count: 'exact' })
      .eq("id", id)
      
    if (error) {
      throw error
    }
    
    if (count === 0) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, deletedCount: count }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting material:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete material" },
      { status: 500 }
    )
  }
}
