import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getUserByClerkId } from "@/lib/mongodb-models"
import { ObjectId } from "mongodb"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is an admin
    const adminUser = await getUserByClerkId(userId)
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const userIdToDelete = params.id

    // Delete the user
    const { db } = await connectToDatabase()
    await db.collection("users").deleteOne({ _id: new ObjectId(userIdToDelete) })

    // Delete all projects associated with this user
    await db.collection("projects").deleteMany({ userId: userIdToDelete })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

