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
        "relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.03] backdrop-blur-md",
        "shadow-sm transition-all duration-200 ease-out",
        hover && "hover:bg-white/[0.05] hover:border-white/[0.08] hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg hover:shadow-black/10",
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


