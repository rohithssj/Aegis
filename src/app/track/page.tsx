"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  db 
} from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  ArrowRight,
  Activity,
  Zap,
  ShieldCheck
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Incident } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function TrackPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "user") {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const [trackingId, setTrackingId] = useState("");
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setSearched(true);
    setIncident(null);

    try {
      const q = query(collection(db, "incidents"), where("trackingId", "==", trackingId.trim()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setIncident({ id: docSnap.id, ...docSnap.data() } as Incident);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = ["processing", "analyzing", "responding", "resolved"];
  const currentStepIndex = incident ? steps.indexOf(incident.status) : -1;

  const statusConfigs = {
    processing: { color: "text-slate-400", bg: "bg-slate-400/10", icon: Loader2 },
    analyzing: { color: "text-accent-cyan", bg: "bg-accent-cyan/10", icon: Activity },
    responding: { color: "text-accent-indigo", bg: "bg-accent-indigo/10", icon: Zap },
    resolved: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
    dismissed: { color: "text-slate-500", bg: "bg-slate-500/10", icon: ShieldAlert }
  };

  const config = incident ? (statusConfigs[incident.status as keyof typeof statusConfigs] || statusConfigs.processing) : statusConfigs.processing;
  if (!isAuthorized) return null;

  return (
    <main className="min-h-screen bg-[#0B1120] pt-32 pb-12 px-6 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="low" className="bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20 px-4">Tracking Portal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Track <span className="italic font-medium bg-gradient-to-r from-accent-indigo to-accent-indigo-light bg-clip-text text-transparent">Incident</span> State
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Enter your unique tracking ID to monitor real-time mitigation progress and tactical response status.
          </p>
        </div>

        <GlassCard className="p-2 rounded-[2rem] bg-white/[0.02] border-white/5 shadow-2xl">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-accent-indigo transition-colors" />
              <input 
                type="text" 
                placeholder="Enter Tracking ID (e.g. AEG-2031)" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full bg-transparent border-none rounded-[1.5rem] py-6 pl-16 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent-indigo/20 transition-all font-mono tracking-widest text-lg"
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              disabled={loading || !trackingId.trim()}
              className="rounded-[1.5rem] px-10 h-auto md:py-0 py-6 text-sm font-bold tracking-widest uppercase"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Tracking ID"}
            </Button>
          </form>
        </GlassCard>

        <AnimatePresence mode="wait">
          {searched && !loading && !incident && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12 space-y-4 opacity-50"
            >
              <ShieldAlert className="h-12 w-12 text-slate-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-lg font-bold text-white tracking-tight">No Incident Found</p>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                  The provided ID could not be matched with any active neural event in our database.
                </p>
              </div>
            </motion.div>
          )}

          {incident && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <GlassCard className="p-8 md:p-12 rounded-[3.5rem] border-white/5 bg-white/[0.01] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse" />
                
                <div className="flex flex-col items-center gap-10">
                  <div className={cn("p-6 rounded-full relative transition-all duration-500", config.bg, config.color)}>
                    <config.icon className={cn("w-16 h-16 transition-all", incident.status === 'processing' && 'animate-spin')} />
                    <motion.div 
                      key={incident.status}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn("absolute inset-0 rounded-full border-2", incident.status === 'resolved' ? "border-emerald-500/30" : "border-accent-cyan/30")}
                    />
                  </div>

                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-4">
                      <Badge variant={incident.severity as any} className="px-5 py-1 text-[10px] lowercase tracking-widest font-bold rounded-full">{incident.severity} priority</Badge>
                      <span className="text-slate-700 font-mono text-xl tracking-[0.2em]">/</span>
                      <span className="text-slate-400 font-mono text-xs font-bold tracking-widest uppercase">{incident.trackingId}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-lg">
                      {incident.title}
                    </h2>
                  </div>

                  <div className="w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <p className="label-text lowercase flex items-center gap-3">
                          <MapPin className="h-3.5 w-3.5" /> Geographic Sector
                        </p>
                        <p className="text-base text-slate-300 font-medium">{incident.location}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="label-text lowercase flex items-center gap-3">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Live Status
                        </p>
                        <div className={cn("flex items-center gap-3 text-lg font-bold uppercase tracking-widest", config.color)}>
                          <span className={cn("w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]", incident.status === 'resolved' ? "bg-emerald-500" : "bg-current")} />
                          {incident.status}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                       <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Tactical Lifecycle</h3>
                          <Badge variant="neutral" className="bg-white/5 text-slate-500 border-none font-mono text-[9px] px-3">{Math.round((currentStepIndex + 1) / 4 * 100)}% COMPLETE</Badge>
                       </div>
                       <div className="flex justify-between relative px-2">
                         <div className="absolute top-4 left-0 right-0 h-[1px] bg-white/5 -z-0 mx-8" />
                         {steps.map((step, idx, arr) => {
                           const isCurrent = step === incident.status;
                           const isPast = arr.indexOf(incident.status) >= idx;
                           return (
                             <div key={step} className="flex flex-col items-center gap-6 relative z-10">
                                <div className={cn(
                                  "w-8 h-8 rounded-full border-4 border-[#0B1120] transition-all duration-700 flex items-center justify-center",
                                  isCurrent ? "bg-accent-indigo scale-125 shadow-[0_0_20px_rgba(91,76,240,0.4)]" : 
                                  isPast ? "bg-accent-indigo/40" : "bg-white/10"
                                )}>
                                  {isPast && !isCurrent && <ShieldCheck className="w-4 h-4 text-white/50" />}
                                  {isCurrent && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                                </div>
                                <span className={cn(
                                  "text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-700 font-bold",
                                  isCurrent ? "text-white" : isPast ? "text-slate-500" : "text-slate-700"
                                )}>{step}</span>
                             </div>
                           );
                         })}
                       </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-accent-indigo/[0.03] border border-accent-indigo/10 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 p-8 opacity-5">
                        <Activity className="h-24 w-24 text-accent-indigo" />
                      </div>
                      <div className="space-y-4">
                        <p className="label-text lowercase text-accent-indigo opacity-70 flex items-center gap-3">
                          <Zap className="h-4 w-4" /> Aegis Intelligence Summary
                        </p>
                        <p className="text-slate-300 italic text-lg leading-relaxed">
                          &quot;{incident.aiAnalysis}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <p className="text-center text-[10px] text-slate-700 font-mono tracking-widest uppercase flex items-center justify-center gap-3">
                <Clock className="w-3 h-3" /> Last Data Sync: {new Date(incident.timestamp).toLocaleTimeString()} — [ID: {incident.id}]
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
