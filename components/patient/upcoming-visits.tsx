"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, FileText, CheckCircle2 } from "lucide-react"

interface Visit {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  type: string
  status: "upcoming" | "interview-pending" | "completed"
  interviewCompleted?: boolean
}

const mockVisits: Visit[] = [
  {
    id: "1",
    doctor: "Dr. Emily Chen",
    specialty: "Endocrinologist",
    date: "Jan 28, 2025",
    time: "10:00 AM",
    type: "Follow-up",
    status: "interview-pending",
    interviewCompleted: false,
  },
  {
    id: "2",
    doctor: "Dr. Michael Roberts",
    specialty: "Cardiologist",
    date: "Feb 5, 2025",
    time: "2:30 PM",
    type: "Consultation",
    status: "upcoming",
    interviewCompleted: true,
  },
]

export function UpcomingVisits({ showAll = false }: { showAll?: boolean }) {
  const visits = showAll ? mockVisits : mockVisits.slice(0, 2)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Visits</CardTitle>
        <CardDescription>Your scheduled doctor appointments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {visits.map((visit) => (
          <div key={visit.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{visit.doctor}</h4>
                  <p className="text-sm text-muted-foreground">{visit.specialty}</p>
                </div>
              </div>
              <Badge variant={visit.status === "interview-pending" ? "secondary" : "outline"}>{visit.type}</Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {visit.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {visit.time}
              </div>
            </div>

            {visit.status === "interview-pending" && !visit.interviewCompleted && (
              <div className="bg-accent/10 border border-accent/20 rounded-md p-3">
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="h-4 w-4 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Pre-visit interview pending</p>
                    <p className="text-xs text-muted-foreground">Complete the questionnaire before your visit</p>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-2">
                  Complete Interview
                </Button>
              </div>
            )}

            {visit.interviewCompleted && (
              <div className="flex items-center gap-2 text-sm text-chart-4">
                <CheckCircle2 className="h-4 w-4" />
                <span>Pre-visit interview completed</span>
              </div>
            )}

            {visit.status === "upcoming" && !visit.interviewCompleted && (
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Details
              </Button>
            )}
          </div>
        ))}

        {!showAll && visits.length > 0 && (
          <Button variant="ghost" className="w-full">
            View All Appointments
          </Button>
        )}

        {visits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No upcoming visits scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
