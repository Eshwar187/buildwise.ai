"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  DollarSign, 
  Leaf, 
  Shield, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  BookmarkCheck 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Material } from "@/lib/mongodb-models"

interface MaterialRecommendationsProps {
  materials: Material[]
  budget: number
  currency: string
  onSaveMaterial: (materialId: string) => void
  savedMaterials?: string[]
}

export function MaterialRecommendations({ 
  materials, 
  budget, 
  currency, 
  onSaveMaterial,
  savedMaterials = []
}: MaterialRecommendationsProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materials)
  const [sortBy, setSortBy] = useState<"cost" | "sustainability" | "durability">("cost")

  // Filter and sort materials when dependencies change
  useEffect(() => {
    let filtered = [...materials]
    
    // Apply category filter
    if (activeTab !== "all") {
      filtered = filtered.filter(material => material.category.toLowerCase() === activeTab.toLowerCase())
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "cost") {
        return a.costPerUnit - b.costPerUnit
      } else if (sortBy === "sustainability") {
        return b.sustainability - a.sustainability
      } else {
        return b.durability - a.durability
      }
    })
    
    setFilteredMaterials(filtered)
  }, [materials, activeTab, sortBy])

  // Group materials by category
  const categories = Array.from(new Set(materials.map(material => material.category)))

  // Calculate total cost for a material based on project size
  const calculateTotalCost = (costPerUnit: number, projectSize: number = 100) => {
    return costPerUnit * projectSize
  }

  // Format currency
  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Check if a material is saved
  const isMaterialSaved = (materialId: string) => {
    return savedMaterials.includes(materialId.toString())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Material Recommendations</h2>
          <p className="text-slate-400 text-sm">
            Based on your budget of {formatCurrency(budget, currency)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Sort by:</span>
          <div className="flex rounded-md overflow-hidden">
            <Button 
              size="sm" 
              variant={sortBy === "cost" ? "default" : "outline"}
              className={sortBy === "cost" ? "bg-teal-600 hover:bg-teal-700" : "border-slate-600 text-slate-300"}
              onClick={() => setSortBy("cost")}
            >
              <DollarSign className="h-4 w-4 mr-1" /> Cost
            </Button>
            <Button 
              size="sm" 
              variant={sortBy === "sustainability" ? "default" : "outline"}
              className={sortBy === "sustainability" ? "bg-green-600 hover:bg-green-700" : "border-slate-600 text-slate-300"}
              onClick={() => setSortBy("sustainability")}
            >
              <Leaf className="h-4 w-4 mr-1" /> Eco
            </Button>
            <Button 
              size="sm" 
              variant={sortBy === "durability" ? "default" : "outline"}
              className={sortBy === "durability" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"}
              onClick={() => setSortBy("durability")}
            >
              <Shield className="h-4 w-4 mr-1" /> Durability
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700 mb-4 overflow-x-auto flex w-full">
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
            All Materials
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category.toLowerCase()} 
              className="data-[state=active]:bg-slate-700"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material, index) => (
              <motion.div
                key={material._id?.toString() || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700 overflow-hidden h-full flex flex-col">
                  {material.imageUrl && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={material.imageUrl}
                        alt={material.name}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-slate-900/80">
                        {material.category}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className={material.imageUrl ? "pt-4" : "pt-6"}>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{material.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                        onClick={() => onSaveMaterial(material._id?.toString() || "")}
                      >
                        {isMaterialSaved(material._id?.toString() || "") ? (
                          <BookmarkCheck className="h-5 w-5 text-teal-500" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <CardDescription className="text-slate-400">
                      {material.description.length > 100 
                        ? `${material.description.substring(0, 100)}...` 
                        : material.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Cost</span>
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(material.costPerUnit, material.currency)} per {material.unit}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Sustainability</span>
                        <span className="text-xs text-green-400">{material.sustainability}/10</span>
                      </div>
                      <Progress value={material.sustainability * 10} className="h-1.5 bg-slate-700">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
                      </Progress>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Durability</span>
                        <span className="text-xs text-blue-400">{material.durability}/10</span>
                      </div>
                      <Progress value={material.durability * 10} className="h-1.5 bg-slate-700">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                      </Progress>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Energy Efficiency</span>
                        <span className="text-xs text-teal-400">{material.energyEfficiency}/10</span>
                      </div>
                      <Progress value={material.energyEfficiency * 10} className="h-1.5 bg-slate-700">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" />
                      </Progress>
                    </div>
                    
                    {material.locallyAvailable && (
                      <Badge variant="outline" className="bg-slate-700 text-green-400 border-green-500">
                        Locally Available
                      </Badge>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-2 pb-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                      </Button>
                    </div>
                    
                    {material.supplier?.website && (
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                        Supplier <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              <p>No materials found in this category.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
