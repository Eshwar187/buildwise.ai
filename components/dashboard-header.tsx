"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, LogOut, Settings, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { ReactNode } from "react"

const navigation = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Designers", href: "/designers" },
  { label: "AI Tools", href: "/dashboard/ai-tools" },
]

interface DashboardHeaderProps {
  heading?: string
  text?: string
  children?: ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    toast.success("Logging out...")
    await signOut()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const userLabel = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
    : user?.email || "Account"

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl opacity-0 transition-opacity duration-300 hover:opacity-100" />
                <Image
                  src="/logo-elegant.svg"
                  alt="BuildWise.ai Logo"
                  width={200}
                  height={50}
                  priority
                  className="relative h-10 w-auto"
                />
              </div>
            </Link>

            <div className="hidden xl:flex items-center rounded-full border border-white/10 bg-white/5 p-1 shadow-lg shadow-black/10">
              {navigation.map((item) => (
                <Button key={item.label} asChild variant="ghost" className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 pr-4 text-white hover:bg-white/10"
                  >
                    <Avatar className="h-8 w-8 border border-white/10">
                      <AvatarFallback className="bg-slate-800 text-white">
                        {user?.user_metadata?.first_name
                          ? getInitials(user.user_metadata.first_name + " " + (user.user_metadata.last_name || ""))
                          : user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-36 truncate text-sm font-medium text-slate-200 sm:inline">
                      {userLabel}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 rounded-2xl border border-white/10 bg-slate-950/95 p-2 text-white shadow-2xl backdrop-blur-2xl"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="rounded-xl px-3 py-2 font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                      </p>
                      <p className="text-xs leading-none text-slate-400">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 hover:bg-white/10" onClick={() => router.push("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-xl px-3 py-2 hover:bg-white/10"
                    onClick={() => router.push("/dashboard?tab=settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-xl px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
              className="md:hidden rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="surface-panel rounded-[1.75rem] p-3">
                <nav className="grid gap-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-3 grid gap-2 border-t border-white/10 pt-3">
                  <Button asChild variant="ghost" className="w-full justify-start rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-2xl border border-white/10 bg-white/5 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {(heading || text || children) && (
        <div className="border-b border-white/5 bg-slate-950/40">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              {heading && <h1 className="text-3xl font-semibold tracking-tight text-white">{heading}</h1>}
              {text && <p className="max-w-2xl text-sm text-slate-400">{text}</p>}
            </div>
            {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
          </div>
        </div>
      )}
    </>
  )
}
