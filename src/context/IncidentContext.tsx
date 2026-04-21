"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Incident, mockDataService } from "@/lib/mockData";

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, "id" | "title" | "timestamp" | "aiAnalysis" | "neuralImpact"> & { type: string }) => void;
  loading: boolean;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider = ({ children }: { children: ReactNode }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    mockDataService.getIncidents().then((data) => {
      setIncidents(data);
      setLoading(false);
    });
  }, []);

  const addIncident = (newIncidentData: Omit<Incident, "id" | "title" | "timestamp" | "aiAnalysis" | "neuralImpact"> & { type: string }) => {
    // Modular AI Generator placeholder
    const generateAISummary = (type: string, severity: string) => {
      const themes = {
        "Cyber Attack": "Neural infiltration detected. Recommend immediate isolation of affected nodes.",
        "Fire": "Thermal escalation in progress. Tactical suppression systems engaged.",
        "Flood": "Gateway breach imminent. Reroute traffic and deploy physical containment.",
        "Earthquake": "Seismic variance detected. Structural integrity compromised in local edge clusters.",
        "Other": "Anomalous event pattern. Aegis AI is monitoring for further deviations."
      };
      
      const tone = {
        critical: " CRITICAL: Immediate response required.",
        high: " Warning: High priority event.",
        medium: " Advisory: Monitoring recommended.",
        low: " Note: Minor anomaly detected."
      };

      return (themes[type as keyof typeof themes] || themes["Other"]) + (tone[severity as keyof typeof tone] || "");
    };

    const impactScores = {
      critical: 85 + Math.floor(Math.random() * 15),
      high: 60 + Math.floor(Math.random() * 20),
      medium: 30 + Math.floor(Math.random() * 25),
      low: 5 + Math.floor(Math.random() * 20)
    };

    const newIncident: Incident = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      title: `${newIncidentData.type} Detection`,
      status: newIncidentData.status,
      timestamp: new Date().toISOString(),
      location: newIncidentData.location,
      description: newIncidentData.description,
      aiAnalysis: generateAISummary(newIncidentData.type, newIncidentData.status),
      neuralImpact: impactScores[newIncidentData.status]
    };

    setIncidents((prev) => [newIncident, ...prev]);
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident, loading }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error("useIncidents must be used within an IncidentProvider");
  }
  return context;
};
