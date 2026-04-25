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
  PackageSearch,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  const [adminNote, setAdminNote] = useState("");
  const [assignedUnit, setAssignedUnit] = useState("");
  const { incidents, loading, updateIncidentStatus, dismissIncident, updateIncident, addIncidentLog } = useIncidents();
  
  const handleAdminUpdate = async () => {
    if (!selectedId) return;
    if (assignedUnit) {
      await updateIncident(selectedId, { assignedUnit });
    }
    if (adminNote) {
      await addIncidentLog(selectedId, adminNote);
      setAdminNote("");
    }
    toast.success("Admin records updated");
  };

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
    await updateIncidentStatus(selectedIncident.id, status);
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
      <aside className={cn(
        "w-full md:w-[400px] border-r border-white/5 flex flex-col bg-surface/30 backdrop-blur-md transition-all duration-500",
        selectedId && "hidden md:flex"
      )}>
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
                    "w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden group/item hover:scale-[1.02] hover:-translate-y-[2px] ease-out",
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
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn("max-w-4xl mx-auto space-y-16 animate-in", selectedIncident.isIsolated && "opacity-80 scale-[0.99] grayscale-[0.2]")}
            >
              {/* MOBILE BACK BUTTON */}
              <div className="md:hidden mt-4 mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedId(null)}
                  className="pl-0 text-slate-500 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Feed
                </Button>
              </div>

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
                    <span className="text-slate-400 font-mono text-[10px] font-bold tracking-widest leading-none lowercase tracking-tighter">{selectedIncident.id}</span>
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
                
                {/* STATUS TIMELINE - Vertical Upgrade */}
                <div className="bg-white/[0.01] border border-white/[0.04] p-6 md:p-10 rounded-[2rem] space-y-10 overflow-hidden relative group/timeline">
                   <div className="flex items-center justify-between mb-2">
                      <div className="space-y-1">
                        <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Deployment Timeline</h3>
                        <p className="text-[10px] text-slate-700 font-medium">Real-time Tactical Sync Active</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono font-bold text-accent-cyan">AEGIS_LIVE_FEED</span>
                        {selectedIncident.lastUpdated && (
                          <span className="text-[9px] font-mono text-slate-600 uppercase">Updated {formatTimeAgo(selectedIncident.lastUpdated)}</span>
                        )}
                      </div>
                   </div>

                   <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-accent-indigo/40 before:via-white/5 before:to-transparent">
                      {selectedIncident.timeline?.slice().reverse().map((step, idx, arr) => (
                        <div key={idx} className="flex gap-8 relative group/item">
                          <div className={cn(
                            "w-[23px] h-[23px] rounded-full z-10 flex items-center justify-center border-4 border-[#0B1120] transition-all duration-500",
                            idx === 0 ? "bg-accent-indigo shadow-[0_0_15px_rgba(91,76,240,0.4)] scale-110" : "bg-white/10"
                          )}>
                            {idx === 0 ? (
                              <div className="w-2 h-2 bg-[#0B1120] rounded-full animate-pulse" />
                            ) : (
                              <ShieldCheck className="w-2.5 h-2.5 text-white/30" />
                            )}
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                              <p className={cn(
                                "text-sm font-bold tracking-tight transition-colors duration-300",
                                idx === 0 ? "text-white" : "text-slate-500"
                              )}>
                                {step.status}
                              </p>
                              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter tabular-nums">
                                {new Date(step.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </p>
                            </div>
                            <p className={cn(
                              "text-xs leading-relaxed max-w-md",
                              idx === 0 ? "text-slate-400" : "text-slate-600"
                            )}>
                              {step.status === "Request received" && "Signal captured via global sensor array. Initiating priority assessment."}
                              {step.status === "AI evaluating scenario" && "Neural engine processing vector data. Determining optimal mitigation strategy."}
                              {step.status === "Units dispatched" && "Tactical response units deployed to primary Geographic Vector."}
                              {step.status === "Incident closed" && "Threat mitigated. System returning to standby status."}
                              {step.status === "Incident dismissed" && "Archive protocol complete. Event de-prioritised."}
                            </p>
                          </div>
                        </div>
                      ))}
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
                  
                  {selectedIncident.aiAnalysis && (
                    <div className="mt-10 pt-8 border-t border-white/[0.05] relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em]">Decision Architecture</p>
                        <div className="flex items-center gap-2 px-3 py-1 bg-accent-indigo/10 rounded-full border border-accent-indigo/20">
                          <Binary className="h-3 w-3 text-accent-indigo" />
                          <span className="text-[9px] text-accent-indigo font-bold uppercase tracking-wider">Explainable AI Trace</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {/* Summary & Factors (8 cols) */}
                        <div className="md:col-span-8 space-y-8">
                          <div className="space-y-3">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                              <ShieldCheck className="h-3 w-3" /> Logical Summary
                            </p>
                            <p className="text-lg text-white/90 font-medium leading-relaxed italic">
                              &quot;{selectedIncident.aiExplanation || "Direct tactical allocation based on current neural load."}&quot;
                            </p>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                              <Activity className="h-3 w-3" /> Core Logic Factors
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selectedIncident.aiFactors?.map((factor, idx) => (
                                <motion.div 
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  key={idx} 
                                  className="flex items-center gap-3 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.03]"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent-indigo shrink-0 shadow-[0_0_8px_rgba(91,76,240,0.4)]" />
                                  <p className="text-[11px] text-white/70 font-medium leading-snug">{factor}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* WOW PANEL — AI Decision Breakdown */}
                        <div className="md:col-span-4 space-y-4">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                             <Binary className="h-3 w-3" /> AI Decision Breakdown
                          </p>
                          <GlassCard className="p-5 border-white/[0.05] bg-white/[0.02] rounded-2xl space-y-4 shadow-2xl hover:scale-[1.02] transition-all duration-300">
                             <div className="space-y-3">
                               <div className="flex justify-between items-center">
                                 <span className="text-[10px] text-white/50 uppercase font-bold">Severity Score</span>
                                 <span className="text-[10px] text-red-400 font-mono">+{(selectedIncident.neuralImpact * 2 / 10).toFixed(1)}</span>
                               </div>
                               <div className="flex justify-between items-center">
                                 <span className="text-[10px] text-white/50 uppercase font-bold">Distance Factor</span>
                                 <span className="text-[10px] text-accent-cyan font-mono">-{(Math.random() * 5 * 1.2).toFixed(1)}</span>
                               </div>
                               <div className="flex justify-between items-center">
                                 <span className="text-[10px] text-white/50 uppercase font-bold">Wait Time Boost</span>
                                 <span className="text-[10px] text-accent-indigo font-mono">+{(Math.random() * 10 * 1.5).toFixed(1)}</span>
                               </div>
                             </div>
                             <div className="pt-3 border-t border-white/[0.05] flex justify-between items-center">
                               <span className="text-xs font-bold text-white tracking-widest uppercase">Final Score</span>
                               <span className="text-lg font-black text-accent-indigo drop-shadow-[0_0_8px_rgba(91,76,240,0.5)]">
                                 {selectedIncident.aiScore || (selectedIncident.neuralImpact * 1.2).toFixed(0)}
                               </span>
                             </div>
                          </GlassCard>

                          <div className="space-y-3 pt-4">
                            {[
                              { label: "Tactical Unit", val: selectedIncident.assignedUnit || selectedIncident.aiUnit, color: "text-white" },
                              { label: "Risk Matrix", val: selectedIncident.aiRisk, color: "text-white" },
                              { label: "Confidence", val: `${selectedIncident.aiConfidence || 0}%`, color: "text-accent-indigo" },
                              { label: "Command Priority", val: selectedIncident.aiPriority || "P3", color: selectedIncident.aiPriority === 'P1' ? 'text-red-500' : 'text-emerald-500' }
                            ].map((stat, i) => (
                              <div key={i} className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
                                <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                                <p className={cn("text-xs font-bold uppercase", stat.color)}>{stat.val}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                  className="rounded-full px-8 text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all sm:ml-auto"
                  onClick={handleDismiss}
                >
                  Dismiss Intelligence
                </Button>
              </div>

              {/* ADMIN CONTROL PANEL */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6 pt-10"
              >
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.05]" />
                  <p className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-[0.4em]">Internal Command Only</p>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>

                <GlassCard className="p-8 md:p-10 rounded-[2.5rem] border-white/10 bg-white/[0.01] space-y-8" hover={false}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-accent-indigo" /> Admin Control Center
                    </h3>
                    <Badge variant="low" className="bg-accent-indigo/10 text-accent-indigo font-mono">v4.0_SECURE</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manual Status Override</label>
                        <select 
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-indigo/30 transition-all"
                          value={selectedIncident.status}
                          onChange={(e) => handleStatusUpdate(e.target.value as any)}
                        >
                          {STATUS_ORDER.map(s => (
                            <option key={s} value={s} className="bg-background">{s.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assign Tactical Unit</label>
                        <select 
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-indigo/30 transition-all"
                          value={assignedUnit || selectedIncident.assignedUnit || ""}
                          onChange={(e) => setAssignedUnit(e.target.value)}
                        >
                          <option value="" disabled className="bg-background text-slate-500">Select Asset...</option>
                          <option value="Fire Brigade" className="bg-background">Fire Brigade</option>
                          <option value="Cyber Unit" className="bg-background">Cyber Unit</option>
                          <option value="Rescue Team" className="bg-background">Rescue Team</option>
                          <option value="Medical Dispatch" className="bg-background">Medical Dispatch</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Command Logs / Notes</label>
                        <textarea 
                          placeholder="Enter tactical updates..."
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white h-[115px] focus:outline-none focus:ring-1 focus:ring-accent-indigo/30 transition-all resize-none"
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      variant="primary" 
                      onClick={handleAdminUpdate}
                      className="rounded-full px-10 shadow-lg shadow-accent-indigo/20"
                    >
                      Commit Record Updates
                    </Button>
                  </div>

                  {/* DISPLAY LOGS */}
                  {selectedIncident.logs && selectedIncident.logs.length > 0 && (
                    <div className="pt-8 border-t border-white/[0.05] space-y-4">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Audit Log</p>
                      <div className="space-y-3">
                        {selectedIncident.logs.map((log, i) => (
                          <div key={i} className="flex gap-4 p-3 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                            <span className="text-[10px] font-mono text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                            <p className="text-xs text-slate-400 leading-relaxed">{log.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
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
