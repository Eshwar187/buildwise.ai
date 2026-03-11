import { NextResponse } from "next/server"
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db
      .collection("users")
      .findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const now = new Date()
    const clerkId = crypto.randomUUID() // Generate a unique ID (replaces Clerk's ID)

    const user = {
      clerkId,
      username: email.split("@")[0],
      email: email.toLowerCase(),
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      passwordHash,
      isAdmin: false,
      isAdminApproved: false,
      createdAt: now,
      updatedAt: now,
      lastActive: now,
    }

    const result = await db.collection("users").insertOne(user)

    // Sign JWT
    const token = await signToken({ userId: clerkId, email: user.email })

    // Set the cookie and return user (without passwordHash)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...safeUser } = user
    const response = NextResponse.json({
      user: { ...safeUser, _id: result.insertedId },
    })

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
