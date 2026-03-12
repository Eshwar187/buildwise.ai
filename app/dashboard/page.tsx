"use client"

import { useAuth } from "@/components/auth-provider"
import { 
  Building2, 
  Users, 
  Clock, 
  ArrowUpRight,
  Plus,
  Sparkles,
  Search,
  MoreVertical
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    label: "Active Projects",
    value: "12",
    icon: Building2,
    color: "indigo",
    increase: "+2 this month"
  },
  {
    label: "Designers Contacted",
    value: "48",
    icon: Users,
    color: "violet",
    increase: "+5 this week"
  },
  {
    label: "AI Designs Generated",
    value: "124",
    icon: Sparkles,
    color: "fuchsia",
    increase: "+12 today"
  },
  {
    label: "Pending Reviews",
    value: "4",
    icon: Clock,
    color: "rose",
    increase: "2 due today"
  }
]

const recentProjects = [
  {
    id: 1,
    name: "Modern Villa Design",
    type: "Residential",
    status: "In Progress",
    designer: "Alex Morgan",
    lastModified: "2 hours ago",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 2,
    name: "Urban Office Complex",
    type: "Commercial",
    status: "Review",
    designer: "Sarah Chen",
    lastModified: "5 hours ago",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 3,
    name: "Coastal Retreat",
    type: "Residential",
    status: "Completed",
    designer: "Marc Jacobs",
    lastModified: "Yesterday",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200&h=200"
  }
]

export default function DashboardPage() {
  const { user } = useAuth()
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, {user?.user_metadata?.first_name || "Builder"}!
          </h1>
          <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white backdrop-blur-sm">
            Export Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="bg-slate-900/40 border-slate-800 hover:border-slate-700/50 transition-all duration-300 overflow-hidden group backdrop-blur-sm relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {stat.increase}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">{stat.label}</p>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-${stat.color}-500 transition-all duration-500 group-hover:w-full`} />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
            <Button variant="link" className="text-indigo-400 hover:text-indigo-300 text-sm">
              View all projects
            </Button>
          </div>
          
          <div className="grid gap-4">
            {recentProjects.map((project) => (
              <Card key={project.id} className="bg-slate-900/40 border-slate-800 hover:bg-slate-800/40 transition-all group overflow-hidden backdrop-blur-sm">
                <div className="flex items-center p-4 gap-4 text-slate-300 whitespace-nowrap">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                    <img 
                      src={project.image} 
                      alt={project.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{project.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{project.type} • {project.designer}</p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end px-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      project.status === 'Review' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-[10px] text-slate-600 mt-1">{project.lastModified}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recommended</h2>
          </div>
          <div className="space-y-4">
            {[
              { title: "Design Systems 101", category: "Guide", time: "5 min read" },
              { title: "Material Selection", category: "Technical", time: "12 min read" },
              { title: "Sustainable Building", category: "Ethics", time: "8 min read" },
            ].map((resource, i) => (
              <Card key={i} className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group backdrop-blur-sm">
                <CardContent className="p-4">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{resource.category}</p>
                  <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{resource.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {resource.time}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            <Card className="bg-gradient-to-br from-indigo-600/20 to-violet-700/20 border-indigo-500/20 shadow-xl backdrop-blur-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-white font-bold text-lg mb-2">BuildWise Pro</h3>
                <p className="text-slate-300 text-sm mb-4">Unlock advanced AI tools and collaborative features.</p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-semibold">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}