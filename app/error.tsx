"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-white mb-4">Error</h1>
      <h2 className="text-2xl font-semibold text-white mb-6">Something went wrong</h2>
      <p className="text-slate-400 max-w-md mb-8">
        We apologize for the inconvenience. Please try again or return to the home page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={reset}
          className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button asChild variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-950">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
