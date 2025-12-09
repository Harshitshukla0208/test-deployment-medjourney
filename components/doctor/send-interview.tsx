"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle2 } from "lucide-react"

export function SendInterview() {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [customQuestions, setCustomQuestions] = useState("")
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setSelectedPatient("")
      setSelectedTemplate("")
      setCustomQuestions("")
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Pre-Visit Interview</CardTitle>
        <CardDescription>Send questionnaires to patients before their appointments</CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <CheckCircle2 className="h-12 w-12 text-chart-4" />
            <p className="text-sm font-medium text-chart-4">Interview Sent Successfully!</p>
            <p className="text-xs text-muted-foreground text-center">
              The patient will receive a notification to complete the questionnaire
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Select Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Choose a patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Chen</SelectItem>
                  <SelectItem value="emily">Emily Rodriguez</SelectItem>
                  <SelectItem value="david">David Kim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Interview Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diabetes">Diabetes Follow-up</SelectItem>
                  <SelectItem value="thyroid">Thyroid Assessment</SelectItem>
                  <SelectItem value="general">General Consultation</SelectItem>
                  <SelectItem value="custom">Custom Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom">Additional Questions (Optional)</Label>
              <Textarea
                id="custom"
                placeholder="Add any custom questions for this patient..."
                value={customQuestions}
                onChange={(e) => setCustomQuestions(e.target.value)}
                rows={4}
              />
            </div>

            <Button className="w-full gap-2" onClick={handleSend} disabled={!selectedPatient || !selectedTemplate}>
              <Send className="h-4 w-4" />
              Send Interview
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
