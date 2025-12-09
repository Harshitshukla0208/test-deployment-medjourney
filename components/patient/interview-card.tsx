"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"

interface InterviewCardProps {
  id: string
  doctorName: string
  specialty: string
  appointmentDate: string
  appointmentTime: string
  status: "pending" | "completed"
  dueDate?: string
}

export function InterviewCard({
  id,
  doctorName,
  specialty,
  appointmentDate,
  appointmentTime,
  status,
  dueDate,
}: InterviewCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-foreground">Pre-Visit Interview</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <User className="h-3 w-3" />
                  <span>
                    {doctorName} • {specialty}
                  </span>
                </div>
              </div>
              <Badge variant={status === "completed" ? "default" : "secondary"}>
                {status === "completed" ? "Completed" : "Pending"}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Appointment: {appointmentDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{appointmentTime}</span>
              </div>
              {dueDate && status === "pending" && (
                <div className="flex items-center gap-2 text-accent">
                  <FileText className="h-4 w-4" />
                  <span>Please complete by {dueDate}</span>
                </div>
              )}
            </div>

            {status === "pending" ? (
              <Button asChild className="w-full">
                <Link href={`/interview/${id}`}>Complete Interview</Link>
              </Button>
            ) : (
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href={`/interview/${id}`}>View Responses</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
