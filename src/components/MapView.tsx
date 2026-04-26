"use client";

import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Incident } from "@/lib/mockData";
import { Badge } from "./Badge";

interface MapViewProps {
  incidents: Incident[];
}

// Marker Cluster Component
const MarkerCluster = ({ incidents }: { incidents: Incident[] }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!map || incidents.length === 0) return;

    const mg = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="w-8 h-8 rounded-full bg-accent-indigo/80 border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-white backdrop-blur-sm shadow-[0_0_15px_rgba(91,76,240,0.4)]">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(32, 32)
        });
      }
    });

    incidents.forEach(i => {
      const coords = (i.lat && i.lng) ? [i.lat, i.lng] : getLocationCoords(i.location);
      const marker = L.marker(coords as any, {
        icon: L.divIcon({
          html: `<div class="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_cyan]"></div>`,
          className: 'custom-marker-icon'
        })
      });
      mg.addLayer(marker);
    });

    map.addLayer(mg);
    return () => {
      map.removeLayer(mg);
    };
  }, [map, incidents]);

  return null;
};

// Heatmap Layer Component
const HeatmapLayer = ({ incidents }: { incidents: Incident[] }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!map || incidents.length === 0) return;

    const heatPoints = incidents.map(i => {
      const coords = (i.lat && i.lng) 
        ? [i.lat, i.lng] 
        : getLocationCoords(i.location);
      
      const severityMap: Record<string, number> = {
        low: 0.3,
        medium: 0.5,
        high: 0.8,
        critical: 1.0
      };
      const intensity = typeof i.severity === 'string' ? severityMap[i.severity] : (i.severity / 10);
      
      return [...coords, intensity];
    }) as any;

    const heatLayer = (L as any).heatLayer(heatPoints, { 
      radius: 30,
      blur: 20,
      maxZoom: 10,
      gradient: { 0.2: 'green', 0.5: 'yellow', 0.8: 'orange', 1: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, incidents]);

  return null;
};

// Simple coordinate derivation from location strings for demo purposes (FALLBACK)
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
  return [20.5937, 78.9629];
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "#ef4444"; // red-500
    case "high": return "#f97316"; // orange-500
    case "medium": return "#eab308"; // yellow-500
    case "low": return "#10b981"; // emerald-500
    default: return "#94a3b8"; // slate-400
  }
};

export default function MapView({ incidents }: MapViewProps) {
  return (
    <MapContainer 
      center={[20.5937, 78.9629]} 
      zoom={4} 
      style={{ height: "100%", width: "100%", background: "#0B1120" }}
      scrollWheelZoom={false}
      className="rounded-2xl overflow-hidden z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <HeatmapLayer incidents={incidents} />
      <MarkerCluster incidents={incidents} />
      {incidents.map((incident) => {
        const coords: [number, number] = (incident.lat && incident.lng) 
          ? [incident.lat, incident.lng] 
          : getLocationCoords(incident.location);
          
        const color = getSeverityColor(incident.severity);
        
        // Impact radius calculation
        const severityValues: Record<string, number> = { low: 5, medium: 8, high: 12, critical: 20 };
        const radius = (severityValues[incident.severity] || 10) * 10000; // in meters for Circle

        return (
          <React.Fragment key={incident.id}>
            <Circle
              center={coords}
              radius={radius}
              pathOptions={{
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 0.2,
                fillOpacity: 0.1
              }}
            />
            <CircleMarker
              center={coords}
              radius={6}
              pathOptions={{
                fillColor: color,
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
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
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}
