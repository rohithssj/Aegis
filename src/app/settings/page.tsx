"use client";

import React from "react";
import { 
  Settings, 
  Shield, 
  Cpu, 
  Lock, 
  Bell, 
  Users, 
  Database, 
  Globe,
  ChevronRight,
  Zap,
  Activity,
  History
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const SETTING_GROUPS = [
  {
    title: "Intelligence & Analysis",
    description: "Manage neural network parameters and predictive modeling triggers.",
    items: [
      { id: "infer-mode", name: "Inference Sensitivity", desc: "Level of sensitivity for anomaly detection", icon: Cpu, val: "Enhanced" },
      { id: "predict-horizon", name: "Predictive Horizon", desc: "How far into the future AI attempts to forecast", icon: Zap, val: "6 Hours" },
      { id: "neural-sync", name: "Neural Sync Frequency", desc: "Synchronization rate between core and edge nodes", icon: Database, val: "Real-time" },
    ]
  },
  {
    title: "Security & Protocols",
    description: "Configure the Aegis firewall and automated response triggers.",
    items: [
      { id: "firewall-lv", name: "Firewall Aggression", desc: "Strictness of automated packet drop protocols", icon: Shield, val: "Tier 4" },
      { id: "auth-mode", name: "Access Protocols", desc: "Neural biometric requirements for root actions", icon: Lock, val: "Biometric L3" },
      { id: "node-isolation", name: "Auto-Isolation", desc: "Automatically isolate nodes on critical detection", icon: Globe, val: "Enabled" },
    ]
  },
  {
    title: "Notifications & Alerts",
    description: "Manage how you receive mission-critical updates.",
    items: [
      { id: "alert-level", name: "Critical Alert Priority", desc: "Delivery method for Priority 1 incidents", icon: Bell, val: "Satellite Overrride" },
      { id: "team-sync", name: "Incident Team Sync", desc: "Share active incident logs with tactical teams", icon: Users, val: "Opt-in" },
    ]
  }
];

export default function SettingsPage() {
  const router = useRouter();
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

  if (!isAuthorized) return null;
  return (
    <main className="flex-1 container-premium pt-32 pb-16 section-spacing pb-40">
      <header className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-3">
          <Badge variant="neutral" dot={false} className="font-bold rounded-lg px-2">v4.2.0</Badge>
        </div>
        <h1 className="hero-heading">
          Global <span className="text-slate-500">Configuration</span>
        </h1>
        <p className="body-text">
          Fine-tune the Aegis orchestrator and neural defense layers. Changes apply globally to the edge network within 5ms.
        </p>
      </header>

      <div className="space-y-16">
        {SETTING_GROUPS.map((group, i) => (
          <section key={i} className="space-y-8 animate-in">
            <div className="space-y-2 px-1">
              <h2 className="section-heading text-white">{group.title}</h2>
              <p className="text-xs text-slate-500 font-medium">{group.description}</p>
            </div>

            <div className="space-y-3">
              {group.items.map((item) => (
                <GlassCard 
                  key={item.id} 
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 md:p-6 transition-all duration-300 gap-6 rounded-2xl"
                  hover={true}
                >
                  <div className="flex items-center gap-5">
                    <div className="p-2.5 rounded-2xl bg-accent-indigo/[0.03] border border-white/[0.05] text-accent-indigo">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white tracking-tight leading-none uppercase">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-none">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-[10px] font-mono font-bold text-accent-cyan bg-accent-cyan/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05] uppercase tracking-widest leading-none">
                      {item.val}
                    </span>
                    <Button variant="ghost" size="sm" className="hidden md:flex py-2 border-white/[0.05] h-9">Modify</Button>
                    <ChevronRight className="h-4 w-4 text-slate-700 md:hidden" />
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        ))}
      </div>

      <GlassCard className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-accent-indigo/10 rounded-3xl" hover={false}>
         <div className="flex items-center gap-6">
            <div className="h-12 w-12 rounded-full bg-accent-indigo/10 flex items-center justify-center text-accent-indigo border border-white/[0.05] shadow-lg">
              <History className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="label-text mb-0">Protocol Version Control</p>
              <p className="text-xs text-slate-400 font-mono font-bold tracking-widest">v4.2.0-STABLE_b2026.04.18</p>
            </div>
         </div>
         <Button variant="primary" size="lg" className="w-full md:w-auto min-w-[200px]">Broadcast Changes</Button>
      </GlassCard>
    </main>
  );
}


