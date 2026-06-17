"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { ImagePlus, Send } from "lucide-react"
import { AppShell } from "@/components/app-shell"
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
import { useData } from "@/lib/data-store"
import type { DisasterType, Severity } from "@/lib/types"
import { severityClasses, statusClasses, formatDate } from "@/lib/ui-helpers"

const disasterTypes: DisasterType[] = [
  "Flood",
  "Earthquake",
  "Fire",
  "Cyclone",
  "Landslide",
  "Tsunami",
]
const severities: Severity[] = ["Low", "Medium", "High", "Critical"]

export default function ReportPage() {
  const { reports, addReport } = useData()
  const [type, setType] = useState<DisasterType | "">("")
  const [location, setLocation] = useState("")
  const [severity, setSeverity] = useState<Severity | "">("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<string | undefined>(undefined)
  const [imageName, setImageName] = useState("")

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!type || !location || !severity || !description) {
      toast.error("Please fill in all required fields.")
      return
    }
    addReport({
      type,
      location,
      severity,
      description,
      image,
      // Random nearby coordinates for the demo map
      lat: 20.5937 + (Math.random() - 0.5) * 10,
      lng: 78.9629 + (Math.random() - 0.5) * 10,
    })
    toast.success("Disaster report submitted successfully.")
    setType("")
    setLocation("")
    setSeverity("")
    setDescription("")
    setImage(undefined)
    setImageName("")
  }

  return (
    <AppShell
      title="Disaster Reporting"
      description="Submit and track incident reports from the field"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>New Report</CardTitle>
            <CardDescription>
              Provide accurate details to help responders act quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Disaster Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as DisasterType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
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
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Riverside District, Chennai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="severity">Severity Level</Label>
                <Select
                  value={severity}
                  onValueChange={(v) => setSeverity(v as Severity)}
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the situation, impact, and any immediate needs."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="image">Upload Image</Label>
                <label
                  htmlFor="image"
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  <ImagePlus className="size-4" />
                  {imageName || "Choose an image (optional)"}
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImage}
                />
                {image ? (
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Report preview"
                    className="mt-1 h-32 w-full rounded-md object-cover"
                  />
                ) : null}
              </div>

              <Button type="submit" className="w-full">
                <Send className="size-4" />
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
            <CardDescription>{reports.length} total incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Reported</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.type}</TableCell>
                      <TableCell className="max-w-[180px] truncate">
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
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusClasses(r.status)}
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {formatDate(r.reportedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
