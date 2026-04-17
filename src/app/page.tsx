"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Clock, 
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockDataService, MetricPoint } from "@/lib/mockData";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);

  useEffect(() => {
    mockDataService.getMetrics("load").then(setMetrics);
  }, []);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-12 space-y-12">
      {/* 1. HERO / COMMAND SECTION */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              System Status: Optimal
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
              Tactical Command
            </h1>
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="space-y-1">
                <p className="section-label">Neural Load</p>
                <p className="metric-value">84.2%</p>
              </div>
              <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
              <div className="space-y-1">
                <p className="section-label">Response Time</p>
                <p className="metric-value">42ms</p>
              </div>
              <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
              <div className="space-y-1">
                <p className="section-label">Active Nodes</p>
                <p className="metric-value">1,204</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button variant="primary" size="lg" className="w-full md:w-auto shadow-xl shadow-accent-primary/20">
              Declare Emergency Protocol
            </Button>
            <p className="text-xs text-slate-500 text-center md:text-right">
              Authorization level: Administrator (Level 5)
            </p>
          </div>
        </div>

        {/* Backdrop Glow */}
        <div className="absolute -top-24 -left-24 h-96 w-96 bg-accent-primary/5 blur-[120px] rounded-full -z-10" />
      </section>

      {/* 2. MAIN FOCUS AREA: Splitting the View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Focus: Primary Analytics Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Neural Load Distribution</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-white/10 text-white font-medium">24h</button>
              <button className="px-3 py-1 text-xs rounded-full text-slate-500 hover:text-white transition-colors">7d</button>
            </div>
          </div>
          
          <div className="h-[400px] w-full bg-white/[0.02] rounded-3xl border border-white/5 p-6 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}}
                  interval={4}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#020617', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }} 
                  itemStyle={{ color: '#6366F1' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Focus: AI Insights Feed */}
        <aside className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent-cyan" />
              AI Intelligence
            </h2>
            
            <div className="space-y-4">
              {[
                { label: "Anomaly Detected", desc: "Pattern mismatch in Sector 7-G", color: "text-amber-400" },
                { label: "Predictive Alert", desc: "Incoming load spike expected (15m)", color: "text-accent-primary" },
                { label: "Optimization Path", desc: "Node rerouting would gain 12% efficiency", color: "text-emerald-400" },
              ].map((insight, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300">
                    <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", insight.color)}>
                      {insight.label}
                    </p>
                    <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                      {insight.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-accent-primary/10 via-transparent to-transparent border border-white/5 space-y-4">
            <div className="p-3 rounded-2xl bg-accent-primary/20 w-fit">
              <Zap className="h-6 w-6 text-accent-primary" />
            </div>
            <h3 className="font-semibold text-white">Neural Accelerate</h3>
            <p className="text-sm text-slate-400">
              Deep-learning inference is currently running at 1.2 Petaflops across the edge network.
            </p>
            <Button variant="ghost" className="w-full text-xs py-2">View Node Map</Button>
          </div>
        </aside>
      </div>

      {/* 3. SECONDARY SECTION: Lower Hub */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/5 pt-12">
         {[
           { icon: Activity, title: "Threat Mitigation", val: "99.9%", desc: "Autonomous defense efficiency" },
           { icon: Clock, title: "Mean Response", val: "2.4s", desc: "Average human-in-the-loop time" },
           { icon: ArrowUpRight, title: "Data Velocity", val: "1.2 TB/s", desc: "Cross-border ingress speed" },
         ].map((stat, i) => (
           <div key={i} className="flex gap-4 group">
             <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-white/20 transition-all">
               <stat.icon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
             </div>
             <div className="space-y-1">
               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">{stat.title}</h4>
               <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">{stat.val}</span>
                <span className="text-xs text-slate-500 font-medium">{stat.desc}</span>
               </div>
             </div>
           </div>
         ))}
      </section>
    </main>
  );
}
