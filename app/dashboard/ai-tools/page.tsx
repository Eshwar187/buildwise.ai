"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard-header"
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

  const handleGenerateMaterials = async () => {
    if (!materialPrompt) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/ai/generate-materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: materialPrompt,
          budget: budget,
          currency: currency,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate materials")
      }

      const data = await response.json()
      setMaterialResult(data.result)
    } catch (error) {
      console.error("Error generating materials:", error)

      // Fallback response if API fails
      setMaterialResult(`
        Based on your project description and budget, here are the recommended materials:
        
        Foundation:
        - Reinforced concrete (4000 PSI)
        - Waterproofing membrane
        - Drainage system
        
        Structural:
        - Steel I-beams (ASTM A992)
        - Engineered wood joists
        - Concrete masonry units
        
        Exterior:
        - Fiber cement siding
        - Energy-efficient windows (double-glazed)
        - Metal roofing (standing seam)
        
        Interior:
        - Drywall (5/8" fire-rated)
        - Engineered hardwood flooring
        - Ceramic tile (bathrooms)
        
        Estimated total cost: Unable to calculate due to API error
      `)
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

  // Sample designers data
  const designers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Modern Residential",
      rating: 4.9,
      projects: 78,
      location: "New York, NY",
      imageUrl: "/placeholder.svg?height=200&width=200&text=SJ",
    },
    {
      id: 2,
      name: "Michael Chen",
      specialty: "Sustainable Design",
      rating: 4.8,
      projects: 64,
      location: "San Francisco, CA",
      imageUrl: "/placeholder.svg?height=200&width=200&text=MC",
    },
    {
      id: 3,
      name: "Priya Patel",
      specialty: "Interior Architecture",
      rating: 4.7,
      projects: 92,
      location: "Chicago, IL",
      imageUrl: "/placeholder.svg?height=200&width=200&text=PP",
    },
    {
      id: 4,
      name: "David Rodriguez",
      specialty: "Commercial Spaces",
      rating: 4.9,
      projects: 56,
      location: "Miami, FL",
      imageUrl: "/placeholder.svg?height=200&width=200&text=DR",
    },
  ]

  // Icon mapping
  const iconMap: Record<string, any> = {
    Lightbulb: Lightbulb,
    Building2: Building2,
    DollarSign: DollarSign,
    Users: Users,
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
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
                    placeholder="Search by location or specialty"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white">
                    Search
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {designers.map((designer) => (
                    <DesignerCard key={designer.id} designer={designer} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

