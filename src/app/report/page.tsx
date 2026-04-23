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
  Clock
} from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { useIncidents } from "@/context/IncidentContext";
import { AegisLogo } from "@/components/AegisLogo";

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

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.description) return;

    setIsSubmitting(true);
    
    // Simulate tactical delay
    setTimeout(() => {
      addIncident(formData);
      const generatedId = "AEG-" + Math.floor(1000 + Math.random() * 9000);
      setTrackingId(generatedId);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#0B1120] py-12 px-6 flex items-center justify-center">
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
                <AegisLogo className="w-8 h-8" />
              </div>

              <GlassCard className="p-8 md:p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Report Incident</h1>
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
                          <Loader2 className="w-5 h-5 animate-spin" /> Transmitting Signal...
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
              <GlassCard className="p-12 md:p-16 rounded-[3rem] border-white/5 bg-white/[0.02] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />
                
                <div className="flex flex-col items-center gap-8">
                  <div className="p-6 rounded-full bg-accent-cyan/10 text-accent-cyan relative">
                    <CheckCircle2 className="w-16 h-16" />
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-accent-cyan/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-4xl font-bold text-white tracking-tight">Incident Reported</h2>
                    <p className="text-slate-400 text-lg">Authorities have been notified and response protocols are active.</p>
                  </div>

                  <div className="w-full max-w-sm bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Tracking ID</span>
                      <span className="text-sm font-mono font-bold text-accent-cyan">{trackingId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Status</span>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                        <span className="text-sm font-mono font-bold text-white uppercase italic">Processing...</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-14 rounded-2xl border-white/5 hover:bg-white/5 font-bold"
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
                      className="flex-1 h-14 rounded-2xl font-bold"
                      onClick={handleLogout}
                    >
                      Close Portal
                    </Button>
                  </div>
                </div>
              </GlassCard>
              
              <div className="flex items-center justify-center gap-3 opacity-30">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]">Neural acknowledgement received // 200 OK</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
