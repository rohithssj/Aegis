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
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <AegisLogo className="w-16 h-16" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Aegis</h1>
            <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Emergency Response System</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectRole("user")}
            className="text-left group outline-none"
          >
            <GlassCard className="p-10 h-full flex flex-col gap-8 rounded-[2rem] border-white/5 group-hover:border-accent-cyan/30 transition-all bg-white/[0.02]">
              <div className="p-4 rounded-2xl bg-accent-cyan/10 w-fit text-accent-cyan group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-2xl font-bold text-white group-hover:text-accent-cyan transition-colors">Report Incident</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Provide immediate intelligence on active emergencies or environmental threats.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-accent-cyan uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Initialize Report <ArrowRight className="w-3 h-3" />
              </div>
            </GlassCard>
          </motion.button>

          {/* Admin Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectRole("admin")}
            className="text-left group outline-none"
          >
            <GlassCard className="p-10 h-full flex flex-col gap-8 rounded-[2rem] border-white/5 group-hover:border-accent-indigo/30 transition-all bg-white/[0.02]">
              <div className="p-4 rounded-2xl bg-accent-indigo/10 w-fit text-accent-indigo group-hover:scale-110 transition-transform">
                <Terminal className="w-8 h-8" />
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-2xl font-bold text-white group-hover:text-accent-indigo transition-colors">Command Center</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Strategic oversight and tactical orchestration of global emergency response.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-accent-indigo uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Access Terminal <ArrowRight className="w-3 h-3" />
              </div>
            </GlassCard>
          </motion.button>
        </div>
        
        <p className="text-center text-[10px] text-slate-700 font-mono tracking-widest uppercase">
          Authorization Required // v4.2.0-secure
        </p>
      </div>
    </main>
  );
}
