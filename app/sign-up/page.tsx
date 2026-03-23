"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Loader2, Mail, Lock, User } from "lucide-react"
import { AuthSplitLayout } from "@/components/auth/split-layout"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || "An error occurred during sign up.")
      }

      setIsSuccess(true)
      setNeedsVerification(Boolean(data?.needsVerification))

      if (!data?.needsVerification) {
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 2000)
      }

    } catch (error) {
      const err = error as any
      setError(err.message || "An error occurred during sign up.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout>
      <div className="w-full">
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center space-y-4 py-8 relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full mix-blend-screen" />
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Account Created!</h2>
              <p className="text-zinc-400 flex flex-col items-center">
                <span>Welcome to BuildWise.ai.</span>
                {needsVerification ? (
                  <span className="mt-4 text-sm bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800">
                    Check your email to verify your account, then sign in.
                  </span>
                ) : (
                  <span className="mt-4 flex items-center gap-2 text-sm bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> 
                    Redirecting to dashboard...
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSignUp} className="space-y-5 relative">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-zinc-300">
                  Full Name
                </Label>
              <div className="relative group">
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500 pl-10 h-12 text-base transition-all duration-200 group-hover:bg-zinc-900/80"
                />
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500 pl-10 h-12 text-base transition-all duration-200 group-hover:bg-zinc-900/80"
                />
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Password
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500 pl-10 h-12 text-base transition-all duration-200 group-hover:bg-zinc-900/80"
                />
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <p className="text-xs text-zinc-500 pt-1">Must be at least 6 characters long.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 text-sm flex items-start gap-3 backdrop-blur-sm"
              >
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs font-bold">!</span>
                </div>
                <p>{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 mt-4 text-base font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>
          </motion.div>
        )}

        {!isSuccess && (
          <div className="mt-8 text-center">
            <p className="text-zinc-400 text-sm flex items-center justify-center gap-2">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-white hover:text-indigo-400 font-medium transition-colors hover:underline underline-offset-4 decoration-indigo-400/30">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthSplitLayout>
  )
}
