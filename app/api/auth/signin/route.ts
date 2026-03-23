import { createClient } from "@/lib/supabase/server"
import { errorResponse, successResponse } from "@/lib/api"
import { authSignInSchema } from "@/lib/validation"

export async function POST(request: Request) {
  try {
    const parsedBody = await request.json().catch(() => null)
    const body = authSignInSchema.safeParse(parsedBody)

    if (!body.success) {
      return errorResponse(
        body.error.issues[0]?.message || "Email and password are required",
        400,
        "validation_error",
        body.error.flatten()
      )
    }

    const supabase = await createClient()

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.data.email.toLowerCase(),
      password: body.data.password,
    })

    if (error) {
      console.error("Supabase signin error:", error.message)
      return errorResponse(
        error.message === "Invalid login credentials" ? "Invalid email or password" : error.message,
        401,
        "authentication_failed"
      )
    }

    if (!data.user) {
      return errorResponse("Invalid email or password", 401, "authentication_failed")
    }

    // Return user info (Supabase session is set via cookies automatically)
    return successResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.first_name,
        lastName: data.user.user_metadata?.last_name,
      },
    })
  } catch (error) {
    console.error("Signin error:", error)
    return errorResponse("Internal server error", 500)
  }
}
