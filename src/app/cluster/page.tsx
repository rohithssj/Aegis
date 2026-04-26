"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Server, 
  ShieldCheck, 
  Globe, 
  AlertCircle, 
  Zap, 
  Clock,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/Badge";
import { useIncidents } from "@/context/IncidentContext";
import { cn } from "@/lib/utils";

export default function ClusterHealthPage() {
  const router = useRouter();
  const { incidents, loading } = useIncidents();

  // Derived metrics (Memoized for performance)
  const stats = useMemo(() => {
    const active = incidents.filter(i => i.status !== "resolved" && i.status !== "dismissed").length;
    const critical = incidents.filter(i => i.severity === "critical" && i.status !== "resolved").length;
    return {
      activeIncidents: active,
      criticalAlerts: critical,
      avgResponseTime: "42ms",
      systemStatus: critical > 3 ? "degraded" : "healthy",
      totalNodes: 1204
    };
  }, [incidents]);

  const regionalData = [
    { name: "India North", load: 68, incidents: 2, status: "stable" },
    { name: "India South", load: 45, incidents: 0, status: "stable" },
    { name: "India East", load: 82, incidents: 4, status: "warning" },
    { name: "India West", load: 55, incidents: 1, status: "stable" },
    { name: "India Central", load: 30, incidents: 0, status: "stable" },
  ];

  const containers = "max-w-7xl mx-auto px-4 md:px-6";

  return (
    <main className="min-h-screen bg-[#0B1120] py-24 md:py-32 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-indigo/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className={cn(containers, "relative z-10 space-y-12")}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest outline-none group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return to Command
            </button>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Cluster <span className="text-accent-indigo italic">Health</span>
            </h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Real-time telemetry across global edge network</p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
             <div className="flex flex-col items-end px-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Overall Status</span>
                <span className={cn(
                  "text-xs font-mono font-bold uppercase tracking-tighter",
                  stats.systemStatus === "healthy" ? "text-emerald-500" : "text-amber-500"
                )}>
                  SYSTEM_{stats.systemStatus.toUpperCase()}
                </span>
             </div>
             <div className={cn(
               "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500",
               stats.systemStatus === "healthy" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
             )}>
               {stats.systemStatus === "healthy" ? <ShieldCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6 animate-pulse" />}
             </div>
          </div>
        </div>

        {/* Mini Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Avg Response Time", val: stats.avgResponseTime, icon: Clock, color: "text-accent-cyan" },
            { label: "Active Incidents", val: stats.activeIncidents, icon: Activity, color: "text-accent-indigo" },
            { label: "Critical Alerts", val: stats.criticalAlerts, icon: AlertCircle, color: "text-red-500" },
          ].map((m, i) => (
            <GlassCard key={i} className="p-6 md:p-8 flex items-center gap-6 group hover:scale-[1.02] transition-all" hover={true}>
              <div className={cn("p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-current/20 transition-colors", m.color)}>
                <m.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{m.label}</p>
                <h4 className="text-3xl font-mono font-bold text-white tracking-tighter leading-none">{m.val}</h4>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* System Nodes (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
             <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
               <Server className="w-4 h-4" /> System Nodes
             </h2>
             <GlassCard className="p-8 space-y-8" hover={false}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Active Nodes</p>
                    <p className="text-4xl font-mono font-bold text-white">{stats.totalNodes.toLocaleString()}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-accent-indigo/20 flex items-center justify-center relative">
                     <div className="absolute inset-0 border-4 border-accent-indigo border-t-transparent rounded-full animate-spin" />
                     <Zap className="w-6 h-6 text-accent-indigo" />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex justify-between items-center">
                     <span className="text-[11px] text-slate-400">Node Status</span>
                     <Badge variant={stats.systemStatus === 'healthy' ? 'low' : 'high'}>
                       {stats.systemStatus === 'healthy' ? 'Nominal' : 'Warning'}
                     </Badge>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[11px] text-slate-400">Uptime</span>
                     <span className="text-[11px] font-mono text-emerald-500 font-bold">99.998%</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[11px] text-slate-400">Sync Latency</span>
                     <span className="text-[11px] font-mono text-accent-cyan font-bold">2.4ms</span>
                   </div>
                </div>

                <Button variant="ghost" className="w-full border-white/5 h-12 text-[10px] font-bold uppercase tracking-widest hover:bg-white/[0.03]">
                  Manual Node Refresh
                </Button>
             </GlassCard>
          </div>

          {/* Regional Health (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
             <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
               <Globe className="w-4 h-4" /> Regional Health (India Zones)
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regionalData.map((reg, idx) => (
                  <GlassCard key={idx} className="p-6 space-y-6 group hover:-translate-y-1 transition-all" hover={true}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{reg.name}</h3>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        reg.status === 'stable' ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                      )} />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono uppercase font-bold">
                          <span className="text-slate-500">Node Load</span>
                          <span className={cn(reg.load > 80 ? "text-red-500" : "text-white")}>{reg.load}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${reg.load}%` }}
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              reg.load > 80 ? "bg-red-500" : "bg-accent-indigo"
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={cn("w-3.5 h-3.5", reg.incidents > 0 ? "text-amber-500" : "text-slate-600")} />
                          <span className="text-[10px] font-bold text-slate-400">{reg.incidents} Incidents</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 font-bold uppercase tracking-widest">{reg.status}</span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
