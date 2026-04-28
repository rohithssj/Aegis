"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  LayoutDashboard, 
  Zap, 
  Target, 
  TrendingUp, 
  Globe, 
  ShieldAlert,
  Binary,
  Loader2,
  Cpu,
  Network,
  Radio
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MetricPoint, Incident } from "@/lib/mockData";
import { useIncidents } from "@/context/IncidentContext";
import { cn, formatTimeAgo } from "@/lib/utils";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { ChartSkeleton, MetricSkeleton, FeedSkeleton } from "@/components/Skeleton";
import { NeuralGraph } from "@/components/NeuralGraph";
import { callGemini } from "@/lib/ai";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-surface/50 animate-pulse flex items-center justify-center text-slate-500 font-mono text-xs">INITIALIZING_MAP_ENGINE...</div>
});

export default function Dashboard() {
  const { incidents, loading, refreshMetrics } = useIncidents() as any;
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  
  const [metrics] = useState<MetricPoint[]>(() => {
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
  
  useEffect(() => {
    if (incidents.length > 0 && !selectedIncidentId) {
      setSelectedIncidentId(incidents[0].id);
    }
  }, [incidents, selectedIncidentId]);

  const selectedIncident = useMemo(() => 
    incidents.find((inc: Incident) => inc.id === selectedIncidentId),
    [incidents, selectedIncidentId]
  );

  const [aiMitigation, setAiMitigation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (selectedIncident) {
      setAiMitigation(selectedIncident.aiMitigation || null);
    }
  }, [selectedIncidentId, selectedIncident]);

  const handleFetchAiInsights = useCallback(async () => {
    if (!selectedIncident || isAiLoading || aiMitigation) return;
    
    setIsAiLoading(true);
    try {
      const mitigationPrompt = `
        Predict what will happen next based on:
        Incident: ${selectedIncident.description}
        Severity: ${selectedIncident.severity}
        
        Provide a concise tactical prediction including future risk and suggested actions.
      `;
      const mitigation = await callGemini(mitigationPrompt);
      setAiMitigation(mitigation);

      await updateDoc(doc(db, "incidents", selectedIncident.id), {
        aiMitigation: mitigation,
      });
    } catch (err) {
      console.error("AI Insight Fetch Error:", err);
    } finally {
      setIsAiLoading(false);
    }
  }, [selectedIncident, isAiLoading, aiMitigation]);

  useEffect(() => {
    if (selectedIncident && !selectedIncident.aiMitigation && !aiMitigation && !isAiLoading) {
      handleFetchAiInsights();
    }
  }, [selectedIncident, aiMitigation, isAiLoading, handleFetchAiInsights]);

  if (loading) return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#05070A] p-10 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-4">
          <FeedSkeleton count={6} />
        </div>
      </div>
    </div>
  );

  const criticalCount = incidents.filter((i: Incident) => i.severity === 'critical').length;
  const activeCount = incidents.filter((i: Incident) => i.status !== 'resolved').length;
  const avgImpact = incidents.length > 0 
    ? Math.round(incidents.reduce((acc: number, curr: Incident) => acc + (curr.neuralImpact || 0), 0) / incidents.length) 
    : 0;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#05070A] text-white">
      <div className="max-w-[1600px] mx-auto p-6 md:p-12 space-y-12">
        
        {/* STEP 1: Header Section */}
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

        {/* STEP 2: Metrics Row */}
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

        {/* STEP 3: Graph Section */}
        <GlassCard className="p-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-400" /> Neural Load Distribution
              </h3>
              <p className="text-slate-500 mt-1">Heuristic throughput metrics across global response clusters</p>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2 rounded-full text-xs font-bold bg-white/10 text-white">Live</button>
              <button className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-white transition-colors">History</button>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="expected" stroke="rgba(255,255,255,0.1)" strokeWidth={2} strokeDasharray="8 8" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* STEP 4: Map + Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px]">
            <GlassCard className="p-0 overflow-hidden h-full">
              <MapView incidents={incidents} />
            </GlassCard>
          </div>
          
          <div className="space-y-8 h-[600px]">
            <GlassCard className="p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-400" /> Live Intelligence
                </h3>
                <Badge variant="low">Active_Uplink</Badge>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {incidents.map((incident: Incident) => (
                  <button
                    key={incident.id}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={cn(
                      "w-full text-left p-6 rounded-2xl transition-all duration-300 border",
                      selectedIncidentId === incident.id 
                        ? "bg-white/10 border-white/20 shadow-xl" 
                        : "bg-white/5 border-transparent hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500">{incident.trackingId}</span>
                          <Badge variant={incident.severity as any} dot={false}>{incident.severity}</Badge>
                        </div>
                        <h4 className="text-sm font-bold">{incident.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {incident.location}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(incident.timestamp)}</span>
                        </div>
                      </div>
                      <ChevronRight className={cn("w-4 h-4 transition-transform", selectedIncidentId === incident.id && "rotate-90")} />
                    </div>
                  </button>
                ))}
              </div>

              {selectedIncident && (
                <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Briefing</p>
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      {aiMitigation || "Aegis AI is synthesizing tactical options for this vector..."}
                    </p>
                  </div>
                  <Button variant="primary" className="w-full">
                    Execute Response
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
