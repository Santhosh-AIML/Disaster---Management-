import type { Severity } from "./types"

export function severityClasses(severity: Severity): string {
  switch (severity) {
    case "Low":
      return "bg-success/15 text-success border-success/30"
    case "Medium":
      return "bg-warning/20 text-warning-foreground border-warning/40"
    case "High":
      return "bg-destructive/15 text-destructive border-destructive/30"
    case "Critical":
      return "bg-destructive text-destructive-foreground border-destructive"
  }
}

export function statusClasses(status: string): string {
  switch (status) {
    case "Available":
      return "bg-success/15 text-success border-success/30"
    case "Filling Up":
      return "bg-warning/20 text-warning-foreground border-warning/40"
    case "Full":
      return "bg-destructive/15 text-destructive border-destructive/30"
    case "Verified":
      return "bg-primary/15 text-primary border-primary/30"
    case "Pending":
      return "bg-warning/20 text-warning-foreground border-warning/40"
    case "Resolved":
      return "bg-success/15 text-success border-success/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function formatDate(iso: string): string {
  // Fixed timezone keeps server and client output identical (avoids hydration mismatch).
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  })
}
