"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Building, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectCard } from "@/components/project-card"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import type { Project } from "@/lib/models/project"

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // All useEffect hooks must be called unconditionally
  // Redirect to sign-in if user is not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = '/sign-in'
    }
  }, [isLoaded, isSignedIn])

  // Fetch projects
  useEffect(() => {
    // Only fetch projects if user is signed in
    if (isSignedIn) {
      const fetchProjects = async () => {
        try {
          const response = await fetch("/api/projects")
          if (!response.ok) {
            throw new Error("Failed to fetch projects")
          }
          const data = await response.json()
          setProjects(data.projects || [])
        } catch (error) {
          console.error("Error fetching projects:", error)
          toast.error("Failed to load projects")
        } finally {
          setIsLoading(false)
        }
      }

      fetchProjects()
    }
  }, [isSignedIn])

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  // Define all functions before any conditional returns
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

      const newProject = await response.json()
      setProjects([newProject, ...projects])
      toast.success("Project created successfully!")
      setIsCreateProjectOpen(false)
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Failed to create project")
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      setProjects(projects.filter((project) => project._id?.toString() !== projectId))
      toast.success("Project deleted successfully!")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project")
    }
  }

  // Don't render anything if not signed in
  if (!isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {user?.firstName || user?.username}</h1>
            <p className="text-slate-400">Manage your construction projects</p>
          </div>

          <Button
            onClick={() => setIsCreateProjectOpen(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="projects" className="data-[state=active]:bg-slate-700">
              <Building className="mr-2 h-4 w-4" /> Projects
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-slate-700 bg-slate-800/50">
                    <CardContent className="p-4">
                      <div className="h-6 w-2/3 bg-slate-700/50 animate-pulse rounded mb-2"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700/50 animate-pulse rounded"></div>
                        <div className="h-4 bg-slate-700/50 animate-pulse rounded"></div>
                        <div className="h-4 bg-slate-700/50 animate-pulse rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-400 mb-4">You don't have any projects yet.</p>
                  <Button
                    onClick={() => setIsCreateProjectOpen(true)}
                    variant="outline"
                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project._id?.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ProjectCard
                      project={project}
                      designer={{
                        id: 1,
                        name: "John Doe",
                        specialty: "Architect",
                        rating: 4.5,
                        projects: 10,
                        location: "New York",
                        imageUrl: "/path/to/image.jpg",
                      }}
                      onDelete={() => handleDeleteProject(project._id?.toString() || "")}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">Account settings functionality will be implemented here.</p>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => router.push("/sign-out")}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <CreateProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}