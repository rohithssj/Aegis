"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = ({ children, className, hover = true, ...props }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 transition-all duration-300",
        hover && "hover:scale-[1.015] hover:border-white/20 hover:bg-white/10",
        className
      )}
      {...props}
    >
      {/* Subtle Inner Highlight */}
      <div className="absolute inset-px rounded-[calc(1rem-1px)] border-t border-white/[0.03] pointer-events-none" />
      
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

