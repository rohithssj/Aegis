"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { Badge } from "@/components/Badge";
import { Activity, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [loadData, setLoadData] = useState<MetricPoint[]>([]);
  const [latencyData, setLatencyData] = useState<MetricPoint[]>([]);

  useEffect(() => {
    mockDataService.getMetrics("load").then(setLoadData);
    mockDataService.getMetrics("latency").then(setLatencyData);
  }, []);

  // Performance Optimization: Memoize Charts
  const MainReliabilityChart = useMemo(() => (
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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} interval={4} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '11px' }} 
        />
        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
        <Area type="monotone" name="Actual Load" dataKey="value" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" isAnimationActive={false} />
        <Area type="monotone" name="Baseline" dataKey="expected" stroke="#8B5CF6" strokeDasharray="5 5" strokeWidth={1} fillOpacity={1} fill="url(#colorTarget)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  ), [loadData]);

  const LatencyChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={latencyData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} interval={6} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
        <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '11px' }} />
        <Line type="stepAfter" dataKey="value" stroke="#6366F1" strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  ), [latencyData]);

  const NodeEfficiencyChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={[
        { name: 'AP-East', val: 94 },
        { name: 'US-West', val: 82 },
        { name: 'EU-North', val: 99 },
        { name: 'LUNAR-S', val: 65 },
        { name: 'SAT-Net', val: 78 }
      ]}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
        <YAxis hide />
        <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '11px' }} />
        <Bar dataKey="val" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={32} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  ), []);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10 space-y-12">
      {/* Page Header */}
      <header className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Advanced Analytics</h1>
        <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
          Deep-dive analysis of neural network efficiency, response patterns, and cross-border data velocity metrics.
        </p>
      </header>

      {/* Primary Trend Chart (Full Width) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Activity className="h-4 w-4" /> Global Reliability
          </h2>
          <Badge variant="low" className="text-[10px] tracking-widest font-bold">99.99% UPTIME</Badge>
        </div>
        
        <div className="h-[400px] w-full bg-white/[0.01] rounded-3xl border border-white/[0.05] p-8">
          {MainReliabilityChart}
        </div>
      </section>

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Latency Distribution */}
        <section className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" /> Ingress Latency (ms)
          </h2>
          <div className="h-[280px] bg-white/[0.01] rounded-3xl border border-white/[0.05] p-6">
            {LatencyChart}
          </div>
        </section>

        {/* Node Performance Bar Chart */}
        <section className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-violet-500" /> Node Efficiency
          </h2>
          <div className="h-[280px] bg-white/[0.01] rounded-3xl border border-white/[0.05] p-6">
            {NodeEfficiencyChart}
          </div>
        </section>
      </div>

      {/* Metrics Summary */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-white/[0.05]">
        {[
          { label: "Neural Flow", val: "18.4 PB", sub: "24h Volume", color: "text-indigo-400" },
          { label: "Threats Blocked", val: "142k", sub: "Autonomous defensive", color: "text-red-400" },
          { label: "Nodes active", val: "12.4k", sub: "Edge instances", color: "text-cyan-400" },
          { label: "Sync Latency", val: "0.08ms", sub: "Core-to-Edge", color: "text-emerald-400" }
        ].map((item, i) => (
          <div key={i} className="space-y-1">
             <p className="section-label mb-0">{item.label}</p>
             <h4 className={cn("text-2xl font-bold tracking-tight", item.color)}>{item.val}</h4>
             <p className="text-[10px] text-slate-600 font-medium">{item.sub}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

