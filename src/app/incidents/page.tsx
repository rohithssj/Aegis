"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Activity,
  ShieldAlert,
  Search,
  Hash,
  Binary,
  Layers,
  ShieldCheck,
  PackageSearch
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { FeedSkeleton } from "@/components/Skeleton";
import { cn } from "@/lib/utils";
import { useIncidents } from "@/context/IncidentContext";
import { toast } from "sonner";
import { Incident } from "@/lib/mockData";

export default function IncidentsPage() {
  const router = useRouter();
  const { incidents, loading, updateIncident, dismissIncident } = useIncidents();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Route protection
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Set initial selection once incidents arrive
  useEffect(() => {
    if (incidents.length > 0 && !selectedId) {
      setSelectedId(incidents[0].id);
    }
  }, [incidents, selectedId]);

  const selectedIncident = incidents.find((inc) => inc.id === selectedId);

  const STATUS_ORDER = ["processing", "analyzing", "responding", "resolved"];
  const currentIdx = selectedIncident ? STATUS_ORDER.indexOf(selectedIncident.status) : -1;

  const handleStatusUpdate = async (status: Incident["status"]) => {
    if (!selectedIncident) return;
    await updateIncident(selectedIncident.id, { status });
    toast.success(`Incident state updated`, {
      description: `${selectedIncident.trackingId} is now in ${status} state.`,
    });
  };

  const handleDismiss = async () => {
    if (!selectedIncident) return;
    toast("Intelligence dismissed", {
      description: `Incident ${selectedIncident.trackingId} moved to archive.`,
    });
    await dismissIncident(selectedIncident.id);
    setSelectedId(null);
  };

  if (!isAuthorized) return null;

  return (
    <main className="flex-1 flex flex-col md:flex-row h-screen pt-16 overflow-hidden bg-background">
      {/* LEFT: Incident Feed (400px fixed) */}
      <aside className="w-full md:w-[400px] border-r border-white/5 flex flex-col bg-surface/30 backdrop-blur-md">
        <div className="p-6 border-b border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Intelligence</h1>
              <p className="label-text mb-0 mt-0.5">Active Event Stream</p>
            </div>
            <Badge variant="low" className="font-mono text-[9px] px-2">LIVE</Badge>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 group-focus-within:text-accent-indigo transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by hash..." 
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2 pl-9 pr-4 text-[11px] font-mono text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-accent-indigo/20 focus:bg-white/[0.04] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="p-4">
               <FeedSkeleton count={6} />
             </div>
          ) : incidents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-50">
              <PackageSearch className="h-10 w-10 text-slate-600" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">No incidents detected</p>
                <p className="text-[10px] text-slate-500 font-medium">System is operating normally</p>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-1.5">
              {incidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedId(incident.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden group/item",
                    selectedId === incident.id 
                      ? "bg-white/[0.08] border border-white/[0.05] shadow-lg translate-x-1" 
                      : "bg-transparent border border-transparent hover:bg-white/[0.02] hover:translate-x-1"
                  )}
                >
                  <div className="space-y-4">
                    {incident.isIsolated && (
                      <div className="absolute top-0 right-0 p-2 opacity-20">
                        <Activity className="h-12 w-12 text-slate-500" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-slate-600" />
                        <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase">{incident.trackingId}</span>
                      </div>
                      <div className={cn(
                        "px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider",
                        incident.status === 'processing' ? 'text-slate-400 bg-slate-400/10' :
                        incident.status === 'analyzing' ? 'text-accent-cyan bg-accent-cyan/10' :
                        incident.status === 'responding' ? 'text-accent-indigo bg-accent-indigo/10' :
                        'text-emerald-500 bg-emerald-500/10'
                      )}>
                        {incident.status}
                      </div>
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-xs font-bold transition-colors leading-snug truncate pr-6",
                        selectedId === incident.id ? "text-white" : "text-slate-400 group-hover/item:text-slate-200"
                      )}>
                        {incident.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={incident.severity as any} dot={true} className="text-[9px] px-0 py-0 bg-transparent uppercase border-none">{incident.severity}</Badge>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-600">
                          <Clock className="h-3 w-3" />
                          {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-300", selectedId === incident.id ? "translate-x-0.5 text-accent-indigo" : "text-slate-700")} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT: Incident Detail Area */}
      <section className="flex-1 overflow-y-auto bg-background md:p-16 p-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedIncident ? (
            <motion.div
              key={selectedIncident.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn("max-w-4xl mx-auto space-y-16 animate-in", selectedIncident.isIsolated && "opacity-80 scale-[0.99] grayscale-[0.2]")}
            >
              {/* Header Info */}
              <div className="space-y-10">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant={selectedIncident.severity as any} className="px-5 py-0.5 text-[10px] tracking-[0.1em] font-bold rounded-full uppercase">{selectedIncident.severity} priority</Badge>
                  <div className={cn(
                    "px-4 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                    selectedIncident.status === 'processing' ? 'text-slate-400 bg-slate-400/10' :
                    selectedIncident.status === 'analyzing' ? 'text-accent-cyan bg-accent-cyan/10' :
                    selectedIncident.status === 'responding' ? 'text-accent-indigo bg-accent-indigo/10' :
                    'text-emerald-500 bg-emerald-500/10'
                  )}>
                    {selectedIncident.status !== 'resolved' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]" />}
                    {selectedIncident.status}
                  </div>
                  {selectedIncident.isIsolated && (
                    <Badge variant="neutral" className="bg-slate-500/10 text-slate-400 border-white/5 font-mono text-[9px] px-3">ISOLATED</Badge>
                  )}
                  {selectedIncident.actionTaken && (
                    <Badge variant="low" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono text-[9px] px-3">COUNTER_MEASURES_DEPLOYED</Badge>
                  )}
                  <span className="text-slate-700 font-mono text-xs tracking-widest ml-auto">/</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.05] rounded-full">
                    <Binary className="h-3 w-3 text-accent-cyan" />
                    <span className="text-slate-400 font-mono text-[10px] font-bold tracking-widest leading-none lowercase">{selectedIncident.id}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] pr-4">
                    {selectedIncident.title}
                  </h2>
                  <p className="text-slate-400 text-lg max-w-2xl font-medium italic">
                    {selectedIncident.description}
                  </p>
                </div>
                
                {/* STATUS TIMELINE */}
                <div className="bg-white/[0.01] border border-white/[0.04] p-8 rounded-[2rem] space-y-8">
                   <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Incident Lifecycle</h3>
                      <span className="text-[10px] font-mono font-bold text-accent-cyan">AEGIS_REALTIME_SYNC</span>
                   </div>
                   <div className="flex justify-between relative px-2">
                     {/* Connector Line */}
                     <div className="absolute top-3 left-0 right-0 h-[1px] bg-white/5 -z-0 mx-8" />
                     {["processing", "analyzing", "responding", "resolved"].map((step, idx, arr) => {
                       const isCurrent = step === selectedIncident.status;
                       const isPast = arr.indexOf(selectedIncident.status) >= idx;
                       return (
                         <div key={step} className="flex flex-col items-center gap-4 relative z-10">
                            <div className={cn(
                              "w-6 h-6 rounded-full border-4 border-background transition-all duration-500 flex items-center justify-center",
                              isCurrent ? "bg-accent-indigo scale-125 shadow-[0_0_15px_rgba(91,76,240,0.4)]" : 
                              isPast ? "bg-accent-indigo/40" : "bg-white/5"
                            )}>
                              {isPast && !isCurrent && <ShieldCheck className="w-3 h-3 text-white/50" />}
                            </div>
                            <span className={cn(
                              "text-[10px] font-mono uppercase tracking-widest transition-colors duration-500",
                              isCurrent ? "text-white font-bold" : isPast ? "text-slate-500" : "text-slate-700"
                            )}>{step}</span>
                         </div>
                       );
                     })}
                   </div>
                </div>

                <div className="flex flex-wrap gap-12 py-8 border-y border-white/[0.03]">
                  <div className="space-y-2">
                    <p className="label-text mb-0 lowercase">Transmission Origin</p>
                    <p className="text-sm font-bold text-white flex items-center gap-3">
                      <Layers className="h-4 w-4 text-accent-indigo" />
                      SECURE_BACKPLANE_v9
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="label-text mb-0 lowercase">Geographic Vector</p>
                    <p className="text-sm font-bold text-white flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-accent-cyan" />
                      {selectedIncident.location}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="label-text mb-0 lowercase">Neural Impact</p>
                    <p className="text-sm font-bold text-white flex items-center gap-3">
                      <Activity className={cn("h-4 w-4", selectedIncident.severity === 'critical' ? 'text-red-500' : 'text-accent-indigo')} />
                      <span className="font-mono text-xl">{selectedIncident.neuralImpact}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Intelligence Brief */}
              <div className="space-y-6">
                <h3 className="label-text flex items-center gap-3 lowercase text-accent-indigo/60">
                  <Activity className="h-4 w-4" /> AI_INTELLIGENCE_MODEL_x4
                </h3>
                <GlassCard className="p-10 border-accent-indigo/10 relative group rounded-[2.5rem] bg-accent-indigo/[0.02]" hover={false}>
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <ShieldAlert className="h-24 w-24 text-accent-indigo" />
                  </div>
                  <p className="text-xl md:text-2xl body-text italic z-10 relative font-medium leading-relaxed pr-8">
                    &quot;{selectedIncident.aiAnalysis}&quot;
                  </p>
                </GlassCard>
              </div>

              {/* ACTION COMMANDS */}
              <div className="pt-10 border-t border-white/[0.05] flex flex-wrap gap-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className={cn(
                    "rounded-full px-8 hover:scale-[1.02] active:scale-[0.98] transition-all",
                    currentIdx >= 1 && "opacity-50 grayscale cursor-not-allowed"
                  )}
                  onClick={() => handleStatusUpdate("analyzing")}
                  disabled={currentIdx >= 1}
                >
                  {currentIdx >= 1 ? "Analyzed" : "Start Analysis"}
                </Button>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className={cn(
                    "rounded-full px-8 hover:scale-[1.02] active:scale-[0.98] transition-all bg-accent-cyan hover:bg-accent-cyan/90 border-none",
                    currentIdx >= 2 && "opacity-50 grayscale cursor-not-allowed"
                  )}
                  onClick={() => handleStatusUpdate("responding")}
                  disabled={currentIdx >= 2}
                >
                  {currentIdx >= 2 ? "Responded" : "Start Response"}
                </Button>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className={cn(
                    "rounded-full px-8 hover:scale-[1.02] active:scale-[0.98] transition-all bg-emerald-500 hover:bg-emerald-600 border-none text-white",
                    currentIdx >= 3 && "opacity-50 grayscale cursor-not-allowed"
                  )}
                  onClick={() => handleStatusUpdate("resolved")}
                  disabled={currentIdx >= 3}
                >
                  {currentIdx === 3 ? "Resolved" : "Mark Resolved"}
                </Button>
                <Button 
                  variant="ghost" 
                  className="rounded-full px-8 text-slate-600 hover:text-red-400 hover:bg-red-400/5 transition-all ml-auto"
                  onClick={handleDismiss}
                >
                  Dismiss Intelligence
                </Button>
              </div>
            </motion.div>
          ) : (
             <div className="h-full flex items-center justify-center">
               <div className="text-center space-y-4 opacity-30">
                 <ShieldCheck className="h-12 w-12 text-slate-500 mx-auto" />
                 <p className="label-text mb-0">
                   Waiting for neural event selection...
                 </p>
               </div>
             </div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

