import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { errorResponse, successResponse } from "@/lib/api"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return errorResponse("Unauthorized", 401, "unauthorized", { user: null })
    }

    return successResponse({ user })
  } catch (error) {
    console.error("Auth me error:", error)
    return errorResponse("Unauthorized", 401, "unauthorized", { user: null })
  }
}
