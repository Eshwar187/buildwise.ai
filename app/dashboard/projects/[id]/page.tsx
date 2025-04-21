"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Loader2,
  PencilRuler,
  Users,
  Palette,
  Leaf
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { FloorPlanProcessor } from "@/components/floor-plan-processor"
import { FloorPlanDisplay } from "@/components/floor-plan-display"
import { MaterialRecommendations } from "@/components/material-recommendations"
import { DesignerRecommendations } from "@/components/designer-recommendations"
import { EnergyRecommendations } from "@/components/energy-recommendations"
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
  preferences: {
    rooms: {
      bedrooms: number
      bathrooms: number
      kitchen: boolean
      livingRoom: boolean
      diningRoom: boolean
      study: boolean
      garage: boolean
      additionalRooms?: string[]
    }
    style?: string
    stories: number
    energyEfficient: boolean
    accessibility: boolean
    outdoorSpace: boolean
  }
  status: "Planning" | "In Progress" | "Completed"
  floorPlans?: any[]
  designerRecommendations?: string[]
  materialRecommendations?: string[]
  energyRecommendations?: string[]
  createdAt: string
  updatedAt: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [designers, setDesigners] = useState([])
  const [materials, setMaterials] = useState([])
  const [energyRecommendations, setEnergyRecommendations] = useState([])
  const [savedDesigners, setSavedDesigners] = useState<string[]>([])
  const [savedMaterials, setSavedMaterials] = useState<string[]>([])

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch project")
        }
        const data = await response.json()
        setProject(data.project)

        // Set saved items
        if (data.project.designerRecommendations) {
          setSavedDesigners(data.project.designerRecommendations)
        }

        if (data.project.materialRecommendations) {
          setSavedMaterials(data.project.materialRecommendations)
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        toast.error("Failed to load project")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  // Fetch designers when location is available
  useEffect(() => {
    const fetchDesigners = async () => {
      if (!project?.location) return

      try {
        const { country, state, city } = project.location
        const response = await fetch(
          `/api/designers?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}${
            city ? `&city=${encodeURIComponent(city)}` : ""
          }`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch designers")
        }

        const data = await response.json()
        setDesigners(data.designers || [])
      } catch (error) {
        console.error("Error fetching designers:", error)
      }
    }

    if (project) {
      fetchDesigners()
    }
  }, [project])

  // Fetch materials using real-time API
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!project) return;

      try {
        console.log('Fetching real-time materials for project...')
        setIsLoading(true)

        // Call the real-time materials API with project data
        const response = await fetch("/api/real-time/materials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(project)
        })

        if (!response.ok) {
          throw new Error("Failed to fetch real-time materials")
        }

        const data = await response.json()
        console.log(`Generated ${data.materials?.length || 0} real-time material recommendations`)

        if (data.materials && data.materials.length > 0) {
          setMaterials(data.materials)
          toast.success("Generated material recommendations based on your project")
        } else {
          throw new Error("No materials returned from API")
        }
      } catch (error) {
        console.error("Error fetching real-time materials:", error)
        toast.error("Couldn't generate material recommendations. Please try again later.")

        // No fallback - just set empty array
        setMaterials([])
      } finally {
        setIsLoading(false)
      }
    }

    if (project) {
      fetchMaterials()
    }
  }, [project])

  // Fetch energy recommendations
  useEffect(() => {
    const fetchEnergyRecommendations = async () => {
      if (!project?.location) return

      try {
        // Assuming we have a country code in the location data
        // In a real app, you would map country names to country codes
        const countryCode = "US" // Placeholder

        const response = await fetch(`/api/energy-recommendations?countryCode=${countryCode}`)
        if (!response.ok) {
          throw new Error("Failed to fetch energy recommendations")
        }

        const data = await response.json()
        setEnergyRecommendations(data.recommendations || [])
      } catch (error) {
        console.error("Error fetching energy recommendations:", error)
      }
    }

    if (project) {
      fetchEnergyRecommendations()
    }
  }, [project])

  // Handle floor plan processing completion
  const handleFloorPlanProcessed = async (floorPlanData: any) => {
    try {
      // Save the floor plan to the project
      const response = await fetch(`/api/projects/${params.id}/floor-plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Use the saved image URL if available, otherwise use the base64 data
          imageUrl: floorPlanData.enhancedFloorPlanUrl || floorPlanData.enhancedFloorPlan,
          description: floorPlanData.floorPlanData?.description || "",
          dimensions: floorPlanData.floorPlanData?.dimensions,
          rooms: floorPlanData.floorPlanData?.rooms,
          generatedBy: "gemini",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save floor plan")
      }

      const data = await response.json()

      // Update the project with the new floor plan
      setProject(prev => {
        if (!prev) return prev

        return {
          ...prev,
          floorPlans: [...(prev.floorPlans || []), data.floorPlan],
        }
      })

      toast.success("Floor plan saved successfully")
    } catch (error) {
      console.error("Error saving floor plan:", error)
      toast.error("Failed to save floor plan")
    }
  }

  // Handle saving a designer
  const handleSaveDesigner = async (designerId: string) => {
    try {
      // Check if already saved
      const isSaved = savedDesigners.includes(designerId)

      // Update local state optimistically
      setSavedDesigners(prev =>
        isSaved
          ? prev.filter(id => id !== designerId)
          : [...prev, designerId]
      )

      // Update on the server
      const response = await fetch(`/api/projects/${params.id}/designers`, {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ designerId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isSaved ? "remove" : "save"} designer`)
      }

      toast.success(`Designer ${isSaved ? "removed" : "saved"} successfully`)
    } catch (error) {
      console.error("Error saving designer:", error)
      toast.error(`Failed to ${savedDesigners.includes(designerId) ? "remove" : "save"} designer`)

      // Revert local state on error
      setSavedDesigners(prev =>
        savedDesigners.includes(designerId)
          ? prev
          : prev.filter(id => id !== designerId)
      )
    }
  }

  // Handle saving a material
  const handleSaveMaterial = async (materialId: string) => {
    try {
      // Check if already saved
      const isSaved = savedMaterials.includes(materialId)

      // Update local state optimistically
      setSavedMaterials(prev =>
        isSaved
          ? prev.filter(id => id !== materialId)
          : [...prev, materialId]
      )

      // Update on the server
      const response = await fetch(`/api/projects/${params.id}/materials`, {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ materialId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isSaved ? "remove" : "save"} material`)
      }

      toast.success(`Material ${isSaved ? "removed" : "saved"} successfully`)
    } catch (error) {
      console.error("Error saving material:", error)
      toast.error(`Failed to ${savedMaterials.includes(materialId) ? "remove" : "save"} material`)

      // Revert local state on error
      setSavedMaterials(prev =>
        savedMaterials.includes(materialId)
          ? prev
          : prev.filter(id => id !== materialId)
      )
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

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  if (!project) {
    return (
      <DashboardShell>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <Building2 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Project not found</h3>
          <p className="text-slate-400 mb-4">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button
            onClick={() => router.push("/dashboard/projects")}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={project.name}
        text={project.description}
      >
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-red-900/50 text-red-400 hover:text-white hover:bg-red-900/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </DashboardHeader>

      <div className="space-y-6">
        {/* Project Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              <span className="text-sm text-slate-400">
                Created {formatDate(project.createdAt)}
              </span>
            </div>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300"
              onClick={() => router.push("/dashboard/projects")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Building2 className="h-5 w-5 text-teal-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-white">Dimensions</h3>
                  <p className="text-slate-300">
                    {project.landDimensions.length} × {project.landDimensions.width} {project.landUnit}
                  </p>
                  <p className="text-sm text-slate-400">
                    Total Area: {project.landDimensions.totalArea ||
                      (parseFloat(project.landDimensions.length as string) *
                       parseFloat(project.landDimensions.width as string))} {project.landUnit}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-teal-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-white">Location</h3>
                  <p className="text-slate-300">
                    {project.location.city}, {project.location.state}, {project.location.country}
                  </p>
                  {project.location.region && (
                    <p className="text-sm text-slate-400">{project.location.region}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <DollarSign className="h-5 w-5 text-teal-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-white">Budget</h3>
                  <p className="text-slate-300">
                    {formatCurrency(project.budget, project.currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              <Building2 className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="floor-plans" className="data-[state=active]:bg-slate-700">
              <PencilRuler className="h-4 w-4 mr-2" /> Floor Plans
            </TabsTrigger>
            <TabsTrigger value="designers" className="data-[state=active]:bg-slate-700">
              <Users className="h-4 w-4 mr-2" /> Designers
            </TabsTrigger>
            <TabsTrigger value="materials" className="data-[state=active]:bg-slate-700">
              <Palette className="h-4 w-4 mr-2" /> Materials
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-slate-700">
              <Leaf className="h-4 w-4 mr-2" /> Energy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Building Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Room Configuration</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Bedrooms</span>
                        <span className="text-sm text-white">{project.preferences.rooms.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Bathrooms</span>
                        <span className="text-sm text-white">{project.preferences.rooms.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Kitchen</span>
                        <span className="text-sm text-white">{project.preferences.rooms.kitchen ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Living Room</span>
                        <span className="text-sm text-white">{project.preferences.rooms.livingRoom ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Dining Room</span>
                        <span className="text-sm text-white">{project.preferences.rooms.diningRoom ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Study</span>
                        <span className="text-sm text-white">{project.preferences.rooms.study ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Garage</span>
                        <span className="text-sm text-white">{project.preferences.rooms.garage ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Building Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Style</span>
                        <span className="text-sm text-white">{project.preferences.style}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Stories</span>
                        <span className="text-sm text-white">{project.preferences.stories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Energy Efficient</span>
                        <span className="text-sm text-white">{project.preferences.energyEfficient ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Accessibility Features</span>
                        <span className="text-sm text-white">{project.preferences.accessibility ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Outdoor Space</span>
                        <span className="text-sm text-white">{project.preferences.outdoorSpace ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Project Summary</h3>
                <div className="space-y-4">
                  {project.floorPlans && project.floorPlans.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Floor Plans</h4>
                      <p className="text-sm text-slate-400">
                        {project.floorPlans.length} floor plan{project.floorPlans.length !== 1 ? "s" : ""} generated
                      </p>
                      <Button
                        variant="link"
                        className="text-teal-400 p-0 h-auto text-sm"
                        onClick={() => setActiveTab("floor-plans")}
                      >
                        View Floor Plans
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Floor Plans</h4>
                      <p className="text-sm text-slate-400">No floor plans generated yet</p>
                      <Button
                        variant="link"
                        className="text-teal-400 p-0 h-auto text-sm"
                        onClick={() => setActiveTab("floor-plans")}
                      >
                        Generate Floor Plan
                      </Button>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Saved Designers</h4>
                    <p className="text-sm text-slate-400">
                      {savedDesigners.length} designer{savedDesigners.length !== 1 ? "s" : ""} saved
                    </p>
                    <Button
                      variant="link"
                      className="text-teal-400 p-0 h-auto text-sm"
                      onClick={() => setActiveTab("designers")}
                    >
                      View Designers
                    </Button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Saved Materials</h4>
                    <p className="text-sm text-slate-400">
                      {savedMaterials.length} material{savedMaterials.length !== 1 ? "s" : ""} saved
                    </p>
                    <Button
                      variant="link"
                      className="text-teal-400 p-0 h-auto text-sm"
                      onClick={() => setActiveTab("materials")}
                    >
                      View Materials
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Floor Plan */}
            {project.floorPlans && project.floorPlans.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Latest Floor Plan</h3>
                  <Button
                    variant="link"
                    className="text-teal-400"
                    onClick={() => setActiveTab("floor-plans")}
                  >
                    View All Floor Plans
                  </Button>
                </div>
                <FloorPlanDisplay
                  floorPlan={project.floorPlans[project.floorPlans.length - 1]}
                  projectName={project.name}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="floor-plans" className="mt-6 space-y-6">
            <FloorPlanProcessor
              projectId={project._id}
              projectName={project.name}
              onProcessComplete={handleFloorPlanProcessed}
            />

            {project.floorPlans && project.floorPlans.length > 0 ? (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Generated Floor Plans</h3>
                <div className="space-y-6">
                  {project.floorPlans.map((floorPlan, index) => (
                    <div key={floorPlan._id || index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-md font-medium text-white">
                          Floor Plan {index + 1}
                        </h4>
                        <span className="text-sm text-slate-400">
                          {formatDate(floorPlan.createdAt)}
                        </span>
                      </div>
                      <FloorPlanDisplay
                        floorPlan={floorPlan}
                        projectName={project.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                <PencilRuler className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No floor plans yet</h3>
                <p className="text-slate-400 mb-4">
                  Generate your first floor plan using the processor above
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="designers" className="mt-6">
            <DesignerRecommendations
              designers={designers}
              onSaveDesigner={handleSaveDesigner}
              savedDesigners={savedDesigners}
            />
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <MaterialRecommendations
              materials={materials}
              budget={parseFloat(project.budget as string)}
              currency={project.currency}
              onSaveMaterial={handleSaveMaterial}
              savedMaterials={savedMaterials}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="energy" className="mt-6">
            <EnergyRecommendations
              recommendations={energyRecommendations}
              countryCode="US" // Placeholder
              currency={project.currency}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
