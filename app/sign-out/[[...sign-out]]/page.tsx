"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SignOutPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const doSignOut = async () => {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error("Sign out error:", error)
      }
      // Always redirect home
      router.push("/")
      router.refresh()
    }

    doSignOut()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center animate-in fade-in zoom-in duration-300">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-white mb-2">Signing out...</h1>
        <p className="text-slate-500 text-sm">See you next time!</p>
      </div>
    </div>
  )
}
