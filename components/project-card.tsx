"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, MapPin, DollarSign, ArrowRight, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMounted } from "@/hooks/use-mounted"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProjectCardProps {
  project: {
    id?: string
    _id?: string | { toString(): string }
    name: string
    description: string
    landArea?: string
    landUnit?: string
    budget?: string
    currency?: string
    location?: {
      country: string
      state: string
      city: string
    }
    createdAt: string | Date
    status: string
    owner?: string
  }
  onDelete?: (id: string) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const mounted = useMounted()

  const formatDate = (dateString: string | Date) => {
    if (!mounted) return "" // Return empty string during SSR to avoid hydration mismatch

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "planning":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "in progress":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  const handleDelete = () => {
    setShowDeleteAlert(false)
    if (onDelete) {
      // Use either id or _id, whichever is available
      const projectId = project.id || (project._id ? project._id.toString() : "")
      if (projectId) {
        onDelete(projectId)
      }
    }
  }

  return (
    <>
      <motion.div whileHover={{ y: -5 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
        <Card className="border-slate-700 bg-slate-800/50 overflow-hidden h-full">
          <div className="relative h-32 bg-gradient-to-r from-cyan-900/50 to-teal-900/50">
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="h-16 w-16 text-white/20" />
            </div>
            <div className="absolute top-4 right-4">
              <Badge className={`${getStatusColor(project.status)} border`}>{project.status}</Badge>
            </div>
            {onDelete && (
              <div className="absolute top-4 left-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-slate-800/50 hover:bg-red-900/50 text-slate-300 hover:text-red-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteAlert(true)
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">{project.name}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-slate-300 line-clamp-2">{project.description}</p>

            <div className="grid grid-cols-2 gap-4">
              {mounted && (
                <div className="flex items-center text-sm text-slate-400">
                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                  {formatDate(project.createdAt)}
                </div>
              )}

              {project.location?.city ? (
                <div className="flex items-center text-sm text-slate-400">
                  <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                  {project.location.city}
                </div>
              ) : project.owner ? (
                <div className="flex items-center text-sm text-slate-400">
                  <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                  {project.owner}
                </div>
              ) : null}

              {project.landArea && (
                <div className="flex items-center text-sm text-slate-400">
                  <Building2 className="h-4 w-4 mr-2 text-slate-500" />
                  {project.landArea} {project.landUnit}
                </div>
              )}

              {(project.budget || project.currency) && (
                <div className="flex items-center text-sm text-slate-400">
                  <DollarSign className="h-4 w-4 mr-2 text-slate-500" />
                  {project.currency} {project.budget}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-slate-700">
            <Button
              variant="ghost"
              className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
              onClick={() => {
                const projectId = project.id || (project._id ? project._id.toString() : "")
                if (projectId) {
                  router.push(`/dashboard/projects/${projectId}`)
                }
              }}
            >
              View Details
              <ArrowRight
                className={`ml-2 h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
              />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

