import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// Debug endpoint to inspect and fix projects in the database
export async function GET(request: Request) {
  try {
    const userId = await getAuthFromCookies()
    console.log('DEBUG GET /api/debug/fix-projects - Auth userId:', userId)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get user projects
    const { data: userProjects, error } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .eq('user_id', userId)

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`DEBUG - Found ${(userProjects || []).length} projects for user ${userId}`)

    // If no projects found, create a test project
    if (!userProjects || userProjects.length === 0) {
      console.log(`DEBUG - Creating a test project for user ${userId}`)

      const { data: testProject, error: insertError } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name: 'Test Project',
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
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({
        message: "Created a test project for the current user",
        projectId: testProject?.id,
        fixed: 1
      })
    }

    return NextResponse.json({
      message: `Found ${userProjects.length} projects for user`,
      fixed: 0,
      userProjects: userProjects.map(p => ({ id: p.id, name: p.name }))
    })
  } catch (error) {
    console.error("DEBUG fix-projects error:", error)
    return NextResponse.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
