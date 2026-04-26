import { Incident } from "./mockData";

export interface SystemMetrics {
  neuralImpact: number;
  threatIndex: number;
  activeIncidents: number;
  criticalCount: number;
  avgResponseTime: number;
}

export const calculateMetrics = (incidents: Incident[], config: any): SystemMetrics => {
  if (!incidents || incidents.length === 0) {
    return {
      neuralImpact: 0,
      threatIndex: 0,
      activeIncidents: 0,
      criticalCount: 0,
      avgResponseTime: 0
    };
  }

  let totalImpact = 0;
  let threatScore = 0;
  let totalResponseTime = 0;
  let resolvedCount = 0;

  incidents.forEach((incident) => {
    // Severity mapping
    const severityMap: Record<string, number> = {
      low: 3,
      medium: 5,
      high: 8,
      critical: 10
    };
    
    const severity = typeof incident.severity === 'string' ? severityMap[incident.severity] : (incident.severity || 5);
    
    // Neural Impact = severity weighted by config sensitivity
    let impactWeight = 1;
    if (config?.inferenceSensitivity === "enhanced") impactWeight = 1.3;
    if (config?.inferenceSensitivity === "low") impactWeight = 0.8;

    totalImpact += severity * impactWeight;

    // Threat Index logic
    if (severity >= 8) threatScore += 3;
    else if (severity >= 5) threatScore += 2;
    else threatScore += 1;

    // Response time calculation
    if (incident.timeline && incident.timeline.length >= 2) {
      // Find 'Request received' and 'Incident closed' or 'Threat mitigated'
      const startEvent = incident.timeline.find(e => e.status.includes("received") || e.status === "Processing");
      const endEvent = incident.timeline.find(e => e.status.includes("closed") || e.status.includes("mitigated") || e.status === "Resolved");
      
      if (startEvent && endEvent) {
        const start = new Date(startEvent.timestamp).getTime();
        const end = new Date(endEvent.timestamp).getTime();
        const diff = (end - start) / 1000; // seconds
        if (diff > 0) {
          totalResponseTime += diff;
          resolvedCount++;
        }
      }
    }
  });

  const neuralImpact = Math.min(100, Math.round((totalImpact / (incidents.length * 10)) * 100));
  const threatIndex = Math.min(10, threatScore);

  return {
    neuralImpact,
    threatIndex,
    activeIncidents: incidents.filter(i => i.status !== "resolved").length,
    criticalCount: incidents.filter(i => i.severity === "critical" || (typeof i.severity === 'number' && i.severity >= 8)).length,
    avgResponseTime: resolvedCount > 0 ? Math.round(totalResponseTime / resolvedCount) : 0
  };
};
