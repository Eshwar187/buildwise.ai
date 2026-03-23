"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">Profile</h1>
      <Card className="bg-slate-900/40 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-slate-300">
          <p><span className="text-slate-500">Name:</span> {user?.user_metadata?.first_name || "N/A"} {user?.user_metadata?.last_name || ""}</p>
          <p><span className="text-slate-500">Email:</span> {user?.email || "N/A"}</p>
        </CardContent>
      </Card>
    </div>
  )
}

