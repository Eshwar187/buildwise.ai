"use client"

import { useAuth } from "@/components/auth-provider"
import { Search, Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function TopBar() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
  return (
    <header className="h-20 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">

      <div className="relative w-96 max-w-full hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search projects, designers..." 
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900" />
        </Button>

        <div className="h-8 w-[1px] bg-slate-800 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-800 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white leading-none mb-1">
                  {user?.user_metadata?.first_name || user?.email?.split('@')[0] || "Guest User"}
                </p>
                <p className="text-[10px] text-slate-500 leading-none">Pro Plan</p>
              </div>
              <Avatar className="h-9 w-9 border border-indigo-500/20">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-xs">
                  {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-300" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => router.push("/dashboard/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => router.push("/dashboard/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => router.push("/dashboard/billing")}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem 
              className="focus:bg-red-900/20 focus:text-red-400 text-red-500 cursor-pointer" 
              onClick={handleSignOut}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
