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
import { useRouter } from "next/navigation";
import { mockDataService, MetricPoint } from "@/lib/mockData";
import { Badge } from "@/components/Badge";
import { GlassCard } from "@/components/GlassCard";
import { MetricSkeleton, ChartSkeleton } from "@/components/Skeleton";
import { Activity, Zap, Cpu, TrendingUp, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const router = useRouter();
  const [loadData, setLoadData] = useState<MetricPoint[]>([]);
  const [latencyData, setLatencyData] = useState<MetricPoint[]>([]);
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

  useEffect(() => {
    Promise.all([
      mockDataService.getMetrics("load"),
      mockDataService.getMetrics("latency")
    ]).then(([load, latency]) => {
      setLoadData(load);
      setLatencyData(latency);
      setLoading(false);
    });
  }, []);

  const MainReliabilityChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={loadData}>
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
          interval={4} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'var(--font-mono)'}} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0F172A', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '12px', 
            fontSize: '11px', 
            fontFamily: 'var(--font-mono)',
            color: '#fff' 
          }} 
          cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <Legend 
          verticalAlign="top" 
          height={40} 
          iconType="circle" 
          wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '20px' }} 
        />
        <Area 
          type="monotone" 
          name="Neural Load" 
          dataKey="value" 
          stroke="#5B4CF0" 
          strokeWidth={2} 
          fillOpacity={1} 
          fill="url(#colorIndigo)" 
          isAnimationActive={false} 
        />
        <Area 
          type="monotone" 
          name="Predicted Baseline" 
          dataKey="expected" 
          stroke="rgba(255,255,255,0.15)" 
          strokeDasharray="4 4" 
          strokeWidth={1} 
          fill="transparent" 
          isAnimationActive={false} 
        />
      </AreaChart>
    </ResponsiveContainer>
  ), [loadData]);

  const LatencyChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={latencyData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
        <XAxis 
          dataKey="time" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'var(--font-mono)'}} 
          interval={6} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'var(--font-mono)'}} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0F172A', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '12px', 
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: '#fff'
          }} 
        />
        <Line 
          type="stepAfter" 
          dataKey="value" 
          stroke="#5B4CF0" 
          strokeWidth={2} 
          dot={false} 
          isAnimationActive={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  ), [latencyData]);

  const NodeEfficiencyChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={[
        { name: 'AP-East', val: 94 },
        { name: 'US-West', val: 82 },
        { name: 'EU-North', val: 99 },
        { name: 'Lunar-S', val: 65 },
        { name: 'Sat-Net', val: 78 }
      ]}>
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'var(--font-mono)'}} 
        />
        <YAxis hide />
        <Tooltip 
          cursor={{fill: 'rgba(255,255,255,0.02)'}} 
          contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)' }} 
        />
        <Bar dataKey="val" fill="#5B4CF0" opacity={0.6} radius={[4, 4, 0, 0]} barSize={32} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  ), []);

  if (!isAuthorized) return null;

  return (
    <main className="flex-1 container-premium pt-32 pb-12 section-spacing">
      {/* Page Header */}
      <header className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-3">
          <Badge variant="low" className="bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20">System Intelligence</Badge>
        </div>
        <h1 className="hero-heading">
          Neural <span className="bg-gradient-to-r from-accent-indigo to-accent-indigo-light bg-clip-text text-transparent italic font-medium">Analytics</span>
        </h1>
        <p className="body-text">
          Deep-dive analysis of neural network efficiency, response patterns, and cross-border data velocity metrics across the Aegis core.
        </p>
      </header>

      {/* Primary Trend Chart (Full Width) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="label-text mb-0 flex items-center gap-3">
            <Activity className="h-4 w-4 text-accent-indigo" /> Global Reliability Metric
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono font-bold text-accent-cyan">99.99% UPTIME</span>
          </div>
        </div>
        
        {loading ? (
          <ChartSkeleton />
        ) : (
          <GlassCard className="h-[450px] p-8 rounded-3xl" hover={false}>
            {MainReliabilityChart}
          </GlassCard>
        )}
      </section>

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-6">
          <h2 className="label-text mb-0 flex items-center gap-3">
            <Zap className="h-4 w-4 text-accent-cyan" /> Ingress Latency (ms)
          </h2>
          {loading ? (
            <div className="h-[320px] glass rounded-3xl animate-pulse" />
          ) : (
            <GlassCard className="h-[320px] p-6 rounded-3xl" hover={false}>
              {LatencyChart}
            </GlassCard>
          )}
        </section>

        <section className="space-y-6">
          <h2 className="label-text mb-0 flex items-center gap-3">
            <Cpu className="h-4 w-4 text-accent-indigo" /> Node Efficiency Index
          </h2>
          {loading ? (
            <div className="h-[320px] glass rounded-3xl animate-pulse" />
          ) : (
            <GlassCard className="h-[320px] p-6 rounded-3xl" hover={false}>
              {NodeEfficiencyChart}
            </GlassCard>
          )}
        </section>
      </div>

      {/* Metrics Summary Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
        ) : (
          [
            { label: "Neural Flow", val: "18.4 PB", trend: "+12%", bg: "bg-accent-indigo/5", border: "border-accent-indigo/10" },
            { label: "Threats Blocked", val: "142,000", trend: "+0.4%", bg: "bg-red-500/5", border: "border-red-500/10" },
            { label: "Nodes Active", val: "12,402", trend: "0.0%", bg: "bg-accent-cyan/5", border: "border-accent-cyan/10" },
            { label: "Sync Latency", val: "0.08ms", trend: "-0.01", bg: "bg-emerald-500/5", border: "border-emerald-500/10" }
          ].map((item, i) => (
            <GlassCard key={i} className={cn("p-5 md:p-6 flex flex-col gap-5", item.bg, item.border)} hover={true}>
               <div className="flex items-center justify-between">
                 <p className="label-text mb-0">{item.label}</p>
                 <TrendingUp className="h-3 w-3 text-slate-600" />
               </div>
               <div className="flex items-baseline justify-between">
                 <h4 className="text-2xl font-mono font-bold text-white tracking-tight">{item.val}</h4>
                 <span className="text-[9px] font-mono font-bold text-accent-cyan">{item.trend}</span>
               </div>
            </GlassCard>
          ))
        )}
      </section>
    </main>
  );
}


