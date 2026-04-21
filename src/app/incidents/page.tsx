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
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { FeedSkeleton } from "@/components/Skeleton";
import { cn } from "@/lib/utils";
import { useIncidents } from "@/context/IncidentContext";

export default function IncidentsPage() {
  const { incidents, loading } = useIncidents();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Set initial selection once incidents arrive
  useEffect(() => {
    if (incidents.length > 0 && !selectedId) {
      setSelectedId(incidents[0].id);
    }
  }, [incidents, selectedId]);

  const selectedIncident = incidents.find((inc) => inc.id === selectedId);

  return (
    <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-background">
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
                    "w-full text-left p-4 rounded-xl transition-all duration-200 relative overflow-hidden group/item",
                    selectedId === incident.id 
                      ? "bg-white/[0.06] border border-white/[0.05] shadow-lg" 
                      : "bg-transparent border border-transparent hover:bg-white/[0.02] hover:translate-x-1"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-slate-600" />
                        <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase">{incident.id}</span>
                      </div>
                      <Badge variant={incident.status as any} dot={false} className="text-[9px] px-1.5 py-0 rounded-md">{incident.status}</Badge>
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-xs font-bold transition-colors leading-snug truncate",
                        selectedId === incident.id ? "text-white" : "text-slate-400 group-hover/item:text-slate-200"
                      )}>
                        {incident.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-slate-600">
                        <Clock className="h-3 w-3" />
                        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              className="max-w-4xl mx-auto space-y-16 animate-in"
            >
              {/* Header Info */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <Badge variant={selectedIncident.status as any} className="px-5 py-0.5 text-[10px] tracking-[0.1em] font-bold rounded-full uppercase">{selectedIncident.status}</Badge>
                  <span className="text-slate-700 font-mono text-xs tracking-widest">/</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.05] rounded-full">
                    <Binary className="h-3 w-3 text-accent-cyan" />
                    <span className="text-slate-400 font-mono text-[10px] font-bold tracking-widest leading-none lowercase">{selectedIncident.id}</span>
                  </div>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                  {selectedIncident.title}
                </h2>
                
                <div className="flex flex-wrap gap-12 py-8 border-y border-white/[0.03]">
                  <div className="space-y-2">
                    <p className="label-text mb-0">Core Node</p>
                    <p className="text-xs font-bold text-white flex items-center gap-3">
                      <Layers className="h-4 w-4 text-accent-indigo" />
                      FIREWALL_ALPHA_v9
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="label-text mb-0">Geographic Vector</p>
                    <p className="text-xs font-bold text-white flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-accent-cyan" />
                      {selectedIncident.location}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="label-text mb-0">Neural Deviation</p>
                    <p className="text-xs font-bold text-white flex items-center gap-3">
                      <Activity className="h-4 w-4 text-red-500" />
                      <span className="font-mono text-lg">{selectedIncident.neuralImpact}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="label-text">RAW_DESCRIPTION_BUFFER</h3>
                  <div className="body-text p-6 glass rounded-2xl">
                    {selectedIncident.description}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="label-text flex items-center gap-2">
                    <Activity className="h-3 w-3 text-accent-indigo" />
                    AI_INTELLIGENCE_MODEL_x4
                  </h3>
                  <GlassCard className="p-8 border-accent-indigo/10 relative group rounded-2xl" hover={false}>
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                      <ShieldAlert className="h-20 w-20 text-accent-indigo" />
                    </div>
                    <p className="body-text italic z-10 relative">
                      &quot;{selectedIncident.aiAnalysis}&quot;
                    </p>
                  </GlassCard>
                </div>
              </div>

              {/* ACTION COMMANDS */}
              <div className="pt-10 border-t border-white/[0.05] flex flex-wrap gap-4">
                <Button variant="primary" size="lg">Initiate Counter-Measures</Button>
                <Button variant="ghost" size="lg">Isolate Network Node</Button>
                <Button variant="ghost" size="lg" className="text-slate-500">Dismiss Intelligence</Button>
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

