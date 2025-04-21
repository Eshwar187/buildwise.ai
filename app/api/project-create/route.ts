import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createProject } from "@/lib/mongodb-models"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"

// Function to copy a floor plan template to a project
function copyFloorPlanTemplate(templateId: string, projectId: string) {
  try {
    // Get the template
    const templatesDir = path.join(process.cwd(), 'public', 'uploads', 'floor-plans')
    const templateDir = path.join(templatesDir, templateId)

    if (!fs.existsSync(templateDir)) {
      console.warn(`Template directory ${templateDir} does not exist`)
      return null
    }

    // Find the template image
    const templateFiles = fs.readdirSync(templateDir)
    const svgFile = templateFiles.find(file => file.endsWith('.svg'))

    if (!svgFile) {
      console.warn(`No SVG file found in template directory ${templateDir}`)
      return null
    }

    const templateImagePath = path.join(templateDir, svgFile)

    // Create the project directory if it doesn't exist
    const projectDir = path.join(templatesDir, projectId)
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true })
    }

    // Generate a new filename
    const filename = `floor-plan-${uuidv4()}${path.extname(templateImagePath)}`
    const newImagePath = path.join(projectDir, filename)

    // Copy the image
    fs.copyFileSync(templateImagePath, newImagePath)

    // Return the relative URL
    return `/uploads/floor-plans/${projectId}/${filename}`
  } catch (error) {
    console.error('Error copying floor plan template:', error)
    return null
  }
}

// POST endpoint to create a project
export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user ID
    const { userId } = await auth()
    console.log('POST /api/project-create - Auth userId:', userId)

    if (!userId) {
      console.log('POST /api/project-create - No userId found in auth')
      return NextResponse.json({ error: "Unauthorized. Please sign in to create a project." }, { status: 401 })
    }

    console.log('POST /api/project-create - Authenticated userId:', userId)

    const body = await req.json()
    console.log('Received project data:', body)

    // Create a new project with the authenticated user's ID
    console.log('POST /api/project-create - Creating project for userId:', userId)

    // Ensure we have a valid userId as a string
    const userIdStr = String(userId)
    console.log('POST /api/project-create - Converted userId to string:', userIdStr)

    // Calculate total area if not provided
    const length = parseFloat(body.landDimensions.length) || 0
    const width = parseFloat(body.landDimensions.width) || 0
    const totalArea = parseFloat(body.landDimensions.totalArea) || (length * width)

    const projectData = {
      userId: userIdStr, // Use the authenticated user's ID as a string
      name: body.name,
      description: body.description,
      landDimensions: {
        length: length,
        width: width,
        totalArea: totalArea
      },
      landUnit: body.landUnit,
      budget: parseFloat(body.budget) || 0,
      currency: body.currency,
      location: body.location,
      preferences: body.preferences,
      status: "Planning",
      // Initialize floorPlans array if we have a generated floor plan
      floorPlans: body.floorPlan ? [body.floorPlan] : []
    }

    console.log('POST /api/project-create - Project data prepared:', {
      userId: projectData.userId,
      name: projectData.name,
      dimensions: projectData.landDimensions,
    })

    const project = await createProject(projectData)

    console.log("Project created with ID:", project._id, "for user:", userId)

    // Check if a floor plan template was selected
    if (body.floorPlanTemplateId) {
      console.log(`Copying floor plan template ${body.floorPlanTemplateId} to project ${project._id.toString()}`)

      // Copy the floor plan template to the project
      const imageUrl = copyFloorPlanTemplate(body.floorPlanTemplateId, project._id.toString())

      if (imageUrl) {
        console.log(`Template copied successfully, image URL: ${imageUrl}`)

        // Add the floor plan to the project
        if (project._id) {
          const floorPlan = {
            projectId: project._id.toString(),
            userId: userId, // Use the authenticated user's ID
            imageUrl,
            aiPrompt: "Template floor plan",
            description: `Floor plan based on template ${body.floorPlanTemplateId}`,
            generatedBy: "gemini", // Using gemini as the generator type
            createdAt: new Date()
          }

          // Add the floor plan to the project's floorPlans array
          if (!project.floorPlans) {
            project.floorPlans = []
          }

          project.floorPlans.push(floorPlan)

          console.log(`Floor plan added to project`)
        }
      }
    }

    console.log('POST /api/project-create - Returning successful response with project ID:', project._id)
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
