import { NextRequest, NextResponse } from "next/server"
import { getFloorPlanTemplates } from "@/lib/floor-plan-utils"

// GET endpoint to retrieve floor plan templates
export async function GET(req: NextRequest) {
  try {
    // Get floor plan templates
    const templates = getFloorPlanTemplates()

    return NextResponse.json({
      success: true,
      templates
    }, {
      status: 200,
      headers: {
        "Cache-Control": "max-age=60, stale-while-revalidate=300"
      }
    })
  } catch (error: any) {
    console.error("Error fetching floor plan templates:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch floor plan templates" },
      { status: 500 }
    )
  }
}
