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
  Layers
} from "lucide-react";
import { mockDataService, Incident } from "@/lib/mockData";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockDataService.getIncidents().then((data) => {
      setIncidents(data);
      if (data.length > 0) setSelectedId(data[0].id);
      setLoading(false);
    });
  }, []);

  const selectedIncident = incidents.find((inc) => inc.id === selectedId);

  return (
    <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* LEFT: Incident Feed (400px fixed) */}
      <aside className="w-full md:w-[420px] border-r border-white/5 flex flex-col bg-surface/50 backdrop-blur-md">
        <div className="p-8 border-b border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tighter">Intelligence</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active Event Stream</p>
            </div>
            <Badge variant="critical" className="font-mono">4</Badge>
          </div>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 group-focus-within:text-accent-indigo transition-colors" />
            <input 
              type="text" 
              placeholder="QUICK_FILTER_BY_HASH..." 
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-mono text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-accent-indigo/30 focus:bg-white/[0.04] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="p-6 space-y-3">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="h-24 w-full bg-white/[0.01] border border-white/5 animate-pulse rounded-2xl" />
               ))}
             </div>
          ) : (
            <div className="p-4 space-y-2">
              {incidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedId(incident.id)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl transition-all relative overflow-hidden border",
                    selectedId === incident.id 
                      ? "bg-white/[0.05] border-accent-indigo/20 shadow-xl" 
                      : "bg-transparent border-transparent hover:bg-white/[0.02]"
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-slate-600" />
                        <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest">{incident.id}</span>
                      </div>
                      <Badge variant={incident.status as any} dot={false} className="text-[9px] px-2 py-0.5">{incident.status}</Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-accent-indigo transition-colors leading-snug truncate">
                        {incident.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 uppercase">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Clock className="h-3 w-3" />
                          {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 transition-transform duration-300", selectedId === incident.id ? "text-accent-indigo" : "text-slate-700")} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT: Incident Detail Area */}
      <section className="flex-1 overflow-y-auto bg-[#0B1120] md:p-16 p-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedIncident ? (
            <motion.div
              key={selectedIncident.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-4xl mx-auto space-y-16"
            >
              {/* Header Info */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <Badge variant={selectedIncident.status as any} className="px-5 py-1 text-[10px] tracking-[0.2em] font-black">{selectedIncident.status.toUpperCase()}</Badge>
                  <span className="text-slate-700 font-mono text-xs tracking-widest">/</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.05] rounded-full">
                    <Binary className="h-3 w-3 text-accent-cyan" />
                    <span className="text-slate-400 font-mono text-[10px] font-bold tracking-widest leading-none">{selectedIncident.id}</span>
                  </div>
                </div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9]">
                  {selectedIncident.title}
                </h2>
                
                <div className="flex flex-wrap gap-12 py-8 border-y border-white/[0.05]">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Core Node</p>
                    <p className="text-xs font-bold text-white flex items-center gap-3">
                      <Layers className="h-4 w-4 text-accent-indigo" />
                      FIREWALL_ALPHA_v9
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Geographic Vector</p>
                    <p className="text-xs font-bold text-white flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-accent-cyan" />
                      {selectedIncident.location}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Neural Deviation</p>
                    <p className="text-xs font-bold text-white flex items-center gap-3">
                      <Activity className="h-4 w-4 text-red-400" />
                      <span className="font-mono text-lg">{selectedIncident.neuralImpact}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RAW_DESCRIPTION_BUFFER</h3>
                  <div className="text-slate-400 text-sm leading-relaxed p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] font-medium">
                    {selectedIncident.description}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-3 w-3 text-accent-indigo" />
                    AI_INTELLIGENCE_MODEL_x4
                  </h3>
                  <GlassCard className="p-8 border-accent-indigo/10 relative group" hover={false}>
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                      <ShieldAlert className="h-20 w-20 text-accent-indigo" />
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed italic z-10 relative font-medium">
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
                 <Binary className="h-12 w-12 text-slate-500 mx-auto" />
                 <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
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

