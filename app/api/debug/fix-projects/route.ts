import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"

// This is a debug endpoint to fix projects in the database
export async function GET(request: Request) {
  try {
    // Get the authenticated user ID
    const { userId } = await auth()
    console.log('DEBUG GET /api/debug/fix-projects - Auth userId:', userId)

    if (!userId) {
      console.log('DEBUG GET /api/debug/fix-projects - No userId found in auth')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect directly to the database
    const { db, isLocal } = await connectToDatabase()
    console.log('DEBUG GET /api/debug/fix-projects - Connected to database, isLocal:', isLocal)
    
    // Check if projects collection exists
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    console.log('DEBUG GET /api/debug/fix-projects - Available collections:', collectionNames)
    
    if (!collectionNames.includes('projects')) {
      console.log('DEBUG GET /api/debug/fix-projects - Projects collection does not exist')
      return NextResponse.json({ message: "Projects collection does not exist", fixed: 0 })
    }
    
    // Count total projects in the collection
    const totalCount = await db.collection("projects").countDocuments({})
    console.log(`DEBUG GET /api/debug/fix-projects - Total projects in collection: ${totalCount}`)
    
    if (totalCount === 0) {
      return NextResponse.json({ message: "No projects found in the database", fixed: 0 })
    }
    
    // Get all projects
    const allProjects = await db.collection("projects").find({}).toArray()
    console.log(`DEBUG GET /api/debug/fix-projects - Found ${allProjects.length} projects`)
    
    // Create a test project for this user if none exists
    const userProjects = allProjects.filter(p => 
      p.userId === userId || p.userId === String(userId)
    )
    
    console.log(`DEBUG GET /api/debug/fix-projects - Found ${userProjects.length} projects for user ${userId}`)
    
    if (userProjects.length === 0) {
      console.log(`DEBUG GET /api/debug/fix-projects - Creating a test project for user ${userId}`)
      
      const now = new Date()
      const testProject = {
        userId: String(userId),
        name: 'Test Project',
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
      console.log(`DEBUG GET /api/debug/fix-projects - Created test project with ID: ${result.insertedId}`)
      
      return NextResponse.json({ 
        message: "Created a test project for the current user", 
        projectId: result.insertedId,
        fixed: 1
      })
    }
    
    // Fix projects with inconsistent userId format
    let fixedCount = 0
    for (const project of allProjects) {
      if (project.userId && typeof project.userId !== 'string') {
        console.log(`DEBUG GET /api/debug/fix-projects - Fixing project ${project._id} with userId type: ${typeof project.userId}`)
        
        await db.collection("projects").updateOne(
          { _id: project._id },
          { $set: { userId: String(project.userId) } }
        )
        
        fixedCount++
      }
    }
    
    return NextResponse.json({ 
      message: `Fixed ${fixedCount} projects with inconsistent userId format`,
      fixed: fixedCount,
      userProjects: userProjects.map(p => ({ id: p._id, name: p.name }))
    })
  } catch (error) {
    console.error("DEBUG GET /api/debug/fix-projects - Error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
