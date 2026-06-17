"use client"

import { ShieldCheck, Backpack, CheckCircle2 } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const guides: {
  type: string
  before: string[]
  during: string[]
  after: string[]
}[] = [
  {
    type: "Flood",
    before: [
      "Know your area's flood risk and evacuation routes.",
      "Keep important documents in waterproof containers.",
      "Move valuables and electrical appliances to higher floors.",
    ],
    during: [
      "Move to higher ground immediately; avoid walking through moving water.",
      "Do not drive through flooded roads.",
      "Turn off electricity and gas if instructed.",
    ],
    after: [
      "Avoid floodwater which may be contaminated or electrically charged.",
      "Boil drinking water until supplies are declared safe.",
      "Document damage with photos for insurance claims.",
    ],
  },
  {
    type: "Earthquake",
    before: [
      "Secure heavy furniture and appliances to walls.",
      "Identify safe spots under sturdy tables in each room.",
      "Keep an emergency kit and a fire extinguisher accessible.",
    ],
    during: [
      "Drop, Cover, and Hold On under sturdy furniture.",
      "Stay away from windows and exterior walls.",
      "If outdoors, move to an open area away from buildings.",
    ],
    after: [
      "Expect aftershocks and stay alert.",
      "Check yourself and others for injuries.",
      "Inspect your home for damage before re-entering.",
    ],
  },
  {
    type: "Fire",
    before: [
      "Install and test smoke alarms regularly.",
      "Plan and practice two escape routes from every room.",
      "Keep flammable materials away from heat sources.",
    ],
    during: [
      "Get out, stay out, and call emergency services.",
      "Crawl low under smoke to your exit.",
      "Use the back of your hand to check doors for heat.",
    ],
    after: [
      "Do not re-enter until authorities declare it safe.",
      "Seek medical attention for burns or smoke inhalation.",
      "Contact your insurance provider promptly.",
    ],
  },
  {
    type: "Cyclone",
    before: [
      "Reinforce windows and secure loose outdoor objects.",
      "Stock up on water, food, and medical supplies.",
      "Charge devices and keep a battery radio ready.",
    ],
    during: [
      "Stay indoors away from windows and glass doors.",
      "Shelter in the strongest part of the building.",
      "Do not go outside during the calm 'eye' of the storm.",
    ],
    after: [
      "Watch for fallen power lines and damaged structures.",
      "Avoid coastal areas due to storm surge risk.",
      "Listen to official channels for all-clear announcements.",
    ],
  },
]

const kitItems = [
  "Drinking water (4 litres per person, per day)",
  "Non-perishable food for 3 days",
  "First-aid kit and prescription medication",
  "Flashlight with spare batteries",
  "Battery or hand-crank radio",
  "Power bank and charging cables",
  "Copies of ID and important documents",
  "Cash in small denominations",
  "Whistle to signal for help",
  "Dust masks and sanitation supplies",
]

export default function PreparednessPage() {
  return (
    <AppShell
      title="Preparedness Guides"
      description="Step-by-step safety actions for before, during, and after a disaster."
    >
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <CardTitle>Safety by Disaster Type</CardTitle>
            </div>
            <CardDescription>
              Select a disaster type to view recommended actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="Flood">
              <TabsList className="flex flex-wrap">
                {guides.map((g) => (
                  <TabsTrigger key={g.type} value={g.type}>
                    {g.type}
                  </TabsTrigger>
                ))}
              </TabsList>
              {guides.map((g) => (
                <TabsContent key={g.type} value={g.type}>
                  <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
                    {(
                      [
                        ["Before", g.before],
                        ["During", g.during],
                        ["After", g.after],
                      ] as const
                    ).map(([phase, items]) => (
                      <div
                        key={phase}
                        className="rounded-lg border bg-card p-4"
                      >
                        <h3 className="mb-3 font-semibold text-foreground">
                          {phase}
                        </h3>
                        <ul className="flex flex-col gap-2">
                          {items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Backpack className="size-5 text-primary" />
              <CardTitle>Emergency Go-Bag Checklist</CardTitle>
            </div>
            <CardDescription>
              Keep these essentials packed and ready to grab at a moment&apos;s
              notice.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {kitItems.map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 rounded-md border p-3 text-sm has-[:checked]:bg-muted"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--primary)]"
                />
                <span>{item}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
