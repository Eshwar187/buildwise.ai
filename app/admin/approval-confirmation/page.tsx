"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function ApprovalConfirmationPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status")

  const isApproved = status === "approved"

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {isApproved ? (
                <CheckCircle className="h-16 w-16 text-emerald-400" />
              ) : (
                <XCircle className="h-16 w-16 text-red-400" />
              )}
            </div>
            <CardTitle className="text-2xl text-white text-center">
              {isApproved ? "Admin Request Approved" : "Admin Request Denied"}
            </CardTitle>
            <CardDescription className="text-slate-400 text-center">
              {isApproved ? "The admin request has been successfully approved" : "The admin request has been denied"}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-white mb-6">
              {isApproved
                ? "The user has been granted admin access to ConstructHub.ai and has been notified via email."
                : "The user has been notified that their request for admin access has been denied."}
            </p>

            <Link href="/">
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

