export interface TimelineEvent {
  status: string;
  time: string;
  message: string;
}

export interface Incident {
  id: string;
  trackingId: string;
  type?: string;
  userId?: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "processing" | "analyzing" | "responding" | "resolved" | "dismissed";
  timestamp: string;
  createdAt: string;
  location: string;
  description: string;
  aiAnalysis?: string;
  aiUnit?: string;
  aiRisk?: string;
  aiScore?: number;
  aiConfidence?: number;
  aiPriority?: string;
  timeline?: TimelineEvent[];
  lastUpdated?: string;
  assignedUnit?: string;
  logs?: {
    message: string;
    timestamp: string;
  }[];
  neuralImpact: number;
  actionTaken?: string;
  isIsolated?: boolean;
  dismissed?: boolean;
  lat?: number;
  lng?: number;
  aiExplanation?: string;
  aiFactors?: string[];
  origin?: string;
  threatScore?: number;
}

export interface MetricPoint {
  time: string;
  value: number;
  expected: number;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    trackingId: "AEG-1101",
    title: "Neural Firewall Breach Attempt",
    severity: "critical",
    status: "resolved",
    timestamp: "2026-04-17T22:15:00Z",
    createdAt: "2026-04-17T22:15:00Z",
    location: "Sector 7-G / Core Node",
    description: "Unauthorized access attempt detected on the primary neural firewall. Behavioral patterns suggest an adaptive adversarial agent.",
    aiAnalysis: "The intruder is utilizing a polymorphic decryption algorithm. Aegis AI recommends immediate isolation of Node 7-G and deployment of the tactical counter-response protocol.",
    timeline: [
      { status: "Request received", time: "2026-04-17T22:15:00Z", message: "Signal captured via global sensor array." },
      { status: "AI evaluating scenario", time: "2026-04-17T22:18:00Z", message: "Neural engine processing vector data." },
      { status: "Units dispatched", time: "2026-04-17T22:20:00Z", message: "Tactical response units deployed." },
      { status: "Incident closed", time: "2026-04-17T22:45:00Z", message: "Threat mitigated." }
    ],
    lastUpdated: "2026-04-17T22:45:00Z",
    neuralImpact: 88,
  },
  {
    id: "INC-002",
    trackingId: "AEG-1102",
    title: "Data Ingress Latency Spike",
    severity: "high",
    status: "resolved",
    timestamp: "2026-04-17T21:40:00Z",
    createdAt: "2026-04-17T21:40:00Z",
    location: "Oceanic Gateway / APAC",
    description: "Intermittent packet loss and significant latency increases across the APAC oceanic fiber routes.",
    aiAnalysis: "Latency spikes correlate with seismic activity in the Philippine Sea. Reroute traffic via the Arctic backbone to maintain stability.",
    timeline: [
      { status: "Request received", time: "2026-04-17T21:40:00Z", message: "Packet loss detected." },
      { status: "AI evaluating scenario", time: "2026-04-17T21:42:00Z", message: "Seismic correlation confirmed." },
      { status: "Units dispatched", time: "2026-04-17T21:45:00Z", message: "Rerouting traffic via Arctic backbone." },
      { status: "Incident closed", time: "2026-04-17T22:10:00Z", message: "System stability restored." }
    ],
    lastUpdated: "2026-04-17T22:10:00Z",
    neuralImpact: 45,
  },
  {
    id: "INC-003",
    trackingId: "AEG-1103",
    title: "Anomalous CPU Load Distribution",
    severity: "medium",
    status: "resolved",
    timestamp: "2026-04-17T20:10:00Z",
    createdAt: "2026-04-17T20:10:00Z",
    location: "Edge Computing Cluster / EU-West",
    description: "Unexpected load balancing behavior in the European edge nodes. Some nodes are operating at 95% while others remain idle.",
    aiAnalysis: "Scheduler logic anomaly detected. Re-syncing node state with the central orchestrator should resolve the imbalance.",
    timeline: [
      { status: "Request received", time: "2026-04-17T20:10:00Z", message: "Load imbalance detected." },
      { status: "AI evaluating scenario", time: "2026-04-17T20:15:00Z", message: "Scheduler logic anomaly analyzed." },
      { status: "Incident closed", time: "2026-04-17T20:45:00Z", message: "Node state re-synced." }
    ],
    lastUpdated: "2026-04-17T20:45:00Z",
    neuralImpact: 12,
  },
  {
    id: "INC-004",
    trackingId: "AEG-1104",
    title: "Backup Integrity Check Failed",
    severity: "low",
    status: "resolved",
    timestamp: "2026-04-17T18:30:00Z",
    createdAt: "2026-04-17T18:30:00Z",
    location: "Secondary Vault / Lunar Edge",
    description: "Routine checksum verification failed for the secondary backup archives on the Lunar edge station.",
    aiAnalysis: "Cosmic ray interference suspected. Initiate a deep-scrub repair and re-verify integrity from the primary vault.",
    timeline: [
      { status: "Request received", time: "2026-04-17T18:30:00Z", message: "Integrity check failure logged." },
      { status: "Incident closed", time: "2026-04-17T19:00:00Z", message: "Scrub repair complete." }
    ],
    lastUpdated: "2026-04-17T19:00:00Z",
    neuralImpact: 5,
  },
];

export const mockDataService = {
  getIncidents: async (): Promise<Incident[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_INCIDENTS;
  },

  getIncidentById: async (id: string): Promise<Incident | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_INCIDENTS.find((inc) => inc.id === id);
  },

  getMetrics: async (type: string): Promise<MetricPoint[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const points: MetricPoint[] = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600000);
      const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const baseValue = type === "load" ? 60 : 20;
      points.push({
        time,
        value: baseValue + Math.random() * 30,
        expected: baseValue + 10,
      });
    }
    return points;
  },
};
