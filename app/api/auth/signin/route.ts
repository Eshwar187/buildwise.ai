import { NextResponse } from "next/server"
import { comparePassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Find user by email
    const user = await db
      .collection("users")
      .findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check password
    if (!user.passwordHash) {
      return NextResponse.json(
        {
          error:
            "This account was created with Clerk. Please sign up again with a password.",
        },
        { status: 401 }
      )
    }

    const isValid = await comparePassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Update last active
    await db
      .collection("users")
      .updateOne(
        { _id: user._id },
        { $set: { lastActive: new Date(), updatedAt: new Date() } }
      )

    // Sign JWT
    const token = await signToken({
      userId: user.clerkId,
      email: user.email,
    })

    // Return user (without passwordHash)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...safeUser } = user
    const response = NextResponse.json({ user: safeUser })

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
