"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Clock, 
  ArrowUpRight,
  ChevronRight,
  AlertTriangle,
  LocateFixed,
  BarChart2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockDataService, MetricPoint, Incident } from "@/lib/mockData";
import { Button } from "@/components/Button";
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

  // Memoize chart to avoid unnecessary re-renders
  const LoadChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={metrics}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
        <XAxis 
          dataKey="time" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10}}
          interval={6}
        />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#020617', 
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            fontSize: '11px',
            color: '#fff'
          }} 
          itemStyle={{ color: '#6366F1' }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#6366F1" 
          strokeWidth={1.5}
          fillOpacity={1} 
          fill="url(#colorValue)" 
          isAnimationActive={false} // Performance optimization
        />
      </AreaChart>
    </ResponsiveContainer>
  ), [metrics]);

  const handleProtocolAction = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 2000);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10 space-y-10">
      {/* 1. COMMAND HEADER */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              SYSTEM CORE: OPTIMAL
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Tactical Command
            </h1>
            <div className="flex flex-wrap gap-8 pt-2">
              <div className="space-y-1">
                <p className="section-label">Neural Load</p>
                <p className="text-2xl font-bold text-white tracking-tight">84.2%</p>
              </div>
              <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
              <div className="space-y-1">
                <p className="section-label">Latency</p>
                <p className="text-2xl font-bold text-white tracking-tight">42ms</p>
              </div>
              <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
              <div className="space-y-1">
                <p className="section-label">Active Nodes</p>
                <p className="text-2xl font-bold text-white tracking-tight">1,204</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleProtocolAction}
              disabled={isDeploying}
              className={cn(
                "w-full md:w-auto transition-all duration-300",
                isDeploying ? "opacity-50" : "shadow-lg shadow-indigo-500/10"
              )}
            >
              {isDeploying ? "Deploying Protocol..." : "Emergency Protocol"}
            </Button>
            <p className="text-[10px] text-slate-600 text-center md:text-right font-medium">
              AUTH: LEVEL 5 ADMINISTRATOR
            </p>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Metrics & Analytics (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> Neural Distribution
              </h2>
            </div>
            
            <div className="h-[360px] w-full bg-white/[0.01] rounded-3xl border border-white/[0.05] p-6 relative group overflow-hidden">
               {LoadChart}
            </div>
          </div>

          {/* Selected Incident Details (The updated details panel) */}
          <div className="glass rounded-[2rem] p-8 space-y-6 border border-white/[0.03]">
            {selectedIncident ? (
              <>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        selectedIncident.status === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                      )}>
                        {selectedIncident.status}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{selectedIncident.id}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{selectedIncident.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Impact Score</p>
                    <p className="text-3xl font-black text-white">{selectedIncident.neuralImpact}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <LocateFixed className="h-3 w-3" /> Location
                    </p>
                    <p className="text-sm text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                      {selectedIncident.location}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Activity className="h-3 w-3" /> System Logs
                    </p>
                    <p className="text-sm text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                      {selectedIncident.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-500/[0.03] border border-indigo-500/10 space-y-2">
                  <p className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5" /> AI Counter-Measures
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{selectedIncident.aiAnalysis}"
                  </p>
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-600 italic">
                Select an incident from the intelligence feed to view details.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Intelligence Feed (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-2">
            <AlertTriangle className="h-4 w-4" /> Intelligence Feed
          </h2>
          
          <div className="space-y-3">
            {incidents.map((incident) => (
              <button 
                key={incident.id}
                onClick={() => setSelectedIncidentId(incident.id)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl transition-all duration-200 border",
                  selectedIncidentId === incident.id
                    ? "bg-white/[0.04] border-white/10 shadow-lg"
                    : "bg-white/[0.01] border-white/[0.03] hover:border-white/10 hover:bg-white/[0.02]"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1",
                    incident.status === 'critical' ? 'bg-red-500' : 
                    incident.status === 'high' ? 'bg-amber-500' : 'bg-indigo-500'
                  )} />
                  <span className="text-[10px] font-mono text-slate-500">{incident.id}</span>
                </div>
                <p className="text-sm font-semibold text-white mb-1 truncate">{incident.title}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/[0.05] space-y-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 w-fit">
              <Zap className="h-5 w-5 text-indigo-500" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Neural Speed</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inference is currently running at 1.2 Petaflops across the edge network.
            </p>
            <Button variant="ghost" className="w-full text-[10px] py-1.5 uppercase font-bold tracking-widest border-white/5">
              Node Map
            </Button>
          </div>
        </aside>
      </div>

      {/* 3. LOWER HUB STATISTICS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/[0.05] pt-10">
         {[
           { icon: Activity, title: "Mitigation Rate", val: "99.9%", desc: "Autonomous efficiency" },
           { icon: Clock, title: "Response Mean", val: "2.4s", desc: "Human loop delay" },
           { icon: ArrowUpRight, title: "Flow Velocity", val: "1.2 TB/s", desc: "Ingress aggregate" },
         ].map((stat, i) => (
           <div key={i} className="flex gap-4 group">
             <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:border-indigo-500/20 transition-all duration-300">
               <stat.icon className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
             </div>
             <div className="space-y-0.5">
               <h4 className="section-label mb-0">{stat.title}</h4>
               <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white tracking-tight">{stat.val}</span>
                <span className="text-[10px] text-slate-600 font-medium">{stat.desc}</span>
               </div>
             </div>
           </div>
         ))}
      </section>
    </main>
  );
}

