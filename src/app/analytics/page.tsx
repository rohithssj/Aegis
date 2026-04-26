"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  ChevronLeft
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useIncidents } from "@/context/IncidentContext";
import { Button } from "@/components/Button";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const router = useRouter();
  const { incidents, loading } = useIncidents();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const stats = useMemo(() => {
    if (incidents.length === 0) return { total: 0, critical: 0, normal: 0, avgResponse: 0 };

    const total = incidents.length;
    const critical = incidents.filter(i => i.severity === "critical" || i.severity === "high").length;
    const normal = total - critical;

    // Calculate average response time in minutes
    const resolvedIncidents = incidents.filter(i => i.status === "resolved" && i.timeline);
    let totalMinutes = 0;

    resolvedIncidents.forEach(inc => {
      const start = new Date(inc.createdAt).getTime();
      const resolvedEntry = inc.timeline?.find(t => t.status === "Incident resolved");
      if (resolvedEntry) {
        const end = new Date(resolvedEntry.time).getTime();
        totalMinutes += (end - start) / (1000 * 60);
      }
    });

    const avgResponse = resolvedIncidents.length > 0 
      ? Math.round(totalMinutes / resolvedIncidents.length) 
      : 0;

    return { total, critical, normal, avgResponse };
  }, [incidents]);

  if (!isAuthorized || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Accessing Neural Archives...</p>
      </div>
    </div>
  );

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full pt-32 pb-12 px-6 space-y-12 animate-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/dashboard")}
            className="pl-0 text-slate-500 hover:text-white transition-all"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Command
          </Button>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            System <span className="bg-gradient-to-r from-accent-indigo to-accent-indigo-light bg-clip-text text-transparent italic">Analytics</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
            Historical response data and neural load distribution metrics across all active sectors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Incidents", val: stats.total, icon: BarChart3, color: "text-accent-indigo", desc: "Total recorded events in database" },
          { label: "Critical vs Normal", val: `${stats.critical} / ${stats.normal}`, icon: ShieldAlert, color: "text-red-500", desc: "High-priority vs standard events" },
          { label: "Avg Response Time", val: `${stats.avgResponse}m`, icon: Clock, color: "text-accent-cyan", desc: "Average time from creation to resolution" }
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-8 space-y-6 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border-white/[0.05]" hover={true}>
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]", m.color)}>
                  <m.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</p>
                <h4 className="text-4xl font-bold text-white tracking-tighter">{m.val}</h4>
                <p className="text-[10px] text-slate-600 font-medium">{m.desc}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 rounded-[2rem] border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-accent-indigo" /> Severity Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-600">LIVE_VIEW_v2</span>
          </div>
          <div className="space-y-4">
             {['Critical', 'High', 'Medium', 'Low'].map((level) => {
               const count = incidents.filter(i => i.severity === level.toLowerCase()).length;
               const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
               return (
                 <div key={level} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-400">{level}</span>
                      <span className="text-white">{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                          "h-full",
                          level === 'Critical' ? 'bg-red-500' : 
                          level === 'High' ? 'bg-orange-500' :
                          level === 'Medium' ? 'bg-yellow-500' : 'bg-accent-cyan'
                        )}
                      />
                    </div>
                 </div>
               );
             })}
          </div>
        </GlassCard>

        <GlassCard className="p-8 rounded-[2rem] border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Resolution Health
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
             <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={377}
                    initial={{ strokeDashoffset: 377 }}
                    animate={{ strokeDashoffset: 377 - (377 * (incidents.filter(i => i.status === "resolved").length / stats.total)) || 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="text-emerald-500"
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-white">
                  {stats.total > 0 ? Math.round((incidents.filter(i => i.status === "resolved").length / stats.total) * 100) : 0}%
                </span>
             </div>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">System-wide Resolution Rate</p>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}

// Helper function for class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
