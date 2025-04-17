"use client"

import type React from "react"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminSignInPage() {
  const { isLoaded, signIn } = useSignIn()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      setIsLoading(true)

      // Try to sign in with the provided credentials
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        // Check if the user is the admin (eshwar09052005@gmail.com)
        if (email === "eshwar09052005@gmail.com") {
          toast.success("Signed in as admin successfully!")
          router.push("/admin/dashboard")
        } else {
          toast.error("You don't have admin privileges")
          // Sign out the user
          await fetch("/api/auth/sign-out", {
            method: "POST",
          })
        }
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="text-cyan-400 flex items-center mb-6 hover:text-cyan-300 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-white">BuildWise.ai Admin</CardTitle>
            <CardDescription className="text-slate-400">Sign in to access the admin dashboard</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eshwar09052005@gmail.com"
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-slate-700 border-slate-600 text-white pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full text-slate-400 hover:text-white hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In as Admin"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-700 pt-4">
            <p className="text-slate-400">
              Need admin access?{" "}
              <Link href="/sign-in" className="text-teal-400 hover:text-teal-300 transition-colors">
                User Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

