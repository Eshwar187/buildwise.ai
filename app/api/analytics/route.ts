import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getAnalytics, getUserByClerkId } from "@/lib/mongodb-models"

export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is an admin
    const user = await getUserByClerkId(userId)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get analytics data
    const analytics = await getAnalytics()

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

