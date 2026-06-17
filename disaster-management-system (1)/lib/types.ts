export type DisasterType =
  | "Flood"
  | "Earthquake"
  | "Fire"
  | "Cyclone"
  | "Landslide"
  | "Tsunami"

export type Severity = "Low" | "Medium" | "High" | "Critical"

export type OccupancyStatus = "Available" | "Filling Up" | "Full"

export interface DisasterReport {
  id: string
  type: DisasterType
  location: string
  severity: Severity
  description: string
  image?: string
  reportedAt: string
  status: "Pending" | "Verified" | "Resolved"
  lat: number
  lng: number
}

export interface Alert {
  id: string
  title: string
  type: DisasterType
  severity: Severity
  area: string
  message: string
  issuedAt: string
  active: boolean
}

export interface Shelter {
  id: string
  name: string
  address: string
  capacity: number
  occupied: number
  contact: string
  status: OccupancyStatus
  lat: number
  lng: number
}

export interface EmergencyContact {
  id: string
  name: string
  department: string
  number: string
  description: string
}
