"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Download, Eye, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mockReports = [
  {
    id: 1,
    name: "Complete Blood Count",
    date: "2025-01-15",
    type: "Blood Test",
    status: "analyzed",
    summary: "All parameters within normal range. Hemoglobin slightly elevated but not concerning.",
    keyFindings: [
      "Hemoglobin: 15.2 g/dL (Normal: 13.5-17.5)",
      "WBC: 7,200/μL (Normal)",
      "Platelets: 250,000/μL (Normal)",
    ],
  },
  {
    id: 2,
    name: "Lipid Profile",
    date: "2025-01-10",
    type: "Blood Test",
    status: "analyzed",
    summary: "Cholesterol levels are slightly elevated. Consider dietary modifications and follow-up in 3 months.",
    keyFindings: ["Total Cholesterol: 215 mg/dL (High)", "LDL: 140 mg/dL (Borderline High)", "HDL: 55 mg/dL (Normal)"],
  },
  {
    id: 3,
    name: "Thyroid Function Test",
    date: "2024-12-20",
    type: "Blood Test",
    status: "analyzed",
    summary: "Thyroid function is normal. TSH and T4 levels are within optimal range.",
    keyFindings: ["TSH: 2.1 mIU/L (Normal)", "Free T4: 1.3 ng/dL (Normal)", "Free T3: 3.2 pg/mL (Normal)"],
  },
]

export function PatientReports() {
  const [selectedReport, setSelectedReport] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Report</CardTitle>
          <CardDescription>Upload your medical reports for AI-powered analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Your Reports</h2>
        {mockReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{report.type}</Badge>
                    <Badge variant="outline">{report.date}</Badge>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Analyzed
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">AI Summary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{report.summary}</p>
              </div>

              {selectedReport === report.id && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm">Key Findings</h4>
                  <ul className="space-y-2">
                    {report.keyFindings.map((finding, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {selectedReport === report.id ? "Hide Details" : "View Details"}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
