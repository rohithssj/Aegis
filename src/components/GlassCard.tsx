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
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md",
        "shadow-[0_8px_32px_-1px_rgba(0,0,0,0.3)]",
        "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent",
        "transition-all duration-200",
        hover && "hover:bg-white/[0.05] hover:border-white/[0.12] hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_12px_40px_-2px_rgba(0,0,0,0.4)]",
        className
      )}
      {...props}
    >
      {/* Subtle Inner Highlight */}
      <div className="absolute inset-px rounded-[calc(1rem-1px)] border-t border-white/[0.05] pointer-events-none" />
      
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};


