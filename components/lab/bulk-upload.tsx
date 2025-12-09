"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function BulkUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files)
    }
  }

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    setUploadComplete(false)
    setProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setProgress(i)
    }

    setUploading(false)
    setUploadComplete(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setUploadComplete(false)
      setProgress(0)
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Reports</CardTitle>
        <CardDescription>Upload multiple client reports at once</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploadComplete ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-chart-4" />
              <p className="text-sm font-medium text-chart-4">Upload Complete!</p>
              <p className="text-xs text-muted-foreground">Reports processed and AI summaries generated</p>
            </div>
          ) : uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-sm font-medium">Processing reports...</p>
              <Progress value={progress} className="w-full max-w-xs" />
              <p className="text-xs text-muted-foreground">{progress}% complete</p>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium mb-2">Drag and drop multiple reports here</p>
              <p className="text-xs text-muted-foreground mb-4">or</p>
              <label htmlFor="bulk-upload">
                <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                  <span>
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Files
                  </span>
                </Button>
                <input
                  id="bulk-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleChange}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-4">Supports PDF, JPG, PNG • Multiple files allowed</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
