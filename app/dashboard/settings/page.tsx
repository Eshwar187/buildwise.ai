"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">Settings</h1>
      <Card className="bg-slate-900/40 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300">
          Settings UI is now available. We can add notification/profile/project defaults next.
        </CardContent>
      </Card>
    </div>
  )
}

