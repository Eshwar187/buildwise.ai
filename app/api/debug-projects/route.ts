import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"

// This is a debug endpoint to directly access projects from the database
export async function GET(request: Request) {
  try {
    // Get the authenticated user ID
    const { userId } = await auth()
    console.log('DEBUG GET /api/debug-projects - Auth userId:', userId)

    if (!userId) {
      console.log('DEBUG GET /api/debug-projects - No userId found in auth')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect directly to the database
    const { db, isLocal } = await connectToDatabase()
    console.log('DEBUG GET /api/debug-projects - Connected to database, isLocal:', isLocal)
    
    // Check if projects collection exists
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    console.log('DEBUG GET /api/debug-projects - Available collections:', collectionNames)
    
    if (!collectionNames.includes('projects')) {
      console.log('DEBUG GET /api/debug-projects - Projects collection does not exist')
      return NextResponse.json({ projects: [], message: "Projects collection does not exist" })
    }
    
    // Count total projects in the collection
    const totalCount = await db.collection("projects").countDocuments({})
    console.log(`DEBUG GET /api/debug-projects - Total projects in collection: ${totalCount}`)
    
    // Get all projects (for debugging)
    const allProjects = await db.collection("projects").find({}).limit(10).toArray()
    console.log('DEBUG GET /api/debug-projects - Sample of all projects:', 
      allProjects.map(p => ({ id: p._id, name: p.name, userId: p.userId }))
    )
    
    // Get projects for this user
    console.log(`DEBUG GET /api/debug-projects - Querying for projects with userId: ${userId}`)
    const userProjects = await db.collection("projects").find({ userId: userId }).toArray()
    console.log(`DEBUG GET /api/debug-projects - Found ${userProjects.length} projects for user ${userId}`)
    
    // Also try with string conversion
    const userIdStr = String(userId)
    console.log(`DEBUG GET /api/debug-projects - Also querying with userId as string: ${userIdStr}`)
    const userProjectsStr = await db.collection("projects").find({ userId: userIdStr }).toArray()
    console.log(`DEBUG GET /api/debug-projects - Found ${userProjectsStr.length} projects with userId as string`)
    
    // Combine results (removing duplicates)
    const combinedProjects = [...userProjects]
    for (const project of userProjectsStr) {
      if (!combinedProjects.some(p => p._id.toString() === project._id.toString())) {
        combinedProjects.push(project)
      }
    }
    
    // If no projects found, create a test project
    if (combinedProjects.length === 0) {
      console.log('DEBUG GET /api/debug-projects - No projects found, creating a test project')
      
      const now = new Date()
      const testProject = {
        userId: userId,
        name: 'Debug Test Project',
        description: 'This is a test project created by the debug API',
        landDimensions: {
          length: 40,
          width: 30,
          totalArea: 1200
        },
        landUnit: 'sq ft',
        budget: 150000,
        currency: 'USD',
        location: {
          country: 'United States',
          state: 'California',
          city: 'San Francisco'
        },
        preferences: {
          rooms: {
            bedrooms: 3,
            bathrooms: 2,
            kitchen: true,
            livingRoom: true,
            diningRoom: true,
            study: true,
            garage: true
          },
          style: 'Modern',
          stories: 2,
          energyEfficient: true,
          accessibility: false,
          outdoorSpace: true
        },
        status: 'Planning',
        createdAt: now,
        updatedAt: now
      }
      
      const result = await db.collection("projects").insertOne(testProject)
      console.log('DEBUG GET /api/debug-projects - Created test project with ID:', result.insertedId)
      
      // Add the created project to the response
      combinedProjects.push({ ...testProject, _id: result.insertedId })
    }

    return NextResponse.json({ 
      projects: combinedProjects,
      debug: {
        userId,
        totalProjects: totalCount,
        userProjectsCount: userProjects.length,
        userProjectsStrCount: userProjectsStr.length,
        combinedCount: combinedProjects.length
      }
    })
  } catch (error) {
    console.error("DEBUG GET /api/debug-projects - Error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : "Unknown error",
      projects: [] 
    }, { status: 500 })
  }
}
