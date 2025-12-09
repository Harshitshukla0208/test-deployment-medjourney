"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Apple,
  Dumbbell,
  Pill,
  Moon,
  Loader2,
} from "lucide-react"

export interface ReportTip {
  icon: "diet" | "exercise" | "supplement" | "lifestyle"
  title: string
  description: string
}

export interface ReportSummaryPoint {
  type: "good" | "attention" | "info"
  title: string
  description: string
}

export interface HealthReport {
  id: string
  name: string
  date: string
  lab: string
  profileId: string
  summary: ReportSummaryPoint[]
  parameters: {
    name: string
    value: string
    unit: string
    status: "normal" | "attention" | "critical"
    normalRange: string
  }[]
  tips?: ReportTip[]
  isProcessing?: boolean
}

interface ReportsListProps {
  reports: HealthReport[]
  onViewReport?: (report: HealthReport) => void
}

export function ReportsList({ reports, onViewReport }: ReportsListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "good":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "attention":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "good":
        return "bg-green-50 border-green-200"
      case "attention":
        return "bg-amber-50 border-amber-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return ""
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Normal</Badge>
      case "attention":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Attention</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Critical</Badge>
      default:
        return null
    }
  }

  const getTipIcon = (iconType: string) => {
    switch (iconType) {
      case "diet":
        return Apple
      case "exercise":
        return Dumbbell
      case "supplement":
        return Pill
      case "lifestyle":
        return Moon
      default:
        return Lightbulb
    }
  }

  const getTipColors = (iconType: string) => {
    switch (iconType) {
      case "diet":
        return { bg: "bg-green-100", text: "text-green-600" }
      case "exercise":
        return { bg: "bg-blue-100", text: "text-blue-600" }
      case "supplement":
        return { bg: "bg-purple-100", text: "text-purple-600" }
      case "lifestyle":
        return { bg: "bg-indigo-100", text: "text-indigo-600" }
      default:
        return { bg: "bg-amber-100", text: "text-amber-600" }
    }
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No reports uploaded yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Your Reports</CardTitle>
            <CardDescription>
              {reports.length} report{reports.length !== 1 ? "s" : ""} uploaded
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-3">
          {reports.map((report) => (
            <AccordionItem
              key={report.id}
              value={report.id}
              className="border rounded-lg px-4 data-[state=open]:bg-muted/30"
            >
              {report.isProcessing ? (
                <div className="py-4">
                  <div className="flex items-center gap-4 text-left flex-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">Processing your report</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          <span className="text-xs">Analyzing...</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{report.name}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {report.lab}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">AI Summary</span>
                  </div>
                  <div className="space-y-2">
                    {report.summary.map((point, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${getBgColor(point.type)}`}>
                        <div className="flex items-start gap-2">
                          {getIcon(point.type)}
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{point.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{point.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-medium text-sm mb-3">Key Parameters</p>
                  <div className="space-y-2">
                    {report.parameters.slice(0, 5).map((param, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-sm">{param.name}</p>
                          <p className="text-xs text-muted-foreground">Normal: {param.normalRange}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm">
                            {param.value} {param.unit}
                          </span>
                          {getStatusBadge(param.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {report.tips && report.tips.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-sm">Tips Based on This Report</span>
                    </div>
                    <div className="space-y-2">
                      {report.tips.map((tip, idx) => {
                        const IconComponent = getTipIcon(tip.icon)
                        const colors = getTipColors(tip.icon)
                        return (
                          <div key={idx} className="p-3 rounded-lg border border-border bg-background">
                            <div className="flex items-start gap-3">
                              <div
                                className={`h-8 w-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}
                              >
                                <IconComponent className={`h-4 w-4 ${colors.text}`} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm text-foreground">{tip.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={() => onViewReport?.(report)}
                >
                  View Full Report
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </AccordionContent>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}


