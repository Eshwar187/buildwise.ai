import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"

// Function to copy a floor plan template to a project
function copyFloorPlanTemplate(templateId: string, projectId: string) {
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'uploads', 'floor-plans')
    const templateDir = path.join(templatesDir, templateId)

    if (!fs.existsSync(templateDir)) {
      console.warn(`Template directory ${templateDir} does not exist`)
      return null
    }

    const templateFiles = fs.readdirSync(templateDir)
    const svgFile = templateFiles.find(file => file.endsWith('.svg'))

    if (!svgFile) {
      console.warn(`No SVG file found in template directory ${templateDir}`)
      return null
    }

    const templateImagePath = path.join(templateDir, svgFile)

    const projectDir = path.join(templatesDir, projectId)
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true })
    }

    const filename = `floor-plan-${uuidv4()}${path.extname(templateImagePath)}`
    const newImagePath = path.join(projectDir, filename)

    fs.copyFileSync(templateImagePath, newImagePath)

    return `/uploads/floor-plans/${projectId}/${filename}`
  } catch (error) {
    console.error('Error copying floor plan template:', error)
    return null
  }
}

// POST endpoint to create a project
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthFromCookies()
    console.log('POST /api/project-create - Auth userId:', userId)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to create a project." }, { status: 401 })
    }

    const body = await req.json()
    console.log('Received project data:', body)

    const supabase = await createClient()

    // Calculate total area if not provided
    const length = parseFloat(body.landDimensions.length) || 0
    const width = parseFloat(body.landDimensions.width) || 0
    const totalArea = parseFloat(body.landDimensions.totalArea) || (length * width)

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: body.name,
        description: body.description,
        land_dimensions: {
          length,
          width,
          totalArea
        },
        land_unit: body.landUnit,
        budget: parseFloat(body.budget) || 0,
        currency: body.currency,
        location: body.location,
        preferences: body.preferences,
        status: "Planning",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return NextResponse.json({
        success: false,
        error: error.message || "Failed to create project"
      }, { status: 500 })
    }

    console.log("Project created with ID:", project.id, "for user:", userId)

    // Handle floor plan template if selected
    if (body.floorPlanTemplateId && project.id) {
      console.log(`Copying floor plan template ${body.floorPlanTemplateId} to project ${project.id}`)

      const imageUrl = copyFloorPlanTemplate(body.floorPlanTemplateId, project.id)

      if (imageUrl) {
        console.log(`Template copied, saving floor plan record`)

        const { error: fpError } = await supabase
          .from('floor_plans')
          .insert({
            project_id: project.id,
            user_id: userId,
            image_url: imageUrl,
            ai_prompt: "Template floor plan",
            description: `Floor plan based on template ${body.floorPlanTemplateId}`,
            generated_by: "gemini",
          })

        if (fpError) {
          console.warn("Warning: could not save floor plan record:", fpError.message)
        }
      }
    }

    // Handle inline floor plan data
    if (body.floorPlan && project.id) {
      const { error: fpError } = await supabase
        .from('floor_plans')
        .insert({
          project_id: project.id,
          user_id: userId,
          image_url: body.floorPlan.imageUrl || '',
          ai_prompt: body.floorPlan.aiPrompt || '',
          description: body.floorPlan.description || '',
          generated_by: body.floorPlan.generatedBy || "gemini",
        })

      if (fpError) {
        console.warn("Warning: could not save inline floor plan:", fpError.message)
      }
    }

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully. You will be redirected to the projects page.'
    })
  } catch (error: any) {
    console.error("Error creating project:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create project"
    }, { status: 500 })
  }
}
