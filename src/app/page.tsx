"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Clock, 
  ArrowUpRight,
  AlertTriangle,
  LocateFixed,
  BarChart2,
  TrendingUp,
  Globe
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockDataService, MetricPoint, Incident } from "@/lib/mockData";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    mockDataService.getMetrics("load").then(setMetrics);
    mockDataService.getIncidents().then(data => {
      setIncidents(data);
      if (data.length > 0) setSelectedIncidentId(data[0].id);
    });
  }, []);

  const selectedIncident = useMemo(() => 
    incidents.find(inc => inc.id === selectedIncidentId),
    [incidents, selectedIncidentId]
  );

  const LoadChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={metrics}>
        <defs>
          <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5B4CF0" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#5B4CF0" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
        <XAxis 
          dataKey="time" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'var(--font-mono)'}}
          interval={6}
        />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0F172A', 
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '11px',
            color: '#fff',
            fontFamily: 'var(--font-mono)'
          }} 
          itemStyle={{ color: '#5B4CF0' }}
          cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#5B4CF0" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorIndigo)" 
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  ), [metrics]);

  const handleProtocolAction = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 2000);
  };

  return (
    <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 md:px-10 py-12 space-y-12">
      
      {/* 🚀 HERO SECTION: Command Status */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-5">
            <Badge variant="low" dot={true} className="bg-accent-cyan/5 text-accent-cyan border-accent-cyan/10">
              System Core: Operational
            </Badge>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Strategic <span className="text-slate-500 italic font-medium">Command</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.02] p-2 rounded-2xl border border-white/[0.05]">
            <div className="flex flex-col items-end px-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Status</span>
              <span className="text-xs font-mono font-bold text-accent-cyan tracking-tight">ENFORCE_v4.2</span>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleProtocolAction}
              disabled={isDeploying}
              className="min-w-[200px]"
            >
              {isDeploying ? "Synchronizing..." : "Emergency Protocol"}
            </Button>
          </div>
        </div>

        {/* Global Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Neural Load", val: "84.2%", icon: Activity, trend: "+2.1%" },
            { label: "Network Latency", val: "42ms", icon: Zap, trend: "-12ms" },
            { label: "Active Nodes", val: "1,204", icon: Globe, trend: "Stable" },
            { label: "Threat Index", val: "0.04", icon: AlertTriangle, trend: "Minimal" },
          ].map((m, i) => (
            <GlassCard key={i} className="p-5 flex flex-col gap-3" hover={false}>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <m.icon className="h-4 w-4 text-slate-500" />
                </div>
                <span className="font-mono text-[10px] text-accent-cyan font-bold">{m.trend}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                <p className="text-2xl font-mono font-bold text-white tracking-tight">{m.val}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 📊 PRIMARY PANEL: Analytics & Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Distribution Chart (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-accent-indigo" /> Neural Load Distribution
            </h2>
            <div className="flex items-center gap-4">
               <span className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                 <span className="h-2 w-2 rounded-full bg-accent-indigo" /> Real-time
               </span>
            </div>
          </div>
          
          <GlassCard className="h-[400px] p-8" hover={false}>
             {LoadChart}
          </GlassCard>

          {/* Detailed Context Panel */}
          {selectedIncident && (
            <GlassCard className="p-8 space-y-8 border-accent-indigo/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={selectedIncident.status as any}>{selectedIncident.status}</Badge>
                    <span className="text-[10px] text-slate-500 font-mono tracking-widest">{selectedIncident.id}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white tracking-tight">
                    {selectedIncident.title}
                  </h3>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-3xl min-w-[160px] text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Impact Deviation</p>
                  <p className="text-4xl font-mono font-bold text-white">{selectedIncident.neuralImpact}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <LocateFixed className="h-3 w-3" /> Vectors
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {selectedIncident.location}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" /> Intelligence Logs
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {selectedIncident.description}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-white/[0.08] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <ShieldCheck className="h-20 w-20 text-accent-cyan" />
                </div>
                <p className="text-[10px] font-bold text-accent-cyan uppercase tracking-widest flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-3.5 w-3.5" /> AI Predictive Response
                </p>
                <p className="text-sm text-slate-300 leading-relaxed italic z-10 relative">
                  &quot;{selectedIncident.aiAnalysis}&quot;
                </p>
              </div>
            </GlassCard>
          )}
        </div>

        {/* 📋 SECONDARY: Intelligence Feed (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2">
            Intelligence Feed
          </h2>
          
          <div className="space-y-2">
            {incidents.map((incident) => (
              <GlassCard 
                key={incident.id}
                hover={true}
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedIncidentId === incident.id
                    ? "bg-white/[0.06] border-accent-indigo/30"
                    : "bg-white/[0.01]"
                )}
                onClick={() => setSelectedIncidentId(incident.id)}
              >
                <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1 h-1 rounded-full",
                      incident.status === 'critical' ? 'bg-red-500' : 'bg-accent-indigo'
                    )} />
                    <span className="text-[9px] font-mono text-slate-500 font-bold tracking-widest uppercase">{incident.id}</span>
                   </div>
                   <span className="text-[9px] font-mono text-slate-600">
                    {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
                <p className="text-[13px] font-bold text-white mb-0.5 truncate">{incident.title}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-6 space-y-4" hover={false}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent-indigo/10 border border-accent-indigo/20">
                <BarChart2 className="h-4 w-4 text-accent-indigo" />
              </div>
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Efficiency</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Neural efficiency is performing at <span className="text-white font-bold">1.2 Petaflops</span> with 99.9% autonomous mitigation.
            </p>
            <Button variant="ghost" className="w-full">View Detailed Nodes</Button>
          </GlassCard>
        </aside>
      </div>
    </main>
  );
}


