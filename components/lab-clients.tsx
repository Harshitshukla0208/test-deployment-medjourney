"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, FileText, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const clients = [
  {
    id: "PT-2451",
    name: "John Doe",
    age: 45,
    lastVisit: "2025-01-20",
    totalReports: 8,
    recentTest: "Complete Blood Count",
  },
  {
    id: "PT-2452",
    name: "Jane Smith",
    age: 38,
    lastVisit: "2025-01-20",
    totalReports: 12,
    recentTest: "Lipid Profile",
  },
  {
    id: "PT-2453",
    name: "Mike Johnson",
    age: 52,
    lastVisit: "2025-01-19",
    totalReports: 15,
    recentTest: "Liver Function Test",
  },
]

const clientTrendData = [
  { month: "Aug", reports: 8 },
  { month: "Sep", reports: 12 },
  { month: "Oct", reports: 15 },
  { month: "Nov", reports: 18 },
  { month: "Dec", reports: 22 },
  { month: "Jan", reports: 28 },
]

export function LabClients() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Search</CardTitle>
          <CardDescription>Find and manage your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or client ID..." className="pl-9" />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>All registered clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{client.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{client.id}</Badge>
                      <span className="text-xs text-muted-foreground">Age: {client.age}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{client.totalReports} reports</Badge>
                </div>

                {selectedClient === client.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Last Visit</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {client.lastVisit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Recent Test</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {client.recentTest}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-3">Report Frequency</p>
                      <ChartContainer
                        config={{
                          reports: {
                            label: "Reports",
                            color: "hsl(var(--accent))",
                          },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={clientTrendData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                              dataKey="month"
                              className="text-xs"
                              tick={{ fill: "hsl(var(--muted-foreground))" }}
                            />
                            <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="reports" stroke="hsl(var(--accent))" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View All Reports
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Timeline
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
