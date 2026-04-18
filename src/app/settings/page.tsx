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
  Zap
} from "lucide-react";
import { Button } from "@/components/Button";

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
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 py-10 space-y-12 pb-32">
      <header className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-4">
          <Settings className="h-8 w-8 text-slate-600" />
          Configuration
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          Fine-tune the Aegis orchestrator and neural defense layers. Changes apply globally to the edge network within 5ms.
        </p>
      </header>

      <div className="space-y-12">
        {SETTING_GROUPS.map((group, i) => (
          <section key={i} className="space-y-6">
            <div className="space-y-1 px-1">
              <h2 className="text-lg font-bold text-white tracking-tight">{group.title}</h2>
              <p className="text-xs text-slate-500 font-medium">{group.description}</p>
            </div>

            <div className="space-y-2">
              {group.items.map((item) => (
                <div 
                  key={item.id} 
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-white/[0.01] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-200 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all duration-300">
                      <item.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-[10px] text-slate-600 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10 uppercase tracking-wider">
                      {item.val}
                    </span>
                    <Button variant="ghost" size="sm" className="hidden md:flex py-1.5 border-white/[0.03]">Configure</Button>
                    <ChevronRight className="h-4 w-4 text-slate-700 md:hidden" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="pt-8 border-t border-white/[0.05] flex items-center justify-between">
         <div className="space-y-1">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Version</p>
           <p className="text-[10px] text-slate-600 font-mono">AEGIS-STABLE-4.2.0 (B2026.04.18)</p>
         </div>
         <Button variant="primary" size="md">Apply Global Sync</Button>
      </div>
    </main>
  );
}

