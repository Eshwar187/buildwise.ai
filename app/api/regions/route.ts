import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { 
  getRegionByLocation, 
  getAllRegions, 
  createRegion,
  getCountries,
  getStatesByCountry,
  getCitiesByState
} from "@/lib/mongodb-models"

// GET endpoint to retrieve regions
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const country = url.searchParams.get("country")
    const state = url.searchParams.get("state")
    const city = url.searchParams.get("city")
    const type = url.searchParams.get("type")

    // If type is "countries", return all countries
    if (type === "countries") {
      const countries = await getCountries()
      return NextResponse.json({ countries }, { status: 200 })
    }

    // If type is "states" and country is provided, return states for that country
    if (type === "states" && country) {
      const states = await getStatesByCountry(country)
      return NextResponse.json({ states }, { status: 200 })
    }

    // If type is "cities" and country and state are provided, return cities for that state
    if (type === "cities" && country && state) {
      const cities = await getCitiesByState(country, state)
      return NextResponse.json({ cities }, { status: 200 })
    }

    // If country, state, and optionally city are provided, return that specific region
    if (country && state) {
      const region = await getRegionByLocation(country, state, city || undefined)
      if (!region) {
        return NextResponse.json({ error: "Region not found" }, { status: 404 })
      }
      return NextResponse.json({ region }, { status: 200 })
    }

    // Otherwise, return all regions
    const regions = await getAllRegions()
    return NextResponse.json({ regions }, { status: 200 })
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
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (in a real app, you would check the user's role)
    // For now, we'll assume they can proceed

    const regionData = await req.json()
    
    // Validate required fields
    const requiredFields = ["country", "countryCode", "state", "city", "localCurrency"]
    for (const field of requiredFields) {
      if (!regionData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if region already exists
    const existingRegion = await getRegionByLocation(
      regionData.country, 
      regionData.state, 
      regionData.city
    )
    
    if (existingRegion) {
      return NextResponse.json(
        { error: "Region already exists" }, 
        { status: 409 }
      )
    }

    // Create the region
    const region = await createRegion(regionData)
    return NextResponse.json({ success: true, region }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating region:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create region" },
      { status: 500 }
    )
  }
}
