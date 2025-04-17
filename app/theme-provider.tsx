"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use state to track if we're mounted to avoid hydration mismatch
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Only render children without theme context during SSR
  if (!mounted) {
    return <>{children}</>
  }

  // Once mounted on client, use the full theme provider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

