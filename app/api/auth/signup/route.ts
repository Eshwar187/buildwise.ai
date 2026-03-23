import { createClient } from "@/lib/supabase/server"
import { errorResponse, successResponse } from "@/lib/api"
import { authSignUpSchema } from "@/lib/validation"

function deriveNameParts(input: {
  firstName?: string
  lastName?: string
  name?: string
}) {
  const fullName = input.name?.trim()
  const firstName = input.firstName?.trim() || fullName?.split(/\s+/)[0] || ""
  const lastName =
    input.lastName?.trim() ||
    fullName
      ?.split(/\s+/)
      .slice(1)
      .join(" ")
      .trim() ||
    ""

  return { firstName, lastName }
}

export async function POST(request: Request) {
  try {
    const parsedBody = await request.json().catch(() => null)
    const body = authSignUpSchema.safeParse(parsedBody)

    if (!body.success) {
      return errorResponse(
        body.error.issues[0]?.message || "Email and password are required",
        400,
        "validation_error",
        body.error.flatten()
      )
    }

    const supabase = await createClient()
    const { firstName, lastName } = deriveNameParts(body.data)
    const email = body.data.email.toLowerCase()

    const { data, error } = await supabase.auth.signUp({
      email,
      password: body.data.password,
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
        return errorResponse("An account with this email already exists", 409, "conflict")
      }
      return errorResponse(error.message, 400, "registration_failed")
    }

    if (!data.user) {
      return errorResponse("Failed to create account", 500, "registration_failed")
    }

    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      email,
      username: email.split("@")[0],
      first_name: firstName || null,
      last_name: lastName || null,
      is_admin: false,
      is_approved: false,
    })

    if (insertError) {
      const code = (insertError as { code?: string }).code
      if (code !== "PGRST205") {
        console.warn("Insert users row warning:", insertError.message)
      }
    }

    return successResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName,
      },
      needsVerification: !data.session,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return errorResponse("Internal server error", 500)
  }
}
