"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PreVisitInterview() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showReport, setShowReport] = useState(false)

  const questions = [
    {
      id: 1,
      question: "What is the primary reason for your visit?",
      type: "textarea",
    },
    {
      id: 2,
      question: "How long have you been experiencing these symptoms?",
      type: "radio",
      options: ["Less than a week", "1-2 weeks", "2-4 weeks", "More than a month"],
    },
    {
      id: 3,
      question: "Rate your pain level (if applicable)",
      type: "radio",
      options: ["No pain", "Mild (1-3)", "Moderate (4-6)", "Severe (7-10)"],
    },
    {
      id: 4,
      question: "Select any symptoms you're currently experiencing:",
      type: "checkbox",
      options: ["Fever", "Fatigue", "Headache", "Nausea", "Dizziness", "Shortness of breath"],
    },
    {
      id: 5,
      question: "Are you currently taking any medications?",
      type: "textarea",
    },
    {
      id: 6,
      question: "Any additional information you'd like to share with your doctor?",
      type: "textarea",
    },
  ]

  const mockReport = {
    chiefComplaint: "Persistent headaches and fatigue",
    duration: "2-4 weeks",
    painLevel: "Moderate (4-6)",
    symptoms: ["Headache", "Fatigue", "Dizziness"],
    medications: "Ibuprofen 400mg as needed",
    additionalInfo: "Symptoms worsen in the afternoon. Sleep quality has decreased.",
    aiSummary:
      "Patient reports persistent headaches and fatigue for 2-4 weeks with moderate pain levels. Associated symptoms include dizziness. Currently managing with OTC pain medication. Sleep disturbances noted. Recommend comprehensive evaluation including blood work and neurological assessment.",
  }

  if (showReport) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Pre-Visit Report</CardTitle>
                <CardDescription>Your consultation preparation summary</CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-sm">AI Summary for Doctor</h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{mockReport.aiSummary}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Chief Complaint</h4>
                <p className="text-sm text-muted-foreground">{mockReport.chiefComplaint}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">Duration</h4>
                <p className="text-sm text-muted-foreground">{mockReport.duration}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">Pain Level</h4>
                <p className="text-sm text-muted-foreground">{mockReport.painLevel}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">Current Medications</h4>
                <p className="text-sm text-muted-foreground">{mockReport.medications}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Associated Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {mockReport.symptoms.map((symptom) => (
                  <Badge key={symptom} variant="secondary">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Additional Information</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{mockReport.additionalInfo}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" onClick={() => setShowReport(false)}>
                Start New Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pre-Visit Interview</CardTitle>
          <CardDescription>Answer these questions to help your doctor prepare for your consultation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Question {currentStep + 1} of {questions.length}
              </span>
              <div className="flex gap-1">
                {questions.map((_, idx) => (
                  <div key={idx} className={`h-2 w-8 rounded-full ${idx <= currentStep ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">{questions[currentStep].question}</Label>

              {questions[currentStep].type === "textarea" && (
                <Textarea placeholder="Type your answer here..." className="min-h-[120px]" />
              )}

              {questions[currentStep].type === "radio" && (
                <RadioGroup>
                  {questions[currentStep].options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {questions[currentStep].type === "checkbox" && (
                <div className="space-y-3">
                  {questions[currentStep].options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox id={option} />
                      <Label htmlFor={option} className="font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep < questions.length - 1 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>Next</Button>
            ) : (
              <Button onClick={() => setShowReport(true)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Why Pre-Visit Interviews?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Helps your doctor prepare better for your consultation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Saves time during your appointment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>AI generates a comprehensive summary for your doctor</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Ensures you don't forget important details</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
