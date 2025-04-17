"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminRegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [reason, setReason] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      // Use our custom registration flow that doesn't require Clerk session
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          reason,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit admin registration")
      }

      setRequestSent(true)
      toast.success("Admin registration request sent successfully!")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (requestSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Request Submitted</CardTitle>
              <CardDescription className="text-slate-400">
                Your admin registration request has been sent
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-white">
                An email has been sent to the main administrator for approval. You will be notified once your request
                has been processed.
              </p>

              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="text-teal-400 flex items-center mb-6 hover:text-teal-300 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Register as Admin</CardTitle>
            <CardDescription className="text-slate-400">Request admin access to ConstructHub.ai</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_username"
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
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

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-white">
                  Reason for Admin Access
                </Label>
                <Input
                  id="reason"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly explain why you need admin access"
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Submitting Request..." : "Request Admin Access"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-700 pt-4">
            <p className="text-slate-400">
              Already have admin access?{" "}
              <Link href="/admin/sign-in" className="text-teal-400 hover:text-teal-300 transition-colors">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

