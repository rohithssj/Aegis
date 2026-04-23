"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Terminal, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AegisLogo } from "@/components/AegisLogo";
import { motion } from "framer-motion";

export default function EntryPage() {
  const router = useRouter();

  // If already logged in, redirect
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") router.push("/dashboard");
    if (role === "user") router.push("/report");
  }, [router]);

  const selectRole = (role: "user" | "admin") => {
    localStorage.setItem("role", role);
    router.push(role === "admin" ? "/dashboard" : "/report");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0B1120]">
      <div className="max-w-4xl w-full space-y-16 animate-in">
        <div className="text-center space-y-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <AegisLogo className="w-12 h-12" showText={false} />
            <h1 className="text-5xl font-bold tracking-tight text-white leading-none">Aegis</h1>
          </motion.div>
          <p className="text-slate-500 font-mono text-xs tracking-[0.4em] uppercase font-bold">Emergency Response System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Option */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectRole("user")}
            className="text-left group outline-none"
          >
            <GlassCard className="p-10 h-full flex flex-col gap-8 rounded-3xl border-white/5 group-hover:border-accent-cyan/30 transition-all bg-white/[0.02] relative overflow-hidden group/card shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-5 rounded-2xl bg-accent-cyan/10 w-fit text-accent-cyan group-hover:scale-110 transition-transform relative z-10">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div className="space-y-4 flex-1 relative z-10">
                <h3 className="text-3xl font-bold text-white group-hover:text-accent-cyan transition-colors">Report Incident</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium">
                  Provide real-time information about disasters or emergencies for immediate response.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-accent-cyan uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 relative z-10">
                Start Report <ArrowRight className="w-3 h-3" />
              </div>
            </GlassCard>
          </motion.button>

          {/* Admin Option */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectRole("admin")}
            className="text-left group outline-none"
          >
            <GlassCard className="p-10 h-full flex flex-col gap-8 rounded-3xl border-white/5 group-hover:border-accent-indigo/30 transition-all bg-white/[0.02] relative overflow-hidden group/card shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-5 rounded-2xl bg-accent-indigo/10 w-fit text-accent-indigo group-hover:scale-110 transition-transform relative z-10">
                <Terminal className="w-10 h-10" />
              </div>
              <div className="space-y-4 flex-1 relative z-10">
                <h3 className="text-3xl font-bold text-white group-hover:text-accent-indigo transition-colors">Command Center</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium">
                  Monitor, analyze and respond to incidents in real-time with tactical precision.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-accent-indigo uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 relative z-10">
                Admin Access <ArrowRight className="w-3 h-3" />
              </div>
            </GlassCard>
          </motion.button>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-12 bg-white/10" />
          <p className="text-center text-[10px] text-slate-700 font-mono tracking-widest uppercase">
            Secure Entry Point // Node AD-5592
          </p>
        </div>
      </div>
    </main>
  );
}
