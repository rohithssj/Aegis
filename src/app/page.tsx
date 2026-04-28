"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, Terminal, ArrowRight, Activity, Globe, Search } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AegisLogo } from "@/components/AegisLogo";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0B1120] relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-indigo/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-cyan/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl w-full z-10 space-y-20 py-12">
        <header className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <AegisLogo className="w-20 h-20 drop-shadow-[0_0_15px_rgba(91,76,240,0.3)]" showText={false} />
            <div className="space-y-2">
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white">
                AEGIS <span className="bg-gradient-to-r from-accent-indigo to-accent-cyan bg-clip-text text-transparent italic font-medium">COMMAND</span>
              </h1>
              <p className="text-slate-500 font-mono text-[10px] md:text-xs tracking-[0.6em] uppercase font-bold">
                Next-Gen Tactical Intelligence & Response System
              </p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Entry */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/report" className="block h-full group">
              <GlassCard 
                className="p-8 md:p-10 h-full flex flex-col gap-8 rounded-[2.5rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative overflow-hidden"
                hover={true}
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <ShieldAlert className="w-32 h-32" />
                </div>
                
                <div className="p-5 rounded-2xl bg-accent-cyan/10 w-fit text-accent-cyan ring-1 ring-accent-cyan/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <ShieldAlert className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white tracking-tight">Report Incident</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Submit field reports for immediate autonomous triage and unit deployment.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-accent-cyan uppercase tracking-widest mt-auto group-hover:translate-x-3 transition-transform">
                  Initiate Report <ArrowRight className="w-4 h-4" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>

          {/* Track Entry */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Link href="/track" className="block h-full group">
              <GlassCard 
                className="p-8 md:p-10 h-full flex flex-col gap-8 rounded-[2.5rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative overflow-hidden"
                hover={true}
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <Search className="w-32 h-32" />
                </div>
                
                <div className="p-5 rounded-2xl bg-purple-500/10 w-fit text-purple-400 ring-1 ring-purple-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Search className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white tracking-tight">Track Status</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Monitor neural grid acknowledgement and real-time response progression.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest mt-auto group-hover:translate-x-3 transition-transform">
                  Track Incident <ArrowRight className="w-4 h-4" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>

          {/* Admin Entry */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/admin" className="block h-full group">
              <GlassCard 
                className="p-8 md:p-10 h-full flex flex-col gap-8 rounded-[2.5rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative overflow-hidden"
                hover={true}
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <Terminal className="w-32 h-32" />
                </div>

                <div className="p-5 rounded-2xl bg-accent-indigo/10 w-fit text-accent-indigo ring-1 ring-accent-indigo/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                  <Terminal className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white tracking-tight">Command Center</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Authorized access only to global response coordination and monitoring.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-accent-indigo uppercase tracking-widest mt-auto group-hover:translate-x-3 transition-transform">
                  Access Command <ArrowRight className="w-4 h-4" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        </div>

        <footer className="pt-12 border-t border-white/[0.05] flex flex-col items-center gap-8">
           <div className="flex gap-12">
             <div className="flex items-center gap-3 opacity-30">
               <Activity className="w-4 h-4 text-slate-500" />
               <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest uppercase">Grid: Indian-Cluster-01</span>
             </div>
             <div className="flex items-center gap-3 opacity-30">
               <Globe className="w-4 h-4 text-slate-500" />
               <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest uppercase">Protocol: Secure_L6</span>
             </div>
           </div>
           <p className="text-[10px] text-slate-800 font-mono tracking-[0.5em] uppercase font-black">
             SYSTEM_STABLE // NO_UNAUTHORIZED_ENTRY_DETECTED
           </p>
        </footer>
      </div>
    </main>
  );
}
