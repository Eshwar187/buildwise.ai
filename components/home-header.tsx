"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HomeHeader() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo-elegant.svg" alt="BuildWise.ai Logo" width={240} height={60} priority className="hover:opacity-90 transition-opacity" />
        </Link>
        <nav className="flex gap-4">
          <Button variant="ghost" className="text-white hover:bg-slate-800">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}