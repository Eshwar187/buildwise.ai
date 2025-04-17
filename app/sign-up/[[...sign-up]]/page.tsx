"use client"

import { SignUp, useUser } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignUpPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const { isSignedIn } = useUser()

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isSignedIn) {
      window.location.href = '/dashboard'
    }
  }, [isSignedIn])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Join BuildWise.ai</h1>
          <p className="mt-2 text-slate-400">Create your account</p>
        </div>

        <SignUp
          appearance={{
            baseTheme: theme === "dark" ? "dark" : "light",
            elements: {
              rootBox: "mx-auto",
              card: "bg-slate-800 border border-slate-700 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "bg-slate-700 border border-slate-600 text-white hover:bg-slate-600",
              socialButtonsBlockButtonText: "text-white font-medium",
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-400",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-slate-700 border-slate-600 text-white",
              formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white",
              footerActionLink: "text-cyan-400 hover:text-cyan-300",
              identityPreviewText: "text-slate-300",
              identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
            },
          }}
          redirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  )
}
