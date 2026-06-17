"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import type { DisasterReport, Shelter } from "@/lib/types"

function severityColor(severity: string): string {
  switch (severity) {
    case "Critical":
      return "#dc2626"
    case "High":
      return "#ea580c"
    case "Medium":
      return "#ca8a04"
    default:
      return "#2563eb"
  }
}

export default function LiveMap({
  reports,
  shelters,
}: {
  reports: DisasterReport[]
  shelters: Shelter[]
}) {
  // Ensure Leaflet recalculates size after mount inside flex containers.
  useEffect(() => {
    window.dispatchEvent(new Event("resize"))
  }, [])

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom
      className="h-[60vh] w-full rounded-lg"
      style={{ background: "var(--muted)" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((r) => (
        <CircleMarker
          key={r.id}
          center={[r.lat, r.lng]}
          radius={10}
          pathOptions={{
            color: severityColor(r.severity),
            fillColor: severityColor(r.severity),
            fillOpacity: 0.6,
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>
                {r.type} &middot; {r.severity}
              </strong>
              <br />
              {r.location}
              <br />
              <span className="text-xs">Status: {r.status}</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      {shelters.map((s) => (
        <CircleMarker
          key={s.id}
          center={[s.lat, s.lng]}
          radius={8}
          pathOptions={{
            color: "#16a34a",
            fillColor: "#16a34a",
            fillOpacity: 0.7,
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{s.name}</strong>
              <br />
              {s.address}
              <br />
              <span className="text-xs">
                Occupancy: {s.occupied}/{s.capacity} ({s.status})
              </span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
