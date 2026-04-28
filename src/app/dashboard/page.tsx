"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  MapPin, 
  ChevronRight, 
  TrendingUp, 
  Zap, 
  Cpu, 
  Network, 
  Radio,
  Loader2,
  Binary
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MetricPoint, Incident } from "@/lib/mockData";
import { useIncidents } from "@/context/IncidentContext";
import { cn, formatTimeAgo } from "@/lib/utils";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { ChartSkeleton, MetricSkeleton, FeedSkeleton } from "@/components/Skeleton";
import dynamic from "next/dynamic";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { isAdmin } from "@/lib/auth";

const MapView = dynamic(() => import("@/components/MapView"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-surface/50 animate-pulse flex items-center justify-center text-slate-500 font-mono text-xs">INITIALIZING_MAP_ENGINE...</div>
});

const HISTORY_DATA: MetricPoint[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  value: 40 + Math.sin(i / 3) * 20 + Math.random() * 10,
  expected: 50,
}));

export default function Dashboard() {
  const { incidents, loading, refreshMetrics } = useIncidents() as any;
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [mode, setMode] = useState<"live" | "history">("live");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;
  
  // Authorization check
  useEffect(() => {
    const checkAuth = async () => {
      const admin = isAdmin();
      if (!admin) {
        if (router) router.replace("/admin");
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  const [liveMetrics, setLiveMetrics] = useState<MetricPoint[]>(() => {
    const points: MetricPoint[] = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600000);
      points.push({
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: 30 + Math.random() * 40,
        expected: 50,
      });
    }
    return points;
  });

  // Simulated live update
  useEffect(() => {
    if (mode !== "live") return;
    const interval = setInterval(() => {
      setLiveMetrics(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const now = new Date();
        next.push({
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: Math.max(20, Math.min(90, last.value + (Math.random() - 0.5) * 10)),
          expected: 50
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [mode]);
  
  useEffect(() => {
    if (incidents.length > 0 && !selectedIncidentId) {
      setSelectedIncidentId(incidents[0].id);
    }
  }, [incidents, selectedIncidentId]);

  const selectedIncident = useMemo(() => 
    incidents.find((inc: Incident) => inc.id === selectedIncidentId),
    [incidents, selectedIncidentId]
  );

  const handleExecute = async () => {
    if (!selectedIncident || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incident: selectedIncident })
      });

      const data = await res.json();
      if (data.text) {
        const docRef = doc(db, "incidents", selectedIncident.id);
        await updateDoc(docRef, {
          aiMitigation: data.text,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const sanitizeAiText = (text: string | undefined) => {
    if (!text) return null;
    const cleaned = text
      .replace(/[*#`]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);
    return cleaned;
  };

  const displayMetrics = mode === "live" ? liveMetrics : HISTORY_DATA;

  if (!isAuthorized || loading) return (
    <div className="h-screen flex items-center justify-center text-white bg-[#05070A]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Validating Credentials...</p>
      </div>
    </div>
  );

  const criticalCount = incidents.filter((i: Incident) => i.severity === 'critical').length;
  const avgImpact = incidents.length > 0 
    ? Math.round(incidents.reduce((acc: number, curr: Incident) => acc + (curr.neuralImpact || 0), 0) / incidents.length) 
    : 0;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#05070A] text-white pt-16">
      <div className="max-w-[1600px] mx-auto p-6 md:p-12 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-purple-500 font-mono text-sm tracking-[0.3em] uppercase font-bold">
              <Shield className="w-5 h-5" />
              Aegis Tactical Overload
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              Strategic <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Command</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg font-medium">
              Global neural monitoring and autonomous response orchestration. Protocol L6 active.
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={refreshMetrics} className="border-white/5">
                <Activity className="h-4 w-4 mr-2" /> RE_SYNC
              </Button>
              <Button variant="primary" size="md">
                Emergency Protocol
              </Button>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-mono font-bold text-emerald-500 tracking-widest uppercase">System Status: Nominal</span>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Neural Load", val: `${avgImpact}%`, icon: Cpu, color: "text-blue-400" },
            { label: "Network Latency", val: "24ms", icon: Network, color: "text-purple-400" },
            { label: "Active Nodes", val: incidents.length + 124, icon: Radio, color: "text-emerald-400" },
            { label: "Threat Index", val: (criticalCount * 12.4 + 4.2).toFixed(1), icon: AlertTriangle, color: "text-red-400" }
          ].map((m, i) => (
            <GlassCard key={i} className="p-8 group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <m.icon className="w-12 h-12" />
               </div>
               <div className="space-y-4">
                  <div className={cn("p-3 rounded-2xl bg-white/5 w-fit", m.color)}>
                    <m.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold tracking-tighter">{m.val}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{m.label}</p>
                  </div>
               </div>
            </GlassCard>
          ))}
        </div>

        {/* Graph Section */}
        <GlassCard className="p-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-400" /> Neural Load Distribution
              </h3>
              <p className="text-slate-500 mt-1">Heuristic throughput metrics across global response clusters</p>
            </div>
            <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10">
              <button 
                onClick={() => setMode("live")}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-bold transition-all duration-300",
                  mode === "live" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-white"
                )}
              >
                Live
              </button>
              <button 
                onClick={() => setMode("history")}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-bold transition-all duration-300",
                  mode === "history" ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-slate-500 hover:text-white"
                )}
              >
                History
              </button>
            </div>
          </div>
          
          <div className="h-[400px] w-full transition-opacity duration-200" key={mode}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayMetrics}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={mode === "live" ? "#3B82F6" : "#8B5CF6"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={mode === "live" ? "#3B82F6" : "#8B5CF6"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke={mode === "live" ? "#3B82F6" : "#8B5CF6"} strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="expected" stroke="rgba(255,255,255,0.1)" strokeWidth={2} strokeDasharray="8 8" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Map + Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
          <div className="h-[600px]">
            <GlassCard className="p-0 overflow-hidden h-full">
              <MapView incidents={incidents} />
            </GlassCard>
          </div>
          
          <div className="space-y-6 h-[600px]">
            <GlassCard className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-400" /> Live Intelligence
                </h3>
                <Badge variant="low">Active_Uplink</Badge>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[500px] scrollbar-thin scrollbar-thumb-white/10">
                {incidents.map((incident: Incident) => (
                  <button
                    key={incident.id}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl transition-all duration-300 border",
                      selectedIncidentId === incident.id 
                        ? "bg-white/10 border-white/20 shadow-xl" 
                        : "bg-white/5 border-transparent hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500">{incident.trackingId}</span>
                          <Badge variant={incident.severity as any} dot={false} className="text-[9px] py-0">{incident.severity}</Badge>
                        </div>
                        <h4 className="text-sm font-bold truncate">{incident.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" /> {incident.location}</span>
                          <span>•</span>
                          <span className="flex-shrink-0">{formatTimeAgo(incident.timestamp)}</span>
                        </div>
                      </div>
                      <ChevronRight className={cn("w-4 h-4 transition-transform flex-shrink-0", selectedIncidentId === incident.id && "rotate-90")} />
                    </div>
                  </button>
                ))}
              </div>

              {selectedIncident && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                  <AnimatePresence mode="wait">
                    {isAiLoading ? (
                      <motion.div 
                        key="shimmer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-3"
                      >
                         <div className="flex items-center gap-3 mb-2">
                           <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                           <span className="text-[10px] uppercase tracking-wide text-white/50">Synthesizing Briefing...</span>
                         </div>
                         <div className="space-y-2">
                           <div className="h-3 bg-white/10 rounded w-full animate-pulse" />
                           <div className="h-3 bg-white/10 rounded w-[90%] animate-pulse" />
                           <div className="h-3 bg-white/10 rounded w-[80%] animate-pulse" />
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.1)] space-y-3"
                      >
                        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                           <Binary className="w-4 h-4 text-purple-400" />
                           <span className="text-[10px] uppercase tracking-wide text-white/50">Aegis Heuristic Report</span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/80 italic font-medium max-w-[95%]">
                          {(() => {
                            const cleaned = sanitizeAiText(selectedIncident.aiMitigation);
                            const isInvalid = !cleaned || 
                              cleaned.toLowerCase().includes("ai busy") || 
                              cleaned.toLowerCase().includes("fallback") || 
                              cleaned.toLowerCase().includes("cached");
                            
                            return !isInvalid 
                              ? cleaned 
                              : "Click Execute Response to generate tactical intelligence.";
                          })()}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <Button 
                    variant="primary" 
                    className="w-full h-12" 
                    onClick={handleExecute}
                    disabled={isAiLoading}
                  >
                    {isAiLoading ? "PROCESSING..." : "Execute Response"}
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        </div>

      </div>
    </div>
  );
}
