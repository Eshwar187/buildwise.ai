"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ChevronDown } from "lucide-react"
import Link from "next/link"
import { HomeHeader } from "@/components/home-header"
import { useUser } from "@clerk/nextjs"

export default function Home() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Define functions before any conditional returns
  const toggleMute = () => setIsMuted(!isMuted)

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  // All useEffect hooks must be called unconditionally
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

  // Don't render anything until we know if the user is signed in
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.3 } },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  const heroSections = [
    {
      title: "AI-Powered Floor Plans",
      description: "Transform your ideas into detailed floor plans with cutting-edge AI technology",
      image: "/first.jpg",
    },
    {
      title: "Smart Material Planning",
      description: "Get real-time cost estimates and sustainable material recommendations for your project",
      image: "/second.jpg",
    },
    {
      title: "Local Expert Network",
      description: "Connect with top designers and contractors in your area for seamless collaboration",
      image: "/third.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <audio ref={audioRef} src="/song.mp3" loop autoPlay muted={isMuted} />
      <HomeHeader />
      <div className="absolute top-24 right-4 z-10">
        <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/10">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1 }}
              className="w-full h-full"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${heroSections[currentSection].image})`,
                  filter: "brightness(0.4)",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                {heroSections[currentSection].title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">{heroSections[currentSection].description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                  onClick={() => router.push("/sign-up")}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
                  onClick={scrollToFeatures}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              onClick={scrollToFeatures}
              className="cursor-pointer"
            >
              <ChevronDown size={30} className="text-white/70" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Next-Gen Construction Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              ConstructHub.ai combines artificial intelligence with construction expertise to revolutionize how you
              plan, design, and build.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto"
          >
            <motion.div
              variants={item}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-xl transform transition-transform hover:scale-105"
            >
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed4e4027?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32&q=80"
                  alt="AI Floor Plans"
                  className="h-8 w-8 object-cover rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Gemini & Groq Powered</h3>
              <p className="text-gray-300">
                Generate detailed floor plans in seconds using Gemini and Groq AI. Customize dimensions, rooms, and styles to create your perfect space.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-xl transform transition-transform hover:scale-105"
            >
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1551288049-b1bd52206d22?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32&q=80"
                  alt="Sustainable Materials"
                  className="h-8 w-8 object-cover rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Sustainable Materials</h3>
              <p className="text-gray-300">
                Get smart recommendations for eco-friendly, cost-effective building materials based on your location and budget.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-xl transform transition-transform hover:scale-105"
            >
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32&q=80"
                  alt="Local Designers"
                  className="h-8 w-8 object-cover rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Local Designers</h3>
              <p className="text-gray-300">
                Connect with top-rated architects and designers in your area who can bring your floor plans to life with professional expertise.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform simplifies the construction process from planning to completion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Project",
                description: "Define your project dimensions, budget, and room preferences",
              },
              {
                step: "02",
                title: "Generate Floor Plans",
                description: "Use Gemini and Groq AI to create detailed floor plans with room layouts",
              },
              {
                step: "03",
                title: "Explore Materials",
                description: "Get sustainable material recommendations based on your location and budget",
              },
              {
                step: "04",
                title: "Connect with Designers",
                description: "Find local professionals to bring your vision to life",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-bold text-cyan-500/20 absolute -top-6 left-0">{item.step}</div>
                <h3 className="text-xl font-bold mb-2 text-white mt-6">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 right-0 transform translate-x-1/2">
                    <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M39.5303 6.53033C39.8232 6.23744 39.8232 5.76256 39.5303 5.46967L34.7574 0.696699C34.4645 0.403806 33.9896 0.403806 33.6967 0.696699C33.4038 0.989593 33.4038 1.46447 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 1
1.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM0 6.75H39V5.25H0V6.75Z"
                        fill="#0891B2"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/30 to-teal-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Ready to Create Your Perfect Floor Plan?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of homeowners and professionals who are using BuildWise.ai to design smarter, more sustainable spaces
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                onClick={() => router.push("/sign-up")}
              >
                Sign Up Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
                onClick={() => router.push("/sign-in")}
              >
                User Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-teal-500 text-teal-400 hover:bg-teal-950"
                onClick={() => router.push("/admin/sign-in")}
              >
                Admin Login
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                BuildWise.ai
              </h2>
              <p className="text-slate-400 mt-2">Building the future with AI</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-white font-medium mb-2">Platform</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Company</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Legal</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800 text-center text-slate-500">
            <p>© {new Date().getFullYear()} BuildWise.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}