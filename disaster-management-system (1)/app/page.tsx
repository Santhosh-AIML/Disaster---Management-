"use client"

import Link from "next/link"
import {
  AlertTriangle,
  BellRing,
  FileWarning,
  Home,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useData } from "@/lib/data-store"
import { emergencyContacts } from "@/lib/seed-data"
import { severityClasses, formatDate } from "@/lib/ui-helpers"

export default function DashboardPage() {
  const { reports, alerts, shelters } = useData()

  const activeAlerts = alerts.filter((a) => a.active)
  const criticalAlert = activeAlerts.find((a) => a.severity === "Critical")
  const totalShelterCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0)
  const occupied = shelters.reduce((sum, s) => sum + s.occupied, 0)

  const quickLinks = [
    { title: "Report an Incident", href: "/report", icon: FileWarning },
    { title: "View Live Alerts", href: "/alerts", icon: BellRing },
    { title: "Find a Shelter", href: "/shelters", icon: Home },
    { title: "Preparedness Guide", href: "/preparedness", icon: ShieldCheck },
  ]

  return (
    <AppShell
      title="Command Dashboard"
      description="Real-time overview of disaster response operations"
    >
      <div className="flex flex-col gap-6">
        {criticalAlert ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4"
          >
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">
                {criticalAlert.title}
              </p>
              <p className="text-sm text-foreground/80">
                {criticalAlert.message}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {criticalAlert.area} &middot; {formatDate(criticalAlert.issuedAt)}
              </p>
            </div>
            <Button asChild size="sm" variant="destructive">
              <Link href="/alerts">Details</Link>
            </Button>
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active Alerts"
            value={activeAlerts.length}
            icon={BellRing}
            tone="destructive"
            hint="Currently broadcasting"
          />
          <StatCard
            label="Reported Incidents"
            value={reports.length}
            icon={FileWarning}
            tone="warning"
            hint={`${reports.filter((r) => r.status === "Pending").length} awaiting review`}
          />
          <StatCard
            label="Safe Shelters"
            value={shelters.length}
            icon={Home}
            tone="success"
            hint={`${occupied}/${totalShelterCapacity} capacity used`}
          />
          <StatCard
            label="Emergency Contacts"
            value={emergencyContacts.length}
            icon={PhoneCall}
            tone="primary"
            hint="One-tap dialing"
          />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Incident Reports</CardTitle>
                <CardDescription>
                  Latest submissions from the field
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/report">
                  View all <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {reports.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.type}</span>
                      <Badge
                        variant="outline"
                        className={severityClasses(r.severity)}
                      >
                        {r.severity}
                      </Badge>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {r.location}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(r.reportedAt)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to key operations</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant="outline"
                  className="justify-start"
                >
                  <Link href={link.href}>
                    <link.icon className="size-4" />
                    {link.title}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>
              Public warnings currently in effect
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {activeAlerts.map((a) => (
              <div key={a.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{a.title}</span>
                  <Badge
                    variant="outline"
                    className={severityClasses(a.severity)}
                  >
                    {a.severity}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.area}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
