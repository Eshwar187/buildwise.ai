"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Bookmark, 
  BookmarkCheck,
  ExternalLink,
  MessageCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Designer } from "@/lib/mongodb-models"

interface DesignerRecommendationsProps {
  designers: Designer[]
  onSaveDesigner: (designerId: string) => void
  savedDesigners?: string[]
}

export function DesignerRecommendations({ 
  designers, 
  onSaveDesigner,
  savedDesigners = []
}: DesignerRecommendationsProps) {
  const [filteredDesigners, setFilteredDesigners] = useState<Designer[]>(designers)
  const [activeSpecialization, setActiveSpecialization] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"rating" | "experience">("rating")

  // Get all unique specializations
  const allSpecializations = Array.from(
    new Set(designers.flatMap(designer => designer.specialization))
  )

  // Filter and sort designers when dependencies change
  useEffect(() => {
    let filtered = [...designers]
    
    // Apply specialization filter
    if (activeSpecialization !== "all") {
      filtered = filtered.filter(designer => 
        designer.specialization.some(s => s.toLowerCase() === activeSpecialization.toLowerCase())
      )
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0)
      } else {
        return b.experience - a.experience
      }
    })
    
    setFilteredDesigners(filtered)
  }, [designers, activeSpecialization, sortBy])

  // Check if a designer is saved
  const isDesignerSaved = (designerId: string) => {
    return savedDesigners.includes(designerId.toString())
  }

  // Format phone number
  const formatPhoneNumber = (phone: string) => {
    // Simple formatting, could be enhanced based on country codes
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Local Designers</h2>
          <p className="text-slate-400 text-sm">
            {designers.length} designers available in your area
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Sort by:</span>
          <div className="flex rounded-md overflow-hidden">
            <Button 
              size="sm" 
              variant={sortBy === "rating" ? "default" : "outline"}
              className={sortBy === "rating" ? "bg-teal-600 hover:bg-teal-700" : "border-slate-600 text-slate-300"}
              onClick={() => setSortBy("rating")}
            >
              <Star className="h-4 w-4 mr-1" /> Rating
            </Button>
            <Button 
              size="sm" 
              variant={sortBy === "experience" ? "default" : "outline"}
              className={sortBy === "experience" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"}
              onClick={() => setSortBy("experience")}
            >
              <Calendar className="h-4 w-4 mr-1" /> Experience
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeSpecialization} onValueChange={setActiveSpecialization} className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700 mb-4 overflow-x-auto flex w-full">
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
            All Designers
          </TabsTrigger>
          {allSpecializations.map(specialization => (
            <TabsTrigger 
              key={specialization} 
              value={specialization.toLowerCase()} 
              className="data-[state=active]:bg-slate-700"
            >
              {specialization}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDesigners.length > 0 ? (
            filteredDesigners.map((designer, index) => (
              <motion.div
                key={designer._id?.toString() || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700 overflow-hidden h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 border-2 border-teal-500">
                          <AvatarImage src={`https://i.pravatar.cc/100?u=${designer._id}`} alt={designer.name} />
                          <AvatarFallback className="bg-teal-900 text-teal-200">
                            {designer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-white">{designer.name}</CardTitle>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${
                                  i < Math.floor(designer.rating || 0) 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : i < (designer.rating || 0) 
                                      ? "fill-yellow-400/50 text-yellow-400/50" 
                                      : "text-slate-600"
                                }`} 
                              />
                            ))}
                            <span className="text-xs text-slate-400 ml-1">
                              ({designer.rating || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                        onClick={() => onSaveDesigner(designer._id?.toString() || "")}
                      >
                        {isDesignerSaved(designer._id?.toString() || "") ? (
                          <BookmarkCheck className="h-5 w-5 text-teal-500" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-2 space-y-3 flex-grow">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                      <span className="text-sm text-slate-300">
                        {designer.location.city}, {designer.location.state}, {designer.location.country}
                        {designer.location.region && ` (${designer.location.region})`}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {designer.specialization.map((spec, i) => (
                        <Badge key={i} variant="outline" className="bg-slate-700 text-teal-400 border-teal-500">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-300">
                        {designer.experience} years of experience
                      </span>
                    </div>
                    
                    {designer.availability ? (
                      <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30">
                        Available for Projects
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-700 text-yellow-400 border-yellow-500">
                        Limited Availability
                      </Badge>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-2 pb-4 flex flex-col space-y-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full border-slate-600 text-slate-300">
                          View Contact Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Contact {designer.name}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 mt-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-16 w-16 border-2 border-teal-500">
                              <AvatarImage src={`https://i.pravatar.cc/100?u=${designer._id}`} alt={designer.name} />
                              <AvatarFallback className="bg-teal-900 text-teal-200">
                                {designer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-medium text-white">{designer.name}</h3>
                              <div className="flex items-center mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < Math.floor(designer.rating || 0) 
                                        ? "fill-yellow-400 text-yellow-400" 
                                        : i < (designer.rating || 0) 
                                          ? "fill-yellow-400/50 text-yellow-400/50" 
                                          : "text-slate-600"
                                    }`} 
                                  />
                                ))}
                                <span className="text-sm text-slate-400 ml-1">
                                  ({designer.rating || 0})
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <Tabs defaultValue="contact" className="w-full">
                            <TabsList className="bg-slate-700 border border-slate-600">
                              <TabsTrigger value="contact" className="data-[state=active]:bg-slate-600">
                                Contact
                              </TabsTrigger>
                              <TabsTrigger value="portfolio" className="data-[state=active]:bg-slate-600">
                                Portfolio
                              </TabsTrigger>
                              {designer.reviews && designer.reviews.length > 0 && (
                                <TabsTrigger value="reviews" className="data-[state=active]:bg-slate-600">
                                  Reviews
                                </TabsTrigger>
                              )}
                            </TabsList>
                            
                            <TabsContent value="contact" className="mt-4 space-y-4">
                              <div className="bg-slate-700/50 p-4 rounded-md space-y-3">
                                <div className="flex items-center space-x-3">
                                  <Phone className="h-5 w-5 text-teal-500" />
                                  <a 
                                    href={`tel:${designer.phone}`} 
                                    className="text-white hover:text-teal-400 transition-colors"
                                  >
                                    {formatPhoneNumber(designer.phone)}
                                  </a>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <Mail className="h-5 w-5 text-teal-500" />
                                  <a 
                                    href={`mailto:${designer.email}`} 
                                    className="text-white hover:text-teal-400 transition-colors"
                                  >
                                    {designer.email}
                                  </a>
                                </div>
                                
                                {designer.website && (
                                  <div className="flex items-center space-x-3">
                                    <Globe className="h-5 w-5 text-teal-500" />
                                    <a 
                                      href={designer.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-white hover:text-teal-400 transition-colors flex items-center"
                                    >
                                      {designer.website.replace(/^https?:\/\//, '')}
                                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                                    </a>
                                  </div>
                                )}
                                
                                <div className="flex items-start space-x-3">
                                  <MapPin className="h-5 w-5 text-teal-500 mt-0.5" />
                                  <span className="text-white">
                                    {designer.location.city}, {designer.location.state}, {designer.location.country}
                                    {designer.location.region && ` (${designer.location.region})`}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                                  <MessageCircle className="h-4 w-4 mr-2" /> Message
                                </Button>
                                <Button variant="outline" className="flex-1 border-slate-600 text-slate-300">
                                  Schedule Call
                                </Button>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="portfolio" className="mt-4">
                              {designer.portfolio && designer.portfolio.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                  {designer.portfolio.map((url, i) => (
                                    <div key={i} className="relative aspect-video rounded-md overflow-hidden">
                                      <Image
                                        src={url}
                                        alt={`Portfolio item ${i+1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6 text-slate-400">
                                  <p>No portfolio items available</p>
                                </div>
                              )}
                            </TabsContent>
                            
                            {designer.reviews && designer.reviews.length > 0 && (
                              <TabsContent value="reviews" className="mt-4 space-y-3">
                                {designer.reviews.map((review, i) => (
                                  <div key={i} className="bg-slate-700/50 p-3 rounded-md">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                          <AvatarFallback className="bg-slate-600 text-slate-200 text-xs">
                                            {review.userId.substring(0, 2).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center">
                                          {Array.from({ length: 5 }).map((_, i) => (
                                            <Star 
                                              key={i} 
                                              className={`h-3.5 w-3.5 ${
                                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                                              }`} 
                                            />
                                          ))}
                                        </div>
                                      </div>
                                      <span className="text-xs text-slate-400">
                                        {new Date(review.date).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-300 mt-2">{review.comment}</p>
                                  </div>
                                ))}
                              </TabsContent>
                            )}
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
              <p>No designers found with this specialization.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
