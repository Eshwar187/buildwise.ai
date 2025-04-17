import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Skeleton */}
      <div className="bg-slate-800 border-b border-slate-700 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Skeleton className="h-10 w-40 bg-slate-700" />
          <div className="hidden md:flex items-center space-x-4">
            <Skeleton className="h-8 w-24 bg-slate-700" />
            <Skeleton className="h-8 w-24 bg-slate-700" />
            <Skeleton className="h-8 w-24 bg-slate-700" />
            <Skeleton className="h-8 w-8 rounded-full bg-slate-700" />
          </div>
          <Skeleton className="h-8 w-8 md:hidden bg-slate-700" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <Skeleton className="h-8 w-64 bg-slate-800 mb-2" />
            <Skeleton className="h-4 w-48 bg-slate-800" />
          </div>
          <Skeleton className="h-10 w-40 bg-slate-800 mt-4 md:mt-0" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-md bg-slate-800 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-slate-700 bg-slate-800/50">
              <div className="h-32 bg-slate-700/50" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-2/3 bg-slate-700 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-3/4 bg-slate-700" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-full bg-slate-700" />
                </div>
                <Skeleton className="h-10 w-full bg-slate-700 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
