import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { 
  getEnergyRecommendationById, 
  getEnergyRecommendationsByRegion, 
  getAllEnergyRecommendations, 
  createEnergyRecommendation
} from "@/lib/mongodb-models"

// GET endpoint to retrieve energy recommendations
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const recommendationId = url.searchParams.get("id")
    const countryCode = url.searchParams.get("countryCode")

    // If recommendationId is provided, return that specific recommendation
    if (recommendationId) {
      const recommendation = await getEnergyRecommendationById(recommendationId)
      if (!recommendation) {
        return NextResponse.json({ error: "Energy recommendation not found" }, { status: 404 })
      }
      return NextResponse.json({ recommendation }, { status: 200 })
    }

    // If countryCode is provided, return recommendations for that region
    if (countryCode) {
      const recommendations = await getEnergyRecommendationsByRegion(countryCode)
      return NextResponse.json({ recommendations }, { status: 200 })
    }

    // Otherwise, return all recommendations
    const recommendations = await getAllEnergyRecommendations()
    return NextResponse.json({ recommendations }, { status: 200 })
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
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (in a real app, you would check the user's role)
    // For now, we'll assume they can proceed

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

    // Create the energy recommendation
    const recommendation = await createEnergyRecommendation(recommendationData)
    return NextResponse.json({ success: true, recommendation }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating energy recommendation:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create energy recommendation" },
      { status: 500 }
    )
  }
}
