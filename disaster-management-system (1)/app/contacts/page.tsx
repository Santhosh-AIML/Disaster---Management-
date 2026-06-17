"use client"

import { useMemo, useState } from "react"
import { Phone, Search, Siren } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { emergencyContacts } from "@/lib/seed-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const departmentColors: Record<string, string> = {
  Police: "bg-primary/15 text-primary border-primary/30",
  "Fire Department": "bg-destructive/15 text-destructive border-destructive/30",
  Ambulance: "bg-success/15 text-success border-success/30",
  "Disaster Response Team":
    "bg-warning/20 text-warning-foreground border-warning/40",
}

export default function ContactsPage() {
  const [query, setQuery] = useState("")

  const filtered = useMemo(
    () =>
      emergencyContacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.department.toLowerCase().includes(query.toLowerCase()) ||
          c.number.includes(query),
      ),
    [query],
  )

  return (
    <AppShell
      title="Emergency Contacts"
      description="One-tap access to critical emergency services and helplines."
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
          <Siren className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">
              In a life-threatening emergency, dial 112 immediately.
            </p>
            <p className="text-sm text-foreground/80">
              112 is the unified national emergency number for police, fire, and
              medical services.
            </p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((contact) => (
            <Card key={contact.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base text-balance">
                    {contact.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      departmentColors[contact.department] ??
                      "bg-muted text-muted-foreground"
                    }
                  >
                    {contact.department}
                  </Badge>
                </div>
                <CardDescription className="pt-1">
                  {contact.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between gap-2">
                <span className="font-mono text-2xl font-bold text-foreground">
                  {contact.number}
                </span>
                <Button asChild size="sm">
                  <a href={`tel:${contact.number}`}>
                    <Phone className="size-4" />
                    Call
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
