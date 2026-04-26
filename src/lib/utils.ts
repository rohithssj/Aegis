import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string | undefined): string {
  if (!dateString) return "No data";
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export const calculateNeuralImpact = (severity: "critical" | "high" | "medium" | "low" | number, aiScore?: number) => {
  let severityNum = 5;
  if (typeof severity === "string") {
    const map = { critical: 10, high: 8, medium: 5, low: 3 };
    severityNum = map[severity] || 5;
  } else {
    severityNum = severity;
  }
  
  const base = severityNum * 10;
  const bonus = aiScore ? Math.min(aiScore / 2, 20) : 0;
  return Math.min(100, Math.round(base + bonus));
};

export const getTransmissionOrigin = (type: string) => {
  switch (type?.toLowerCase()) {
    case "fire":
      return "IOT_SENSOR_GRID";
    case "cyber":
    case "cyber attack":
      return "CYBER_DEFENSE_NODE";
    case "flood":
      return "SATELLITE_MONITORING_SYSTEM";
    case "medical":
      return "EMERGENCY_CALL_CENTER";
    default:
      return "USER_INPUT_PORTAL";
  }
};

export const createInitialTimeline = () => {
  return [
    {
      status: "Processing",
      timestamp: new Date().toISOString(),
      description: "Request received and logged into system"
    }
  ];
};
