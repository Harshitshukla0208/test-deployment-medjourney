"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, User } from "lucide-react"

interface Report {
  id: string
  clientName: string
  reportType: string
  date: string
  status: "processed" | "processing" | "uploaded"
  aiSummary?: string
}

const mockReports: Report[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    reportType: "Complete Blood Count",
    date: "Jan 15, 2025",
    status: "processed",
    aiSummary: "All parameters within normal range. Hemoglobin levels stable.",
  },
  {
    id: "2",
    clientName: "Michael Chen",
    reportType: "Lipid Profile",
    date: "Jan 14, 2025",
    status: "processed",
    aiSummary: "LDL cholesterol slightly elevated. Recommend dietary modifications.",
  },
  {
    id: "3",
    clientName: "Emily Rodriguez",
    reportType: "Thyroid Function Test",
    date: "Jan 12, 2025",
    status: "processed",
    aiSummary: "TSH levels within normal range. Continue current treatment.",
  },
  {
    id: "4",
    clientName: "David Kim",
    reportType: "Vitamin D Test",
    date: "Jan 10, 2025",
    status: "processing",
  },
  {
    id: "5",
    clientName: "Jessica Martinez",
    reportType: "HbA1c Test",
    date: "Jan 8, 2025",
    status: "processed",
    aiSummary: "HbA1c at 6.2%. Good glycemic control maintained.",
  },
]

export function RecentReports({ showAll = false }: { showAll?: boolean }) {
  const reports = showAll ? mockReports : mockReports.slice(0, 3)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return (
          <Badge variant="default" className="bg-chart-4 text-white">
            Processed
          </Badge>
        )
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "uploaded":
        return <Badge variant="outline">Uploaded</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
        <CardDescription>Latest client reports with AI analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{report.reportType}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <User className="h-3 w-3" />
                      <span>{report.clientName}</span>
                      <span>•</span>
                      <span>{report.date}</span>
                    </div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                {report.aiSummary && (
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{report.aiSummary}</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
