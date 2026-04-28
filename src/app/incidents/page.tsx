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
  AlertTriangle,
  Zap
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
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { incidents, loading: feedLoading, updateIncidentStatus, dismissIncident } = useIncidents();
  
  // Authorization check
  useEffect(() => {
    const checkAuth = async () => {
      const admin = isAdmin();
      if (!admin) {
        router.replace("/admin");
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
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

  const sanitizeAiText = (text: string | undefined) => {
    if (!text) return null;
    
    // Remove markdown symbols (*, #, `)
    const cleaned = text
      .replace(/[*#`]/g, "")
      // Collapse multiple spaces/newlines into one
      .replace(/\s+/g, " ")
      .trim()
      // Limit length to ~200 chars
      .slice(0, 200);

    return cleaned;
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

  if (!isAuthorized) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#05070A]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Validating Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col md:flex-row h-screen pt-16 overflow-hidden bg-[#05070A] text-white">
      <aside className={cn(
        "w-full md:w-[400px] border-r border-white/5 flex flex-col bg-surface/30 backdrop-blur-md transition-all duration-500 h-screen overflow-y-auto pr-2 custom-scrollbar",
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

        <div className="p-4 space-y-3">
          {feedLoading ? (
             <FeedSkeleton count={6} />
          ) : (
            incidents.map((incident) => (
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
            ))
          )}
        </div>
      </aside>

      <section className={cn(
        "flex-1 bg-background transition-all duration-500 h-[calc(100vh-64px)] overflow-hidden",
        !selectedId && "hidden md:block"
      )}>
        <div className="h-full overflow-y-auto p-8 md:p-16 custom-scrollbar pr-2 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="wait">
            {selectedIncident ? (
              <motion.div
                key={selectedIncident.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                <div className="md:hidden mb-8">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge variant={selectedIncident.severity as any} className="px-5 py-1 rounded-full uppercase text-[10px] tracking-widest">{selectedIncident.severity}</Badge>
                    <div className="ml-auto flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                      <Binary className="h-3.5 w-3.5 text-blue-400" />
                      <span className="text-slate-400 font-mono text-[11px] font-bold">{selectedIncident.id}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                      {selectedIncident.title}
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl font-medium italic leading-relaxed">
                      {selectedIncident.description}
                    </p>
                  </div>
                </div>

                {/* Intelligence Brief */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-3">
                      <Activity className="h-5 w-5 text-purple-400" /> Tactical Intelligence
                    </h3>
                  </div>

                  <AnimatePresence mode="wait">
                    {isAiLoading ? (
                      <motion.div 
                        key="shimmer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 space-y-4"
                      >
                         <div className="flex items-center gap-3 mb-4">
                           <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                           <span className="text-[10px] uppercase tracking-wide text-white/50">Synthesizing Tactical Data...</span>
                         </div>
                         <div className="space-y-3">
                           <div className="h-3 bg-white/10 rounded w-full animate-pulse" />
                           <div className="h-3 bg-white/10 rounded w-[95%] animate-pulse" />
                           <div className="h-3 bg-white/10 rounded w-[85%] animate-pulse" />
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.1)] relative group"
                      >
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                           <Binary className="w-5 h-5 text-purple-400" />
                           <span className="text-[10px] uppercase tracking-wide text-white/50">Aegis Heuristic Report</span>
                        </div>
                        <p className="text-lg leading-relaxed text-white/80 italic font-medium max-w-[95%]">
                          {(() => {
                            const cleaned = sanitizeAiText(selectedIncident.aiNarration);
                            const isInvalid = !cleaned || 
                              cleaned.toLowerCase().includes("ai busy") || 
                              cleaned.toLowerCase().includes("fallback") || 
                              cleaned.toLowerCase().includes("cached");
                            
                            return !isInvalid 
                              ? cleaned 
                              : "Click Execute Response to generate tactical intelligence.";
                          })()}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 mt-8 border-t border-white/5">
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="pt-8 border-t border-white/5 flex flex-col gap-6">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical AI Analysis</p>
                    <Button 
                      variant="primary" 
                      className="w-full h-14 rounded-2xl" 
                      disabled={isAiLoading}
                      onClick={async () => {
                        if (!selectedIncident || isAiLoading) return;
                        setIsAiLoading(true);
                        try {
                          const { doc, updateDoc } = await import("firebase/firestore");
                          const { db } = await import("@/lib/firebase");
                          
                          const res = await fetch("/api/ai", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ incident: selectedIncident })
                          });

                          const data = await res.json();
                          if (data.text) {
                            await updateDoc(doc(db, "incidents", selectedIncident.id), {
                              aiNarration: data.text,
                              lastUpdated: new Date().toISOString()
                            });
                          }
                        } catch (err) {
                          console.error("AI Synthesis Error:", err);
                        } finally {
                          setIsAiLoading(false);
                        }
                      }}
                    >
                      <Zap className="w-4 h-4 mr-2" /> {isAiLoading ? "PROCESSING..." : "Execute AI Synthesis"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" size="lg" className="rounded-full" onClick={() => handleStatusUpdate("analyzing")}>Start Analysis</Button>
                    <Button variant="primary" size="lg" className="rounded-full bg-blue-600 shadow-blue-600/20" onClick={() => handleStatusUpdate("responding")}>Start Response</Button>
                    <Button variant="primary" size="lg" className="rounded-full bg-emerald-600 shadow-emerald-600/20" onClick={() => handleStatusUpdate("resolved")}>Resolve</Button>
                    <Button variant="ghost" className="rounded-full text-slate-500 hover:text-red-400 sm:ml-auto" onClick={handleDismiss}>Dismiss Incident</Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-6">
                <ShieldCheck className="h-20 w-20 text-slate-500" />
                <p className="text-sm font-bold uppercase tracking-widest">Waiting for neural event selection...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
