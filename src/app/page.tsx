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

  // Initialize data and start real-time simulation
  useEffect(() => {
    // Initial fetch
    mockDataService.getIncidents().then(data => {
      setIncidents(data);
      if (data.length > 0) setSelectedIncidentId(data[0].id);
    });

    // Generate initial 30 points
    const generateInitialData = () => {
      const data: MetricPoint[] = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        data.push({
          time,
          value: 65 + Math.random() * 25,
          expected: 75
        });
      }
      return data;
    };

    setMetrics(generateInitialData());

    // Start interval
    const interval = setInterval(() => {
      setMetrics(prev => {
        const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newPoint = {
          time: nextTime,
          value: 65 + Math.random() * 25,
          expected: 75
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2500);

    return () => clearInterval(interval);
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
        <XAxis 
          dataKey="time" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'var(--font-mono)'}}
          interval={5}
        />
        <YAxis hide domain={[0, 100]} />
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
          isAnimationActive={true}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  ), [metrics]);

  const handleProtocolAction = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 2000);
  };

  return (
    <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 md:px-10 py-12 space-y-16">
      
      {/* 🚀 HERO SECTION: Command Status */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <Badge variant="low" dot={true} className="bg-accent-cyan/5 text-accent-cyan border-accent-cyan/10">
              System Core: Operational
            </Badge>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
              Strategic <span className="text-slate-500 italic font-medium">Command</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.02] p-2 rounded-2xl border border-white/[0.05]">
            <div className="flex flex-col items-end px-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1.5">Protocol Status</span>
              <span className="text-xs font-mono font-bold text-accent-cyan tracking-tight">ENFORCE_v4.2</span>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleProtocolAction}
              disabled={isDeploying}
              className="min-w-[220px]"
            >
              {isDeploying ? "Synchronizing..." : "Emergency Protocol"}
            </Button>
          </div>
        </div>

        {/* Global Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Neural Load", val: metrics.length > 0 ? `${metrics[metrics.length-1].value.toFixed(1)}%` : "0.0%", icon: Activity, trend: "+2.1%" },
            { label: "Network Latency", val: "42ms", icon: Zap, trend: "-12ms" },
            { label: "Active Nodes", val: "1,204", icon: Globe, trend: "Stable" },
            { label: "Threat Index", val: "0.04", icon: AlertTriangle, trend: "Minimal" },
          ].map((m, i) => (
            <GlassCard key={i} className="p-6 flex flex-col gap-4" hover={true}>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <m.icon className="h-4.5 w-4.5 text-slate-500" />
                </div>
                <span className="font-mono text-[10px] text-accent-cyan font-bold leading-none">{m.trend}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">{m.label}</p>
                <h4 className="text-3xl font-mono font-bold text-white tracking-tight leading-none">{m.val}</h4>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 📊 PRIMARY PANEL: Analytics & Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Distribution Chart (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
              <BarChart2 className="h-4 w-4 text-accent-indigo" /> Neural Load Distribution
            </h2>
            <div className="flex items-center gap-6">
               <span className="flex items-center gap-2 text-[10px] font-mono text-accent-indigo font-bold">
                 <span className="h-1.5 w-1.5 rounded-full bg-accent-indigo animate-pulse" /> Live Stream
               </span>
            </div>
          </div>
          
          <GlassCard className="h-[500px] p-8 relative overflow-hidden" hover={false}>
             {/* Gradient Depth Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-40 pointer-events-none z-10" />
             <div className="relative z-0 h-full">
               {LoadChart}
             </div>
          </GlassCard>

          {/* Detailed Context Panel */}
          {selectedIncident && (
            <GlassCard className="p-10 space-y-10 border-accent-indigo/10" hover={false}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant={selectedIncident.status as any} className="px-4 py-1 text-[10px]">{selectedIncident.status.toUpperCase()}</Badge>
                    <span className="text-[11px] text-slate-600 font-mono tracking-[0.3em] font-bold uppercase">{selectedIncident.id}</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight">
                    {selectedIncident.title}
                  </h3>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2.5rem] min-w-[200px] text-center shadow-inner">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2">Impact Intensity</p>
                  <p className="text-5xl font-mono font-bold text-white leading-none tracking-tighter">{selectedIncident.neuralImpact}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                    <LocateFixed className="h-3.5 w-3.5" /> Target Vectors
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed font-semibold italic">
                    {selectedIncident.location}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                    <TrendingUp className="h-3.5 w-3.5" /> Intelligence Analysis
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {selectedIncident.description}
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-surface/50 border border-white/[0.08] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <ShieldCheck className="h-24 w-24 text-accent-cyan" />
                </div>
                <div className="relative z-10 space-y-4">
                  <p className="text-[10px] font-bold text-accent-cyan uppercase tracking-[0.2em] flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4" /> Aegis Predictive Mitigation
                  </p>
                  <p className="text-base text-slate-300 leading-relaxed italic font-medium">
                    &quot;{selectedIncident.aiAnalysis}&quot;
                  </p>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* 📋 SECONDARY: Intelligence Feed (4 cols) */}
        <aside className="lg:col-span-4 space-y-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-3">
            Real-time Intelligence
          </h2>
          
          <div className="space-y-3">
            {incidents.map((incident) => (
              <button
                key={incident.id}
                onClick={() => setSelectedIncidentId(incident.id)}
                className="w-full text-left focus:outline-none block"
              >
                <GlassCard 
                  hover={true}
                  className={cn(
                    "p-5 transition-all flex items-center gap-5 border-l-2",
                    selectedIncidentId === incident.id
                      ? "bg-white/[0.08] border-accent-indigo shadow-lg"
                      : "bg-white/[0.01] border-l-transparent hover:border-l-slate-700"
                  )}
                >
                  {/* Priority Indicator */}
                  <div className={cn(
                    "w-1 h-full absolute left-0 top-0 bottom-0",
                    incident.status === 'critical' ? 'bg-red-500' : 
                    incident.status === 'high' ? 'bg-accent-indigo' :
                    incident.status === 'medium' ? 'bg-accent-cyan' : 'bg-slate-700'
                  )} />
                  
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-slate-500 font-bold tracking-[0.2em] uppercase leading-none">{incident.id}</span>
                      <span className="text-[9px] font-mono text-slate-600 font-bold">
                        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs font-bold leading-snug transition-colors",
                      selectedIncidentId === incident.id ? "text-white" : "text-slate-400"
                    )}>
                      {incident.title}
                    </p>
                  </div>
                </GlassCard>
              </button>
            ))}
          </div>

          <GlassCard className="p-8 space-y-6 bg-accent-indigo/5 border-accent-indigo/10" hover={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/20">
                <BarChart2 className="h-5 w-5 text-accent-indigo" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Flow Efficiency</h3>
                <p className="text-[9px] font-mono text-slate-500 font-bold">BETA_RELEASE_v1.2</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Neural efficiency is performing at <span className="text-white font-bold">1.2 Petaflops</span> with 99.9% autonomous mitigation across the edge network.
            </p>
            <Button variant="ghost" className="w-full border-white/[0.05] h-11 text-xs font-bold">View Cluster Health</Button>
          </GlassCard>
        </aside>
      </div>
    </main>
  );
}



