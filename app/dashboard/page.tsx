"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  Building2,
  Clock,
  ArrowUpRight,
  Plus,
  Sparkles,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

type Project = {
  _id: string
  name: string
  status: "Planning" | "In Progress" | "Completed"
  description: string
  location: {
    city?: string
    state?: string
    country?: string
  }
  createdAt: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch(`/api/projects?t=${Date.now()}`)
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.error || "Failed to load projects")
        }
        setProjects(data?.projects || [])
      } catch (error) {
        console.error("Failed to load dashboard projects:", error)
        toast.error("Could not load project data")
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const stats = useMemo(() => {
    const active = projects.filter((p) => p.status !== "Completed").length
    const completed = projects.filter((p) => p.status === "Completed").length
    const recent = projects.filter((p) => {
      const created = new Date(p.createdAt).getTime()
      return Date.now() - created < 7 * 24 * 60 * 60 * 1000
    }).length

    return [
      { label: "Total Projects", value: String(projects.length), sub: "all projects", icon: Building2 },
      { label: "Active", value: String(active), sub: "planning/in progress", icon: Sparkles },
      { label: "Completed", value: String(completed), sub: "finished", icon: Clock },
      { label: "New This Week", value: String(recent), sub: "recently created", icon: ArrowUpRight },
    ]
  }, [projects])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div initial="hidden" animate="show" variants={container} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, {user?.user_metadata?.first_name || "Builder"}!
          </h1>
          <p className="text-slate-400 mt-1">Your live project summary is shown below.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white backdrop-blur-sm"
            onClick={() => router.push("/dashboard/projects")}
          >
            View Projects
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20"
            onClick={() => router.push("/dashboard/projects")}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="bg-slate-900/40 border-slate-800/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{stat.sub}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          <Button variant="link" className="text-indigo-400 hover:text-indigo-300 text-sm" onClick={() => router.push("/dashboard/projects")}>
            View all projects
          </Button>
        </div>

        {isLoading ? (
          <div className="h-36 flex items-center justify-center border border-slate-800 rounded-xl bg-slate-900/30">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="h-36 flex flex-col gap-3 items-center justify-center border border-slate-800 rounded-xl bg-slate-900/30">
            <p className="text-slate-400">No projects yet.</p>
            <Button size="sm" onClick={() => router.push("/dashboard/projects")}>
              Create your first project
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.slice(0, 5).map((project) => (
              <Card
                key={project._id}
                className="bg-slate-900/40 border-slate-800 hover:bg-slate-800/40 transition-all group overflow-hidden backdrop-blur-sm cursor-pointer"
                onClick={() => router.push(`/dashboard/projects/${project._id}`)}
              >
                <div className="flex items-center p-4 gap-4 text-slate-300">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{project.name}</h3>
                    <p className="text-xs text-slate-500 truncate">
                      {[project.location?.city, project.location?.state, project.location?.country].filter(Boolean).join(", ") || "Location not set"}
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400">
                    {project.status}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-white" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
