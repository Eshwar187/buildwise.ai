import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./theme-provider"
import { ToasterProvider } from "@/components/ui/toaster-provider"
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BuildWise.ai",
  description: "Next-gen AI-powered floor plan generator and construction platform",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClerkProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="buildwise-theme">
            {children}
            <ToasterProvider />
          </ThemeProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  )
}

