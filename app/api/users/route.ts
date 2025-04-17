import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getUserByClerkId } from "@/lib/mongodb-models"

export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is an admin
    const user = await getUserByClerkId(userId)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all users
    const { db } = await connectToDatabase()
    const users = await db.collection("users").find().sort({ createdAt: -1 }).toArray()

    // For each user, get their project count
    interface User {
      clerkId: string
      [key: string]: any // To allow other fields from the user document
    }

    interface UserWithProjectCount extends User {
      projectsCount: number
    }

    const usersWithProjectCount: UserWithProjectCount[] = await Promise.all(
      users.map(async (user: User): Promise<UserWithProjectCount> => {
      const projectCount: number = await db.collection("projects").countDocuments({ userId: user.clerkId })
      return {
        ...user,
        projectsCount: projectCount,
      }
      }),
    )

    return NextResponse.json(usersWithProjectCount)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

