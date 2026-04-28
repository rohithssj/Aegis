"use client";

import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Search, MapPin, Activity, Clock, Binary } from "lucide-react";
import { Badge } from "@/components/Badge";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function TrackPage() {
  const [input, setInput] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [incident, setIncident] = useState<any>(null);

  useEffect(() => {
    if (!trackingId) return;

    const docRef = doc(db, "incidents", trackingId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setIncident({ id: docSnap.id, ...docSnap.data() });
      } else {
        toast.error("Incident not found", { description: "Please verify the ID and try again." });
        setTrackingId("");
      }
      setLoading(false);
    }, (error) => {
      toast.error("Error connecting to real-time stream");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [trackingId]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setTrackingId(input.trim());
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Track Incident</h1>
          <p className="text-slate-400">Enter your secure incident ID to access real-time tactical updates and AI deployment status.</p>
          
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-3 pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. INC-1234..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-full py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 transition-all placeholder:text-slate-600 shadow-inner"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="px-8 shrink-0">
              {loading ? "Searching..." : "Track"}
            </Button>
          </form>
        </div>

        {incident && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 ease-out">
            <GlassCard className="p-6 md:p-10 space-y-8" hover={false}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white truncate max-w-full">{incident.title}</h2>
                  <div className="flex items-center gap-3 mt-2 text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{incident.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={incident.severity as any} className="uppercase px-4 py-1.5">{incident.severity}</Badge>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2",
                    incident.status === 'processing' ? 'text-slate-400 bg-slate-400/10' :
                    incident.status === 'analyzing' ? 'text-accent-cyan bg-accent-cyan/10' :
                    incident.status === 'responding' ? 'text-accent-indigo bg-accent-indigo/10' :
                    'text-emerald-500 bg-emerald-500/10'
                  )}>
                    {incident.status !== 'resolved' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                    {incident.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Timeline */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Live Timeline
                  </h3>
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 h-[250px] overflow-y-auto custom-scrollbar">
                    {incident.timeline && incident.timeline.length > 0 ? (
                      <div className="space-y-6">
                        {incident.timeline.map((t: any, i: number) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-accent-indigo shadow-[0_0_10px_rgba(91,76,240,0.5)] mt-1" />
                              {i < incident.timeline.length - 1 && <div className="w-px h-full bg-white/10 my-2" />}
                            </div>
                            <div className="pb-4">
                              <p className="text-sm font-bold text-white">{t.status}</p>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2 md:line-clamp-3">{t.message}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-2">
                                {new Date(t.time).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm italic">No events recorded.</p>
                    )}
                  </div>
                </div>

                {/* Map & AI Decision */}
                <div className="space-y-6 flex flex-col h-full">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Tactical Overview
                  </h3>
                  <div className="h-[250px] bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden relative">
                     <MapView incidents={[incident]} />
                  </div>
                  
                  {incident.aiAnalysis && (
                    <div className="bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl space-y-3 flex-grow">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-accent-indigo uppercase tracking-widest flex items-center gap-2">
                           <Binary className="h-3 w-3" /> AI Assessment
                         </span>
                         {incident.assignedUnit && (
                           <span className="text-[10px] font-bold text-emerald-500 uppercase">{incident.assignedUnit} Assigned</span>
                         )}
                      </div>
                      <p className="text-sm text-slate-300 italic line-clamp-2 md:line-clamp-3">
                        &quot;{incident.aiAnalysis}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}
