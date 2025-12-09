"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const appointmentsPerMonthData = [
  { month: "Aug", appointments: 82 },
  { month: "Sep", appointments: 88 },
  { month: "Oct", appointments: 95 },
  { month: "Nov", appointments: 102 },
  { month: "Dec", apartments: 98 },
  { month: "Jan", appointments: 105 },
]

const conditionDistributionData = [
  { condition: "Type 2 Diabetes", count: 45 },
  { condition: "Hypothyroidism", count: 38 },
  { condition: "Type 1 Diabetes", count: 28 },
  { condition: "Hyperthyroidism", count: 22 },
  { condition: "PCOS", count: 18 },
]

const interviewCompletionData = [
  { month: "Aug", completed: 65, pending: 15 },
  { month: "Sep", completed: 72, pending: 12 },
  { month: "Oct", completed: 78, pending: 10 },
  { month: "Nov", completed: 85, pending: 8 },
  { month: "Dec", completed: 88, pending: 6 },
  { month: "Jan", completed: 92, pending: 5 },
]

export function DoctorAnalytics() {
  return (
    <div className="space-y-6">
      {/* Appointments Per Month */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments Per Month</CardTitle>
          <CardDescription>Monthly consultation trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              appointments: {
                label: "Appointments",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentsPerMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="var(--color-appointments)"
                  strokeWidth={2}
                  name="Appointments"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Condition Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Conditions</CardTitle>
            <CardDescription>Distribution of patient conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Patients",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conditionDistributionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="condition" type="category" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" name="Patients" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Interview Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Pre-Visit Interview Status</CardTitle>
            <CardDescription>Interview completion trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: {
                  label: "Completed",
                  color: "hsl(var(--chart-4))",
                },
                pending: {
                  label: "Pending",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interviewCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="completed" fill="var(--color-completed)" name="Completed" />
                  <Bar dataKey="pending" fill="var(--color-pending)" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
