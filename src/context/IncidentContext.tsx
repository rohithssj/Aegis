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
  getDoc,
  writeBatch,
  arrayUnion
} from "firebase/firestore";
import { Incident, TimelineEvent } from "@/lib/mockData";
import { 
  calculateNeuralImpact, 
  getTransmissionOrigin, 
  createInitialTimeline 
} from "@/lib/utils";

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (incident: { 
    type: string; 
    severity: "low" | "medium" | "high" | "critical"; 
    location: string; 
    description: string;
    aiUnit?: string;
    aiRisk?: string;
    aiScore?: number;
    aiConfidence?: number;
    aiPriority?: string;
    aiAnalysis?: string;
    aiFactors?: string[];
    aiExplanation?: string;
    aiMitigation?: string;
    aiNarration?: string;
    aiExplanationText?: string;
    lat?: number;
    lng?: number;
    neuralImpact?: number;
    origin?: string;
    threatScore?: number;
  }) => Promise<string>;
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<void>;
  updateIncidentStatus: (id: string, status: Incident["status"]) => Promise<void>;
  dismissIncident: (id: string) => Promise<void>;
  addIncidentLog: (id: string, message: string) => Promise<void>;
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

  // Sync isEmergency from Firebase config
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "config", "globalSettings"), (snap) => {
      const data = snap.data();
      if (data && typeof data.emergencyMode === 'boolean') {
        setIsEmergency(data.emergencyMode);
      }
    });
    return () => unsubscribe();
  }, []);

  const triggerEmergencyProtocol = async () => {
    // Update global config
    await updateDoc(doc(db, "config", "globalSettings"), {
      emergencyMode: true
    });
    
    const batch = writeBatch(db);
    incidents.forEach((inc) => {
      if (inc.status === "processing" || inc.status === "analyzing") {
        const docRef = doc(db, "incidents", inc.id);
        const now = new Date().toISOString();
        const newEvent: TimelineEvent = {
          status: "Responding",
          time: now,
          message: "Tactical units dispatched via global emergency protocol"
        };
        batch.update(docRef, { 
          status: "responding",
          lastUpdated: now,
          timeline: arrayUnion(newEvent)
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
    const now = new Date().toISOString();

    const newEvent: TimelineEvent = {
      status: status.charAt(0).toUpperCase() + status.slice(1),
      time: now,
      message:
        status === "analyzing"
          ? "AI evaluating scenario"
          : status === "responding"
          ? "Units dispatched"
          : status === "resolved"
          ? "Incident resolved"
          : "Status updated"
    };

    await updateDoc(docRef, { 
      status,
      lastUpdated: now,
      timeline: arrayUnion(newEvent)
    });
  };

  const addIncidentLog = async (id: string, message: string) => {
    const docRef = doc(db, "incidents", id);
    await updateDoc(docRef, {
      logs: arrayUnion({
        message,
        timestamp: new Date().toISOString()
      })
    });
  };

  const dismissIncident = async (id: string) => {
    const docRef = doc(db, "incidents", id);
    await updateDoc(docRef, { 
      status: "dismissed", 
      dismissed: true 
    });
  };

  const addIncident = async (newIncidentData: { 
    type: string; 
    severity: "low" | "medium" | "high" | "critical"; 
    location: string; 
    description: string;
    aiUnit?: string;
    aiRisk?: string;
    aiScore?: number;
    aiConfidence?: number;
    aiPriority?: string;
    aiAnalysis?: string;
    aiFactors?: string[];
    aiExplanation?: string;
    aiMitigation?: string;
    aiNarration?: string;
    aiExplanationText?: string;
    lat?: number;
    lng?: number;
    neuralImpact?: number;
    origin?: string;
    threatScore?: number;
  }) => {
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

    const trackingId = `AEG-${Math.floor(1000 + Math.random() * 9000)}`;

    // ALL user-submitted incidents MUST start at "processing" status
    // Manual overrides only allowed by admin actions
    const status = "processing";

    const newIncidentBase = {
      trackingId,
      type: newIncidentData.type,
      title: `${newIncidentData.type} Detection`,
      severity: isEmergency ? "critical" : newIncidentData.severity,
      status,
      timestamp: new Date(),
      createdAt: new Date(),
      location: newIncidentData.location,
      description: newIncidentData.description,
      aiAnalysis: newIncidentData.aiAnalysis || generateAISummary(newIncidentData.type, isEmergency ? "critical" : newIncidentData.severity),
      aiUnit: newIncidentData.aiUnit || "Determining...",
      aiRisk: newIncidentData.aiRisk || "Analyzing...",
      aiScore: newIncidentData.aiScore || 0,
      aiConfidence: newIncidentData.aiConfidence || 0,
      aiPriority: newIncidentData.aiPriority || "P3",
      aiFactors: newIncidentData.aiFactors || [],
      aiExplanation: newIncidentData.aiExplanation || "Direct tactical allocation based on current neural load.",
      aiMitigation: newIncidentData.aiMitigation || "",
      aiNarration: newIncidentData.aiNarration || "",
      aiExplanationText: newIncidentData.aiExplanationText || "",
      lat: newIncidentData.lat,
      lng: newIncidentData.lng,
      neuralImpact: newIncidentData.neuralImpact || calculateNeuralImpact(newIncidentData.severity, newIncidentData.aiScore),
      origin: newIncidentData.origin || getTransmissionOrigin(newIncidentData.type),
      threatScore: newIncidentData.threatScore || 0,
      timeline: createInitialTimeline(),
      lastUpdated: new Date().toISOString(),
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
      addIncidentLog,
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
