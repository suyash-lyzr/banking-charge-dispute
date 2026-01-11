"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ObservabilityData } from "@/types"
import { format } from "date-fns"

interface ObservabilityDashboardProps {
  data: ObservabilityData
}

export function ObservabilityDashboard({ data }: ObservabilityDashboardProps) {
  // Group messages by step for bar chart
  const stepCounts = data.messages.reduce((acc, msg) => {
    const step = msg.step || "unknown"
    acc[step] = (acc[step] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const barChartData = Object.entries(stepCounts).map(([step, count]) => ({
    step: step.charAt(0).toUpperCase() + step.slice(1),
    count,
  }))

  // Timeline data for line chart
  const timelineData = data.messages.map((msg, index) => ({
    index: index + 1,
    timestamp: format(msg.timestamp, "HH:mm:ss"),
    latency: msg.latency || 0,
    role: msg.role,
  }))

  const getOutcomeBadge = () => {
    switch (data.finalOutcome) {
      case "fraud":
        return <Badge variant="destructive">Fraud Detected</Badge>
      case "not_fraud":
        return <Badge variant="default">Not Fraud</Badge>
      case "resolved":
        return <Badge variant="default">Resolved</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Observability Dashboard</h1>
        {getOutcomeBadge()}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Messages by Agent Step</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="oklch(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Latency Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="oklch(var(--chart-2))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.messages.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalSteps}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalLatency}ms</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.messages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between p-2 rounded border bg-card"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      msg.role === "user" ? "default" : "secondary"
                    }
                  >
                    {msg.role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(msg.timestamp, "HH:mm:ss")}
                  </span>
                  {msg.step && (
                    <span className="text-xs text-muted-foreground">
                      ({msg.step})
                    </span>
                  )}
                </div>
                {msg.latency && (
                  <span className="text-xs text-muted-foreground">
                    {msg.latency}ms
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
