"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Minus } from "lucide-react"

const hemoglobinData = [
  { date: "Oct 2024", value: 14.8 },
  { date: "Nov 2024", value: 14.5 },
  { date: "Dec 2024", value: 15.0 },
  { date: "Jan 2025", value: 15.2 },
]

const cholesterolData = [
  { date: "Oct 2024", total: 205, ldl: 130, hdl: 58 },
  { date: "Nov 2024", total: 210, ldl: 135, hdl: 56 },
  { date: "Dec 2024", total: 212, ldl: 138, hdl: 55 },
  { date: "Jan 2025", total: 215, ldl: 140, hdl: 55 },
]

const thyroidData = [
  { date: "Jul 2024", tsh: 2.3, t4: 1.2 },
  { date: "Oct 2024", tsh: 2.2, t4: 1.3 },
  { date: "Dec 2024", tsh: 2.1, t4: 1.3 },
]

export function HealthTimeline() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Health Parameter Trends</CardTitle>
          <CardDescription>Track how your health metrics change over time</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Hemoglobin Levels</CardTitle>
              <CardDescription>Normal range: 13.5-17.5 g/dL</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-chart-4" />
              <span className="text-chart-4 font-medium">+2.7% from last test</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Hemoglobin (g/dL)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hemoglobinData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[13, 16]} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Cholesterol Profile</CardTitle>
              <CardDescription>Total, LDL, and HDL cholesterol levels (mg/dL)</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-destructive" />
              <span className="text-destructive font-medium">Needs attention</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              total: {
                label: "Total Cholesterol",
                color: "hsl(var(--chart-1))",
              },
              ldl: {
                label: "LDL (Bad)",
                color: "hsl(var(--destructive))",
              },
              hdl: {
                label: "HDL (Good)",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cholesterolData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 250]} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Total" />
                <Line type="monotone" dataKey="ldl" stroke="hsl(var(--destructive))" strokeWidth={2} name="LDL" />
                <Line type="monotone" dataKey="hdl" stroke="hsl(var(--chart-4))" strokeWidth={2} name="HDL" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Thyroid Function</CardTitle>
              <CardDescription>TSH and Free T4 levels</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Minus className="h-4 w-4 text-chart-4" />
              <span className="text-chart-4 font-medium">Stable</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              tsh: {
                label: "TSH (mIU/L)",
                color: "hsl(var(--chart-2))",
              },
              t4: {
                label: "Free T4 (ng/dL)",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={thyroidData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 3]} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="tsh" stroke="hsl(var(--chart-2))" strokeWidth={2} name="TSH" />
                <Line type="monotone" dataKey="t4" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Free T4" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
