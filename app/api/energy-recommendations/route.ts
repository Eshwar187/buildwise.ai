import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// GET endpoint to retrieve energy recommendations
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const url = new URL(req.url)
    const recommendationId = url.searchParams.get("id")
    const countryCode = url.searchParams.get("countryCode")

    // If recommendationId is provided, return that specific recommendation
    if (recommendationId) {
      const { data: recommendation, error } = await supabase
        .from('energy_recommendations')
        .select('*')
        .eq('id', recommendationId)
        .single()

      if (error || !recommendation) {
        return NextResponse.json({ error: "Energy recommendation not found" }, { status: 404 })
      }
      return NextResponse.json({ recommendation }, { status: 200 })
    }

    // If countryCode is provided, return recommendations for that region
    if (countryCode) {
      const { data: recommendations, error } = await supabase
        .from('energy_recommendations')
        .select('*')
        .contains('applicable_regions', [countryCode])

      if (error) {
        console.error("Error fetching recommendations by region:", error)
        return NextResponse.json({ recommendations: [] }, { status: 200 })
      }
      return NextResponse.json({ recommendations: recommendations || [] }, { status: 200 })
    }

    // Otherwise, return all recommendations
    const { data: recommendations, error } = await supabase
      .from('energy_recommendations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching all recommendations:", error)
      return NextResponse.json({ recommendations: [] }, { status: 200 })
    }
    return NextResponse.json({ recommendations: recommendations || [] }, { status: 200 })
  } catch (error: any) {
    console.error("Error retrieving energy recommendations:", error)
    return NextResponse.json(
      { error: error.message || "Failed to retrieve energy recommendations" },
      { status: 500 }
    )
  }
}

// POST endpoint to create a new energy recommendation
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recommendationData = await req.json()

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "savingsEstimate",
      "implementationCost",
      "applicableRegions",
      "category"
    ]

    for (const field of requiredFields) {
      if (!recommendationData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate implementation cost fields
    const costFields = ["amount", "currency", "level"]
    for (const field of costFields) {
      if (!recommendationData.implementationCost[field]) {
        return NextResponse.json(
          { error: `Missing required implementation cost field: ${field}` },
          { status: 400 }
        )
      }
    }

    const supabase = await createClient()

    // Create the energy recommendation
    const { data: recommendation, error } = await supabase
      .from('energy_recommendations')
      .insert({
        title: recommendationData.title,
        description: recommendationData.description,
        savings_estimate: recommendationData.savingsEstimate,
        implementation_cost: recommendationData.implementationCost,
        applicable_regions: recommendationData.applicableRegions,
        category: recommendationData.category,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating recommendation:", error)
      return NextResponse.json({ error: "Failed to create recommendation" }, { status: 500 })
    }

    return NextResponse.json({ success: true, recommendation }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating energy recommendation:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create energy recommendation" },
      { status: 500 }
    )
  }
}
