"use client"

import { ReactNode } from "react"
import { DashboardHeader } from "@/components/dashboard-header"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-slate-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} BuildWise.ai. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
