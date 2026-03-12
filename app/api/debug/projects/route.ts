import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// Debug endpoint to directly list projects from the database
export async function GET(request: Request) {
  try {
    const userId = await getAuthFromCookies()
    console.log('DEBUG GET /api/debug/projects - Auth userId:', userId)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Count total projects
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    // Get user's projects
    const { data: userProjects, error } = await supabase
      .from('projects')
      .select('id, name, user_id, created_at')
      .eq('user_id', userId)

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: error.message, projects: [] }, { status: 500 })
    }

    return NextResponse.json({
      projects: userProjects || [],
      debug: {
        userId,
        totalProjects: totalProjects || 0,
        userProjectsCount: (userProjects || []).length,
      }
    })
  } catch (error) {
    console.error("DEBUG projects error:", error)
    return NextResponse.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
      projects: []
    }, { status: 500 })
  }
}
