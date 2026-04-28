"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Incident } from "@/lib/mockData";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

interface MapViewProps {
  incidents: Incident[];
}

// Proximity-based grouping (Radius ~0.01)
const groupIncidents = (incidents: Incident[]) => {
  const groups: Record<string, { 
    lat: number; 
    lng: number; 
    count: number; 
    criticalCount: number; 
    mediumCount: number; 
    lowCount: number; 
    items: Incident[] 
  }> = {};

  incidents.forEach(inc => {
    if (!inc.lat || !inc.lng) return;
    
    // Bucket by 0.01 precision
    const latBucket = Math.round(inc.lat * 100) / 100;
    const lngBucket = Math.round(inc.lng * 100) / 100;
    const key = `${latBucket},${lngBucket}`;

    if (!groups[key]) {
      groups[key] = { 
        lat: latBucket, 
        lng: lngBucket, 
        count: 0, 
        criticalCount: 0, 
        mediumCount: 0, 
        lowCount: 0, 
        items: [] 
      };
    }

    groups[key].count++;
    if (inc.severity === "critical") groups[key].criticalCount++;
    else if (inc.severity === "medium") groups[key].mediumCount++;
    else groups[key].lowCount++;
    groups[key].items.push(inc);
  });

  return Object.values(groups);
};

export default function MapView({ incidents }: MapViewProps) {
  const groupedData = useMemo(() => groupIncidents(incidents), [incidents]);

  const createClusterIcon = (cluster: any) => {
    let colorClass = "bg-emerald-500/80 shadow-[0_0_15px_#10b981]";
    if (cluster.criticalCount > 0) colorClass = "bg-red-500/80 shadow-[0_0_15px_#ef4444]";
    else if (cluster.mediumCount > 0) colorClass = "bg-yellow-500/80 shadow-[0_0_15px_#eab308]";

    const size = Math.min(60, 32 + cluster.count * 2);

    return L.divIcon({
      html: `<div class="marker ${colorClass} rounded-full border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-white backdrop-blur-sm" style="width: ${size}px; height: ${size}px;">${cluster.count}</div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(size, size)
    });
  };

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
      
      {groupedData.map((cluster, idx) => (
        <Marker 
          key={idx} 
          position={[cluster.lat, cluster.lng]}
          icon={createClusterIcon(cluster)}
        >
          <Popup className="custom-popup">
            <div className="p-3 min-w-[200px] bg-[#0F172A] text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sector Activity</span>
                <Badge variant={cluster.criticalCount > 0 ? "critical" : (cluster.mediumCount > 0 ? "medium" : "low")}>{cluster.count} Events</Badge>
              </div>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {cluster.items.map((inc) => (
                  <div key={inc.id} className="text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold truncate flex-1">{inc.title}</h4>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full ml-2",
                        inc.severity === 'critical' ? 'bg-red-500' : (inc.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500')
                      )} />
                    </div>
                    <p className="text-[9px] text-slate-500 truncate">{inc.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
