import React from "react"
import Link from "next/link"
import { Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LabPortalView } from "@/components/dashboard/views/lab-view"

export default function LabDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" />
            <span className="text-xl font-semibold text-foreground">MedJourney.ai</span>
            <span className="text-sm text-muted-foreground ml-2">Lab Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <React.Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading dashboard...</div>}>
          <LabPortalView />
        </React.Suspense>
      </main>
    </div>
  )
}
