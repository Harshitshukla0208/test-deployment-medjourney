"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, TrendingUp, Calendar, Activity, Plus } from "lucide-react"
import { ReportsList } from "@/components/patient/reports-list"
import { ReportUpload } from "@/components/patient/report-upload"
import { UpcomingVisits } from "@/components/patient/upcoming-visits"
import { HealthTimeline } from "@/components/patient/health-timeline"
import { PortalSwitcher, PortalView } from "@/components/dashboard/portal-switcher"

export function PatientPortalView({ currentView }: { currentView: PortalView }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Sarah</h1>
          <p className="text-muted-foreground">Track your health journey and manage your medical reports</p>
        </div>
        <div className="flex-shrink-0">
          <PortalSwitcher currentView={currentView} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Reports</CardDescription>
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Parameters Tracked</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Glucose, BP, Cholesterol...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Upcoming Visits</CardDescription>
            <CardTitle className="text-3xl">2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Next: Jan 28, 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Health Score</CardDescription>
            <CardTitle className="text-3xl text-chart-4">85</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Good overall health</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="visits" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Visits</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <ReportUpload />
            <UpcomingVisits />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your latest health reports and AI summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportsList limit={3} />
              <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setActiveTab("reports")}>
                View All Reports
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">All Reports</h2>
              <p className="text-muted-foreground">View and manage your medical reports</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Report
            </Button>
          </div>
          <ReportsList />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Health Timeline</h2>
            <p className="text-muted-foreground">Track your health parameters over time</p>
          </div>
          <HealthTimeline />
        </TabsContent>

        <TabsContent value="visits" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Doctor Visits</h2>
              <p className="text-muted-foreground">Manage appointments and pre-visit interviews</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Visit
            </Button>
          </div>
          <UpcomingVisits showAll />
        </TabsContent>
      </Tabs>
    </div>
  )
}

