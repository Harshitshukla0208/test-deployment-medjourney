"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Users, Calendar, FileText, Plus } from "lucide-react"
import { SendInterview } from "@/components/doctor/send-interview"
import { UpcomingAppointments } from "@/components/doctor/upcoming-appointments"
import { PatientsList } from "@/components/doctor/patients-list"
import { DoctorAnalytics } from "@/components/doctor/doctor-analytics"
import { PortalSwitcher, PortalView } from "@/components/dashboard/portal-switcher"

export function DoctorPortalView({ currentView }: { currentView: PortalView }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, Dr. Emily Chen</h1>
          <p className="text-muted-foreground">Endocrinology • City Medical Center</p>
        </div>
        <div className="flex-shrink-0">
          <PortalSwitcher currentView={currentView} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
          <CardDescription>Total Personal Profiles</CardDescription>
            <CardTitle className="text-3xl">156</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Today's Appointments</CardDescription>
            <CardTitle className="text-3xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Next at 10:00 AM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Interviews</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Awaiting responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed This Week</CardDescription>
            <CardTitle className="text-3xl">28</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-chart-4">+4 from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="patients" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Personal Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SendInterview />
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                  <Plus className="h-4 w-4" />
                  Schedule Appointment
                </Button>
                <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                  <FileText className="h-4 w-4" />
                  View Reports
                </Button>
                <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                  <Users className="h-4 w-4" />
                  Add New Profile
                </Button>
              </CardContent>
            </Card>
          </div>
          <UpcomingAppointments />
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Profile Management</h2>
              <p className="text-muted-foreground">View and manage your personal records</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Profile
            </Button>
          </div>
          <PatientsList />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Appointments</h2>
              <p className="text-muted-foreground">Manage your appointment schedule</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>
          <UpcomingAppointments showAll />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Practice Analytics</h2>
            <p className="text-muted-foreground">Insights from your practice</p>
          </div>
          <DoctorAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

