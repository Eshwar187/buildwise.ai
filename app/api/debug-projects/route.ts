import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// Debug endpoint to directly list projects from the database
export async function GET(request: Request) {
  try {
    const userId = await getAuthFromCookies()
    console.log('DEBUG GET /api/debug-projects - Auth userId:', userId)

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
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: error.message, projects: [] }, { status: 500 })
    }

    // If no projects found, create a test project
    if (!userProjects || userProjects.length === 0) {
      console.log('DEBUG - No projects found, creating a test project')

      const { data: testProject, error: insertError } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name: 'Debug Test Project',
          description: 'This is a test project created by the debug API',
          land_dimensions: { length: 40, width: 30, totalArea: 1200 },
          land_unit: 'sq ft',
          budget: 150000,
          currency: 'USD',
          location: { country: 'United States', state: 'California', city: 'San Francisco' },
          preferences: {
            rooms: { bedrooms: 3, bathrooms: 2, kitchen: true, livingRoom: true, diningRoom: true, study: true, garage: true },
            style: 'Modern',
            stories: 2,
            energyEfficient: true,
            accessibility: false,
            outdoorSpace: true
          },
          status: 'Planning',
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error creating test project:", insertError)
      }

      return NextResponse.json({
        projects: testProject ? [testProject] : [],
        debug: {
          userId,
          totalProjects: totalProjects || 0,
          userProjectsCount: testProject ? 1 : 0,
          createdTestProject: true,
        }
      })
    }

    return NextResponse.json({
      projects: userProjects,
      debug: {
        userId,
        totalProjects: totalProjects || 0,
        userProjectsCount: userProjects.length,
      }
    })
  } catch (error) {
    console.error("DEBUG debug-projects error:", error)
    return NextResponse.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
      projects: []
    }, { status: 500 })
  }
}
