"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  AlertTriangle,
  Binary
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { cn, formatTimeAgo } from "@/lib/utils";
import { getIncidentByTrackingId } from "@/lib/getIncidentByTrackingId";
import { Incident } from "@/lib/mockData";
import { AegisLogo } from "@/components/AegisLogo";

export default function TrackPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError(null);
    setIncident(null);

    try {
      // Pass the raw trackingId to the helper (helper handles normalization)
      const data = await getIncidentByTrackingId(trackingId);
      if (data) {
        setIncident(data as any);
      } else {
        setError("Invalid Tracking ID. Please check and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the incident details.");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["processing", "analyzing", "responding", "resolved"];
  const getActiveStepsCount = (status: string) => {
    switch (status) {
      case "processing": return 1;
      case "analyzing": return 2;
      case "responding": return 3;
      case "resolved": return 4;
      default: return 1;
    }
  };

  const statusConfigs = {
    processing: { color: "text-blue-400", bg: "bg-blue-400/10", icon: Loader2 },
    analyzing: { color: "text-purple-400", bg: "bg-purple-400/10", icon: Activity },
    responding: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: Zap },
    resolved: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  };

  const activeSteps = incident ? getActiveStepsCount(incident.status) : 0;
  const config = incident ? (statusConfigs[incident.status as keyof typeof statusConfigs] || statusConfigs.processing) : statusConfigs.processing;

  return (
    <main className="min-h-screen bg-[#05070A] text-white py-24 px-6 relative overflow-hidden flex flex-col items-center">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full relative z-10 space-y-8">
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-between w-full mb-8">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest outline-none"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Nexus
            </button>
            <AegisLogo className="w-10 h-10" showText={false} />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter">Track <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic">Incident</span></h1>
          <p className="text-slate-400 font-medium">Monitor real-time status of your reported incident</p>
        </header>

        <GlassCard className="p-8 space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2 text-left">
              <label htmlFor="trackingId" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Binary className="w-3 h-3 text-purple-400" /> Tracking Identifier
              </label>
              <div className="relative group">
                <input
                  id="trackingId"
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Paste tracking ID here..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                />
                <button 
                  type="submit"
                  disabled={loading || !trackingId.trim()}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Verify
                </button>
              </div>
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest"
              >
                <AlertTriangle className="w-3 h-3" /> {error}
              </motion.div>
            )}
          </form>
        </GlassCard>

        <AnimatePresence mode="wait">
          {incident && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <GlassCard className="p-8 md:p-10 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={incident.severity as any} className="uppercase text-[9px] tracking-widest">{incident.severity}</Badge>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{incident.trackingId}</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">{incident.title}</h2>
                  </div>
                  <div className={cn("px-4 py-2 rounded-xl flex items-center gap-3 border", config.bg, config.color.replace('text-', 'border-').replace('text-', 'text-'))}>
                    <config.icon className={cn("w-4 h-4", incident.status === 'processing' && 'animate-spin')} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{incident.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" /> {incident.location}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Reported</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-400" /> {formatTimeAgo(incident.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Status Timeline</p>
                  <div className="px-2">
                    <div className="flex justify-between mb-6">
                      {steps.map((step, idx) => (
                        <div key={step} className="flex flex-col items-center gap-3">
                          <div className={cn(
                            "w-3 h-3 rounded-full transition-all duration-700",
                            idx < activeSteps ? config.color.replace('text-', 'bg-') : "bg-white/10"
                          )} />
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-[0.2em] transition-all",
                            idx < activeSteps ? "text-slate-200" : "text-slate-600"
                          )}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: `${(activeSteps / steps.length) * 100}%` }}
                        className={cn("absolute h-full transition-all duration-700", 
                          activeSteps === 4 ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-6 border-t border-white/5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Intelligence Brief</p>
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    &quot;{incident.description}&quot;
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
