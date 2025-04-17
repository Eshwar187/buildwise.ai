"use client"

import { SignOutButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignOutPage() {
  const router = useRouter()
  
  // Redirect to home page after sign out
  const handleSignOutComplete = () => {
    router.push("/")
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md p-8 bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Signing Out...</h1>
        <p className="text-slate-400 mb-8 text-center">You are being signed out of BuildWise.ai</p>
        
        <div className="flex justify-center">
          <SignOutButton signOutCallback={handleSignOutComplete}>
            <button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 py-3 rounded-md font-medium">
              Click here if you're not redirected
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  )
}
