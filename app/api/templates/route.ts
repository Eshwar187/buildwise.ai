import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// GET endpoint to retrieve floor plan templates
export async function GET(req: NextRequest) {
  try {
    // Define the templates directory
    const templatesDir = path.join(process.cwd(), 'public', 'uploads', 'floor-plans')
    
    // Check if directory exists
    if (!fs.existsSync(templatesDir)) {
      console.warn('Floor plan templates directory does not exist')
      return NextResponse.json({ 
        success: false, 
        templates: [] 
      }, { status: 200 })
    }
    
    // Get all project directories
    const projectDirs = fs.readdirSync(templatesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    // Collect template data
    const templates = []
    
    for (const projectDir of projectDirs) {
      const projectPath = path.join(templatesDir, projectDir)
      const metadataPath = path.join(projectPath, 'metadata.json')
      
      // Check if metadata file exists
      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
          templates.push(metadata)
        } catch (error) {
          console.error(`Error parsing metadata for ${projectDir}:`, error)
        }
      }
    }
    
    // If no templates found, return hardcoded templates
    if (templates.length === 0) {
      const hardcodedTemplates = [
        {
          projectId: 'project-1',
          name: 'Modern House Floor Plan',
          style: 'modern',
          imageUrl: '/uploads/floor-plans/project-1/modern-floor-plan.svg',
          bedrooms: 3,
          bathrooms: 2
        },
        {
          projectId: 'project-2',
          name: 'Farmhouse Floor Plan',
          style: 'farmhouse',
          imageUrl: '/uploads/floor-plans/project-2/farmhouse-floor-plan.svg',
          bedrooms: 4,
          bathrooms: 3
        },
        {
          projectId: 'project-3',
          name: 'Cottage Floor Plan',
          style: 'cottage',
          imageUrl: '/uploads/floor-plans/project-3/cottage-floor-plan.svg',
          bedrooms: 2,
          bathrooms: 1
        }
      ]
      
      return NextResponse.json({ 
        success: true, 
        templates: hardcodedTemplates 
      }, { 
        status: 200,
        headers: {
          "Cache-Control": "max-age=60, stale-while-revalidate=300"
        }
      })
    }

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
      { 
        success: false,
        error: error.message || "Failed to fetch floor plan templates",
        templates: [] 
      },
      { status: 200 } // Return 200 even on error to avoid breaking the UI
    )
  }
}
