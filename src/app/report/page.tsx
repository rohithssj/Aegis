"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  MapPin, 
  AlignLeft, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Clock,
  Activity,
  Zap
} from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";
import { useIncidents } from "@/context/IncidentContext";
import { AegisLogo } from "@/components/AegisLogo";
import { toast } from "sonner";

const INCIDENT_TYPES = ["Flood", "Fire", "Earthquake", "Cyber Attack", "Other"];
const SEVERITY_LEVELS = ["low", "medium", "high", "critical"];

export default function ReportPage() {
  const router = useRouter();
  const { addIncident } = useIncidents();
  
  const [formData, setFormData] = useState({
    type: "Cyber Attack",
    location: "",
    description: "",
    status: "medium" as "low" | "medium" | "high" | "critical",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const getCoordinates = async (location: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const cacheKey = `geo_${location.toLowerCase().trim()}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
        { headers: { "User-Agent": "Aegis-Crisis-Management-System" } }
      );

      if (!response.ok) throw new Error("Geolocation service unavailable");
      const data = await response.json();

      if (data && data.length > 0) {
        const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        localStorage.setItem(cacheKey, JSON.stringify(coords));
        return coords;
      }
      return null;
    } catch (error) {
      console.error("Geolocation error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.description) return;

    setIsSubmitting(true);
    
    try {
      const coords = await getCoordinates(formData.location);
      
      // Simulate Heuristic Processing delay (Internal to submission)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const aiData = {
        summary: "Neural grid identifies anomalous activity vector. Heuristic patterns indicate a legitimate emergency state.",
        risk: formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
        confidence: 94 + Math.floor(Math.random() * 5),
        priority: formData.status === "critical" ? "P1" : (formData.status === "high" ? "P2" : "P3"),
        unit: formData.type === "Cyber Attack" ? "Nexus Tactical" : "Aegis Vanguard",
        explanation: "Threat signatures correlate with reported vector. Automated triage recommends immediate response protocols."
      };

      const id = await addIncident({
        type: formData.type,
        severity: formData.status as any,
        location: formData.location,
        description: formData.description,
        aiAnalysis: aiData.summary,
        aiRisk: aiData.risk,
        aiScore: aiData.confidence,
        aiConfidence: aiData.confidence,
        aiPriority: aiData.priority,
        aiUnit: aiData.unit,
        aiExplanation: aiData.explanation,
        lat: coords?.lat || 20.5937,
        lng: coords?.lng || 78.9629,
        neuralImpact: Math.min(100, Math.max(0, aiData.confidence + (formData.status === 'critical' ? 20 : 0))),
        threatScore: aiData.confidence / 10,
        aiMitigation: "Deploying rapid response units and isolating affected regional nodes.",
        aiNarration: "Aegis Command has acknowledged the report. Heuristic analysis suggests a high-probability event matching the reported vector. Tactical units are in position."
      });
      
      setTrackingId(id);
      setIsSubmitted(true);
      
      // REMOVED: Automatic status progression (analyzing/responding timeouts)
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Transmission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); // Standardize with auth key
    router.push("/");
  };

  const { incidents } = useIncidents();
  const currentIncident = incidents.find(inc => inc.id === trackingId);
  
  // Explicitly use backend status, defaulting to processing for new reports
  const currentStatus = currentIncident?.status || "processing";
  const steps = ["processing", "analyzing", "responding", "resolved"];
  
  // Calculate active steps based on real status
  const getActiveStepsCount = (status: string) => {
    switch (status) {
      case "processing": return 1;
      case "analyzing": return 2;
      case "responding": return 3;
      case "resolved": return 4;
      default: return 1;
    }
  };
  
  const activeSteps = getActiveStepsCount(currentStatus);
  const currentStepIndex = steps.indexOf(currentStatus);

  const statusConfigs = {
    processing: { color: "text-slate-400", bg: "bg-slate-400/10", icon: Loader2 },
    analyzing: { color: "text-blue-400", bg: "bg-blue-400/10", icon: Activity },
    responding: { color: "text-purple-500", bg: "bg-purple-500/10", icon: Zap },
    resolved: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  };

  const config = statusConfigs[currentStatus as keyof typeof statusConfigs] || statusConfigs.processing;

  return (
    <main className="min-h-screen bg-[#05070A] py-12 md:py-24 px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden text-white">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex items-center justify-center">
        <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest outline-none"
                >
                  <ArrowLeft className="w-4 h-4" /> Exit Portal
                </button>
                <AegisLogo className="w-10 h-10" showText={false} />
              </div>

              <GlassCard className="p-8 md:p-12 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                <div className="space-y-10">
                  <div className="space-y-3">
                    <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter">Report <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic">Incident</span></h1>
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Transmission Protocol Initialized</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-purple-500" /> Event Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                        >
                          {INCIDENT_TYPES.map((t) => (
                            <option key={t} value={t} className="bg-[#0F172A]">
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <ShieldAlert className="h-3 w-3 text-purple-500" /> Priority
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                        >
                          {SEVERITY_LEVELS.map((s) => (
                            <option key={s} value={s} className="bg-[#0F172A]">
                              {s.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-purple-500" /> Geographic Sector
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Northeast Corridor / Node 78"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <AlignLeft className="h-3 w-3 text-purple-500" /> Intelligence Brief
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide mission-critical details..."
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.location || !formData.description}
                      size="lg"
                      className="w-full h-16 rounded-2xl text-xs font-bold tracking-widest uppercase"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" /> Synthesizing Data...
                        </span>
                      ) : (
                        "Upload Intelligence Report"
                      )}
                    </Button>
                  </form>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center space-y-8"
            >
              <GlassCard className="p-8 md:p-16 rounded-[4rem] border-white/5 bg-white/[0.01] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
                
                <div className="flex flex-col items-center gap-10">
                  <div className={cn("p-8 rounded-full relative transition-all duration-500", config.bg, config.color)}>
                    <config.icon className={cn("w-16 h-16 transition-all", currentStatus === 'processing' && 'animate-spin')} />
                    <motion.div 
                      key={currentStatus}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn("absolute inset-0 rounded-full border-4", activeSteps === 4 ? "border-emerald-500/30" : "border-blue-500/30")}
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-5xl font-bold text-white tracking-tight">Transmission Complete</h2>
                    <p className="text-slate-400 text-lg max-w-sm mx-auto font-medium">Aegis Intelligence is orchestrating tactical response protocols.</p>
                  </div>

                  <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Tracking ID</span>
                        <span className="text-sm font-mono font-bold text-white">{trackingId}</span>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Status</span>
                        <span className={cn("text-sm font-bold uppercase flex items-center gap-2", config.color)}>
                          <span className={cn("w-2 h-2 rounded-full animate-pulse", activeSteps === 4 ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-current")} />
                          {currentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Progress Indicator - Reflecting Real-time Status Only */}
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
                            initial={{ width: "25%" }}
                            animate={{ width: `${(activeSteps / steps.length) * 100}%` }}
                            className={cn("absolute h-full transition-all duration-700", 
                              activeSteps === 4 ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
                            )}
                          />
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-16 rounded-2xl border-white/5 hover:bg-white/5 text-xs"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          type: "Cyber Attack",
                          location: "",
                          description: "",
                          status: "medium",
                        });
                      }}
                    >
                      New Report
                    </Button>
                    <Button 
                      className="flex-1 h-16 rounded-2xl text-xs"
                      onClick={handleLogout}
                    >
                      Exit System
                    </Button>
                  </div>
                </div>
              </GlassCard>

              {currentIncident?.aiAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 w-full max-w-md mx-auto"
                >
                  <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Heuristic Evaluation</p>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="space-y-1">
                        <p className="text-[9px] text-slate-500 uppercase font-bold">Risk</p>
                        <p className="text-xs text-white font-bold">{currentIncident.aiRisk}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-slate-500 uppercase font-bold">Confidence</p>
                        <p className="text-xs text-blue-400 font-bold">{currentIncident.aiConfidence}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-slate-500 uppercase font-bold">Priority</p>
                        <p className={cn(
                          "text-xs font-bold",
                          currentIncident.aiPriority === "P1" ? "text-red-500" :
                          currentIncident.aiPriority === "P2" ? "text-yellow-500" :
                          "text-green-500"
                        )}>
                          {currentIncident.aiPriority}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed italic border-t border-white/5 pt-6">
                      &quot;{currentIncident.aiAnalysis}&quot;
                    </p>
                  </GlassCard>
                </motion.div>
              )}
              
              <div className="flex items-center justify-center gap-3 opacity-30 pt-4">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Neural acknowledgement verified</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
