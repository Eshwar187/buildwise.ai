"use client"

import { ReactNode, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Calculator, ClipboardList, PenTool, Sparkles, Box } from "lucide-react"

const features = [
  {
    title: "AI-Powered Planning",
    description: "Instantly generate project schedules, material lists, and energy recommendations.",
    icon: Sparkles,
    color: "from-blue-500 to-indigo-500",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
  },
  {
    title: "Smart Cost Estimation",
    description: "Pinpoint accurate cost projections based on real-time market data and historical analysis.",
    icon: Calculator,
    color: "from-emerald-500 to-teal-500",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"
  },
  {
    title: "Seamless Collaboration",
    description: "Connect architects, contractors, and clients in one unified intelligent workspace.",
    icon: Building2,
    color: "from-orange-500 to-rose-500",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')]"
  }
]

interface AuthSplitLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  tag?: string
  sideTitle?: string
  sideDescription?: string
  sideIcon?: any // Lucide icon
  accentColor?: string
}

export function AuthSplitLayout({ 
  children,
  title,
  subtitle,
  tag,
  sideTitle,
  sideDescription,
  sideIcon: SideIcon,
  accentColor = "indigo"
}: AuthSplitLayoutProps) {
  const [currentFeature, setCurrentFeature] = useState(0)

  // Auto-cycle features
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-white font-sans overflow-hidden">
      
      {/* LEFT SIDE: Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10 bg-zinc-950">
        
        {/* Logo */}
        <div className="absolute top-8 left-8 sm:left-16 lg:left-24 flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">BuildWise<span className="text-indigo-500">.ai</span></span>
        </div>

        {/* Content injected here (SignIn / SignUp form) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm mx-auto"
        >
          {children}
        </motion.div>

        {/* Footer */}
        <div className="absolute bottom-8 left-8 sm:left-16 lg:left-24 text-sm text-zinc-500">
          © {new Date().getFullYear()} BuildWise.ai. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Animated Presentation (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-900 border-l border-zinc-800/50">
        
        {/* Persistent background effects */}
        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

        <div className="relative w-full h-full flex flex-col items-center justify-center p-12">
          
          {/* Main Showcase Area */}
          <div className="w-full max-w-lg aspect-square relative flex items-center justify-center mb-12">
            
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Decorative floating shapes based on current feature */}
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Central glowing orb */}
                  <div className={`absolute w-64 h-64 rounded-full bg-gradient-to-tr ${features[currentFeature].color} opacity-20 blur-3xl`} />
                  
                  {/* Floating App Mockup Card */}
                  <motion.div 
                    initial={{ y: 20 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden shadow-black/50"
                  >
                    {/* Mockup Top Bar */}
                    <div className="flex border-b border-zinc-800 p-3 items-center gap-2 bg-zinc-950/50">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="mx-auto w-32 h-4 bg-zinc-800 rounded-full" />
                    </div>
                    {/* Mockup Content */}
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-xl mb-6 bg-gradient-to-br ${accentColor === 'rose' ? 'from-rose-500 to-pink-500' : features[currentFeature].color} flex items-center justify-center shadow-lg`}>
                        {(() => {
                          const Icon = SideIcon || features[currentFeature].icon
                          return <Icon className="w-6 h-6 text-white" />
                        })()}
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="w-3/4 h-6 bg-zinc-800 rounded-md" />
                        <div className="w-full h-4 bg-zinc-800/50 rounded-md" />
                        <div className="w-5/6 h-4 bg-zinc-800/50 rounded-md" />
                      </div>
                      
                      {/* Fake data lines */}
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                            <div className={`w-8 h-8 rounded-md bg-zinc-800 flex items-center justify-center`}>
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${features[currentFeature].color}`} />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <div className="w-1/3 h-3 bg-zinc-700/50 rounded" />
                              <div className="w-1/4 h-2 bg-zinc-800 rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Decorative orbital rings */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border border-zinc-700/30 rounded-full border-dashed"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-12 border border-blue-500/10 rounded-full"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text Content Carousel */}
          <div className="text-center h-32 relative w-full mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                  {sideTitle || features[currentFeature].title}
                </h2>
                <p className="text-zinc-400 max-w-md text-lg leading-relaxed">
                  {sideDescription || features[currentFeature].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex gap-3">
            {features.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFeature(idx)}
                className={`transition-all duration-300 rounded-full ${
                  currentFeature === idx 
                    ? `w-8 h-2.5 bg-gradient-to-r ${features[currentFeature].color} shadow-lg shadow-blue-500/20` 
                    : "w-2.5 h-2.5 bg-zinc-700 hover:bg-zinc-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
        </div>
      </div>
    </div>
  )
}
