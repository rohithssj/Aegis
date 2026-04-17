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
  Filter
} from "lucide-react";
import { mockDataService, Incident } from "@/lib/mockData";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
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
    <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
      {/* LEFT: Incident Feed (40%) */}
      <aside className="w-full md:w-[400px] border-r border-white/5 flex flex-col bg-[#020617]">
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white tracking-tight">Active Incidents</h1>
            <Badge variant="critical">4 TOTAL</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by ID, Title..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="p-8 space-y-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-24 w-full bg-white/[0.02] animate-pulse rounded-2xl" />
               ))}
             </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {incidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedId(incident.id)}
                  className={cn(
                    "w-full text-left p-6 transition-all relative group",
                    selectedId === incident.id 
                      ? "bg-white/[0.03]" 
                      : "hover:bg-white/[0.01]"
                  )}
                >
                  {selectedId === incident.id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-accent-primary"
                    />
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 tracking-widest">{incident.id}</span>
                      <Badge variant={incident.status}>{incident.status}</Badge>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-accent-primary transition-colors leading-tight">
                      {incident.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {incident.location.split('/')[0]}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT: Incident Detail Area (60%) */}
      <section className="flex-1 overflow-y-auto bg-slate-950/20 md:p-12 p-6 custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedIncident ? (
            <motion.div
              key={selectedIncident.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              {/* Header Info */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant={selectedIncident.status} className="px-4 py-1 text-sm">{selectedIncident.status.toUpperCase()}</Badge>
                  <span className="text-slate-500 font-medium">/</span>
                  <span className="text-slate-500 font-medium">{selectedIncident.id}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  {selectedIncident.title}
                </h2>
                <div className="flex flex-wrap gap-8 py-4 border-y border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Detection Source</p>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-accent-primary" />
                      Neural Firewall Alpha
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Precise Location</p>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent-cyan" />
                      {selectedIncident.location}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Neural Impact</p>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <Activity className="h-4 w-4 text-red-400" />
                      {selectedIncident.neuralImpact}% Deviation
                    </p>
                  </div>
                </div>
              </div>

              {/* Description & AI Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Event Log</h3>
                  <p className="text-slate-400 text-sm leading-relaxed bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                    {selectedIncident.description}
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="h-4 w-4 text-accent-primary" />
                    AI Intelligence Report
                  </h3>
                  <div className="p-6 rounded-3xl bg-accent-primary/5 border border-accent-primary/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <ShieldAlert className="h-16 w-16" />
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed relative z-10 italic">
                      &quot;{selectedIncident.aiAnalysis}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
                <Button variant="primary">Execute Counter-Response</Button>
                <Button variant="ghost">Isolate Node Traffic</Button>
                <Button variant="ghost">Forward to Threat Intelligence</Button>
              </div>
            </motion.div>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-500">
               Select an incident from the log to view automated analysis.
             </div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
