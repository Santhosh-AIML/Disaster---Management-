"use client"

import { useMemo, useState } from "react"
import { Bell, MapPin, Clock } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { useData } from "@/lib/data-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { severityClasses, formatDate } from "@/lib/ui-helpers"
import type { Severity, DisasterType } from "@/lib/types"

const disasterTypes: (DisasterType | "All")[] = [
  "All",
  "Flood",
  "Earthquake",
  "Fire",
  "Cyclone",
  "Landslide",
  "Tsunami",
]

const severityOrder: Record<Severity, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

export default function AlertsPage() {
  const { alerts, toggleAlert } = useData()
  const [typeFilter, setTypeFilter] = useState<DisasterType | "All">("All")
  const [severityFilter, setSeverityFilter] = useState<Severity | "All">("All")
  const [showInactive, setShowInactive] = useState(false)

  const filtered = useMemo(() => {
    return [...alerts]
      .filter((a) => (showInactive ? true : a.active))
      .filter((a) => (typeFilter === "All" ? true : a.type === typeFilter))
      .filter((a) =>
        severityFilter === "All" ? true : a.severity === severityFilter,
      )
      .sort((a, b) => {
        const s = severityOrder[a.severity] - severityOrder[b.severity]
        if (s !== 0) return s
        return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
      })
  }, [alerts, typeFilter, severityFilter, showInactive])

  return (
    <AppShell
      title="Active Alerts"
      description="Live early-warning notifications issued by monitoring agencies."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Disaster type
            </span>
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as DisasterType | "All")}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {disasterTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Severity
            </span>
            <Select
              value={severityFilter}
              onValueChange={(v) => setSeverityFilter(v as Severity | "All")}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["All", "Critical", "High", "Medium", "Low"] as const).map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant={showInactive ? "default" : "outline"}
            onClick={() => setShowInactive((v) => !v)}
          >
            {showInactive ? "Showing all" : "Show inactive"}
          </Button>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" />
            <span>
              {filtered.length} alert{filtered.length === 1 ? "" : "s"} shown
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Bell className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No alerts match the current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((alert) => (
              <Card
                key={alert.id}
                className={`border-l-4 ${alert.active ? "" : "opacity-60"}`}
                style={{
                  borderLeftColor:
                    alert.severity === "Critical"
                      ? "var(--destructive)"
                      : alert.severity === "High"
                        ? "var(--warning)"
                        : "var(--primary)",
                }}
              >
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-lg text-balance">
                        {alert.title}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {alert.area}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(alert.issuedAt)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{alert.type}</Badge>
                      <Badge className={severityClasses(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <Badge
                      variant="outline"
                      className={
                        alert.active
                          ? "border-success/30 bg-success/15 text-success"
                          : "text-muted-foreground"
                      }
                    >
                      {alert.active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAlert(alert.id)}
                    >
                      {alert.active ? "Deactivate" : "Reactivate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}
