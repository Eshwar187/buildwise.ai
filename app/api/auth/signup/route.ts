import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    const supabase = await createClient()

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          first_name: firstName || "",
          last_name: lastName || "",
          username: email.split("@")[0],
        },
      },
    })

    if (error) {
      console.error("Supabase signup error:", error.message)
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      )
    }

    // Also create a row in the users table for app-level data
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: email.toLowerCase(),
        username: email.split("@")[0],
        first_name: firstName || null,
        last_name: lastName || null,
        is_admin: false,
        is_approved: false,
      })

    if (insertError) {
      // User might already exist via a trigger – that's fine
      console.warn("Insert users row warning:", insertError.message)
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
