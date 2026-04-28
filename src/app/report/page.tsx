"use client";

import React, { useState, useEffect } from "react";
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
import { callGemini } from "@/lib/ai";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const INCIDENT_TYPES = ["Flood", "Fire", "Earthquake", "Cyber Attack", "Other"];
const SEVERITY_LEVELS = ["low", "medium", "high", "critical"];

export default function ReportPage() {
  const router = useRouter();
  const { addIncident, updateIncidentStatus } = useIncidents();
  
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
      if (!coords) {
        toast.error("Location lookup failed", {
          description: "Using fallback tactical coordinates.",
        });
      }

      // AI Analysis via Gemini
      const prompt = `
        You are an advanced emergency response AI.
        Analyze this incident:
        Type: ${formData.type}
        Location: ${formData.location}
        Description: ${formData.description}
        Severity: ${formData.status}

        Return STRICT JSON format:
        {
          "summary": "Brief analysis of the situation",
          "risk": "Critical/High/Medium/Low",
          "confidence": 0-100,
          "priority": "P1/P2/P3",
          "unit": "Recommended response unit name",
          "explanation": "3-point explanation of decision"
        }
      `;

      const aiRaw = await callGemini(prompt);
      let aiData;

      try {
        const jsonMatch = aiRaw.match(/\{[\s\S]*\}/);
        aiData = JSON.parse(jsonMatch ? jsonMatch[0] : aiRaw);
      } catch (err) {
        aiData = {
          summary: "AI analysis unavailable.",
          risk: formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
          confidence: 85,
          priority: formData.status === "critical" ? "P1" : "P3",
          unit: "General Response Unit",
          explanation: aiRaw || "Manual priority override."
        };
      }

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
        lat: coords?.lat,
        lng: coords?.lng,
        neuralImpact: Math.min(100, Math.max(0, aiData.confidence + (formData.status === 'critical' ? 20 : 0))),
        threatScore: aiData.confidence / 10
      });
      
      setTrackingId(id);
      setIsSubmitted(true);

      setTimeout(() => updateIncidentStatus(id, "analyzing"), 3000);
      setTimeout(() => updateIncidentStatus(id, "responding"), 8000);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Transmission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/");
  };

  const { incidents } = useIncidents();
  const currentIncident = incidents.find(inc => inc.id === trackingId);
  const currentStatus = currentIncident?.status || "processing";
  const steps = ["processing", "analyzing", "responding", "resolved"];
  const currentStepIndex = steps.indexOf(currentStatus);

  const statusConfigs = {
    processing: { color: "text-slate-400", bg: "bg-slate-400/10", icon: Loader2 },
    analyzing: { color: "text-accent-cyan", bg: "bg-accent-cyan/10", icon: Activity },
    responding: { color: "text-accent-indigo", bg: "bg-accent-indigo/10", icon: Zap },
    resolved: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  };

  const config = statusConfigs[currentStatus as keyof typeof statusConfigs] || statusConfigs.processing;

  return (
    <main className="min-h-screen bg-[#0B1120] py-12 md:py-24 px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <h1 className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em] mb-4">REPORT PAGE WORKING</h1>
      
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
                <AegisLogo className="w-8 h-8" showText={false} />
              </div>

              <GlassCard className="p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border-white/5 bg-white/[0.01] hover:scale-[1.005] transition-all duration-300">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Report <span className="text-accent-indigo italic">Incident</span></h1>
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Transmission Protocol Initialized</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="label-text lowercase flex items-center gap-2 font-bold">
                          <AlertTriangle className="h-3 w-3 text-accent-indigo" /> Event Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent-indigo/20 transition-all appearance-none cursor-pointer"
                        >
                          {INCIDENT_TYPES.map((t) => (
                            <option key={t} value={t} className="bg-[#0F172A]">
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="label-text lowercase flex items-center gap-2 font-bold">
                          <ShieldAlert className="h-3 w-3 text-accent-indigo" /> Priority
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent-indigo/20 transition-all appearance-none cursor-pointer"
                        >
                          {SEVERITY_LEVELS.map((s) => (
                            <option key={s} value={s} className="bg-[#0F172A]">
                              {s.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="label-text lowercase flex items-center gap-2 font-bold">
                        <MapPin className="h-3 w-3 text-accent-indigo" /> Geographic Sector
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Northeast Corridor / Node 78"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-indigo/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="label-text lowercase flex items-center gap-2 font-bold">
                        <AlignLeft className="h-3 w-3 text-accent-indigo" /> Intelligence Brief
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide mission-critical details..."
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-indigo/20 transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.location || !formData.description}
                      size="lg"
                      className="w-full h-16 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 relative overflow-hidden"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" /> Analyzing scenario...
                        </span>
                      ) : (
                        "Upload Intelligence Report"
                      )}
                    </Button>
                    {isSubmitting && (
                      <div className="flex justify-center pt-2">
                        <p className="text-accent-cyan animate-pulse text-[10px] font-mono font-bold uppercase tracking-widest">
                          Generating AI response...
                        </p>
                      </div>
                    )}
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
              <GlassCard className="p-8 md:p-12 rounded-[3.5rem] border-white/5 bg-white/[0.01] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent animate-pulse" />
                
                <div className="flex flex-col items-center gap-8">
                  <div className={cn("p-6 rounded-full relative transition-all duration-500", config.bg, config.color)}>
                    <config.icon className={cn("w-12 h-12 transition-all", currentStatus === 'processing' && 'animate-spin')} />
                    <motion.div 
                      key={currentStatus}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn("absolute inset-0 rounded-full border-2", currentStepIndex === 3 ? "border-emerald-500/30" : "border-accent-cyan/30")}
                    />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-4xl font-bold text-white tracking-tight">Incident Reported</h2>
                    <p className="text-slate-400 text-sm max-w-sm">Emergency signal transmitted. Aegis Intelligence is orchestrating tactical response.</p>
                  </div>

                  <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 text-left">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Tracking ID</span>
                        <span className="text-xs font-mono font-bold text-white">{trackingId}</span>
                      </div>
                      <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 text-left">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Live Status</span>
                        <span className={cn("text-xs font-bold uppercase flex items-center gap-2", config.color)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", currentStepIndex === 3 ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-current")} />
                          {currentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="px-2">
                       <div className="flex justify-between mb-5">
                         {steps.map((step, idx) => (
                           <div key={step} className="flex flex-col items-center gap-3">
                              <motion.div 
                                animate={{ scale: idx === currentStepIndex ? 1.2 : 1 }}
                                className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-500",
                                idx <= currentStepIndex ? config.color.replace('text-', 'bg-') : "bg-white/10"
                              )} />
                              <span className={cn(
                                "text-[9px] font-mono uppercase tracking-widest transition-all",
                                idx <= currentStepIndex ? "text-slate-200 font-bold" : "text-slate-600"
                              )}>
                                {step}
                              </span>
                           </div>
                         ))}
                       </div>
                       <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            className={cn("absolute h-full transition-all duration-500", 
                              currentStepIndex === 3 ? "bg-emerald-500" : "bg-accent-indigo"
                            )}
                          />
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-14 rounded-2xl border-white/5 hover:bg-white/5 font-bold text-xs tracking-widest uppercase"
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
                      Report Another
                    </Button>
                    <Button 
                      className="flex-1 h-14 rounded-2xl font-bold text-xs tracking-widest uppercase"
                      onClick={handleLogout}
                    >
                      Close Portal
                    </Button>
                  </div>
                </div>
              </GlassCard>

              {currentIncident?.aiAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 w-full max-w-md mx-auto"
                >
                  <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-5 backdrop-blur-sm">
                    <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mb-3">AI Intelligence Response</p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-[9px] text-white/30 uppercase font-bold">Risk</p>
                        <p className="text-[11px] text-white/90 font-medium">{currentIncident.aiRisk}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-white/30 uppercase font-bold">Confidence</p>
                        <p className="text-[11px] text-accent-cyan font-bold">{currentIncident.aiConfidence}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-white/30 uppercase font-bold">Priority</p>
                        <p className={cn(
                          "text-[11px] font-bold",
                          currentIncident.aiPriority === "P1" ? "text-red-500" :
                          currentIncident.aiPriority === "P2" ? "text-yellow-500" :
                          "text-green-500"
                        )}>
                          {currentIncident.aiPriority}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed italic border-t border-white/[0.03] pt-3">
                      &quot;{currentIncident.aiAnalysis}&quot;
                    </p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex items-center justify-center gap-3 opacity-30">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]">Neural acknowledgement received — 200 OK</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
