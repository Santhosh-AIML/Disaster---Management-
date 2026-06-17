"use client"

import { useMemo, useState } from "react"
import { Home, MapPin, Phone, Users, Minus, Plus } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { useData } from "@/lib/data-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { statusClasses } from "@/lib/ui-helpers"

export default function SheltersPage() {
  const { shelters, updateShelter } = useData()
  const [query, setQuery] = useState("")

  const filtered = useMemo(
    () =>
      shelters.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.address.toLowerCase().includes(query.toLowerCase()),
      ),
    [shelters, query],
  )

  const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0)
  const totalOccupied = shelters.reduce((sum, s) => sum + s.occupied, 0)

  return (
    <AppShell
      title="Relief Shelters"
      description="Locate available shelters and manage real-time occupancy."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Input
            placeholder="Search by name or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {totalOccupied.toLocaleString()} /{" "}
              {totalCapacity.toLocaleString()} sheltered
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((shelter) => {
            const pct = Math.round((shelter.occupied / shelter.capacity) * 100)
            return (
              <Card key={shelter.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Home className="size-5" />
                      </div>
                      <CardTitle className="text-base text-balance">
                        {shelter.name}
                      </CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusClasses(shelter.status)}
                    >
                      {shelter.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 pt-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {shelter.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className="font-medium">
                        {shelter.occupied} / {shelter.capacity}
                      </span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`h-full rounded-full ${
                          pct >= 100
                            ? "bg-destructive"
                            : pct >= 70
                              ? "bg-warning"
                              : "bg-success"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <a
                    href={`tel:${shelter.contact.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {shelter.contact}
                  </a>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      updateShelter(shelter.id, shelter.occupied - 10)
                    }
                    aria-label="Decrease occupancy"
                  >
                    <Minus className="size-4" /> 10
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      updateShelter(shelter.id, shelter.occupied + 10)
                    }
                    aria-label="Increase occupancy"
                  >
                    <Plus className="size-4" /> 10
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
