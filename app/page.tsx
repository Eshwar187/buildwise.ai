"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ChevronDown, Sparkles, Shield, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { HomeHeader } from "@/components/home-header"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  const router = useRouter()
  const { user, isLoaded } = useAuth()
  const isSignedIn = !!user
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const toggleMute = () => setIsMuted(!isMuted)

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = '/dashboard'
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  useEffect(() => {
    setIsVisible(true)
    const timer = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-cyan-500/10 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const heroSections = [
    {
      title: "AI-Powered Architecture",
      description: "Visionary design meets generative intelligence. Construct detailed floor plans with BuildWise.ai.",
      image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=2000",
    },
    {
      title: "Precision Material Estimation",
      description: "Real-time cost analysis and sustainable selections tailored to your specific project needs.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2000",
    },
    {
      title: "Seamless Expert Synergy",
      description: "Collaborate with top-tier contractors and designers in a unified digital ecosystem.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000",
    },
  ]

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      <audio ref={audioRef} src="/song.mp3" loop autoPlay muted={isMuted} />
      <HomeHeader />

      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={toggleMute} 
          className="rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 hover:bg-slate-800/60 shadow-xl transition-all"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-[5000ms]"
                style={{
                  backgroundImage: `url(${heroSections[currentSection].image})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617]" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-6 z-10 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.1)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Construction Intel</span>
              </motion.div>

              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
              >
                {heroSections[currentSection].title}
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                {heroSections[currentSection].description}
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-5 justify-center"
              >
                <Button
                  size="lg"
                  className="h-14 px-8 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-full shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all group"
                  onClick={() => router.push("/sign-up")}
                >
                  Start Building
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 border-slate-700 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white rounded-full transition-all"
                  onClick={scrollToFeatures}
                >
                  Explore Capabilities
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={scrollToFeatures}
            >
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Engineered for Excellence
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              BuildWise.ai integrates high-performance AI frameworks with deep architectural knowledge to streamline your workflow.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Gemini High-Speed Engine",
                description: "Leverage Google's Gemini models for rapid design iteration and real-time architectural insights.",
                gradient: "from-cyan-500/20 to-teal-500/20",
                border: "hover:border-cyan-500/40"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Sustainable Sourcing",
                description: "AI-curated material recommendations that balance ecological impact with project cost efficiency.",
                gradient: "from-teal-500/20 to-emerald-500/20",
                border: "hover:border-teal-500/40"
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Precision Matching",
                description: "Our proprietary algorithm connects you with certified local designers who match your aesthetic profile.",
                gradient: "from-purple-500/20 to-cyan-500/20",
                border: "hover:border-purple-500/40"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={item}
                whileHover={{ y: -8 }}
                className={`p-10 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/5 ${feature.border} transition-all group`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] rounded-full -translate-y-1/2" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-16 rounded-[3rem] bg-slate-900/30 backdrop-blur-2xl border border-white/5 shadow-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
              Construct Your Vision
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the elite circle of builders and designers defining the next era of construction with BuildWise.ai.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="h-16 px-10 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-full transition-all shadow-xl shadow-white/5"
                onClick={() => router.push("/sign-up")}
              >
                Architect Your Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 border-slate-700 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800 text-white rounded-full transition-all"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#020617]/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                  <span className="text-slate-900 font-black text-xl">B</span>
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">BuildWise<span className="text-cyan-500">.ai</span></span>
              </Link>
              <p className="text-slate-500 leading-relaxed">
                Empowering the modern architect with generative intelligence and precision tools.
              </p>
            </div>
            {["Platform", "Resources", "Company"].map((title, i) => (
              <div key={i}>
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6">{title}</h4>
                <ul className="space-y-4">
                  {["Link One", "Link Two", "Link Three"].map((link, j) => (
                    <li key={j}>
                      <Link href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm font-medium">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-600 text-sm">© {new Date().getFullYear()} BuildWise.ai. Built for the future.</p>
            <div className="flex gap-8">
              {["Terms", "Privacy", "Security"].map((legal, i) => (
                <Link key={i} href="#" className="text-slate-600 hover:text-slate-400 transition-colors text-sm">{legal}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
}