"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useUser, SignOutButton } from "@clerk/nextjs"
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
import { Menu, LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function DashboardHeader() {
  const { user } = useUser()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    // This is now handled by the Clerk SignOutButton
    toast.success("Logging out...")
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
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo-unique.svg" alt="BuildWise.ai Logo" width={170} height={42} priority className="hover:opacity-90 transition-opacity" />
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/projects" className="text-slate-300 hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/designers" className="text-slate-300 hover:text-white transition-colors">
              Find Designers
            </Link>
            <Link href="/dashboard/ai-tools" className="text-slate-300 hover:text-white transition-colors">
              AI Tools
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
                      : user?.username?.[0].toUpperCase() || "U"}
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
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer" onClick={() => router.push("/dashboard")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-slate-700 cursor-pointer"
                onClick={() => router.push("/dashboard?tab=settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <SignOutButton signOutCallback={() => router.push("/")}>
                <DropdownMenuItem
                  className="hover:bg-slate-700 cursor-pointer text-red-400 hover:text-red-300"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </SignOutButton>
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
              href="/dashboard"
              className="text-slate-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/projects"
              className="text-slate-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/designers"
              className="text-slate-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Designers
            </Link>
            <Link
              href="/dashboard/ai-tools"
              className="text-slate-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Tools
            </Link>
            <div className="border-t border-slate-700 pt-2 mt-2">
              <SignOutButton signOutCallback={() => router.push("/")}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-700 px-0"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </SignOutButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

