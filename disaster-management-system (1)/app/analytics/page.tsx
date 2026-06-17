"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { AppShell } from "@/components/app-shell"
import { useData } from "@/lib/data-store"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { DisasterType, Severity } from "@/lib/types"

const typeColors: Record<string, string> = {
  Flood: "var(--chart-1)",
  Earthquake: "var(--chart-3)",
  Fire: "var(--chart-4)",
  Cyclone: "var(--chart-5)",
  Landslide: "var(--chart-2)",
  Tsunami: "var(--primary)",
}

const severityColors: Record<Severity, string> = {
  Low: "var(--chart-2)",
  Medium: "var(--chart-4)",
  High: "var(--chart-3)",
  Critical: "var(--destructive)",
}

export default function AnalyticsPage() {
  const { reports, shelters } = useData()

  const byType = useMemo(() => {
    const counts: Record<string, number> = {}
    reports.forEach((r) => {
      counts[r.type] = (counts[r.type] ?? 0) + 1
    })
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      fill: typeColors[type] ?? "var(--primary)",
    }))
  }, [reports])

  const bySeverity = useMemo(() => {
    const order: Severity[] = ["Low", "Medium", "High", "Critical"]
    const counts: Record<string, number> = {}
    reports.forEach((r) => {
      counts[r.severity] = (counts[r.severity] ?? 0) + 1
    })
    return order
      .filter((s) => counts[s])
      .map((severity) => ({
        severity,
        count: counts[severity],
        fill: severityColors[severity],
      }))
  }, [reports])

  const shelterData = useMemo(
    () =>
      shelters.map((s) => ({
        name: s.name.split(" ").slice(0, 2).join(" "),
        occupied: s.occupied,
        available: s.capacity - s.occupied,
      })),
    [shelters],
  )

  const typeConfig = Object.fromEntries(
    (Object.keys(typeColors) as DisasterType[]).map((t) => [
      t,
      { label: t, color: typeColors[t] },
    ]),
  )

  return (
    <AppShell
      title="Analytics & Insights"
      description="Aggregated trends across incidents and relief operations."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Type</CardTitle>
            <CardDescription>Distribution of reported disasters</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={typeConfig} className="h-72 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={byType}
                  dataKey="count"
                  nameKey="type"
                  innerRadius={55}
                  outerRadius={100}
                  strokeWidth={2}
                >
                  {byType.map((entry) => (
                    <Cell key={entry.type} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="type" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
            <CardDescription>Volume across severity levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ count: { label: "Reports" } }}
              className="h-72 w-full"
            >
              <BarChart data={bySeverity}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="severity" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={6}>
                  {bySeverity.map((entry) => (
                    <Cell key={entry.severity} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Shelter Capacity Utilization</CardTitle>
            <CardDescription>
              Occupied vs. available beds per shelter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                occupied: { label: "Occupied", color: "var(--chart-3)" },
                available: { label: "Available", color: "var(--chart-2)" },
              }}
              className="h-80 w-full"
            >
              <BarChart data={shelterData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="occupied"
                  stackId="a"
                  fill="var(--color-occupied)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="available"
                  stackId="a"
                  fill="var(--color-available)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
