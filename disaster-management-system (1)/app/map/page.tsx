"use client"

import dynamic from "next/dynamic"
import { AppShell } from "@/components/app-shell"
import { useData } from "@/lib/data-store"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const LiveMap = dynamic(() => import("@/components/live-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] w-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
      Loading map...
    </div>
  ),
})

const legend = [
  { label: "Critical incident", color: "#dc2626" },
  { label: "High incident", color: "#ea580c" },
  { label: "Medium incident", color: "#ca8a04" },
  { label: "Low incident", color: "#2563eb" },
  { label: "Relief shelter", color: "#16a34a" },
]

export default function MapPage() {
  const { reports, shelters } = useData()

  return (
    <AppShell
      title="Live Situation Map"
      description="Geospatial view of active incidents and relief shelters."
    >
      <Card>
        <CardHeader>
          <CardTitle>Incident & Shelter Map</CardTitle>
          <CardDescription>
            {reports.length} incidents and {shelters.length} shelters plotted.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LiveMap reports={reports} shelters={shelters} />
          <div className="flex flex-wrap gap-4">
            {legend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="inline-block size-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
