"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Building2, MessageSquare } from "lucide-react"

interface Designer {
  id: number
  name: string
  specialty: string
  rating: number
  projects: number
  location: string
  imageUrl: string
}

interface DesignerCardProps {
  designer: Designer
}

export function DesignerCard({ designer }: DesignerCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="border-slate-700 bg-slate-800/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-4 flex items-center justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={designer.imageUrl} alt={designer.name} />
                <AvatarFallback className="bg-slate-700 text-white text-xl">
                  {designer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="md:w-2/3 p-4 border-t md:border-t-0 md:border-l border-slate-700">
              <h3 className="text-lg font-medium text-white mb-1">{designer.name}</h3>

              <div className="flex items-center mb-2">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(designer.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-300">
                  {designer.rating} ({designer.projects} projects)
                </span>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex items-center text-sm text-slate-300">
                  <Building2 className="h-4 w-4 mr-2 text-slate-500" />
                  {designer.specialty}
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                  {designer.location}
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white">
                <MessageSquare className="mr-2 h-4 w-4" /> Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

