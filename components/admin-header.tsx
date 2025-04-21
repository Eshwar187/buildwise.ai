"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, LogOut, Settings, User, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function AdminHeader() {
  const { user } = useUser()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      // Sign out the user using Clerk
      await fetch("/api/auth/sign-out", {
        method: "POST",
      })

      toast.success("Logged out successfully")
      // Use window.location for a hard redirect
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/admin/dashboard" className="flex items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
            ConstructHub.ai <span className="text-white text-sm ml-1">Admin</span>
          </h1>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="text-slate-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-slate-300 hover:text-white transition-colors">
              Users
            </Link>
            <Link href="/admin/projects" className="text-slate-300 hover:text-white transition-colors">
              Projects
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} alt={user?.username || ""} />
                  <AvatarFallback className="bg-slate-700 text-white">
                    {user?.firstName
                      ? getInitials(user.firstName + " " + (user.lastName || ""))
                      : user?.username?.[0].toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-white" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-slate-400">{user?.emailAddresses[0].emailAddress}</p>
                  <p className="text-xs leading-none text-emerald-400 flex items-center mt-1">
                    <Shield className="h-3 w-3 mr-1" /> Admin
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                className="hover:bg-slate-700 cursor-pointer"
                onClick={() => router.push("/admin/dashboard")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-slate-700 cursor-pointer"
                onClick={() => router.push("/admin/dashboard?tab=settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                className="hover:bg-slate-700 cursor-pointer text-red-400 hover:text-red-300"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu />
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 py-2">
          <nav className="container mx-auto px-4 flex flex-col space-y-2">
            <Link
              href="/admin/dashboard"
              className="text-slate-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="text-slate-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Users
            </Link>
            <Link
              href="/admin/projects"
              className="text-slate-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <div className="border-t border-slate-700 pt-2 mt-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-700 px-0"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

