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
    <main className="min-h-screen bg-[#05070A] text-white pt-32 pb-40 overflow-x-hidden">
      <div className="container-premium max-w-5xl mx-auto px-6 space-y-16 animate-in">
        
        {/* Header Section */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="neutral" dot={false} className="font-bold rounded-lg px-2 bg-white/5 border-white/10 text-slate-400 uppercase tracking-widest text-[10px]">v4.5.0_STABLE</Badge>
            {loading && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Syncing Protocols...</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
              Global <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Configuration</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl font-medium">
              Fine-tune the Aegis orchestrator and neural defense layers. Changes apply globally to the edge network.
            </p>
          </div>
        </header>

        <div className="space-y-16">
          {/* Intelligence Settings */}
          <section className="space-y-8">
            <div className="space-y-2 px-1">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <Cpu className="w-6 h-6 text-blue-400" /> Intelligence & Analysis
              </h2>
              <p className="text-sm text-slate-500 font-medium">Manage neural network parameters and predictive modeling triggers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-8 space-y-8 rounded-2xl border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Inference Sensitivity</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Anomaly Detection Threshold</p>
                  </div>
                </div>
                <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl">
                  {["low", "normal", "enhanced"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettings({ ...settings, inferenceSensitivity: mode })}
                      className={cn(
                        "flex-1 py-3 text-[10px] font-bold uppercase rounded-xl transition-all duration-300",
                        settings.inferenceSensitivity === mode 
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-8 space-y-8 rounded-2xl border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Predictive Horizon</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Forecasting range (1–12 hours)</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <input 
                    type="range" 
                    min="1" 
                    max="12" 
                    value={settings.predictiveHorizon}
                    onChange={(e) => setSettings({ ...settings, predictiveHorizon: parseInt(e.target.value) })}
                    className="flex-1 accent-purple-500 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xl font-mono font-bold text-white">{settings.predictiveHorizon}h</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* Protocol Settings */}
          <section className="space-y-8">
            <div className="space-y-2 px-1">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" /> Security & Protocols
              </h2>
              <p className="text-sm text-slate-500 font-medium">Configure automated response triggers and network isolation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-8 flex items-center justify-between rounded-2xl border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Auto-Isolation</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Lock nodes on critical detection</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, autoIsolation: !settings.autoIsolation })}
                  className={cn(
                    "w-14 h-7 rounded-full p-1.5 transition-all duration-500 ease-in-out",
                    settings.autoIsolation ? "bg-blue-500 shadow-lg shadow-blue-500/20" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full transition-all duration-500 ease-in-out shadow-sm",
                    settings.autoIsolation ? "translate-x-7" : "translate-x-0"
                  )} />
                </button>
              </GlassCard>

              <GlassCard className="p-8 space-y-8 rounded-2xl border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Critical Alert Priority</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Delivery channel for Priority 1</p>
                  </div>
                </div>
                <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl">
                  {["standard", "satellite"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettings({ ...settings, alertPriority: mode })}
                      className={cn(
                        "flex-1 py-3 text-[10px] font-bold uppercase rounded-xl transition-all duration-300",
                        settings.alertPriority === mode 
                          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" 
                          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
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

        {/* Action Bar */}
        <GlassCard className="p-10 flex flex-col md:flex-row items-center justify-between gap-10 border-white/10 bg-white/[0.02] rounded-[3rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
           <div className="flex items-center gap-8">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <History className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white uppercase tracking-widest">Protocol Version Control</p>
                <p className="text-xs text-slate-500 font-mono font-bold tracking-[0.2em] uppercase">
                  v4.5.0-PROXIMA_b{new Date().getFullYear()}.{new Date().getMonth()+1}.{new Date().getDate()}
                </p>
              </div>
           </div>
           <Button 
             variant="primary" 
             size="lg" 
             className="w-full md:w-auto min-w-[240px] h-16 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl"
             onClick={handleSave}
             disabled={isSaving}
           >
             {isSaving ? (
               <span className="flex items-center gap-3">
                 <Loader2 className="w-4 h-4 animate-spin" /> Broadcasting...
               </span>
             ) : (
               "Synchronize Protocols"
             )}
           </Button>
        </GlassCard>
      </div>
    </main>
  );
}
