import { NextRequest } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { errorResponse, successResponse } from "@/lib/api"
import { designerCreateSchema, designerUpdateSchema, designerQuerySchema } from "@/lib/validation"

// GET endpoint to retrieve designers
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const supabase = await createClient()

    const url = new URL(req.url)
    const query = designerQuerySchema.safeParse({
      id: url.searchParams.get("id") || undefined,
      country: url.searchParams.get("country") || undefined,
      state: url.searchParams.get("state") || undefined,
      city: url.searchParams.get("city") || undefined,
    })

    if (!query.success) {
      return errorResponse(
        query.error.issues[0]?.message || "Invalid query parameters",
        400,
        "validation_error",
        query.error.flatten()
      )
    }

    const { id: designerId, country, state, city } = query.data

    // If designerId is provided, return that specific designer
    if (designerId) {
      const { data: designer, error } = await supabase
        .from('designers')
        .select('*')
        .eq('id', designerId)
        .single()

      if (error || !designer) {
        return errorResponse("Designer not found", 404, "not_found")
      }
      return successResponse({ designer })
    }

    // If location parameters are provided, return designers for that location
    if (country && state) {
      let query = supabase
        .from('designers')
        .select('*')
        .eq('country', country)
        .eq('state', state)

      if (city) {
        query = query.eq('city', city)
      }

      const { data: designers, error } = await query

      if (error) {
        console.error("Error fetching designers by location:", error)
        return errorResponse("Failed to retrieve designers", 500, "database_error")
      }
      return successResponse({ designers: designers || [] })
    }

    // Otherwise, return all designers
    const { data: designers, error } = await supabase
      .from('designers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching all designers:", error)
      return errorResponse("Failed to retrieve designers", 500, "database_error")
    }
    return successResponse({ designers: designers || [] })
  } catch (error: any) {
    console.error("Error retrieving designers:", error)
    return errorResponse(error.message || "Failed to retrieve designers", 500)
  }
}

// POST endpoint to create a new designer
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const parsedBody = await req.json().catch(() => null)
    const designerData = designerCreateSchema.safeParse(parsedBody)
    if (!designerData.success) {
      return errorResponse(
        designerData.error.issues[0]?.message || "Missing required designer fields",
        400,
        "validation_error",
        designerData.error.flatten()
      )
    }

    const supabase = await createClient()

    const { data: designer, error } = await supabase
      .from('designers')
      .insert({
        name: designerData.data.name,
        email: designerData.data.email,
        phone: designerData.data.phone,
        specialization: designerData.data.specialization,
        experience: designerData.data.experience,
        country: designerData.data.location.country,
        state: designerData.data.location.state,
        city: designerData.data.location.city,
        availability: designerData.data.availability,
        portfolio: designerData.data.portfolio || null,
        rating: designerData.data.rating || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating designer:", error)
      return errorResponse("Failed to create designer", 500, "database_error")
    }

    return successResponse({ designer }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating designer:", error)
    return errorResponse(error.message || "Failed to create designer", 500)
  }
}

// PUT endpoint to update a designer
export async function PUT(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const parsedBody = await req.json().catch(() => null)
    const body = designerUpdateSchema.safeParse(parsedBody)
    if (!body.success) {
      return errorResponse(
        body.error.issues[0]?.message || "Missing designer ID",
        400,
        "validation_error",
        body.error.flatten()
      )
    }

    const { id, ...updateData } = body.data
    const supabase = await createClient()

    // Verify the designer exists
    const { data: existing, error: fetchError } = await supabase
      .from('designers')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return errorResponse("Designer not found", 404, "not_found")
    }

    // Build update payload – flatten location if present
    const payload: Record<string, any> = {}
    if (updateData.name !== undefined) payload.name = updateData.name
    if (updateData.email !== undefined) payload.email = updateData.email
    if (updateData.phone !== undefined) payload.phone = updateData.phone
    if (updateData.specialization !== undefined) payload.specialization = updateData.specialization
    if (updateData.experience !== undefined) payload.experience = updateData.experience
    if (updateData.availability !== undefined) payload.availability = updateData.availability
    if (updateData.portfolio !== undefined) payload.portfolio = updateData.portfolio
    if (updateData.rating !== undefined) payload.rating = updateData.rating
    if (updateData.location) {
      if (updateData.location.country !== undefined) payload.country = updateData.location.country
      if (updateData.location.state !== undefined) payload.state = updateData.location.state
      if (updateData.location.city !== undefined) payload.city = updateData.location.city
    }

    const { error: updateError } = await supabase
      .from('designers')
      .update(payload)
      .eq('id', id)

    if (updateError) {
      console.error("Error updating designer:", updateError)
      return errorResponse("Failed to update designer", 500, "database_error")
    }

    return successResponse({ modifiedCount: 1 })
  } catch (error: any) {
    console.error("Error updating designer:", error)
    return errorResponse(error.message || "Failed to update designer", 500)
  }
}

// DELETE endpoint to delete a designer
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    if (!id) {
      return errorResponse("Missing designer ID", 400, "validation_error")
    }

    const supabase = await createClient()

    // Verify the designer exists
    const { data: existing, error: fetchError } = await supabase
      .from('designers')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return errorResponse("Designer not found", 404, "not_found")
    }

    const { error: deleteError } = await supabase
      .from('designers')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error("Error deleting designer:", deleteError)
      return errorResponse("Failed to delete designer", 500, "database_error")
    }

    return successResponse({ deletedCount: 1 })
  } catch (error: any) {
    console.error("Error deleting designer:", error)
    return errorResponse(error.message || "Failed to delete designer", 500)
  }
}
