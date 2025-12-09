"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react"

interface Appointment {
  id: string
  patientName: string
  condition: string
  time: string
  type: string
  interviewStatus: "completed" | "pending" | "not-sent"
  notes?: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    condition: "Type 2 Diabetes",
    time: "10:00 AM",
    type: "Follow-up",
    interviewStatus: "pending",
    notes: "Review recent HbA1c results",
  },
  {
    id: "2",
    patientName: "David Kim",
    condition: "Type 1 Diabetes",
    time: "11:30 AM",
    type: "Consultation",
    interviewStatus: "completed",
    notes: "Discuss insulin pump options",
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    condition: "Hyperthyroidism",
    time: "2:00 PM",
    type: "Follow-up",
    interviewStatus: "completed",
    notes: "Check thyroid medication effectiveness",
  },
  {
    id: "4",
    patientName: "Michael Chen",
    condition: "Hypothyroidism",
    time: "3:30 PM",
    type: "Routine Check",
    interviewStatus: "not-sent",
  },
]

export function UpcomingAppointments({ showAll = false }: { showAll?: boolean }) {
  const appointments = showAll ? mockAppointments : mockAppointments.slice(0, 3)

  const getInterviewBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-1 text-xs text-chart-4">
            <CheckCircle2 className="h-3 w-3" />
            <span>Interview Complete</span>
          </div>
        )
      case "pending":
        return (
          <div className="flex items-center gap-1 text-xs text-accent">
            <AlertCircle className="h-3 w-3" />
            <span>Interview Pending</span>
          </div>
        )
      case "not-sent":
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>No Interview</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Appointments</CardTitle>
        <CardDescription>Your scheduled consultations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{appointment.patientName}</h4>
                  <p className="text-sm text-muted-foreground">{appointment.condition}</p>
                </div>
              </div>
              <Badge variant="outline">{appointment.type}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {appointment.time}
              </div>
              {getInterviewBadge(appointment.interviewStatus)}
            </div>

            {appointment.notes && (
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-2">{appointment.notes}</p>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View Patient
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                View Timeline
              </Button>
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No appointments scheduled for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
