"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export const GlassCard = ({
  children,
  className,
  glow = false,
  hover = true,
}: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, borderColor: "rgba(255, 255, 255, 0.15)" } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative rounded-2xl md:rounded-3xl p-6",
        "bg-white/[0.03] backdrop-blur-md",
        "border border-white/10",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]",
        "overflow-hidden group",
        className
      )}
    >
      {/* Subtle Inner Highlight */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[inherit] pointer-events-none" />
      
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

      {/* Optional Glow Effect */}
      {glow && (
        <div className="absolute -inset-20 bg-accent-primary/5 blur-[100px] -z-10 pointer-events-none" />
      )}

      <div className="relative z-10 space-y-4">
        {children}
      </div>
    </motion.div>
  );
};
