"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const reportsPerMonthData = [
  { month: "Aug", reports: 98 },
  { month: "Sep", reports: 112 },
  { month: "Oct", reports: 125 },
  { month: "Nov", reports: 138 },
  { month: "Dec", reports: 145 },
  { month: "Jan", reports: 156 },
]

const testTypesData = [
  { type: "Blood Count", count: 245 },
  { type: "Lipid Profile", count: 198 },
  { type: "Thyroid", count: 156 },
  { type: "Vitamin D", count: 134 },
  { type: "HbA1c", count: 112 },
]

const processingTimeData = [
  { month: "Aug", time: 3.2 },
  { month: "Sep", time: 3.0 },
  { month: "Oct", time: 2.8 },
  { month: "Nov", time: 2.6 },
  { month: "Dec", time: 2.4 },
  { month: "Jan", time: 2.3 },
]

export function LabAnalytics() {
  return (
    <div className="space-y-6">
      {/* Reports Per Month */}
      <Card>
        <CardHeader>
          <CardTitle>Reports Generated Per Month</CardTitle>
          <CardDescription>Monthly report generation trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              reports: {
                label: "Reports",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportsPerMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="reports" stroke="var(--color-reports)" strokeWidth={2} name="Reports" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Test Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Test Types Distribution</CardTitle>
            <CardDescription>Most common test types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testTypesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Processing Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle>AI Processing Time</CardTitle>
            <CardDescription>Average processing time in seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                time: {
                  label: "Time (s)",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processingTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 4]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="time" stroke="var(--color-time)" strokeWidth={2} name="Time (s)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
