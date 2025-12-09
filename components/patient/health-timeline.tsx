"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const glucoseData = [
  { date: "Oct 2024", value: 105, normal: 100 },
  { date: "Nov 2024", value: 98, normal: 100 },
  { date: "Dec 2024", value: 102, normal: 100 },
  { date: "Jan 2025", value: 95, normal: 100 },
]

const cholesterolData = [
  { date: "Oct 2024", ldl: 145, hdl: 52, normal: 100 },
  { date: "Nov 2024", ldl: 138, hdl: 54, normal: 100 },
  { date: "Dec 2024", ldl: 132, hdl: 55, normal: 100 },
  { date: "Jan 2025", ldl: 128, hdl: 56, normal: 100 },
]

const bloodPressureData = [
  { date: "Oct 2024", systolic: 128, diastolic: 82 },
  { date: "Nov 2024", systolic: 125, diastolic: 80 },
  { date: "Dec 2024", systolic: 122, diastolic: 78 },
  { date: "Jan 2025", systolic: 120, diastolic: 76 },
]

export function HealthTimeline() {
  const [selectedParameter, setSelectedParameter] = useState("glucose")

  const getChartData = () => {
    switch (selectedParameter) {
      case "glucose":
        return glucoseData
      case "cholesterol":
        return cholesterolData
      case "blood-pressure":
        return bloodPressureData
      default:
        return glucoseData
    }
  }

  const renderChart = () => {
    const data = getChartData()

    if (selectedParameter === "glucose") {
      return (
        <ChartContainer
          config={{
            value: {
              label: "Glucose (mg/dL)",
              color: "hsl(var(--chart-1))",
            },
            normal: {
              label: "Normal Range",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[80, 120]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} name="Glucose" />
              <Line
                type="monotone"
                dataKey="normal"
                stroke="var(--color-normal)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Normal"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )
    }

    if (selectedParameter === "cholesterol") {
      return (
        <ChartContainer
          config={{
            ldl: {
              label: "LDL (mg/dL)",
              color: "hsl(var(--chart-1))",
            },
            hdl: {
              label: "HDL (mg/dL)",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[40, 160]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="ldl" stroke="var(--color-ldl)" strokeWidth={2} name="LDL" />
              <Line type="monotone" dataKey="hdl" stroke="var(--color-hdl)" strokeWidth={2} name="HDL" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )
    }

    if (selectedParameter === "blood-pressure") {
      return (
        <ChartContainer
          config={{
            systolic: {
              label: "Systolic (mmHg)",
              color: "hsl(var(--chart-1))",
            },
            diastolic: {
              label: "Diastolic (mmHg)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[60, 140]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="systolic" stroke="var(--color-systolic)" strokeWidth={2} name="Systolic" />
              <Line
                type="monotone"
                dataKey="diastolic"
                stroke="var(--color-diastolic)"
                strokeWidth={2}
                name="Diastolic"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Health Parameter Timeline</CardTitle>
            <CardDescription>Track your health metrics over time</CardDescription>
          </div>
          <Select value={selectedParameter} onValueChange={setSelectedParameter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select parameter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="glucose">Blood Glucose</SelectItem>
              <SelectItem value="cholesterol">Cholesterol</SelectItem>
              <SelectItem value="blood-pressure">Blood Pressure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}
