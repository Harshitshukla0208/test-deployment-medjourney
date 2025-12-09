"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Droplets,
  Heart,
  Lightbulb,
  Apple,
  Dumbbell,
  Pill,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const glucoseData = [
  { month: "Aug", value: 105 },
  { month: "Sep", value: 98 },
  { month: "Oct", value: 102 },
  { month: "Nov", value: 95 },
  { month: "Dec", value: 94 },
  { month: "Jan", value: 92 },
]

const cholesterolData = [
  { month: "Aug", ldl: 158, hdl: 48 },
  { month: "Sep", ldl: 155, hdl: 50 },
  { month: "Oct", ldl: 150, hdl: 52 },
  { month: "Nov", ldl: 148, hdl: 53 },
  { month: "Dec", ldl: 145, hdl: 54 },
  { month: "Jan", ldl: 142, hdl: 55 },
]

const hemoglobinData = [
  { month: "Aug", value: 13.8 },
  { month: "Sep", value: 14.0 },
  { month: "Oct", value: 14.2 },
  { month: "Nov", value: 14.1 },
  { month: "Dec", value: 14.3 },
  { month: "Jan", value: 14.4 },
]

const parameters = [
  {
    id: "glucose",
    name: "Blood Glucose",
    icon: Droplets,
    current: "92 mg/dL",
    trend: "down",
    trendText: "12% improvement",
    status: "Normal",
    statusColor: "bg-green-100 text-green-700",
    data: glucoseData,
    normalRange: { min: 70, max: 100 },
    unit: "mg/dL",
    chartType: "single" as const,
  },
  {
    id: "cholesterol",
    name: "Cholesterol",
    icon: Heart,
    current: "LDL: 142",
    trend: "down",
    trendText: "10% reduction",
    status: "Attention",
    statusColor: "bg-amber-100 text-amber-700",
    data: cholesterolData,
    normalRange: { min: 0, max: 100 },
    unit: "mg/dL",
    chartType: "dual" as const,
  },
  {
    id: "hemoglobin",
    name: "Hemoglobin",
    icon: Activity,
    current: "14.4 g/dL",
    trend: "up",
    trendText: "4% increase",
    status: "Normal",
    statusColor: "bg-green-100 text-green-700",
    data: hemoglobinData,
    normalRange: { min: 13.5, max: 17.5 },
    unit: "g/dL",
    chartType: "single" as const,
  },
]

const timelineTips = [
  {
    icon: Apple,
    title: "Cholesterol Improving",
    description:
      "Your LDL has dropped 10% over 6 months. Keep up the dietary changes - increasing fiber and reducing saturated fats is working.",
    color: { bg: "bg-green-100", text: "text-green-600" },
  },
  {
    icon: Dumbbell,
    title: "Maintain Exercise Routine",
    description:
      "Your consistent progress suggests your current exercise routine is effective. Consider adding strength training 2x/week for additional benefits.",
    color: { bg: "bg-blue-100", text: "text-blue-600" },
  },
  {
    icon: Pill,
    title: "Schedule Follow-up",
    description:
      "With your cholesterol still above optimal, consider scheduling a follow-up in 3 months to assess if medication might be beneficial.",
    color: { bg: "bg-purple-100", text: "text-purple-600" },
  },
]

export function HealthTimeline() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />
      case "down":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Health Timeline</CardTitle>
              <CardDescription>Track how your health parameters change over time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parameters.map((param) => (
              <div key={param.id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <param.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{param.name}</span>
                  </div>
                  <Badge className={param.statusColor}>{param.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="font-bold text-sm">{param.current}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Trend</p>
                    <div className="flex items-center gap-1">
                      <span
                        className={
                          param.trend === "down" && param.id !== "hemoglobin"
                            ? "text-green-600"
                            : param.trend === "up" && param.id === "hemoglobin"
                              ? "text-green-600"
                              : "text-amber-500"
                        }
                      >
                        {getTrendIcon(param.trend)}
                      </span>
                      <span className="text-xs font-medium">{param.trendText}</span>
                    </div>
                  </div>
                </div>

                <ChartContainer
                  config={{
                    value: {
                      label: param.name,
                      color: "hsl(var(--primary))",
                    },
                    ldl: {
                      label: "LDL",
                      color: "hsl(var(--destructive))",
                    },
                    hdl: {
                      label: "HDL",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-[160px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    {param.chartType === "dual" ? (
                      <LineChart data={param.data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="month"
                          className="text-xs"
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        />
                        <YAxis
                          className="text-xs"
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          width={30}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ReferenceLine y={100} stroke="hsl(var(--chart-4))" strokeDasharray="5 5" />
                        <Line
                          type="monotone"
                          dataKey="ldl"
                          stroke="hsl(var(--destructive))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--destructive))", r: 3 }}
                          name="LDL"
                        />
                        <Line
                          type="monotone"
                          dataKey="hdl"
                          stroke="hsl(var(--chart-4))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--chart-4))", r: 3 }}
                          name="HDL"
                        />
                      </LineChart>
                    ) : (
                      <LineChart data={param.data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="month"
                          className="text-xs"
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        />
                        <YAxis
                          className="text-xs"
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          domain={param.id === "glucose" ? [60, 120] : [12, 16]}
                          width={30}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ReferenceLine
                          y={param.normalRange.max}
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="5 5"
                        />
                        <ReferenceLine
                          y={param.normalRange.min}
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="5 5"
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", r: 3 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle>Timeline Insights</CardTitle>
              <CardDescription>AI-generated recommendations based on your overall health trends</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {timelineTips.map((tip, index) => (
              <div key={index} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 rounded-full ${tip.color.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <tip.icon className={`h-5 w-5 ${tip.color.text}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


