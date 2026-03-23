"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Wand2, MessageSquare, Lightbulb, Users, Building2, DollarSign } from "lucide-react"
import { AIChatbot } from "@/components/ai-chatbot"
import { DesignerCard } from "@/components/designer-card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("chatbot")
  const [isGenerating, setIsGenerating] = useState(false)
  const [materialPrompt, setMaterialPrompt] = useState("")
  const [materialResult, setMaterialResult] = useState("")
  const [budget, setBudget] = useState(100000)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [buildingType, setBuildingType] = useState("residential")
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [currency, setCurrency] = useState("USD")
  const [designerLocationInput, setDesignerLocationInput] = useState("New York, NY")
  const [designerLocation, setDesignerLocation] = useState("New York, NY")
  const [designerResults, setDesignerResults] = useState<any[]>([])
  const [isLoadingDesigners, setIsLoadingDesigners] = useState(false)
  const [designerError, setDesignerError] = useState("")

  // Fetch budget-based suggestions when budget changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (budget <= 0) return

      setIsLoadingSuggestions(true)

      try {
        const response = await fetch(`/api/ai/suggestions?budget=${budget}&type=${buildingType}&currency=${currency}`)

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions")
        }

        const data = await response.json()
        setSuggestions(data.suggestions)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        // Fallback suggestions if API fails
        setSuggestions([
          {
            id: 1,
            title: "Energy Efficiency",
            description: `For your budget, consider adding solar panels. You could save up to 30% on energy costs.`,
            icon: "Lightbulb",
          },
          {
            id: 2,
            title: "Material Selection",
            description: `With your budget, sustainable bamboo flooring is a cost-effective option that could increase property value.`,
            icon: "Building2",
          },
          {
            id: 3,
            title: "Budget Optimization",
            description: `Your budget would be most efficiently used by prioritizing structural elements over cosmetic features.`,
            icon: "DollarSign",
          },
        ])
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchSuggestions()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [budget, buildingType, currency])

  useEffect(() => {
    const fetchDesigners = async () => {
      if (activeTab !== "designers") return

      const location = designerLocation.trim()
      if (!location) {
        setDesignerResults([])
        setDesignerError("Enter a city, state, or country to find designers.")
        return
      }

      setIsLoadingDesigners(true)
      setDesignerError("")

      try {
        const response = await fetch(`/api/real-time/designers?location=${encodeURIComponent(location)}`)
        const data = await response.json().catch(() => null)

        if (!response.ok || !data?.success) {
          throw new Error(data?.error || "Failed to fetch designers")
        }

        setDesignerResults(Array.isArray(data.designers) ? data.designers : [])
      } catch (error) {
        console.error("Error fetching designers:", error)
        setDesignerResults([])
        setDesignerError(error instanceof Error ? error.message : "Failed to fetch designers")
      } finally {
        setIsLoadingDesigners(false)
      }
    }

    fetchDesigners()
  }, [activeTab, designerLocation])

  const handleGenerateMaterials = async () => {
    if (!materialPrompt) return

    setIsGenerating(true)
    setMaterialResult("") // Clear previous results

    try {
      toast.info("Generating material recommendations...")

      // Create a mock project object with the prompt data
      const projectData = {
        preferences: {
          style: buildingType || 'Modern',
        },
        budget: budget,
        currency: currency,
        landDimensions: {
          length: 40,
          width: 30,
        },
        landUnit: 'sq ft',
        location: {
          country: 'United States',
          state: 'California',
          city: 'Los Angeles',
        },
        description: materialPrompt,
      }

      console.log("Sending request to generate materials with data:", {
        style: projectData.preferences.style,
        budget: projectData.budget,
        description: projectData.description.substring(0, 50) + "..."
      })

      // Call the real-time materials API
      const response = await fetch("/api/real-time/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error:", errorData)
        throw new Error(errorData.error || "Failed to generate materials")
      }

      const data = await response.json()
      console.log("Received material recommendations:", {
        success: data.success,
        count: data.materials?.length || 0
      })

      if (data.materials && data.materials.length > 0) {
        // Format the materials into a readable text format
        let result = `Based on your project description and budget of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(budget)}, here are the recommended materials:\n\n`

        // Group materials by category
        const categorizedMaterials: Record<string, any[]> = {}
        data.materials.forEach((material: any) => {
          if (!categorizedMaterials[material.category]) {
            categorizedMaterials[material.category] = []
          }
          categorizedMaterials[material.category].push(material)
        })

        // Add each category and its materials
        for (const [category, materials] of Object.entries(categorizedMaterials) as [string, any[]][]) {
          result += `${category}:\n`
          materials.forEach((material) => {
            result += `- ${material.name} (${new Intl.NumberFormat('en-US', { style: 'currency', currency: material.currency }).format(material.costPerUnit)} per ${material.unit})\n`
            result += `  Sustainability: ${material.sustainability}/10, Durability: ${material.durability}/10, Energy Efficiency: ${material.energyEfficiency}/10\n`
          })
          result += '\n'
        }

        setMaterialResult(result)
        toast.success("Successfully generated material recommendations!")
      } else {
        throw new Error("No materials returned from API")
      }
    } catch (error) {
      const err = error as Error
      console.error("Error generating materials:", err)
      toast.error(`Failed to generate material recommendations: ${err.message || 'Unknown error'}. Please try again.`)
      setMaterialResult("")
    } finally {
      setIsGenerating(false)
    }
  }

  // Format currency based on selected currency
  const formatCurrency = (value: number) => {
    if (currency === "INR") {
      // Convert USD to INR (approximate exchange rate)
      const inrValue = value * 75
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(inrValue)
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value)
    }
  }

  const designerCards = designerResults.map((designer: any) => ({
    id: designer.id,
    name: designer.name,
    specialty: designer.specialization || designer.company || "Design",
    rating: Number(designer.rating) || 0,
    projects: designer.projects || 0,
    location: designer.location || [designer.city, designer.state, designer.country].filter(Boolean).join(", "),
    imageUrl: designer.imageUrl || "/placeholder.svg?height=200&width=200&text=BW",
  }))

  // Icon mapping
  const iconMap: Record<string, any> = {
    Lightbulb: Lightbulb,
    Building2: Building2,
    DollarSign: DollarSign,
    Users: Users,
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">AI Tools</h1>
          <p className="text-slate-400">Enhance your construction project with AI-powered tools</p>
        </div>

        <div className="mb-8">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Budget Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Adjust your budget to get personalized AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="budget" className="text-white">
                    Budget: {formatCurrency(budget)}
                  </Label>
                </div>

                <Slider
                  id="budget"
                  min={10000}
                  max={1000000}
                  step={10000}
                  value={[budget]}
                  onValueChange={(value) => setBudget(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>$10,000</span>
                  <span>$1,000,000</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 w-full md:w-1/2">
                  <Label htmlFor="buildingType" className="text-white">
                    Building Type
                  </Label>
                  <Select value={buildingType} onValueChange={setBuildingType}>
                    <SelectTrigger id="buildingType" className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 w-full md:w-1/2">
                  <Label htmlFor="currency" className="text-white">
                    Currency
                  </Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">AI Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingSuggestions
              ? // Loading skeletons
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="border-slate-700 bg-slate-800/50 h-full">
                      <CardHeader className="pb-2">
                        <div className="h-6 w-2/3 bg-slate-700/50 animate-pulse rounded"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-slate-700/50 animate-pulse rounded mb-2"></div>
                        <div className="h-4 bg-slate-700/50 animate-pulse rounded mb-2"></div>
                        <div className="h-4 bg-slate-700/50 animate-pulse rounded"></div>
                      </CardContent>
                    </Card>
                  ))
              : suggestions.map((suggestion) => {
                  const IconComponent = iconMap[suggestion.icon] || Lightbulb
                  return (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-slate-700 bg-slate-800/50 h-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <IconComponent className="h-5 w-5 text-cyan-400 mr-2" />
                            <CardTitle className="text-white text-lg">{suggestion.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-300">{suggestion.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
          </div>
        </div>

        <Tabs defaultValue="chatbot" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="chatbot" className="data-[state=active]:bg-slate-700">
              <MessageSquare className="mr-2 h-4 w-4" /> AI Assistant
            </TabsTrigger>
            <TabsTrigger value="materials" className="data-[state=active]:bg-slate-700">
              <Wand2 className="mr-2 h-4 w-4" /> Material Estimator
            </TabsTrigger>
            <TabsTrigger value="designers" className="data-[state=active]:bg-slate-700">
              <Users className="mr-2 h-4 w-4" /> Find Designers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chatbot" className="mt-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">AI Construction Assistant</CardTitle>
                <CardDescription className="text-slate-400">
                  Ask questions about construction, materials, regulations, or get project advice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIChatbot budget={budget} buildingType={buildingType} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">AI Material Estimator</CardTitle>
                <CardDescription className="text-slate-400">
                  Get AI-powered material recommendations and cost estimates for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Describe your project in detail (e.g., 2-story house, 2000 sq ft, 3 bedrooms, 2 bathrooms, modern style)"
                    className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                    value={materialPrompt}
                    onChange={(e) => setMaterialPrompt(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleGenerateMaterials}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                  disabled={isGenerating || !materialPrompt}
                >
                  {isGenerating ? (
                    <>
                      <motion.div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" /> Generate Recommendations
                    </>
                  )}
                </Button>

                {materialResult && (
                  <div className="mt-6 p-4 bg-slate-700 rounded-md">
                    <h3 className="text-lg font-medium text-white mb-2">Material Recommendations</h3>
                    <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">{materialResult}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="designers" className="mt-6">
            <Card className="border-slate-700 bg-slate-800/50 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Find Local Designers</CardTitle>
                <CardDescription className="text-slate-400">
                  Connect with top-rated designers and architects in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    value={designerLocationInput}
                    onChange={(e) => setDesignerLocationInput(e.target.value)}
                    placeholder="Search by location or specialty"
                    className="bg-slate-700 border-slate-600 text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        setDesignerLocation(designerLocationInput.trim())
                      }
                    }}
                  />
                  <Button
                    onClick={() => setDesignerLocation(designerLocationInput.trim())}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                    disabled={isLoadingDesigners}
                  >
                    Search
                  </Button>
                </div>

                {designerError && (
                  <div className="mb-4 rounded-md border border-amber-700/50 bg-amber-950/30 p-3 text-sm text-amber-200">
                    {designerError}
                  </div>
                )}

                {isLoadingDesigners ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array(2).fill(0).map((_, index) => (
                      <Card key={index} className="border-slate-700 bg-slate-800/50 h-48 animate-pulse" />
                    ))}
                  </div>
                ) : designerCards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {designerCards.map((designer) => (
                      <DesignerCard key={designer.id} designer={designer} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-slate-700 bg-slate-900/60 p-6 text-center text-slate-400">
                    No designers found yet. Try a different location.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}

