"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Send, Plus, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const pendingForms = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    patientId: "P-1001",
    appointmentDate: "2025-01-22",
    submittedDate: "2025-01-20",
    chiefComplaint: "Persistent headaches and fatigue",
    status: "completed",
  },
  {
    id: 2,
    patientName: "Lisa Anderson",
    patientId: "P-1003",
    appointmentDate: "2025-01-24",
    submittedDate: "2025-01-21",
    chiefComplaint: "Blood sugar management concerns",
    status: "completed",
  },
]

export function DoctorConsultations() {
  const [showForm, setShowForm] = useState(false)

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send Pre-Visit Consultation Form</CardTitle>
          <CardDescription>Create a customized questionnaire for your personal profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="patientSelect">Select Profile</Label>
              <Input id="patientSelect" placeholder="Search name or ID..." />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="appointmentDate">Appointment Date</Label>
              <Input id="appointmentDate" type="date" />
            </div>

            <div className="grid gap-2">
              <Label>Custom Questions (Optional)</Label>
              <Textarea
                placeholder="Add any specific questions you'd like answered before the visit..."
                className="min-h-[120px]"
              />
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Standard Questions Included:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Primary reason for visit</li>
              <li>• Symptom duration and severity</li>
              <li>• Current medications</li>
              <li>• Recent health changes</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Form
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Pre-Visit Consultation Forms</CardTitle>
              <CardDescription>Send and review pre-visit questionnaires</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>Completed forms awaiting your review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingForms.map((form) => (
              <div key={form.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{form.patientName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{form.patientId}</Badge>
                      <span className="text-xs text-muted-foreground">Appointment: {form.appointmentDate}</span>
                    </div>
                  </div>
                  <Badge className="bg-chart-3/10 text-chart-3">Completed</Badge>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Chief Complaint:</p>
                  <p className="text-sm text-muted-foreground">{form.chiefComplaint}</p>
                </div>

                <p className="text-xs text-muted-foreground mb-3">Submitted: {form.submittedDate}</p>

                <Button size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Review Full Response
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Benefits of Pre-Visit Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-chart-3 mt-0.5">•</span>
              <span>Better prepared consultations with full context</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-chart-3 mt-0.5">•</span>
              <span>More efficient use of appointment time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-chart-3 mt-0.5">•</span>
              <span>AI-generated summaries for quick review</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-chart-3 mt-0.5">•</span>
              <span>Improved outcomes through better preparation</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
