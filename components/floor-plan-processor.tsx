"use client"

import { useState, useCallback, memo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import dynamic from "next/dynamic"
import {
  Upload,
  Wand2,
  Loader2,
  Check,
  AlertCircle,
  Palette,
  Cube,
  FileJson,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

// Lazy load the FloorPlanDisplay component
const FloorPlanDisplay = dynamic(() => import("@/components/floor-plan-display").then(mod => mod.FloorPlanDisplay), {
  loading: () => <div className="h-64 w-full bg-slate-800 animate-pulse rounded-lg"></div>
})

interface FloorPlanProcessorProps {
  projectId: string
  projectName: string
  onProcessComplete?: (floorPlanData: any) => void
}

// Memoize the component to prevent unnecessary re-renders
export const FloorPlanProcessor = memo(function FloorPlanProcessor({
  projectId,
  projectName,
  onProcessComplete
}: FloorPlanProcessorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [colorScheme, setColorScheme] = useState<string>("modern")
  const [generate3D, setGenerate3D] = useState<boolean>(false)
  const [exportData, setExportData] = useState<boolean>(true)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processedData, setProcessedData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<string>("original")
  const [error, setError] = useState<string | null>(null)

  // Handle file selection - memoized with useCallback
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setProcessedData(null)
      setError(null)
    }
  }, [])

  // Handle file drop - memoized with useCallback
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please drop an image file")
        return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setProcessedData(null)
      setError(null)
    }
  }, [])

  // Handle drag events - memoized with useCallback
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  // Process the floor plan - memoized with useCallback
  const processFloorPlan = useCallback(async () => {
    if (!selectedFile) {
      toast.error("Please select a floor plan image")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("colorScheme", colorScheme)
      formData.append("generate3D", generate3D.toString())
      formData.append("exportData", exportData.toString())
      formData.append("projectId", projectId)

      console.log('Sending request to process floor plan with:', {
        colorScheme,
        generate3D,
        exportData,
        fileSize: selectedFile.size,
        fileType: selectedFile.type
      })

      const response = await fetch("/api/floor-plans/process", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Floor plan processing error:', errorData)
        throw new Error(errorData.error || "Failed to process floor plan")
      }

      const data = await response.json()
      setProcessedData(data)
      setActiveTab("enhanced")

      // Call the callback if provided
      if (onProcessComplete) {
        onProcessComplete(data)
      }

      toast.success("Floor plan processed successfully")
    } catch (error: any) {
      console.error("Error processing floor plan:", error)
      setError(error.message || "Failed to process floor plan")
      toast.error(error.message || "Failed to process floor plan")
    } finally {
      setIsProcessing(false)
    }
  }

  // Download processed floor plan - memoized with useCallback
  const downloadImage = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Download floor plan data - memoized with useCallback
  const downloadData = useCallback((data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    // Use React.Fragment to avoid unnecessary DOM elements
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Floor Plan Processor</CardTitle>
          <CardDescription className="text-slate-400">
            Upload a floor plan image to enhance it with better colors and clarity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              previewUrl ? "border-teal-500/50" : "border-slate-600"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative h-64 w-full">
                  <Image
                    src={previewUrl}
                    alt="Floor plan preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                      setProcessedData(null)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-slate-500" />
                </div>
                <p className="text-slate-400">
                  Drag and drop your floor plan image here, or click to browse
                </p>
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Browse Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Processing Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Processing Options</h3>

            <div className="space-y-4 md:space-y-3">
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Color Scheme</h4>
                <RadioGroup
                  value={colorScheme}
                  onValueChange={setColorScheme}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  <div>
                    <RadioGroupItem
                      value="modern"
                      id="modern"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="modern"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-700/50 p-4 hover:bg-slate-700 hover:text-slate-50 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:text-teal-400"
                    >
                      <Palette className="h-5 w-5 mb-2" />
                      Modern
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="minimal"
                      id="minimal"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="minimal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-700/50 p-4 hover:bg-slate-700 hover:text-slate-50 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:text-teal-400"
                    >
                      <Palette className="h-5 w-5 mb-2" />
                      Minimal
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="colorful"
                      id="colorful"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="colorful"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-700/50 p-4 hover:bg-slate-700 hover:text-slate-50 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:text-teal-400"
                    >
                      <Palette className="h-5 w-5 mb-2" />
                      Colorful
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="blueprint"
                      id="blueprint"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="blueprint"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-700/50 p-4 hover:bg-slate-700 hover:text-slate-50 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:text-teal-400"
                    >
                      <Palette className="h-5 w-5 mb-2" />
                      Blueprint
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cube className="h-4 w-4 text-slate-400" />
                  <Label htmlFor="generate3D" className="text-slate-300">
                    Generate 3D Visualization
                  </Label>
                </div>
                <Switch
                  id="generate3D"
                  checked={generate3D}
                  onCheckedChange={setGenerate3D}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileJson className="h-4 w-4 text-slate-400" />
                  <Label htmlFor="exportData" className="text-slate-300">
                    Export Floor Plan Data
                  </Label>
                </div>
                <Switch
                  id="exportData"
                  checked={exportData}
                  onCheckedChange={setExportData}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
            onClick={processFloorPlan}
            disabled={!selectedFile || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" /> Process Floor Plan
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Results */}
      {(processedData || error) && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Results</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 text-red-400 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Processing Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-slate-700 border border-slate-600 mb-4">
                  <TabsTrigger value="original" className="data-[state=active]:bg-slate-600">
                    Original
                  </TabsTrigger>
                  <TabsTrigger value="enhanced" className="data-[state=active]:bg-slate-600">
                    Enhanced
                  </TabsTrigger>
                  {processedData?.visualization3D && (
                    <TabsTrigger value="3d" className="data-[state=active]:bg-slate-600">
                      3D View
                    </TabsTrigger>
                  )}
                  {processedData?.floorPlanData && (
                    <TabsTrigger value="data" className="data-[state=active]:bg-slate-600">
                      Data
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="original" className="mt-0">
                  {previewUrl && (
                    <div className="relative rounded-lg overflow-hidden w-full max-w-full">
                      <Image
                        src={previewUrl}
                        alt="Original floor plan"
                        width={800}
                        height={600}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="enhanced" className="mt-0">
                  {processedData?.enhancedFloorPlan && (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden w-full max-w-full">
                        <Image
                          src={processedData.enhancedFloorPlan}
                          alt="Enhanced floor plan"
                          width={800}
                          height={600}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => downloadImage(
                            processedData.enhancedFloorPlan,
                            `${projectName.replace(/\s+/g, "-").toLowerCase()}-enhanced.png`
                          )}
                        >
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {processedData?.visualization3D && (
                  <TabsContent value="3d" className="mt-0">
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden w-full max-w-full">
                        <Image
                          src={processedData.visualization3D}
                          alt="3D visualization"
                          width={800}
                          height={600}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => downloadImage(
                            processedData.visualization3D,
                            `${projectName.replace(/\s+/g, "-").toLowerCase()}-3d.png`
                          )}
                        >
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {processedData?.floorPlanData && (
                  <TabsContent value="data" className="mt-0">
                    <div className="space-y-4">
                      <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-[400px]">
                        <pre className="text-slate-300 text-sm">
                          {JSON.stringify(processedData.floorPlanData, null, 2)}
                        </pre>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => downloadData(
                            processedData.floorPlanData,
                            `${projectName.replace(/\s+/g, "-").toLowerCase()}-data.json`
                          )}
                        >
                          <Download className="h-4 w-4 mr-2" /> Download JSON
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
})