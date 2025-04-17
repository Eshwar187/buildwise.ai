import { ReactNode } from "react"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      {children}
    </div>
  )
}
