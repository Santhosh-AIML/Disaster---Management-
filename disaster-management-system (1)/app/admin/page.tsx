"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { useData } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { severityClasses, statusClasses, formatDate } from "@/lib/ui-helpers"
import type { DisasterReport, DisasterType, Severity } from "@/lib/types"

const reportStatuses: DisasterReport["status"][] = [
  "Pending",
  "Verified",
  "Resolved",
]
const disasterTypes: DisasterType[] = [
  "Flood",
  "Earthquake",
  "Fire",
  "Cyclone",
  "Landslide",
  "Tsunami",
]
const severities: Severity[] = ["Low", "Medium", "High", "Critical"]

export default function AdminPage() {
  const { reports, updateReportStatus, deleteReport, alerts, addAlert, deleteAlert } =
    useData()

  const [title, setTitle] = useState("")
  const [type, setType] = useState<DisasterType | "">("")
  const [severity, setSeverity] = useState<Severity | "">("")
  const [area, setArea] = useState("")
  const [message, setMessage] = useState("")

  function handleCreateAlert(e: FormEvent) {
    e.preventDefault()
    if (!title || !type || !severity || !area || !message) {
      toast.error("Please complete all alert fields.")
      return
    }
    addAlert({ title, type, severity, area, message })
    toast.success("Alert broadcast to the public.")
    setTitle("")
    setType("")
    setSeverity("")
    setArea("")
    setMessage("")
  }

  return (
    <AppShell
      title="Admin Dashboard"
      description="Verify field reports and broadcast public warnings."
    >
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Incident Reports</CardTitle>
            <CardDescription>
              Update verification status or remove invalid reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.type}</TableCell>
                      <TableCell className="max-w-[160px] truncate">
                        {r.location}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={severityClasses(r.severity)}
                        >
                          {r.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(r.reportedAt)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={r.status}
                          onValueChange={(v) =>
                            updateReportStatus(
                              r.id,
                              v as DisasterReport["status"],
                            )
                          }
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {reportStatuses.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            deleteReport(r.id)
                            toast.success("Report removed.")
                          }}
                          aria-label="Delete report"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast New Alert</CardTitle>
              <CardDescription>
                Issue a public early-warning notification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlert} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Alert Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Severe Flood Warning"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="alert-type">Type</Label>
                    <Select
                      value={type}
                      onValueChange={(v) => setType(v as DisasterType)}
                    >
                      <SelectTrigger id="alert-type">
                        <SelectValue placeholder="Type" />
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
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="alert-severity">Severity</Label>
                    <Select
                      value={severity}
                      onValueChange={(v) => setSeverity(v as Severity)}
                    >
                      <SelectTrigger id="alert-severity">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {severities.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="area">Affected Area</Label>
                  <Input
                    id="area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Coastal districts"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Instructions for the public..."
                  />
                </div>
                <Button type="submit">
                  <Plus className="size-4" />
                  Broadcast Alert
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Alerts</CardTitle>
              <CardDescription>
                {alerts.filter((a) => a.active).length} active broadcasts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{a.title}</span>
                      <Badge
                        variant="outline"
                        className={severityClasses(a.severity)}
                      >
                        {a.severity}
                      </Badge>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {a.area}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className={statusClasses(a.active ? "Available" : "")}
                    >
                      {a.active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        deleteAlert(a.id)
                        toast.success("Alert deleted.")
                      }}
                      aria-label="Delete alert"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
