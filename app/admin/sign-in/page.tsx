"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldAlert, ArrowRight, Loader2, Home } from "lucide-react"
import { AuthSplitLayout } from "@/components/auth/split-layout"

import { Suspense } from "react"

export default function AdminSignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    }>
      <AdminSignInContent />
    </Suspense>
  )
}

function AdminSignInContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParams = searchParams?.get("redirectUrl")
  const redirectUrl = redirectParams || "/admin/dashboard"
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push(redirectUrl)
      router.refresh()
    } catch (error) {
      const err = error as any
      setError(err.message || "An error occurred during admin sign in.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      title="Admin Portal"
      subtitle="Sign in to access the restricted BuildWise admin area"
      tag="Security"
      sideTitle="Control & Oversight"
      sideDescription="Manage projects, users, and system configurations with advanced administrative tools."
      sideIcon={<ShieldAlert className="w-12 h-12 text-red-500" />}
      accentColor="red"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-2"
          >
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome, Admin</h1>
          <p className="text-zinc-400">Authenticating for restricted system access</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300 ml-1">Admin Email</Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="admin@buildwise.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900/50 border-zinc-800 focus:border-red-500/50 focus:ring-red-500/20 pl-10 h-12 rounded-xl transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" text-zinc-300>Security Key</Label>
            </div>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors">
                <Loader2 className="w-4 h-4" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900/50 border-zinc-800 focus:border-red-500/50 focus:ring-red-500/20 pl-10 h-12 rounded-xl transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20 group"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center">
                Access Panel <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-1 group"
          >
            <Home className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Return to User Interface
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  )
}
