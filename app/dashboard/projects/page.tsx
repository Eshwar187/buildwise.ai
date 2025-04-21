"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Loader2,
  RefreshCw,
  Wrench
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { toast } from "sonner"

interface Project {
  _id: string
  name: string
  description: string
  landDimensions: {
    length: number | string
    width: number | string
    totalArea?: number | string
  }
  landUnit: string
  budget: number | string
  currency: string
  location: {
    country: string
    state: string
    city: string
    region?: string
  }
  status: "Planning" | "In Progress" | "Completed"
  createdAt: string
  updatedAt: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Function to fetch projects
  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      console.log('Fetching projects...')
      // Add a cache-busting parameter to avoid caching issues
      const response = await fetch(`/api/projects?t=${new Date().getTime()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const data = await response.json()
      console.log(`Fetched ${data.projects?.length || 0} projects`)
      setProjects(data.projects || [])
      setFilteredProjects(data.projects || [])

      if (data.projects?.length === 0) {
        console.log('No projects found, showing empty state')
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch projects on initial load
  useEffect(() => {
    fetchProjects()

    // Also check for refresh parameter in URL (used after project creation)
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('refresh')) {
      console.log('Refresh parameter detected, fetching projects again...')
      // Remove the refresh parameter from the URL without reloading the page
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [])

  // Filter projects when search query or status filter changes
  useEffect(() => {
    let filtered = [...projects]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.location.country.toLowerCase().includes(query) ||
          project.location.state.toLowerCase().includes(query) ||
          project.location.city.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }, [searchQuery, statusFilter, projects])

  // Handle project creation
  const handleCreateProject = async (projectData: any) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const data = await response.json()
      setProjects(prev => [data.project, ...prev])
      toast.success("Project created successfully")
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Failed to create project")
    }
  }

  // Format currency
  const formatCurrency = (amount: number | string, currency: string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(numAmount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
      case "In Progress":
        return "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
      case "Completed":
        return "bg-green-600/20 text-green-400 hover:bg-green-600/30"
      default:
        return "bg-slate-600/20 text-slate-400 hover:bg-slate-600/30"
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Projects"
        text="Create and manage your floor plan projects."
      >
        <div className="flex items-center space-x-2">
          <Button
            onClick={fetchProjects}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-700"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button
            onClick={async () => {
              toast.info("Checking for projects in database...")
              try {
                const response = await fetch('/api/debug/projects')
                if (response.ok) {
                  const data = await response.json()
                  console.log('Debug projects response:', data)
                  if (data.projects && data.projects.length > 0) {
                    toast.success(`Found ${data.projects.length} projects in database!`)
                    // Refresh the projects list
                    fetchProjects()
                  } else {
                    toast.warning("No projects found in database. Trying to fix...")
                    // Try to fix projects
                    const fixResponse = await fetch('/api/debug/fix-projects')
                    if (fixResponse.ok) {
                      const fixData = await fixResponse.json()
                      console.log('Fix projects response:', fixData)
                      if (fixData.fixed > 0) {
                        toast.success(`Fixed ${fixData.fixed} projects!`)
                        // Refresh the projects list
                        fetchProjects()
                      } else {
                        toast.error("Could not fix any projects.")
                      }
                    }
                  }
                }
              } catch (error) {
                console.error('Error debugging projects:', error)
                toast.error("Error checking projects")
              }
            }}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <Wrench className="mr-2 h-4 w-4" /> Debug
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </DashboardHeader>

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className="bg-slate-800 border-slate-700 h-full flex flex-col cursor-pointer hover:border-teal-500/50 transition-colors"
                  onClick={() => router.push(`/dashboard/projects/${project._id}`)}
                >
                  <CardHeader className="pb-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <CardTitle className="text-white mt-2">{project.name}</CardTitle>
                    <CardDescription className="text-slate-400 line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 flex-grow">
                    <div className="flex items-start space-x-2">
                      <Building2 className="h-4 w-4 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-300">
                          {project.landDimensions.length} × {project.landDimensions.width} {project.landUnit}
                        </p>
                        <p className="text-xs text-slate-500">
                          Total Area: {project.landDimensions.totalArea ||
                            (parseFloat(project.landDimensions.length as string) *
                             parseFloat(project.landDimensions.width as string))} {project.landUnit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                      <p className="text-sm text-slate-300">
                        {project.location.city}, {project.location.state}, {project.location.country}
                      </p>
                    </div>

                    <div className="flex items-start space-x-2">
                      <DollarSign className="h-4 w-4 text-slate-500 mt-0.5" />
                      <p className="text-sm text-slate-300">
                        {formatCurrency(project.budget, project.currency)}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-slate-700 pt-4">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Created {formatDate(project.createdAt)}</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
            <Building2 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
            <p className="text-slate-400 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first project"}
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>
        )}
      </div>

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProject}
      />
    </DashboardShell>
  )
}
