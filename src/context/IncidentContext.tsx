"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Incident, mockDataService } from "@/lib/mockData";

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (incident: { type: string; severity: "low" | "medium" | "high" | "critical"; location: string; description: string }) => string;
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

  const addIncident = (newIncidentData: { type: string; severity: "low" | "medium" | "high" | "critical"; location: string; description: string }) => {
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

    const newId = `AEG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newIncident: Incident = {
      id: newId,
      title: `${newIncidentData.type} Detection`,
      severity: newIncidentData.severity,
      status: "processing",
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      location: newIncidentData.location,
      description: newIncidentData.description,
      aiAnalysis: generateAISummary(newIncidentData.type, newIncidentData.severity),
      neuralImpact: impactScores[newIncidentData.severity]
    };

    setIncidents((prev) => [newIncident, ...prev]);

    // Live Status Engine - Lifecycle Simulation
    const updateStatus = (status: "analyzing" | "responding" | "resolved", delay: number) => {
      setTimeout(() => {
        setIncidents(prev => prev.map(inc => 
          inc.id === newId ? { ...inc, status } : inc
        ));
      }, delay);
    };

    updateStatus("analyzing", 3000);
    updateStatus("responding", 6000);
    updateStatus("resolved", 10000);

    return newId;
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
