"use client"

import { ReactNode } from "react"
import { DashboardHeader } from "@/components/dashboard-header"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]"
      />

      <DashboardHeader />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="w-full">{children}</div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {new Date().getFullYear()} BuildWise.ai. All rights reserved.</p>
          <p>Designed for focused project planning and delivery.</p>
        </div>
      </footer>
    </div>
  )
}
