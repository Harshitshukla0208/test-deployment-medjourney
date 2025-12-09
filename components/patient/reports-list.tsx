"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Report {
  id: string
  name: string
  date: string
  type: string
  status: "analyzed" | "processing" | "uploaded"
  trend?: "up" | "down" | "stable"
  summary?: string
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Complete Blood Count",
    date: "Jan 15, 2025",
    type: "Lab Test",
    status: "analyzed",
    trend: "stable",
    summary: "All parameters within normal range. Hemoglobin slightly improved from last test.",
  },
  {
    id: "2",
    name: "Lipid Profile",
    date: "Jan 10, 2025",
    type: "Lab Test",
    status: "analyzed",
    trend: "down",
    summary: "LDL cholesterol decreased by 12%. HDL levels stable. Continue current medication.",
  },
  {
    id: "3",
    name: "Thyroid Function Test",
    date: "Dec 28, 2024",
    type: "Lab Test",
    status: "analyzed",
    trend: "up",
    summary: "TSH levels slightly elevated. May need dosage adjustment. Consult with endocrinologist.",
  },
  {
    id: "4",
    name: "Vitamin D Test",
    date: "Dec 20, 2024",
    type: "Lab Test",
    status: "analyzed",
    trend: "up",
    summary: "Vitamin D levels improved to 35 ng/mL. Continue supplementation for 3 more months.",
  },
]

export function ReportsList({ limit }: { limit?: number }) {
  const reports = limit ? mockReports.slice(0, limit) : mockReports

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-chart-4" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      case "stable":
        return <Minus className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "analyzed":
        return (
          <Badge variant="default" className="bg-chart-4 text-white">
            Analyzed
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
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="hover:border-primary/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.date} • {report.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(report.trend)}
                    {getStatusBadge(report.status)}
                  </div>
                </div>
                {report.summary && (
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{report.summary}</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
