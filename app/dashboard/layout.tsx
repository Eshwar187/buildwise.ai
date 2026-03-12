"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { ReactNode } from "react"
import { motion } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#0a0a0c] overflow-hidden">
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50 border-r border-white/5 bg-[#0a0a0c]"
      >
        <Sidebar />
      </motion.aside>
      <div className="md:pl-64 flex flex-col min-h-screen w-full">
        <TopBar />
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 p-8 bg-[#0a0a0c] overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
