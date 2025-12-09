"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Sparkles, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const recentUploads = [
  {
    id: 1,
    clientName: "John Doe",
    clientId: "PT-2451",
    testType: "Complete Blood Count",
    uploadDate: "2025-01-20",
    status: "processed",
  },
  {
    id: 2,
    clientName: "Jane Smith",
    clientId: "PT-2452",
    testType: "Lipid Profile",
    uploadDate: "2025-01-20",
    status: "processed",
  },
  {
    id: 3,
    clientName: "Mike Johnson",
    clientId: "PT-2453",
    testType: "Liver Function Test",
    uploadDate: "2025-01-19",
    status: "processed",
  },
]

export function LabReports() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Client Reports</CardTitle>
          <CardDescription>Upload single or multiple reports for AI analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input id="clientId" placeholder="Enter client ID (e.g., PT-2454)" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="testType">Test Type</Label>
              <Input id="testType" placeholder="e.g., Complete Blood Count" />
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
            <p className="text-xs text-muted-foreground mt-2">Supports bulk upload (multiple files)</p>
          </div>

          <Button className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Upload & Generate AI Analysis
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Recently processed client reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium text-sm">{upload.clientName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {upload.clientId}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{upload.testType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent/10 text-accent">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Processed
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
