import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// GET endpoint to retrieve designers
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const url = new URL(req.url)
    const designerId = url.searchParams.get("id")
    const country = url.searchParams.get("country")
    const state = url.searchParams.get("state")
    const city = url.searchParams.get("city")

    // If designerId is provided, return that specific designer
    if (designerId) {
      const { data: designer, error } = await supabase
        .from('designers')
        .select('*')
        .eq('id', designerId)
        .single()

      if (error || !designer) {
        return NextResponse.json({ error: "Designer not found" }, { status: 404 })
      }
      return NextResponse.json({ designer }, { status: 200 })
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
        return NextResponse.json({ designers: [] }, { status: 200 })
      }
      return NextResponse.json({ designers: designers || [] }, { status: 200 })
    }

    // Otherwise, return all designers
    const { data: designers, error } = await supabase
      .from('designers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching all designers:", error)
      return NextResponse.json({ designers: [] }, { status: 200 })
    }
    return NextResponse.json({ designers: designers || [] }, { status: 200 })
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
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    const supabase = await createClient()

    const { data: designer, error } = await supabase
      .from('designers')
      .insert({
        name: designerData.name,
        email: designerData.email,
        phone: designerData.phone,
        specialization: designerData.specialization,
        experience: designerData.experience,
        country: designerData.location.country,
        state: designerData.location.state,
        city: designerData.location.city,
        availability: designerData.availability,
        portfolio: designerData.portfolio || null,
        rating: designerData.rating || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating designer:", error)
      return NextResponse.json({ error: "Failed to create designer" }, { status: 500 })
    }

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
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, ...updateData } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing designer ID" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the designer exists
    const { data: existing, error: fetchError } = await supabase
      .from('designers')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 })
    }

    // Build update payload – flatten location if present
    const payload: Record<string, any> = {}
    if (updateData.name) payload.name = updateData.name
    if (updateData.email) payload.email = updateData.email
    if (updateData.phone) payload.phone = updateData.phone
    if (updateData.specialization) payload.specialization = updateData.specialization
    if (updateData.experience) payload.experience = updateData.experience
    if (updateData.availability) payload.availability = updateData.availability
    if (updateData.portfolio) payload.portfolio = updateData.portfolio
    if (updateData.rating) payload.rating = updateData.rating
    if (updateData.location) {
      if (updateData.location.country) payload.country = updateData.location.country
      if (updateData.location.state) payload.state = updateData.location.state
      if (updateData.location.city) payload.city = updateData.location.city
    }

    const { error: updateError } = await supabase
      .from('designers')
      .update(payload)
      .eq('id', id)

    if (updateError) {
      console.error("Error updating designer:", updateError)
      return NextResponse.json({ error: "Failed to update designer" }, { status: 500 })
    }

    return NextResponse.json({ success: true, modifiedCount: 1 }, { status: 200 })
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
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing designer ID" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the designer exists
    const { data: existing, error: fetchError } = await supabase
      .from('designers')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('designers')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error("Error deleting designer:", deleteError)
      return NextResponse.json({ error: "Failed to delete designer" }, { status: 500 })
    }

    return NextResponse.json({ success: true, deletedCount: 1 }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting designer:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete designer" },
      { status: 500 }
    )
  }
}
