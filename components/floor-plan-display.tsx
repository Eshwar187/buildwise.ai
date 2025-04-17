"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  Maximize2, 
  Minimize2, 
  Download, 
  Share2, 
  Info, 
  Ruler, 
  Home, 
  Bed, 
  Bath, 
  ChefHat, 
  Sofa, 
  Utensils 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { FloorPlan } from "@/lib/mongodb-models"

interface FloorPlanDisplayProps {
  floorPlan: FloorPlan
  projectName: string
}

export function FloorPlanDisplay({ floorPlan, projectName }: FloorPlanDisplayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showDimensions, setShowDimensions] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleDimensions = () => {
    setShowDimensions(!showDimensions)
  }

  const handleDownload = () => {
    // Create a temporary anchor element
    const link = document.createElement("a")
    link.href = floorPlan.imageUrl
    link.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-floor-plan.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${projectName} Floor Plan`,
          text: "Check out this floor plan I created with ConstructHub.ai",
          url: floorPlan.imageUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(floorPlan.imageUrl)
      alert("Floor plan URL copied to clipboard!")
    }
  }

  return (
    <div className={`relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 ${
      isFullscreen ? "fixed inset-0 z-50 flex items-center justify-center p-4" : ""
    }`}>
      {/* Toolbar */}
      <div className="absolute top-2 right-2 z-10 flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 bg-slate-900/80 text-slate-300 hover:bg-slate-900 hover:text-white"
                onClick={toggleDimensions}
              >
                <Ruler className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Dimensions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 bg-slate-900/80 text-slate-300 hover:bg-slate-900 hover:text-white"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 bg-slate-900/80 text-slate-300 hover:bg-slate-900 hover:text-white"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-slate-900/80 text-slate-300 hover:bg-slate-900 hover:text-white"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Floor Plan Details</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-slate-700 border border-slate-600">
                <TabsTrigger value="description" className="data-[state=active]:bg-slate-600">
                  Description
                </TabsTrigger>
                <TabsTrigger value="rooms" className="data-[state=active]:bg-slate-600">
                  Rooms
                </TabsTrigger>
                <TabsTrigger value="dimensions" className="data-[state=active]:bg-slate-600">
                  Dimensions
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4 space-y-4">
                <div className="bg-slate-700/50 p-4 rounded-md">
                  <p className="text-slate-300 text-sm whitespace-pre-line">
                    {floorPlan.description || "No description available."}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-slate-700 text-teal-400 border-teal-500">
                    Generated by {floorPlan.generatedBy === "gemini" ? "Gemini AI" : "Groq AI"}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-500">
                    {new Date(floorPlan.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </TabsContent>
              
              <TabsContent value="rooms" className="mt-4">
                {floorPlan.rooms && floorPlan.rooms.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {floorPlan.rooms.map((room, index) => (
                      <div key={index} className="bg-slate-700/50 p-3 rounded-md">
                        <div className="flex items-center space-x-2 mb-1">
                          {room.name.toLowerCase().includes("bed") ? (
                            <Bed className="h-4 w-4 text-blue-400" />
                          ) : room.name.toLowerCase().includes("bath") ? (
                            <Bath className="h-4 w-4 text-cyan-400" />
                          ) : room.name.toLowerCase().includes("kitchen") ? (
                            <ChefHat className="h-4 w-4 text-yellow-400" />
                          ) : room.name.toLowerCase().includes("living") ? (
                            <Sofa className="h-4 w-4 text-purple-400" />
                          ) : room.name.toLowerCase().includes("dining") ? (
                            <Utensils className="h-4 w-4 text-green-400" />
                          ) : (
                            <Home className="h-4 w-4 text-slate-400" />
                          )}
                          <span className="text-sm font-medium text-white">{room.name}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Area: {room.area} {floorPlan.dimensions?.unit || "sq ft"}
                          {room.dimensions && (
                            <span className="block mt-1">
                              {room.dimensions.width} × {room.dimensions.length} {floorPlan.dimensions?.unit.split(" ")[0] || "ft"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400">
                    <p>No room details available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="dimensions" className="mt-4">
                <div className="bg-slate-700/50 p-4 rounded-md space-y-3">
                  {floorPlan.dimensions ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Total Area</span>
                        <span className="text-sm font-medium text-white">
                          {floorPlan.dimensions.width * floorPlan.dimensions.length} {floorPlan.dimensions.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Width</span>
                        <span className="text-sm font-medium text-white">
                          {floorPlan.dimensions.width} {floorPlan.dimensions.unit.split(" ")[0]}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Length</span>
                        <span className="text-sm font-medium text-white">
                          {floorPlan.dimensions.length} {floorPlan.dimensions.unit.split(" ")[0]}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-center py-2 text-slate-400">No dimension details available</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 bg-slate-900/80 text-slate-300 hover:bg-slate-900 hover:text-white"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Floor Plan Image */}
      <div className="relative">
        <Image
          src={floorPlan.imageUrl}
          alt={`Floor plan for ${projectName}`}
          width={1024}
          height={1024}
          className="w-full h-auto"
        />
        
        {/* Dimensions Overlay */}
        {showDimensions && floorPlan.dimensions && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-2 left-2 bg-slate-900/90 text-white text-xs px-2 py-1 rounded"
            >
              {floorPlan.dimensions.width} × {floorPlan.dimensions.length} {floorPlan.dimensions.unit}
            </motion.div>
            
            {/* Horizontal dimension line */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute top-8 left-8 right-8 h-0.5 bg-teal-500 flex items-center justify-center"
            >
              <span className="absolute -top-6 bg-slate-900/90 text-white text-xs px-2 py-1 rounded">
                {floorPlan.dimensions.width} {floorPlan.dimensions.unit.split(" ")[0]}
              </span>
            </motion.div>
            
            {/* Vertical dimension line */}
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="absolute top-8 bottom-8 left-8 w-0.5 bg-teal-500 flex items-center justify-center"
            >
              <span className="absolute -left-6 transform -rotate-90 bg-slate-900/90 text-white text-xs px-2 py-1 rounded">
                {floorPlan.dimensions.length} {floorPlan.dimensions.unit.split(" ")[0]}
              </span>
            </motion.div>
          </div>
        )}
      </div>

      {/* Close button for fullscreen mode */}
      {isFullscreen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-10 w-10 bg-slate-900/80 text-white hover:bg-slate-900"
          onClick={toggleFullscreen}
        >
          <Minimize2 className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
