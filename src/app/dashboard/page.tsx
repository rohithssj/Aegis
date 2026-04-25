"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Clock, 
  AlertTriangle,
  LocateFixed,
  BarChart2,
  TrendingUp,
  Globe,
  ShieldAlert
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MetricPoint } from "@/lib/mockData";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { GlassCard } from "@/components/GlassCard";
import { MetricSkeleton, ChartSkeleton, FeedSkeleton } from "@/components/Skeleton";
import { cn } from "@/lib/utils";
import { useIncidents } from "@/context/IncidentContext";
import { toast } from "sonner";

export default function Dashboard() {
  const router = useRouter();
  const { incidents, loading: incidentsLoading, triggerEmergencyProtocol, isEmergency } = useIncidents();
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [loading, setLoading] = useState(true);
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

  // Initialize data and start real-time simulation
  useEffect(() => {
    if (!isAuthorized) return;

    setLoading(false);

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
  }, [isAuthorized]);

  // Set initial selection once incidents arrive
  useEffect(() => {
    if (incidents.length > 0 && !selectedIncidentId) {
      setSelectedIncidentId(incidents[0].id);
    }
  }, [incidents, selectedIncidentId]);

  const selectedIncident = useMemo(() => 
    incidents.find(inc => inc.id === selectedIncidentId),
    [incidents, selectedIncidentId]
  );

  const LoadChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={metrics}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5B4CF0" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#5B4CF0" stopOpacity={0} />
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
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 10px rgba(91,76,240,0.1)'
          }} 
          itemStyle={{ color: '#5B4CF0' }}
          cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={isEmergency ? "#ef4444" : "#5B4CF0"}
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#chartGradient)" 
          activeDot={{ r: 4, stroke: isEmergency ? "#ef4444" : "#5B4CF0", strokeWidth: 2, fill: '#0B1120' }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  ), [metrics, isEmergency]);

  const handleProtocolAction = async () => {
    if (isEmergency) return;
    setIsDeploying(true);
    
    // Simulate tactical delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await triggerEmergencyProtocol();
    setIsDeploying(false);
    toast.error("EMERGENCY PROTOCOL ACTIVATED", {
      description: "Global response initiated. All node statuses updated to responding.",
      duration: 5000,
    });
  };

  if (!isAuthorized) return null;

  return (
    <main className="flex-1 container-premium pt-32 pb-12 section-spacing relative">
      
      {isEmergency && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md py-3 text-center border-b border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-in">
           <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] sm:tracking-[0.5em] text-white flex items-center justify-center gap-4">
             <AlertTriangle className="h-4 w-4 animate-pulse" /> EMERGENCY MODE ACTIVE // ALL SYSTEMS RESPONDING <AlertTriangle className="h-4 w-4 animate-pulse" />
           </span>
        </div>
      )}

      {/* HERO SECTION: Command Status */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isEmergency ? "bg-red-500" : "bg-accent-cyan")}></span>
                <span className={cn("relative inline-flex rounded-full h-2 w-2", isEmergency ? "bg-red-500" : "bg-accent-cyan")}></span>
              </span>
              <Badge variant={isEmergency ? "critical" : "low"} className={cn("px-3 py-0.5", isEmergency ? "" : "bg-accent-cyan/5 text-accent-cyan border-accent-cyan/10")}>
                {isEmergency ? "Emergency Protocol Active" : "Live System Operational"}
              </Badge>
            </div>
            <h1 className="hero-heading pr-2">
              Strategic <span className={cn("bg-gradient-to-r bg-clip-text text-transparent italic font-medium", isEmergency ? "from-red-500 to-orange-500" : "from-accent-indigo to-accent-indigo-light")}>Command</span>
            </h1>
            <p className="body-text max-w-md">
              {isEmergency ? "System-wide response active. Tactical agents deployed to all edge nodes." : "Real-time neural orchestration across 1,204 active edge nodes"}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.02] p-1.5 rounded-full border border-white/[0.05] backdrop-blur-md self-start md:self-end group transition-all duration-200">
            <div className="flex flex-col items-end px-4 py-1">
              <span className="label-text mb-1 lowercase">Protocol Status</span>
              <span className={cn("text-xs font-mono font-bold tracking-tight", isEmergency ? "text-red-500" : "text-accent-cyan")}>
                {isEmergency ? "PROTOCOL_ALPHA_ACTIVE" : "ENFORCE_v4.2"}
              </span>
            </div>
            <Button 
              variant={isEmergency ? "secondary" : "primary"} 
              size="lg" 
              onClick={handleProtocolAction}
              disabled={isDeploying || isEmergency}
              className={cn("min-w-[180px] rounded-full active:scale-[0.98]", isEmergency && "cursor-not-allowed opacity-50")}
            >
              {isDeploying ? "Synchronizing..." : isEmergency ? "Protocol Active" : "Emergency Protocol"}
            </Button>
          </div>
        </div>

        {/* Global Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
          ) : (
            [
              { label: "Neural Load", val: metrics.length > 0 ? `${metrics[metrics.length-1].value.toFixed(1)}%` : "0.0%", icon: Activity, trend: "+2.1%" },
              { label: "Network Latency", val: "42ms", icon: Zap, trend: "-12ms" },
              { label: "Active Nodes", val: "1,204", icon: Globe, trend: "Stable" },
              { label: "Threat Index", val: "0.04", icon: AlertTriangle, trend: "Minimal" },
            ].map((m, i) => (
              <GlassCard key={i} className="p-5 md:p-6 flex flex-col gap-5 group" hover={true}>
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] group-hover:border-accent-indigo/20 transition-colors">
                    <m.icon className="h-4 w-4 text-slate-400 group-hover:text-accent-indigo transition-colors" />
                  </div>
                  <span className="font-mono text-[10px] text-accent-cyan font-bold leading-none">{m.trend}</span>
                </div>
                <div className="space-y-1">
                  <p className="label-text mb-0">{m.label}</p>
                  <h4 className="text-2xl font-mono font-bold text-white tracking-tight leading-none">{m.val}</h4>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </section>

      {/* PRIMARY PANEL: Analytics & Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Distribution Chart (8 cols) */}
        <div className="md:col-span-8 space-y-10">
          <div className="flex items-center justify-between px-2">
            <h2 className="label-text mb-0 flex items-center gap-3">
              <BarChart2 className="h-4 w-4 text-accent-indigo" /> Neural Load Distribution
            </h2>
            <div className="flex items-center gap-6">
               <span className="flex items-center gap-2 text-[10px] font-mono text-accent-indigo font-bold">
                 <span className="h-1.5 w-1.5 rounded-full bg-accent-indigo animate-pulse" /> Live Stream
               </span>
            </div>
          </div>
          
          <div className="relative group">
            {loading ? (
              <ChartSkeleton />
            ) : (
              <GlassCard className="h-[280px] md:h-[520px] p-0 md:p-6 relative overflow-hidden rounded-3xl border-white/[0.08]" hover={false}>
                 <div className="absolute inset-0 bg-gradient-to-b from-accent-indigo/[0.02] to-transparent pointer-events-none" />
                 <div className="relative z-0 h-full p-6">
                   {LoadChart}
                 </div>
                 <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none z-10" />
              </GlassCard>
            )}
          </div>

          {/* Detailed Context Panel */}
          {selectedIncident && (
            <GlassCard className="p-6 md:p-10 space-y-10 border-accent-indigo/10 bg-accent-indigo/[0.01] rounded-[2.5rem] animate-in" hover={false}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge variant={selectedIncident.severity as any} className="px-4 py-1 text-[10px] rounded-full uppercase">{selectedIncident.severity}</Badge>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                      selectedIncident.status === 'processing' ? 'text-slate-400 bg-slate-400/10' :
                      selectedIncident.status === 'analyzing' ? 'text-accent-cyan bg-accent-cyan/10' :
                      selectedIncident.status === 'responding' ? 'text-accent-indigo bg-accent-indigo/10' :
                      'text-emerald-500 bg-emerald-500/10'
                    )}>
                      {selectedIncident.status !== 'resolved' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                      Status: {selectedIncident.status}
                    </div>
                    <span className="text-[11px] text-slate-600 font-mono tracking-[0.3em] font-bold uppercase">{selectedIncident.id}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {selectedIncident.title}
                  </h3>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-3xl min-w-[200px] text-center shrink-0">
                  <p className="label-text lowercase mb-2">Impact Intensity</p>
                  <p className="text-4xl md:text-5xl font-mono font-bold text-white leading-none tracking-tighter">{selectedIncident.neuralImpact}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-3">
                  <p className="label-text flex items-center gap-3">
                    <LocateFixed className="h-3.5 w-3.5" /> Target Vectors
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed font-semibold italic">
                    {selectedIncident.location}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <p className="label-text flex items-center gap-3">
                    <TrendingUp className="h-3.5 w-3.5" /> Intelligence Analysis
                  </p>
                  <p className="body-text">
                    {selectedIncident.description}
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8 rounded-2xl bg-white/[0.01] border border-white/[0.03] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <ShieldCheck className="h-24 w-24 text-accent-cyan" />
                </div>
                <div className="relative z-10 space-y-4">
                  <p className="label-text flex items-center gap-3 lowercase text-accent-cyan/80">
                    <ShieldCheck className="h-4 w-4" /> Aegis Predictive Mitigation
                  </p>
                  <p className="body-text italic">
                    &quot;{selectedIncident.aiAnalysis}&quot;
                  </p>
                  
                  {selectedIncident.aiAnalysis && (
                    <div className="mt-8 pt-6 border-t border-white/[0.05]">
                      <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mb-4">AI Tactical Recommendation</p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-1 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.03]">
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Tactical Unit</p>
                          <p className="text-xs font-bold text-white">{selectedIncident.aiUnit || (selectedIncident as any).aiHospital}</p>
                        </div>
                        <div className="space-y-1 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.03]">
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Risk Index</p>
                          <p className="text-xs font-bold text-white">{selectedIncident.aiRisk}</p>
                        </div>
                        <div className="space-y-1 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.03]">
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Confidence Score</p>
                          <p className="text-xs font-bold text-accent-cyan">{selectedIncident.aiScore}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* SECONDARY: Intelligence Feed (4 cols) */}
        <aside className="md:col-span-4 space-y-8">
          <h2 className="label-text mb-0 px-3">
            Real-time Intelligence
          </h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <FeedSkeleton />
            ) : incidents.length === 0 ? (
              <div className="p-8 text-center glass rounded-2xl space-y-4 opacity-50">
                <ShieldCheck className="h-8 w-8 mx-auto text-slate-500" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">No active incidents detected</p>
                  <p className="text-[10px] text-slate-500 font-medium">System is operating normally</p>
                </div>
              </div>
            ) : (
              incidents.map((incident) => (
              <button
                key={incident.id}
                onClick={() => setSelectedIncidentId(incident.id)}
                className="w-full text-left focus:outline-none block group/item"
              >
                <GlassCard 
                  hover={false}
                  className={cn(
                    "p-5 transition-all duration-300 border-l-2 relative rounded-2xl overflow-hidden",
                    selectedIncidentId === incident.id
                      ? "bg-white/[0.08] border-l-accent-indigo shadow-lg translate-x-1"
                      : "bg-white/[0.01] border-l-transparent hover:border-l-slate-700 hover:bg-white/[0.03] hover:translate-x-1"
                  )}
                >
                  <div className={cn(
                    "w-[2px] h-full absolute left-0 top-0 bottom-0",
                    incident.severity === 'critical' ? 'bg-red-500' : 
                    incident.severity === 'high' ? 'bg-orange-500' :
                    incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-accent-cyan'
                  )} />
                  
                  <div className="flex-1 space-y-2.5 pl-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-slate-500 font-bold tracking-[0.2em] uppercase leading-none">{incident.trackingId}</span>
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                          incident.status === 'processing' ? 'text-slate-400 bg-slate-400/10' :
                          incident.status === 'analyzing' ? 'text-accent-cyan bg-accent-cyan/10' :
                          incident.status === 'responding' ? 'text-accent-indigo bg-accent-indigo/10' :
                          'text-emerald-500 bg-emerald-500/10'
                        )}>
                          {incident.status !== 'resolved' && <span className="w-1 h-1 rounded-full bg-current animate-pulse" />}
                          {incident.status}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-600 font-bold">
                        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs font-bold leading-snug transition-colors",
                      selectedIncidentId === incident.id ? "text-white" : "text-slate-400 group-hover/item:text-slate-200"
                    )}>
                      {incident.title}
                    </p>
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-medium text-slate-500 flex items-center gap-1.5">
                         <LocateFixed className="h-2.5 w-2.5" /> {incident.location}
                       </span>
                    </div>
                  </div>
                </GlassCard>
              </button>
            )))}
          </div>

          <GlassCard className="p-8 space-y-6 bg-accent-indigo/5 border-accent-indigo/10" hover={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/20">
                <BarChart2 className="h-5 w-5 text-accent-indigo" />
              </div>
              <div>
                <h3 className="label-text mb-0">Flow Efficiency</h3>
                <p className="text-[9px] font-mono text-slate-500 font-bold">BETA_RELEASE_v1.2</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Neural efficiency is performing at <span className="text-white font-bold">1.2 Petaflops</span> with 99.9% autonomous mitigation across the edge network.
            </p>
            <Button variant="ghost" className="w-full border-white/[0.05] h-11 text-xs font-bold hover:bg-white/[0.05] rounded-xl">View Cluster Health</Button>
          </GlassCard>
        </aside>
      </div>
    </main>
  );
}
