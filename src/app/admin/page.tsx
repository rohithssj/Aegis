"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [key, setKey] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(key)) {
      toast.success("Access Granted", { description: "Welcome to Command Center" });
      router.push("/dashboard");
    } else {
      toast.error("Access Denied", { description: "Invalid admin credentials" });
      setKey("");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/10 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <GlassCard className="p-8 md:p-10 text-center space-y-8" hover={false}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 shadow-[0_0_30px_rgba(91,76,240,0.2)]">
              <ShieldCheck className="h-10 w-10 text-accent-indigo" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Access</h1>
            <p className="text-slate-400 text-sm">Secure authorization required for Command Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label htmlFor="auth-key" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Authentication Key
              </label>
              <input
                id="auth-key"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter access key..."
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-indigo/50 transition-all shadow-inner placeholder:text-slate-600"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 text-sm font-bold shadow-[0_0_20px_rgba(91,76,240,0.3)]"
            >
              Enter Command Center
            </Button>
          </form>
        </GlassCard>
      </div>
    </main>
  );
}
