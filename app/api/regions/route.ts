import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// GET endpoint to retrieve regions
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const url = new URL(req.url)
    const country = url.searchParams.get("country")
    const state = url.searchParams.get("state")
    const city = url.searchParams.get("city")
    const type = url.searchParams.get("type")

    // If type is "countries", return all distinct countries
    if (type === "countries") {
      const { data, error } = await supabase
        .from('regions')
        .select('country')
      if (error) {
        console.error("Error fetching countries:", error)
        return NextResponse.json({ countries: [] }, { status: 200 })
      }
      const countries = [...new Set((data || []).map((r: any) => r.country))]
      return NextResponse.json({ countries }, { status: 200 })
    }

    // If type is "states" and country is provided, return states for that country
    if (type === "states" && country) {
      const { data, error } = await supabase
        .from('regions')
        .select('state')
        .eq('country', country)
      if (error) {
        console.error("Error fetching states:", error)
        return NextResponse.json({ states: [] }, { status: 200 })
      }
      const states = [...new Set((data || []).map((r: any) => r.state))]
      return NextResponse.json({ states }, { status: 200 })
    }

    // If type is "cities" and country and state are provided, return cities
    if (type === "cities" && country && state) {
      const { data, error } = await supabase
        .from('regions')
        .select('city')
        .eq('country', country)
        .eq('state', state)
      if (error) {
        console.error("Error fetching cities:", error)
        return NextResponse.json({ cities: [] }, { status: 200 })
      }
      const cities = [...new Set((data || []).map((r: any) => r.city))]
      return NextResponse.json({ cities }, { status: 200 })
    }

    // If country, state, and optionally city are provided, return that specific region
    if (country && state) {
      let query = supabase
        .from('regions')
        .select('*')
        .eq('country', country)
        .eq('state', state)

      if (city) {
        query = query.eq('city', city)
      }

      const { data: region, error } = await query.maybeSingle()
      if (error) {
        console.error("Error fetching region:", error)
        return NextResponse.json({ error: "Region not found" }, { status: 404 })
      }
      if (!region) {
        return NextResponse.json({ error: "Region not found" }, { status: 404 })
      }
      return NextResponse.json({ region }, { status: 200 })
    }

    // Otherwise, return all regions
    const { data: regions, error } = await supabase
      .from('regions')
      .select('*')
      .order('country')
      .order('state')
      .order('city')

    if (error) {
      console.error("Error fetching all regions:", error)
      return NextResponse.json({ regions: [] }, { status: 200 })
    }
    return NextResponse.json({ regions: regions || [] }, { status: 200 })
  } catch (error: any) {
    console.error("Error retrieving regions:", error)
    return NextResponse.json(
      { error: error.message || "Failed to retrieve regions" },
      { status: 500 }
    )
  }
}

// POST endpoint to create a new region
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const regionData = await req.json()

    // Validate required fields
    const requiredFields = ["country", "countryCode", "state", "city", "localCurrency"]
    for (const field of requiredFields) {
      if (!regionData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const supabase = await createClient()

    // Check if region already exists
    const { data: existing } = await supabase
      .from('regions')
      .select('id')
      .eq('country', regionData.country)
      .eq('state', regionData.state)
      .eq('city', regionData.city)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: "Region already exists" },
        { status: 409 }
      )
    }

    // Create the region
    const { data: region, error } = await supabase
      .from('regions')
      .insert({
        country: regionData.country,
        country_code: regionData.countryCode,
        state: regionData.state,
        city: regionData.city,
        local_currency: regionData.localCurrency,
        material_cost_index: regionData.materialCostIndex || null,
        labor_cost_index: regionData.laborCostIndex || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating region:", error)
      return NextResponse.json({ error: "Failed to create region" }, { status: 500 })
    }

    return NextResponse.json({ success: true, region }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating region:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create region" },
      { status: 500 }
    )
  }
}
