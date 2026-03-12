"use client"

import React, { createContext, useContext, useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AuthUser {
  userId: string
  email: string
  name?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const fetchUser = async () => {
    try {
      const { data: { user: sessionUser }, error } = await supabase.auth.getUser()
      if (sessionUser) {
        setUser({
          userId: sessionUser.id,
          email: sessionUser.email || "",
          name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || undefined
        })
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            userId: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || undefined
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      setUser(null)
      router.push("/sign-in")
      router.refresh()
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signOut, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
