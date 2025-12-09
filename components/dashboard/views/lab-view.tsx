"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Users, FileText, TrendingUp, Plus } from "lucide-react"
import { BulkUpload } from "@/components/lab/bulk-upload"
import { RecentReports } from "@/components/lab/recent-reports"
import { ClientsList } from "@/components/lab/clients-list"
import { LabAnalytics } from "@/components/lab/lab-analytics"
import { PortalSwitcher, PortalView } from "@/components/dashboard/portal-switcher"

export function LabPortalView({ currentView }: { currentView: PortalView }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">HealthLab Diagnostics</h1>
          <p className="text-muted-foreground">Manage client reports and analytics</p>
        </div>
        <div className="flex-shrink-0">
          <PortalSwitcher currentView={currentView} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Clients</CardDescription>
            <CardTitle className="text-3xl">342</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+28 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Reports Generated</CardDescription>
            <CardTitle className="text-3xl">1,248</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+156 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>AI Summaries</CardDescription>
            <CardTitle className="text-3xl">1,248</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">100% coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg. Processing Time</CardDescription>
            <CardTitle className="text-3xl">2.3s</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-chart-4">-0.5s improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Clients</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <BulkUpload />
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add New Client
                </Button>
                <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
                <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                  <TrendingUp className="h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
          <RecentReports />
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Client Management</h2>
              <p className="text-muted-foreground">View and manage your client database</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>
          <ClientsList />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">All Reports</h2>
              <p className="text-muted-foreground">Browse and manage client reports</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Reports
            </Button>
          </div>
          <RecentReports showAll />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Lab Analytics</h2>
            <p className="text-muted-foreground">Insights and trends from your lab data</p>
          </div>
          <LabAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

