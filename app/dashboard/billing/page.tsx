"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">Billing</h1>
      <Card className="bg-slate-900/40 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Plan & Subscription</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300">
          Billing page is active. Integrate Stripe or your payment provider to manage plans.
        </CardContent>
      </Card>
    </div>
  )
}

