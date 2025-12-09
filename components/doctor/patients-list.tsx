"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { User, FileText, TrendingUp, Calendar, Search } from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  condition: string
  lastVisit: string
  nextAppointment?: string
  reportsCount: number
  status: "stable" | "monitoring" | "critical"
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 45,
    condition: "Type 2 Diabetes",
    lastVisit: "Jan 15, 2025",
    nextAppointment: "Jan 28, 2025",
    reportsCount: 24,
    status: "stable",
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 52,
    condition: "Hypothyroidism",
    lastVisit: "Jan 12, 2025",
    nextAppointment: "Feb 5, 2025",
    reportsCount: 18,
    status: "stable",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    age: 38,
    condition: "Hyperthyroidism",
    lastVisit: "Jan 10, 2025",
    nextAppointment: "Jan 24, 2025",
    reportsCount: 32,
    status: "monitoring",
  },
  {
    id: "4",
    name: "David Kim",
    age: 61,
    condition: "Type 1 Diabetes",
    lastVisit: "Jan 8, 2025",
    nextAppointment: "Jan 22, 2025",
    reportsCount: 45,
    status: "monitoring",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    age: 29,
    condition: "PCOS",
    lastVisit: "Jan 5, 2025",
    reportsCount: 12,
    status: "stable",
  },
]

export function PatientsList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stable":
        return (
          <Badge variant="default" className="bg-chart-4 text-white">
            Stable
          </Badge>
        )
      case "monitoring":
        return <Badge variant="secondary">Monitoring</Badge>
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name or condition..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.condition}
                      </p>
                    </div>
                    {getStatusBadge(patient.status)}
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Last visit: {patient.lastVisit}</span>
                    </div>
                    {patient.nextAppointment && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Next: {patient.nextAppointment}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{patient.reportsCount} reports</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      View Profile
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      View Timeline
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No patients found matching your search</p>
        </div>
      )}
    </div>
  )
}
