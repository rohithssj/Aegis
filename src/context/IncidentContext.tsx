"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc,
  writeBatch
} from "firebase/firestore";
import { Incident } from "@/lib/mockData";

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (incident: { type: string; severity: "low" | "medium" | "high" | "critical"; location: string; description: string }) => Promise<string>;
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<void>;
  updateIncidentStatus: (id: string, status: Incident["status"]) => Promise<void>;
  dismissIncident: (id: string) => Promise<void>;
  triggerEmergencyProtocol: () => Promise<void>;
  isEmergency: boolean;
  loading: boolean;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider = ({ children }: { children: ReactNode }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmergency, setIsEmergency] = useState(false);

  // Real-time listener for incidents
  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incidentData: Incident[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamp to ISO string for the frontend state if needed, 
        // or just keep it as is if Incident interface supports Date/Timestamp.
        // The Incident interface currently uses string for timestamp/createdAt.
        // I will map them to ISO strings here for UI compatibility.
        incidentData.push({ 
          id: doc.id, 
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        } as Incident);
      });
      setIncidents(incidentData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync isEmergency based on active incidents
  useEffect(() => {
    const hasEmergency = incidents.some(inc => inc.severity === "critical" && inc.status === "responding");
    if (hasEmergency !== isEmergency) {
      setIsEmergency(hasEmergency);
    }
  }, [incidents, isEmergency]);

  const triggerEmergencyProtocol = async () => {
    setIsEmergency(true);
    const batch = writeBatch(db);
    
    incidents.forEach((incident) => {
      if (incident.status !== "dismissed") {
        const docRef = doc(db, "incidents", incident.id);
        batch.update(docRef, {
          status: "responding",
          severity: "critical",
          neuralImpact: Math.max(incident.neuralImpact, 90)
        });
      }
    });
    
    await batch.commit();
  };

  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    const docRef = doc(db, "incidents", id);
    await updateDoc(docRef, updates);
  };

  const updateIncidentStatus = async (id: string, status: Incident["status"]) => {
    const docRef = doc(db, "incidents", id);
    await updateDoc(docRef, { status });
  };

  const dismissIncident = async (id: string) => {
    const docRef = doc(db, "incidents", id);
    await updateDoc(docRef, { 
      status: "dismissed", 
      dismissed: true 
    });
  };

  const addIncident = async (newIncidentData: { type: string; severity: "low" | "medium" | "high" | "critical"; location: string; description: string }) => {
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

    const trackingId = `AEG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newIncidentBase = {
      trackingId,
      title: `${newIncidentData.type} Detection`,
      severity: isEmergency ? "critical" : newIncidentData.severity,
      status: (isEmergency ? "responding" : "processing") as any,
      timestamp: new Date(),
      createdAt: new Date(),
      location: newIncidentData.location,
      description: newIncidentData.description,
      aiAnalysis: generateAISummary(newIncidentData.type, isEmergency ? "critical" : newIncidentData.severity),
      neuralImpact: isEmergency ? 95 : impactScores[newIncidentData.severity],
      dismissed: false
    };

    const docRef = await addDoc(collection(db, "incidents"), newIncidentBase);
    return docRef.id;
  };

  return (
    <IncidentContext.Provider value={{ 
      incidents: incidents.filter(i => !i.dismissed), 
      addIncident, 
      updateIncident,
      updateIncidentStatus,
      dismissIncident,
      triggerEmergencyProtocol,
      isEmergency,
      loading 
    }}>
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
