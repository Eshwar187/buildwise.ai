import { NextRequest } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { errorResponse, successResponse } from "@/lib/api"
import { materialCreateSchema, materialUpdateSchema } from "@/lib/validation"

// GET endpoint to retrieve materials
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
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
        return errorResponse("Material not found", 404, "not_found")
      }
      return successResponse({ material })
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
      return successResponse({ materials: materials || [] })
    }

    // Otherwise, return all materials
    const { data: materials, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false })
      
    if (error) {
      throw error
    }
    return successResponse({ materials: materials || [] })
  } catch (error: any) {
    console.error("Error retrieving materials:", error)
    return errorResponse(error.message || "Failed to retrieve materials", 500)
  }
}

// POST endpoint to create a new material
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const parsedBody = await req.json().catch(() => null)
    const materialData = materialCreateSchema.safeParse(parsedBody)
    const supabase = await createClient()

    if (!materialData.success) {
      return errorResponse(
        materialData.error.issues[0]?.message || "Missing required material fields",
        400,
        "validation_error",
        materialData.error.flatten()
      )
    }

    // Create the material
    const { data: material, error } = await supabase
      .from("materials")
      .insert([{
        name: materialData.data.name,
        category: materialData.data.category,
        description: materialData.data.description,
        cost_per_unit: materialData.data.costPerUnit,
        unit: materialData.data.unit,
        currency: materialData.data.currency,
        sustainability: materialData.data.sustainability,
        durability: materialData.data.durability,
        energy_efficiency: materialData.data.energyEfficiency,
        locally_available: materialData.data.locallyAvailable,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
      
    if (error) {
      throw error
    }
      
    return successResponse({ material }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating material:", error)
    return errorResponse(error.message || "Failed to create material", 500)
  }
}

// PUT endpoint to update a material
export async function PUT(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const parsedBody = await req.json().catch(() => null)
    const body = materialUpdateSchema.safeParse(parsedBody)
    const supabase = await createClient()

    if (!body.success) {
      return errorResponse(
        body.error.issues[0]?.message || "Missing material ID",
        400,
        "validation_error",
        body.error.flatten()
      )
    }

    const { id, ...updateData } = body.data

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
      return errorResponse("Material not found or update failed", 404, "not_found")
    }

    return successResponse({ modifiedCount: data.length })
  } catch (error: any) {
    console.error("Error updating material:", error)
    return errorResponse(error.message || "Failed to update material", 500)
  }
}

// DELETE endpoint to delete a material
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    const supabase = await createClient()

    if (!id) {
      return errorResponse("Missing material ID", 400, "validation_error")
    }

    const { error, count } = await supabase
      .from("materials")
      .delete({ count: 'exact' })
      .eq("id", id)
      
    if (error) {
      throw error
    }
    
    if (count === 0) {
      return errorResponse("Material not found", 404, "not_found")
    }

    return successResponse({ deletedCount: count })
  } catch (error: any) {
    console.error("Error deleting material:", error)
    return errorResponse(error.message || "Failed to delete material", 500)
  }
}
