"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Activity,
  ShieldAlert,
  Search,
  Hash,
  Binary,
  Layers,
  ShieldCheck,
  PackageSearch,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { FeedSkeleton } from "@/components/Skeleton";
import { cn, formatTimeAgo } from "@/lib/utils";
import { useIncidents } from "@/context/IncidentContext";
import { toast } from "sonner";
import { Incident } from "@/lib/mockData";
import { callGemini } from "@/lib/ai";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function IncidentsPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [assignedUnit, setAssignedUnit] = useState("");
  const { incidents, loading: feedLoading, updateIncidentStatus, dismissIncident, updateIncident, addIncidentLog } = useIncidents();
  
  const [aiAnalysisText, setAiAnalysisText] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Authorization check
  useEffect(() => {
    if (!isAdmin()) {
      router.push("/admin");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Initial selection
  useEffect(() => {
    if (incidents.length > 0 && !selectedId) {
      setSelectedId(incidents[0].id);
    }
  }, [incidents, selectedId]);

  const selectedIncident = incidents.find((inc) => inc.id === selectedId);

  // Debug visibility
  useEffect(() => {
    console.log("SELECTED INCIDENT:", selectedIncident?.trackingId);
    console.log("AI DATA STATE:", aiAnalysisText);
  }, [selectedIncident, aiAnalysisText]);

  // Reset state when incident changes
  useEffect(() => {
    if (selectedIncident) {
      setAiAnalysisText(selectedIncident.aiNarration || null);
    }
  }, [selectedId, selectedIncident]);

  const handleGenerateIntel = useCallback(async () => {
    if (!selectedIncident || isAiLoading || aiAnalysisText) return;
    
    setIsAiLoading(true);
    console.log("TRIGGERING AI FOR:", selectedIncident.trackingId);

    try {
      const intelPrompt = `
        Analyze this incident for Aegis Command:
        Description: ${selectedIncident.description}
        Location: ${selectedIncident.location}
        
        Return a structured tactical report:
        1. Situation Summary
        2. Risk Level & Confidence
        3. Priority & Tactical Unit
        4. Detailed Explanation
      `;
      
      const narration = await callGemini(intelPrompt);
      console.log("AI RESULT RECEIVED:", narration);
      
      setAiAnalysisText(narration);

      // Cache in Firebase
      await updateDoc(doc(db, "incidents", selectedIncident.id), {
        aiNarration: narration
      });
    } catch (err) {
      console.error("AI Intel Error:", err);
      setAiAnalysisText("Intelligence node offline. Heuristic fallback active.");
    } finally {
      setIsAiLoading(false);
    }
  }, [selectedIncident, isAiLoading, aiAnalysisText]);

  // Auto-trigger if missing
  useEffect(() => {
    if (selectedIncident && !selectedIncident.aiNarration && !aiAnalysisText && !isAiLoading) {
      handleGenerateIntel();
    }
  }, [selectedIncident, aiAnalysisText, isAiLoading, handleGenerateIntel]);

  const handleAdminUpdate = async () => {
    if (!selectedId) return;
    if (assignedUnit) await updateIncident(selectedId, { assignedUnit });
    if (adminNote) {
      await addIncidentLog(selectedId, adminNote);
      setAdminNote("");
    }
    toast.success("Admin records updated");
  };

  const STATUS_ORDER = ["processing", "analyzing", "responding", "resolved"];
  const currentIdx = selectedIncident ? STATUS_ORDER.indexOf(selectedIncident.status) : -1;

  const handleStatusUpdate = async (status: Incident["status"]) => {
    if (!selectedIncident) return;
    await updateIncidentStatus(selectedIncident.id, status);
    toast.success(`Incident state updated`);
  };

  const handleDismiss = async () => {
    if (!selectedIncident) return;
    await dismissIncident(selectedIncident.id);
    setSelectedId(null);
  };

  if (!isAuthorized) return null;

  return (
    <main className="flex-1 flex flex-col md:flex-row h-screen pt-16 overflow-hidden bg-background">
      <aside className={cn(
        "w-full md:w-[400px] border-r border-white/5 flex flex-col bg-surface/30 backdrop-blur-md transition-all duration-500",
        selectedId && "hidden md:flex"
      )}>
        <div className="p-6 border-b border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Intelligence</h1>
              <p className="label-text mb-0 mt-0.5">Active Event Stream</p>
            </div>
            <Badge variant="low" className="font-mono text-[9px] px-2">LIVE</Badge>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {feedLoading ? (
             <div className="p-4"><FeedSkeleton count={6} /></div>
          ) : (
            <div className="p-3 space-y-1.5">
              {incidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedId(incident.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all duration-300 relative group/item hover:scale-[1.02]",
                    selectedId === incident.id ? "bg-white/[0.08] border border-white/[0.05]" : "bg-transparent border border-transparent"
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{incident.trackingId}</span>
                      <Badge variant={incident.status as any} className="text-[8px] uppercase">{incident.status}</Badge>
                    </div>
                    <h3 className={cn("text-xs font-bold", selectedId === incident.id ? "text-white" : "text-slate-400")}>
                      {incident.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      <section className={cn(
        "flex-1 overflow-y-auto bg-background md:p-16 p-8 custom-scrollbar transition-all duration-500",
        !selectedId && "hidden md:block"
      )}>
        <AnimatePresence mode="wait">
          {selectedIncident ? (
            <motion.div
              key={selectedIncident.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="max-w-4xl mx-auto space-y-16"
            >
              <div className="md:hidden">
                <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
              </div>

              <div className="space-y-10">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant={selectedIncident.severity as any} className="px-5 py-0.5 rounded-full uppercase">{selectedIncident.severity}</Badge>
                  <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.05] rounded-full">
                    <Binary className="h-3 w-3 text-accent-cyan" />
                    <span className="text-slate-400 font-mono text-[10px]">{selectedIncident.id}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                    {selectedIncident.title}
                  </h2>
                  <p className="text-slate-400 text-lg max-w-2xl font-medium italic">
                    {selectedIncident.description}
                  </p>
                </div>
              </div>

              {/* Intelligence Brief */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Activity className="h-5 w-5 text-purple-400" /> Tactical Intelligence
                  </h3>
                </div>

                <GlassCard className="p-12 border-white/5 relative group rounded-[2.5rem] bg-white/[0.02]" hover={false}>
                  {isAiLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 opacity-40">
                       <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                       <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">Synthesizing Intelligence...</p>
                    </div>
                  ) : (
                    <div className="space-y-6 relative z-10">
                      <p className="text-white/80 leading-relaxed whitespace-pre-wrap font-medium italic">
                        {aiAnalysisText || "Aegis AI is monitoring this vector for anomalous patterns. Heuristic evaluation in progress."}
                      </p>
                    </div>
                  )}
                </GlassCard>
              </div>

              {/* Actions */}
              <div className="pt-10 border-t border-white/[0.05] flex flex-wrap gap-4">
                <Button variant="primary" size="lg" className="rounded-full" onClick={() => handleStatusUpdate("analyzing")}>Start Analysis</Button>
                <Button variant="primary" size="lg" className="rounded-full bg-accent-cyan" onClick={() => handleStatusUpdate("responding")}>Start Response</Button>
                <Button variant="primary" size="lg" className="rounded-full bg-emerald-500" onClick={() => handleStatusUpdate("resolved")}>Resolve</Button>
                <Button variant="ghost" className="rounded-full text-slate-600 hover:text-red-400 sm:ml-auto" onClick={handleDismiss}>Dismiss</Button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center opacity-30">
              <ShieldCheck className="h-12 w-12 text-slate-500 mr-4" />
              <p className="label-text mb-0">Waiting for neural event selection...</p>
            </div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
