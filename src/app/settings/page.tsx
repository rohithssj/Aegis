"use client";

import React, { useEffect, useState } from "react";
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
  History,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { isAdmin } from "@/lib/auth";

export default function SettingsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    inferenceSensitivity: "normal", // low | normal | enhanced
    predictiveHorizon: 6,            // hours (1–12)
    autoIsolation: true,
    alertPriority: "satellite"       // satellite | standard
  });

  // Authorization check
  useEffect(() => {
    const checkAuth = async () => {
      const admin = isAdmin();
      if (!admin) {
        router.replace("/admin");
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch settings from Firebase
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchSettings = async () => {
      try {
        const ref = doc(db, "config", "globalSettings");
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to sync global configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [isAuthorized]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "config", "globalSettings"), settings);
      toast.success("System configuration updated globally", {
        description: "Neural protocols synchronized across all edge nodes."
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to broadcast changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#05070A]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Validating Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 container-premium pt-32 pb-16 section-spacing pb-40 bg-[#05070A]">
      <header className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-3">
          <Badge variant="neutral" dot={false} className="font-bold rounded-lg px-2">v4.5.0_STABLE</Badge>
          {loading && <Badge variant="low" className="animate-pulse">SYNCING...</Badge>}
        </div>
        <h1 className="hero-heading">
          Global <span className="text-slate-500">Configuration</span>
        </h1>
        <p className="body-text text-slate-400">
          Fine-tune the Aegis orchestrator and neural defense layers. Changes apply globally to the edge network within 5ms.
        </p>
      </header>

      <div className="space-y-12 mt-16 text-white">
        {/* Intelligence Settings */}
        <section className="space-y-8 animate-in">
          <div className="space-y-2 px-1">
            <h2 className="section-heading text-white">Intelligence & Analysis</h2>
            <p className="text-xs text-slate-500 font-medium">Manage neural network parameters and predictive modeling triggers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-6 space-y-6 rounded-2xl" hover={false}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent-indigo/10 text-accent-indigo">
                  <Cpu className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Inference Sensitivity</p>
                  <p className="text-[10px] text-slate-500">Anomaly detection threshold</p>
                </div>
              </div>
              <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                {["low", "normal", "enhanced"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSettings({ ...settings, inferenceSensitivity: mode })}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all",
                      settings.inferenceSensitivity === mode 
                        ? "bg-accent-indigo text-white shadow-lg" 
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-6 rounded-2xl" hover={false}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Predictive Horizon</p>
                  <p className="text-[10px] text-slate-500">Forecasting range (1–12 hours)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  value={settings.predictiveHorizon}
                  onChange={(e) => setSettings({ ...settings, predictiveHorizon: parseInt(e.target.value) })}
                  className="flex-1 accent-accent-cyan"
                />
                <span className="text-xl font-mono font-bold text-white min-w-[3ch]">{settings.predictiveHorizon}h</span>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Protocol Settings */}
        <section className="space-y-8 animate-in">
          <div className="space-y-2 px-1">
            <h2 className="section-heading text-white">Security & Protocols</h2>
            <p className="text-xs text-slate-500 font-medium">Configure automated response triggers and network isolation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-6 flex items-center justify-between rounded-2xl" hover={false}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent-indigo/10 text-accent-indigo">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Auto-Isolation</p>
                  <p className="text-[10px] text-slate-500">Lock nodes on critical detection</p>
                </div>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, autoIsolation: !settings.autoIsolation })}
                className={cn(
                  "w-12 h-6 rounded-full p-1 transition-all duration-300",
                  settings.autoIsolation ? "bg-accent-indigo" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full transition-all duration-300",
                  settings.autoIsolation ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </GlassCard>

            <GlassCard className="p-6 space-y-6 rounded-2xl" hover={false}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Critical Alert Priority</p>
                  <p className="text-[10px] text-slate-500">Delivery channel for Priority 1</p>
                </div>
              </div>
              <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                {["standard", "satellite"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSettings({ ...settings, alertPriority: mode })}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all",
                      settings.alertPriority === mode 
                        ? "bg-accent-cyan text-slate-900 shadow-lg" 
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>
      </div>

      <GlassCard className="p-8 md:p-10 mt-16 flex flex-col md:flex-row items-center justify-between gap-8 border-accent-indigo/10 rounded-3xl" hover={false}>
         <div className="flex items-center gap-6">
            <div className="h-12 w-12 rounded-full bg-accent-indigo/10 flex items-center justify-center text-accent-indigo border border-white/[0.05] shadow-lg">
              <History className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="label-text mb-0 text-white">Protocol Version Control</p>
              <p className="text-xs text-slate-400 font-mono font-bold tracking-widest uppercase">v4.5.0-PROXIMA_b{new Date().getFullYear()}.{new Date().getMonth()+1}.{new Date().getDate()}</p>
            </div>
         </div>
         <Button 
           variant="primary" 
           size="lg" 
           className="w-full md:w-auto min-w-[200px]"
           onClick={handleSave}
           disabled={isSaving}
         >
           {isSaving ? "BROADCASTING..." : "Broadcast Changes"}
         </Button>
      </GlassCard>
    </main>
  );
}
