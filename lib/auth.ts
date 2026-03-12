import { createClient } from "@/lib/supabase/server"

// Extract userId from the auth cookie in API routes (server-side, uses next/headers)
export async function getAuthFromCookies(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
  } catch {
    return null
  }
}
