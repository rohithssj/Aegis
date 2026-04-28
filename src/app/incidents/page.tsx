"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  ChevronRight, 
  MapPin, 
  Binary,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { FeedSkeleton } from "@/components/Skeleton";
import { cn, formatTimeAgo } from "@/lib/utils";
import { useIncidents } from "@/context/IncidentContext";
import { toast } from "sonner";
import { Incident } from "@/lib/mockData";

export default function IncidentsPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { incidents, loading: feedLoading, updateIncidentStatus, dismissIncident } = useIncidents();
  
  // Authorization check
  useEffect(() => {
    if (!isAdmin()) {
      router.push("/admin");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Initial selection
  useEffect(() => {
    if (incidents.length > 0 && !selectedId) {
      setSelectedId(incidents[0].id);
    }
  }, [incidents, selectedId]);

  const selectedIncident = incidents.find((inc) => inc.id === selectedId);

  const handleStatusUpdate = async (status: Incident["status"]) => {
    if (!selectedIncident) return;
    await updateIncidentStatus(selectedIncident.id, status);
    toast.success(`Incident state updated to ${status}`);
  };

  const handleDismiss = async () => {
    if (!selectedIncident) return;
    await dismissIncident(selectedIncident.id);
    setSelectedId(null);
  };

  const getStatusStyles = (incident: Incident) => {
    const isCritical = incident.severity === "critical";
    const isResponding = incident.status === "responding";
    const isResolved = incident.status === "resolved";

    if (isCritical) return "bg-red-500/10 border-red-500/30 text-red-400";
    if (isResponding) return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
    if (isResolved) return "bg-green-500/10 border-green-500/30 text-green-400";
    return "bg-white/5 border-transparent text-slate-400";
  };

  const getIndicatorColor = (incident: Incident) => {
    if (incident.severity === "critical") return "bg-red-500";
    if (incident.status === "responding") return "bg-yellow-500";
    if (incident.status === "resolved") return "bg-green-500";
    return "bg-slate-500";
  };

  if (!isAuthorized) return null;

  return (
    <main className="flex-1 flex flex-col md:flex-row h-screen pt-16 overflow-hidden bg-[#05070A] text-white">
      <aside className={cn(
        "w-full md:w-[400px] border-r border-white/5 flex flex-col bg-surface/30 backdrop-blur-md transition-all duration-500",
        selectedId && "hidden md:flex"
      )}>
        <div className="p-8 border-b border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Intelligence</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active Event Stream</p>
            </div>
            <Badge variant="low" className="font-mono text-[9px] px-2">LIVE</Badge>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {feedLoading ? (
             <div className="p-4"><FeedSkeleton count={6} /></div>
          ) : (
            <div className="p-4 space-y-3">
              {incidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedId(incident.id)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl transition-all duration-200 relative group border overflow-hidden",
                    selectedId === incident.id 
                      ? "bg-white/10 border-white/20 shadow-xl" 
                      : cn("hover:bg-white/5", getStatusStyles(incident))
                  )}
                >
                  {/* Left Indicator Bar */}
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1", getIndicatorColor(incident))} />
                  
                  <div className="space-y-4 pl-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold opacity-60 uppercase">{incident.trackingId}</span>
                      <Badge variant={incident.status as any} className="text-[8px] uppercase">{incident.status}</Badge>
                    </div>
                    <h3 className="text-sm font-bold truncate">
                      {incident.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] opacity-60 font-medium">
                       <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3" /> {incident.location}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      <section className={cn(
        "flex-1 overflow-y-auto bg-background md:p-16 p-8 custom-scrollbar transition-all duration-500",
        !selectedId && "hidden md:block"
      )}>
        <AnimatePresence mode="wait">
          {selectedIncident ? (
            <motion.div
              key={selectedIncident.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="max-w-4xl mx-auto space-y-16"
            >
              <div className="md:hidden">
                <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
              </div>

              <div className="space-y-10">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant={selectedIncident.severity as any} className="px-5 py-1 rounded-full uppercase">{selectedIncident.severity}</Badge>
                  <div className="ml-auto flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                    <Binary className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-slate-400 font-mono text-[11px] font-bold">{selectedIncident.id}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                    {selectedIncident.title}
                  </h2>
                  <p className="text-slate-400 text-xl max-w-2xl font-medium italic leading-relaxed">
                    {selectedIncident.description}
                  </p>
                </div>
              </div>

              {/* Intelligence Brief */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Activity className="h-5 w-5 text-purple-400" /> Tactical Intelligence
                  </h3>
                </div>

                <GlassCard className="p-12 border-white/5 relative group rounded-[2.5rem] bg-white/[0.02]" hover={false}>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                       <AlertTriangle className="w-4 h-4 text-amber-500" />
                       Aegis Heuristic Report
                    </div>
                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap font-medium italic text-lg">
                      {selectedIncident.aiNarration || "Aegis AI is monitoring this vector for anomalous patterns. Heuristic evaluation in progress. Primary response units are on standby."}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Threat Risk</p>
                          <p className="text-xl font-bold text-white">{selectedIncident.severity === 'critical' ? 'Elevated' : 'Moderate'}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Confidence</p>
                          <p className="text-xl font-bold text-white">94.2%</p>
                       </div>
                       <div className="hidden md:block">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Protocol</p>
                          <p className="text-xl font-bold text-blue-400">Secure_L6</p>
                       </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Actions */}
              <div className="pt-10 border-t border-white/5 flex flex-wrap gap-4">
                <Button variant="primary" size="lg" className="rounded-full" onClick={() => handleStatusUpdate("analyzing")}>Start Analysis</Button>
                <Button variant="primary" size="lg" className="rounded-full bg-blue-600 shadow-blue-600/20" onClick={() => handleStatusUpdate("responding")}>Start Response</Button>
                <Button variant="primary" size="lg" className="rounded-full bg-emerald-600 shadow-emerald-600/20" onClick={() => handleStatusUpdate("resolved")}>Resolve</Button>
                <Button variant="ghost" className="rounded-full text-slate-500 hover:text-red-400 sm:ml-auto" onClick={handleDismiss}>Dismiss Incident</Button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-6">
              <ShieldCheck className="h-20 w-20 text-slate-500" />
              <p className="text-sm font-bold uppercase tracking-widest">Waiting for neural event selection...</p>
            </div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
