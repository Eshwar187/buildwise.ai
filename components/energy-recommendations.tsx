"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  Leaf, 
  DollarSign, 
  Lightbulb, 
  Droplets, 
  Sun, 
  Thermometer, 
  Info,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnergyRecommendation } from "@/lib/mongodb-models"

interface EnergyRecommendationsProps {
  recommendations: EnergyRecommendation[]
  countryCode: string
  currency: string
}

export function EnergyRecommendations({ 
  recommendations, 
  countryCode, 
  currency 
}: EnergyRecommendationsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  
  // Filter recommendations by category
  const filteredRecommendations = activeCategory === "all" 
    ? recommendations 
    : recommendations.filter(rec => rec.category.toLowerCase() === activeCategory.toLowerCase())
  
  // Get all unique categories
  const categories = Array.from(
    new Set(recommendations.map(rec => rec.category))
  )

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "insulation":
        return <Thermometer className="h-5 w-5 text-blue-400" />
      case "solar":
        return <Sun className="h-5 w-5 text-yellow-400" />
      case "hvac":
        return <Thermometer className="h-5 w-5 text-red-400" />
      case "lighting":
        return <Lightbulb className="h-5 w-5 text-yellow-400" />
      case "water":
        return <Droplets className="h-5 w-5 text-blue-400" />
      default:
        return <Leaf className="h-5 w-5 text-green-400" />
    }
  }

  // Format currency
  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Energy Efficiency Recommendations</h2>
        <p className="text-slate-400 text-sm">
          Optimize your building for energy efficiency and cost savings
        </p>
      </div>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700 mb-4 overflow-x-auto flex w-full">
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
            All Recommendations
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category.toLowerCase()} 
              className="data-[state=active]:bg-slate-700 flex items-center"
            >
              {getCategoryIcon(category)}
              <span className="ml-1">{category}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation._id?.toString() || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700 overflow-hidden h-full flex flex-col">
                  {recommendation.imageUrl && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={recommendation.imageUrl}
                        alt={recommendation.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-slate-900/80 flex items-center">
                        {getCategoryIcon(recommendation.category)}
                        <span className="ml-1">{recommendation.category}</span>
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className={recommendation.imageUrl ? "pt-4" : "pt-6"}>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{recommendation.title}</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400">
                      {recommendation.description.length > 100 
                        ? `${recommendation.description.substring(0, 100)}...` 
                        : recommendation.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-grow">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Leaf className="h-4 w-4 text-green-500 mr-1.5" />
                        <span className="text-sm text-slate-300">Potential Savings</span>
                      </div>
                      <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30">
                        {recommendation.savingsEstimate}%
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-slate-500 mr-1.5" />
                        <span className="text-sm text-slate-300">Implementation Cost</span>
                      </div>
                      <Badge 
                        className={`
                          ${recommendation.implementationCost.level === "Low" 
                            ? "bg-green-600/20 text-green-400" 
                            : recommendation.implementationCost.level === "Medium"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : "bg-red-600/20 text-red-400"
                          }
                        `}
                      >
                        {recommendation.implementationCost.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Cost-Benefit Ratio</span>
                        <span className="text-xs text-teal-400">
                          {Math.round(recommendation.savingsEstimate / 
                            (recommendation.implementationCost.level === "Low" ? 1 : 
                             recommendation.implementationCost.level === "Medium" ? 2 : 3) * 10) / 10}
                        </span>
                      </div>
                      <Progress 
                        value={recommendation.savingsEstimate / 
                          (recommendation.implementationCost.level === "Low" ? 1 : 
                           recommendation.implementationCost.level === "Medium" ? 2 : 3) * 10} 
                        className="h-1.5 bg-slate-700"
                      >
                        <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" />
                      </Progress>
                    </div>
                    
                    <div className="text-sm text-slate-400">
                      Estimated Cost: {formatCurrency(recommendation.implementationCost.amount, recommendation.implementationCost.currency)}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2 pb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full border-slate-600 text-slate-300">
                          <Info className="h-4 w-4 mr-1.5" /> View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white">
                        <DialogHeader>
                          <DialogTitle>{recommendation.title}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 mt-4">
                          {recommendation.imageUrl && (
                            <div className="relative h-48 w-full rounded-md overflow-hidden">
                              <Image
                                src={recommendation.imageUrl}
                                alt={recommendation.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          
                          <Tabs defaultValue="details" className="w-full">
                            <TabsList className="bg-slate-700 border border-slate-600">
                              <TabsTrigger value="details" className="data-[state=active]:bg-slate-600">
                                Details
                              </TabsTrigger>
                              <TabsTrigger value="savings" className="data-[state=active]:bg-slate-600">
                                Savings
                              </TabsTrigger>
                              <TabsTrigger value="implementation" className="data-[state=active]:bg-slate-600">
                                Implementation
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="details" className="mt-4 space-y-4">
                              <div className="bg-slate-700/50 p-4 rounded-md">
                                <p className="text-slate-300 text-sm whitespace-pre-line">
                                  {recommendation.description}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-slate-700 flex items-center">
                                  {getCategoryIcon(recommendation.category)}
                                  <span className="ml-1">{recommendation.category}</span>
                                </Badge>
                                
                                {recommendation.applicableRegions.includes(countryCode) && (
                                  <Badge variant="outline" className="bg-slate-700 text-green-400 border-green-500">
                                    Available in Your Region
                                  </Badge>
                                )}
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="savings" className="mt-4 space-y-4">
                              <div className="bg-slate-700/50 p-4 rounded-md space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-1">Potential Energy Savings</h4>
                                  <div className="flex items-center">
                                    <Progress 
                                      value={recommendation.savingsEstimate} 
                                      className="h-2.5 bg-slate-600 flex-grow mr-3"
                                    >
                                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
                                    </Progress>
                                    <span className="text-lg font-medium text-green-400">
                                      {recommendation.savingsEstimate}%
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-1">Estimated Annual Savings</h4>
                                  <p className="text-lg font-medium text-green-400">
                                    {formatCurrency(
                                      // This is a simplified calculation - in a real app, you'd use actual energy costs
                                      (recommendation.savingsEstimate / 100) * 1200, 
                                      currency
                                    )}
                                    <span className="text-sm text-slate-400 ml-1">per year</span>
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-1">Return on Investment</h4>
                                  <p className="text-base text-slate-300">
                                    Pays for itself in approximately{" "}
                                    <span className="text-teal-400 font-medium">
                                      {Math.round(recommendation.implementationCost.amount / 
                                        ((recommendation.savingsEstimate / 100) * 1200) * 10) / 10} years
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="implementation" className="mt-4 space-y-4">
                              <div className="bg-slate-700/50 p-4 rounded-md space-y-3">
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-1">Implementation Cost</h4>
                                  <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium text-white">
                                      {formatCurrency(recommendation.implementationCost.amount, recommendation.implementationCost.currency)}
                                    </span>
                                    <Badge 
                                      className={`
                                        ${recommendation.implementationCost.level === "Low" 
                                          ? "bg-green-600/20 text-green-400" 
                                          : recommendation.implementationCost.level === "Medium"
                                            ? "bg-yellow-600/20 text-yellow-400"
                                            : "bg-red-600/20 text-red-400"
                                        }
                                      `}
                                    >
                                      {recommendation.implementationCost.level} Cost
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-1">Difficulty Level</h4>
                                  <div className="flex items-center space-x-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <div 
                                        key={i} 
                                        className={`h-2 w-8 rounded-full ${
                                          i < (recommendation.implementationCost.level === "Low" ? 1 : 
                                               recommendation.implementationCost.level === "Medium" ? 2 : 3)
                                            ? "bg-teal-500" 
                                            : "bg-slate-600"
                                        }`} 
                                      />
                                    ))}
                                    <span className="text-sm text-slate-400 ml-2">
                                      {recommendation.implementationCost.level === "Low" 
                                        ? "Easy" 
                                        : recommendation.implementationCost.level === "Medium"
                                          ? "Moderate"
                                          : "Complex"}
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-1">Professional Installation</h4>
                                  <p className="text-sm text-slate-300">
                                    {recommendation.implementationCost.level === "Low" 
                                      ? "Can be DIY or professional installation" 
                                      : "Professional installation recommended"}
                                  </p>
                                </div>
                              </div>
                              
                              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                                Find Local Installers <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                              </Button>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              <p>No energy recommendations found in this category.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
