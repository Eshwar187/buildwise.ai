"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { label: "Product", href: "#product" },
  { label: "Platform", href: "#platform" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "/contact" },
]

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
              <span className="text-sm font-semibold tracking-wide text-white sm:text-base">
                BuildWise.ai
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center rounded-full border border-white/10 bg-white/5 p-1 shadow-lg shadow-black/10">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" className="rounded-full border border-white/10 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="rounded-full border border-indigo-400/20 bg-indigo-600 px-6 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500">
              <Link href="/sign-up">
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="surface-panel rounded-[1.75rem] p-3">
              <nav className="grid gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-3 grid gap-2 border-t border-white/10 pt-3 sm:grid-cols-2">
                <Button asChild variant="ghost" className="rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="rounded-2xl border border-indigo-400/20 bg-indigo-600 text-white hover:bg-indigo-500">
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
