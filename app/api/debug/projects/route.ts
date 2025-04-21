import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"

// This is a debug endpoint to directly access projects from the database
export async function GET(request: Request) {
  try {
    // Get the authenticated user ID
    const { userId } = await auth()
    console.log('DEBUG GET /api/debug/projects - Auth userId:', userId)

    if (!userId) {
      console.log('DEBUG GET /api/debug/projects - No userId found in auth')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect directly to the database
    const { db, isLocal } = await connectToDatabase()
    console.log('DEBUG GET /api/debug/projects - Connected to database, isLocal:', isLocal)
    
    // Check if projects collection exists
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    console.log('DEBUG GET /api/debug/projects - Available collections:', collectionNames)
    
    if (!collectionNames.includes('projects')) {
      console.log('DEBUG GET /api/debug/projects - Projects collection does not exist')
      return NextResponse.json({ projects: [], message: "Projects collection does not exist" })
    }
    
    // Count total projects in the collection
    const totalCount = await db.collection("projects").countDocuments({})
    console.log(`DEBUG GET /api/debug/projects - Total projects in collection: ${totalCount}`)
    
    // Get all projects (for debugging)
    const allProjects = await db.collection("projects").find({}).limit(10).toArray()
    console.log('DEBUG GET /api/debug/projects - Sample of all projects:', 
      allProjects.map(p => ({ id: p._id, name: p.name, userId: p.userId }))
    )
    
    // Get projects for this user
    console.log(`DEBUG GET /api/debug/projects - Querying for projects with userId: ${userId}`)
    const userProjects = await db.collection("projects").find({ userId: userId }).toArray()
    console.log(`DEBUG GET /api/debug/projects - Found ${userProjects.length} projects for user ${userId}`)
    
    // Also try with string conversion
    const userIdStr = String(userId)
    console.log(`DEBUG GET /api/debug/projects - Also querying with userId as string: ${userIdStr}`)
    const userProjectsStr = await db.collection("projects").find({ userId: userIdStr }).toArray()
    console.log(`DEBUG GET /api/debug/projects - Found ${userProjectsStr.length} projects with userId as string`)
    
    // Combine results (removing duplicates)
    const combinedProjects = [...userProjects]
    for (const project of userProjectsStr) {
      if (!combinedProjects.some(p => p._id.toString() === project._id.toString())) {
        combinedProjects.push(project)
      }
    }

    return NextResponse.json({ 
      projects: combinedProjects,
      debug: {
        userId,
        totalProjects: totalCount,
        userProjects: userProjects.map(p => ({ id: p._id, name: p.name, userId: p.userId })),
        userProjectsStr: userProjectsStr.map(p => ({ id: p._id, name: p.name, userId: p.userId })),
        allProjects: allProjects.map(p => ({ id: p._id, name: p.name, userId: p.userId }))
      }
    })
  } catch (error) {
    console.error("DEBUG GET /api/debug/projects - Error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : "Unknown error",
      projects: [] 
    }, { status: 500 })
  }
}
