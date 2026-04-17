"use client";

import React, { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { mockDataService, MetricPoint } from "@/lib/mockData";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/Badge";
import { Activity, Zap, Shield, Cpu, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [loadData, setLoadData] = useState<MetricPoint[]>([]);
  const [latencyData, setLatencyData] = useState<MetricPoint[]>([]);

  useEffect(() => {
    mockDataService.getMetrics("load").then(setLoadData);
    mockDataService.getMetrics("latency").then(setLatencyData);
  }, []);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-12 space-y-16">
      {/* Page Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">Advanced Analytics</h1>
        <p className="text-slate-400 max-w-2xl">
          Deep-dive analysis of neural network efficiency, response patterns, and cross-border data velocity metrics.
        </p>
      </header>

      {/* Primary Trend Chart (Full Width) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent-primary" />
            Network Reliability (24h)
          </h2>
          <Badge variant="low">99.998% GLOBAL UPTIME</Badge>
        </div>
        
        <div className="h-[400px] w-full bg-white/[0.01] rounded-[2rem] border border-white/5 p-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={loadData}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" name="Actual Load" dataKey="value" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
              <Area type="monotone" name="Baseline Target" dataKey="expected" stroke="#8B5CF6" strokeDasharray="5 5" strokeWidth={1} fillOpacity={1} fill="url(#colorTarget)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Latency Distribution */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Ingress Latency (ms)
          </h2>
          <div className="h-[300px] bg-white/[0.01] rounded-[2rem] border border-white/5 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                <Line type="stepAfter" dataKey="value" stroke="#06B6D4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Node Performance Bar Chart */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-violet-500" />
            Cross-Node Efficiency
          </h2>
          <div className="h-[300px] bg-white/[0.01] rounded-[2rem] border border-white/5 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'AP-East', val: 94 },
                { name: 'US-West', val: 82 },
                { name: 'EU-North', val: 99 },
                { name: 'LUNAR-S', val: 65 },
                { name: 'SAT-Net', val: 78 }
              ]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                <Bar dataKey="val" fill="#8B5CF6" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Metrics Summary */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5">
        {[
          { label: "Neural Flow", val: "18.4 PB", sub: "Processed / 24h", color: "text-accent-primary" },
          { label: "Threats Blocked", val: "142k", sub: "Autonomous defensive acts", color: "text-red-400" },
          { label: "Network nodes", val: "12.4k", sub: "Active edge instances", color: "text-accent-cyan" },
          { label: "Sync Latency", val: "0.08ms", sub: "Core-to-Edge sync time", color: "text-emerald-400" }
        ].map((item, i) => (
          <div key={i} className="space-y-2">
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.label}</p>
             <h4 className={cn("text-3xl font-bold tracking-tight", item.color)}>{item.val}</h4>
             <p className="text-xs text-slate-500">{item.sub}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
