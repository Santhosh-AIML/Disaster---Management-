"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { Alert, DisasterReport, Shelter } from "./types"
import { seedAlerts, seedReports, seedShelters } from "./seed-data"

interface DataStore {
  reports: DisasterReport[]
  alerts: Alert[]
  shelters: Shelter[]
  addReport: (report: Omit<DisasterReport, "id" | "reportedAt" | "status">) => void
  updateReportStatus: (id: string, status: DisasterReport["status"]) => void
  deleteReport: (id: string) => void
  toggleAlert: (id: string) => void
  deleteAlert: (id: string) => void
  addAlert: (alert: Omit<Alert, "id" | "issuedAt" | "active">) => void
  updateShelter: (id: string, occupied: number) => void
}

const DataContext = createContext<DataStore | null>(null)

const STORAGE_KEY = "dms-data-v1"

function statusFromOccupancy(
  occupied: number,
  capacity: number,
): Shelter["status"] {
  if (occupied >= capacity) return "Full"
  if (occupied / capacity >= 0.7) return "Filling Up"
  return "Available"
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<DisasterReport[]>(seedReports)
  const [alerts, setAlerts] = useState<Alert[]>(seedAlerts)
  const [shelters, setShelters] = useState<Shelter[]>(seedShelters)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.reports) setReports(parsed.reports)
        if (parsed.alerts) setAlerts(parsed.alerts)
        if (parsed.shelters) setShelters(parsed.shelters)
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ reports, alerts, shelters }),
    )
  }, [reports, alerts, shelters, hydrated])

  const addReport: DataStore["addReport"] = (report) => {
    setReports((prev) => [
      {
        ...report,
        id: `rpt-${Date.now()}`,
        reportedAt: new Date().toISOString(),
        status: "Pending",
      },
      ...prev,
    ])
  }

  const updateReportStatus: DataStore["updateReportStatus"] = (id, status) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    )
  }

  const deleteReport: DataStore["deleteReport"] = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  const toggleAlert: DataStore["toggleAlert"] = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    )
  }

  const deleteAlert: DataStore["deleteAlert"] = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const addAlert: DataStore["addAlert"] = (alert) => {
    setAlerts((prev) => [
      {
        ...alert,
        id: `alt-${Date.now()}`,
        issuedAt: new Date().toISOString(),
        active: true,
      },
      ...prev,
    ])
  }

  const updateShelter: DataStore["updateShelter"] = (id, occupied) => {
    setShelters((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              occupied: Math.max(0, Math.min(occupied, s.capacity)),
              status: statusFromOccupancy(
                Math.max(0, Math.min(occupied, s.capacity)),
                s.capacity,
              ),
            }
          : s,
      ),
    )
  }

  return (
    <DataContext.Provider
      value={{
        reports,
        alerts,
        shelters,
        addReport,
        updateReportStatus,
        deleteReport,
        toggleAlert,
        deleteAlert,
        addAlert,
        updateShelter,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}
