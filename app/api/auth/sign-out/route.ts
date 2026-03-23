import { createClient } from "@/lib/supabase/server"
import { errorResponse, successResponse } from "@/lib/api"

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    return successResponse({})
  } catch (error) {
    console.error("Sign out error:", error)
    return errorResponse("Internal server error", 500)
  }
}
