"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  Wand2, 
  Settings,
  ChevronRight,
  PlusCircle
} from "lucide-react"
import { motion } from "framer-motion"

interface NavItemProps {
  href: string
  label: string
  icon: any
  active?: boolean
}

function NavItem({ href, label, icon: Icon, active }: NavItemProps) {
  return (
    <Link href={href}>
      <div className={cn(
        "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out mb-1",
        active 
          ? "bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-indigo-400" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      )}>
        <Icon className={cn(
          "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
          active ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-300"
        )} />
        <span className="font-medium">{label}</span>
        
        {active && (
          <motion.div 
            layoutId="activeNav"
            className="absolute left-0 w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          />
        )}
      </div>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "My Projects",
      icon: Building2,
      href: "/dashboard/projects",
      active: pathname.startsWith("/dashboard/projects"),
    },
    {
      label: "Find Designers",
      icon: Users,
      href: "/designers",
      active: pathname.startsWith("/designers"),
    },
    {
      label: "AI Designer",
      icon: Wand2,
      href: "/dashboard/ai-tools",
      active: pathname.startsWith("/dashboard/ai-tools"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-xl border-r border-white/5 w-64 fixed left-0 top-0 z-20 shadow-2xl shadow-black/50 overflow-hidden">
      {/* Subtle glow behind the logo */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600/10 blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="p-6 relative z-10">

        <Link href="/dashboard" className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center border border-white/10 shadow-lg shadow-indigo-900/20">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
            BuildWise
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 overflow-y-auto mt-4">
        <nav>
          {routes.map((route) => (
            <NavItem
              key={route.href}
              href={route.href}
              label={route.label}
              icon={route.icon}
              active={route.active}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 mt-auto">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 blur-2xl rounded-full group-hover:bg-indigo-500/20 transition-colors duration-500" />
          <h4 className="text-sm font-bold text-white mb-1 relative z-10">Upgrade to Pro</h4>
          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed relative z-10">Get access to professional AI designer tools & advanced materials.</p>
          <button className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-900/20 active:scale-95 relative z-10">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}
