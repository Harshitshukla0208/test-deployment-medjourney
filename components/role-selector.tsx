"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Stethoscope } from "lucide-react"
import Link from "next/link"

export function RoleSelector() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Link href="/personal">
        <Card className="cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all">
          <CardHeader>
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Personal Portal</CardTitle>
            <CardDescription>Upload reports, view AI summaries, and track your health journey</CardDescription>
          </CardHeader>
        </Card>
      </Link>

      <Link href="/lab">
        <Card className="cursor-pointer border-2 hover:border-accent hover:shadow-lg transition-all">
          <CardHeader>
            <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-accent" />
            </div>
            <CardTitle>Lab Owner Portal</CardTitle>
            <CardDescription>Manage client reports with AI-enhanced insights and analytics</CardDescription>
          </CardHeader>
        </Card>
      </Link>

      <Link href="/doctor">
        <Card className="cursor-pointer border-2 hover:border-chart-3 hover:shadow-lg transition-all">
          <CardHeader>
            <div className="h-16 w-16 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
              <Stethoscope className="h-8 w-8 text-chart-3" />
            </div>
            <CardTitle>Doctor Portal</CardTitle>
            <CardDescription>Send consultations and review patient insights efficiently</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </div>
  )
}
