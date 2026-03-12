import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    const supabase = await createClient()

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })

    if (error) {
      console.error("Supabase signin error:", error.message)
      return NextResponse.json(
        { error: error.message === "Invalid login credentials"
            ? "Invalid email or password"
            : error.message },
        { status: 401 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Return user info (Supabase session is set via cookies automatically)
    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.first_name,
        lastName: data.user.user_metadata?.last_name,
      },
    })
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
