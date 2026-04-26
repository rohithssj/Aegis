import { Incident } from "./mockData";

export interface PredictiveAlert {
  id: string;
  type: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
}

export const generateAlerts = (incidents: Incident[], config: any): PredictiveAlert[] => {
  const alerts: PredictiveAlert[] = [];
  const now = new Date();

  // 1. Critical Trend Detection
  const recentHours = config?.predictiveHorizon || 6;
  const recentIncidents = incidents.filter(i => {
    const age = (now.getTime() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60);
    return age <= recentHours;
  });

  const highSeverityCount = recentIncidents.filter(i => i.severity === "critical" || i.severity === "high").length;
  
  // Sensitivity affects threshold
  let threshold = 3;
  if (config?.inferenceSensitivity === "enhanced") threshold = 2;
  if (config?.inferenceSensitivity === "low") threshold = 5;

  if (highSeverityCount >= threshold) {
    alerts.push({
      id: "alert-trend",
      type: "CRITICAL TREND",
      message: `Spike in high-severity incidents detected within the last ${recentHours}h.`,
      severity: "critical",
      timestamp: now.toISOString()
    });
  }

  // 2. Type Concentration (e.g. Cyber cluster)
  const types = ["Cyber Attack", "Flood", "Fire"];
  types.forEach(type => {
    const typeCount = recentIncidents.filter(i => i.type === type).length;
    if (typeCount >= 2) {
      alerts.push({
        id: `alert-type-${type}`,
        type: "NODE CONCENTRATION",
        message: `Unusual cluster of ${type} events detected in regional grid.`,
        severity: "high",
        timestamp: now.toISOString()
      });
    }
  });

  // 3. System Load Alert
  const totalWeight = recentIncidents.reduce((acc, i) => {
    const map: Record<string, number> = { low: 1, medium: 2, high: 4, critical: 8 };
    return acc + (map[i.severity as string] || 1);
  }, 0);

  if (totalWeight > 20) {
    alerts.push({
      id: "alert-load",
      type: "SYSTEM CAPACITY",
      message: "Regional response capacity approaching threshold. Consider activating Alpha protocols.",
      severity: "medium",
      timestamp: now.toISOString()
    });
  }

  return alerts;
};
