"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, FileText, TrendingUp, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const patients = [
  {
    id: "P-1001",
    name: "Sarah Johnson",
    age: 34,
    nextAppt: "2025-01-22",
    condition: "Routine Checkup",
    lastVisit: "2024-10-15",
    hasPreVisit: true,
    reportsCount: 5,
  },
  {
    id: "P-1002",
    name: "Michael Brown",
    age: 58,
    nextAppt: "2025-01-23",
    condition: "Hypertension Follow-up",
    lastVisit: "2024-12-10",
    hasPreVisit: false,
    reportsCount: 12,
  },
  {
    id: "P-1003",
    name: "Lisa Anderson",
    age: 42,
    nextAppt: "2025-01-24",
    condition: "Diabetes Management",
    lastVisit: "2025-01-05",
    hasPreVisit: true,
    reportsCount: 18,
  },
]

export function DoctorPatients() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
          <CardDescription>Find patient records and health timelines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or patient ID..." className="pl-9" />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Patients scheduled for consultation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patients.map((patient) => (
              <div key={patient.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{patient.id}</Badge>
                      <span className="text-xs text-muted-foreground">Age: {patient.age}</span>
                    </div>
                  </div>
                  {patient.hasPreVisit && <Badge className="bg-chart-3/10 text-chart-3">Pre-visit completed</Badge>}
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Next: {patient.nextAppt}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{patient.reportsCount} reports</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{patient.condition}</p>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                  <Button size="sm" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Health Timeline
                  </Button>
                  {!patient.hasPreVisit && (
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Pre-Visit Form
                    </Button>
                  )}
                  {patient.hasPreVisit && (
                    <Button size="sm" variant="default">
                      View Pre-Visit Responses
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
