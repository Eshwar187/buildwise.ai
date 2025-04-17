"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeHeader } from "@/components/home-header"
import {
  Building2,
  Users,
  Lightbulb,
  Leaf,
  Shield,
  Award,
  Github,
  Linkedin,
  Twitter
} from "lucide-react"

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Former architect with 15+ years of experience, passionate about combining technology and construction.",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
      bio: "AI specialist with a background in computational design and sustainable architecture.",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Award-winning architect focused on creating beautiful, functional, and sustainable spaces.",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Priya Patel",
      role: "Head of Engineering",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Full-stack developer with expertise in AI and machine learning applications for construction.",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <HomeHeader />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/blueprint-bg.jpg"
            alt="Blueprint background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              About BuildWise.ai
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We're revolutionizing the construction industry by combining cutting-edge AI technology with architectural expertise to create smarter, more sustainable buildings.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              >
                <Building2 className="mr-2 h-5 w-5" /> Our Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
              >
                <Users className="mr-2 h-5 w-5" /> Meet the Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300">
              To democratize access to high-quality architectural design and make sustainable building practices the standard, not the exception.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Lightbulb className="h-10 w-10 text-cyan-400" />,
                title: "Innovation",
                description: "We leverage the latest AI technologies to create floor plans that are not just beautiful, but functional and optimized for your specific needs."
              },
              {
                icon: <Leaf className="h-10 w-10 text-green-400" />,
                title: "Sustainability",
                description: "Every design we create prioritizes energy efficiency and sustainable materials, reducing environmental impact without compromising on quality."
              },
              {
                icon: <Shield className="h-10 w-10 text-blue-400" />,
                title: "Accessibility",
                description: "We believe great design should be accessible to everyone, regardless of budget or technical knowledge."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-slate-700/50 p-8 rounded-xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  BuildWise.ai was founded in 2023 by a team of architects, engineers, and AI specialists who saw the potential to transform the construction industry through technology.
                </p>
                <p>
                  What started as a simple tool to generate basic floor plans has evolved into a comprehensive platform that helps homeowners, architects, and builders create sustainable, cost-effective, and beautiful spaces.
                </p>
                <p>
                  Today, we're proud to have helped thousands of customers across the globe bring their dream homes and buildings to life, while promoting sustainable building practices and supporting local design communities.
                </p>
              </div>
              <div className="mt-8">
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                >
                  Learn More About Our Journey
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative h-[400px] rounded-xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
                alt="Modern sustainable home"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                <div>
                  <Badge className="mb-2 bg-cyan-500 text-white">Featured Project</Badge>
                  <h3 className="text-xl font-bold text-white">Eco-Friendly Modern Home</h3>
                  <p className="text-gray-200">California, USA</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300">
              A diverse group of experts passionate about architecture, technology, and sustainability.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-slate-700/50 rounded-xl overflow-hidden"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-cyan-400 mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    <Link href={member.social.linkedin} className="text-gray-400 hover:text-white transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    <Link href={member.social.twitter} className="text-gray-400 hover:text-white transition-colors">
                      <Twitter className="h-5 w-5" />
                    </Link>
                    <Link href={member.social.github} className="text-gray-400 hover:text-white transition-colors">
                      <Github className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: "10,000+", label: "Floor Plans Generated" },
              { number: "5,000+", label: "Happy Customers" },
              { number: "500+", label: "Local Designers" },
              { number: "30+", label: "Countries Served" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-slate-700/50 p-8 rounded-xl"
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/30 to-teal-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied customers who have transformed their ideas into reality with BuildWise.ai
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
              >
                Schedule a Demo
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

// Badge component for the story section
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {children}
    </div>
  )
}
