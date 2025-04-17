"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  const router = useRouter()

  // Use a simpler approach without the navigate prop
  return (
    <ClerkProvider
      appearance={{
        baseTheme: "dark",
        elements: {
          formButtonPrimary:
            "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white",
          footerActionLink: "text-cyan-400 hover:text-cyan-300",
          card: "bg-slate-900 border border-slate-800",
          formFieldInput: "bg-slate-800 border-slate-700",
          formFieldLabel: "text-slate-300",
          identityPreview: "bg-slate-800",
        },
        variables: {
          colorPrimary: "#06b6d4",
          colorText: "#f8fafc",
          colorTextSecondary: "#cbd5e1",
          colorBackground: "#0f172a",
          colorInputText: "#f8fafc",
          colorInputBackground: "#1e293b",
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  )
}
