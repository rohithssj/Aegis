"use client";

import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import { Incident } from "@/lib/mockData";
import { Badge } from "./Badge";

interface MapViewProps {
  incidents: Incident[];
}

// Simple coordinate derivation from location strings for demo purposes
const getLocationCoords = (location: string): [number, number] => {
  const loc = location.toLowerCase();
  if (loc.includes("sector 7-g")) return [28.6139, 77.2090]; // Delhi
  if (loc.includes("apac")) return [1.3521, 103.8198]; // Singapore
  if (loc.includes("eu-west")) return [48.8566, 2.3522]; // Paris
  if (loc.includes("lunar")) return [20.0, 0.0]; // Demo
  if (loc.includes("mumbai") || loc.includes("west")) return [19.0760, 72.8777];
  if (loc.includes("bangalore") || loc.includes("south")) return [12.9716, 77.5946];
  if (loc.includes("kolkata") || loc.includes("east")) return [22.5726, 88.3639];
  
  // Default to somewhere in India if not matched
  return [20.5937 + (Math.random() - 0.5) * 5, 78.9629 + (Math.random() - 0.5) * 5];
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "#ef4444"; // red-500
    case "high": return "#f97316"; // orange-500
    case "medium": return "#eab308"; // yellow-500
    case "low": return "#06b6d4"; // cyan-500
    default: return "#94a3b8"; // slate-400
  }
};

export default function MapView({ incidents }: MapViewProps) {
  return (
    <MapContainer 
      center={[20.5937, 78.9629]} 
      zoom={5} 
      style={{ height: "100%", width: "100%", background: "#0B1120" }}
      scrollWheelZoom={false}
      className="rounded-2xl overflow-hidden z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {incidents.map((incident) => {
        const coords = getLocationCoords(incident.location);
        const color = getSeverityColor(incident.severity);
        
        return (
          <CircleMarker
            key={incident.id}
            center={coords}
            radius={8}
            pathOptions={{
              fillColor: color,
              color: color,
              weight: 2,
              opacity: 1,
              fillOpacity: 0.6
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[150px] bg-[#0F172A] text-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{incident.trackingId}</span>
                  <Badge variant={incident.severity as any} dot={false} className="text-[8px] py-0">{incident.severity}</Badge>
                </div>
                <h4 className="text-xs font-bold mb-1">{incident.title}</h4>
                <p className="text-[10px] text-slate-400 mb-2">{incident.location}</p>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse text-accent-cyan" />
                   <span className="text-[9px] uppercase font-bold text-accent-cyan">{incident.status}</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
