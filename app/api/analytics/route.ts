import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const userId = await getAuthFromCookies()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Check if the user is an admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single()

    if (userError || !user || !user.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get analytics data using counts from each table
    const [
      { count: totalUsers },
      { count: totalProjects },
      { count: totalDesigners },
      { count: totalFloorPlans },
      { count: pendingUsers },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('designers').select('*', { count: 'exact', head: true }),
      supabase.from('floor_plans').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_approved', false),
    ])

    // Get recent activity – last 10 projects
    const { data: recentProjects } = await supabase
      .from('projects')
      .select('id, name, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10)

    const analytics = {
      totalUsers: totalUsers || 0,
      totalProjects: totalProjects || 0,
      totalDesigners: totalDesigners || 0,
      totalFloorPlans: totalFloorPlans || 0,
      pendingUsers: pendingUsers || 0,
      recentProjects: recentProjects || [],
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
