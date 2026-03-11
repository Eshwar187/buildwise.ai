import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.projectId || !body.landArea || !body.landUnit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if the project exists and belongs to the user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', body.projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // For now, we'll use a placeholder
    const aiPrompt = `Generate a floor plan for a ${body.landArea} ${body.landUnit} ${body.buildingType || "building"} with ${body.rooms || "3"} rooms`
    const imageUrl = "/placeholder.svg?height=600&width=800"

    // Save the floor plan to the database
    const { data: floorPlan, error: insertError } = await supabase
      .from('floor_plans')
      .insert({
        project_id: body.projectId,
        user_id: user.id,
        image_url: imageUrl,
        ai_prompt: aiPrompt,
        version: 1,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json(floorPlan)
  } catch (error) {
    console.error("Error generating floor plan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
