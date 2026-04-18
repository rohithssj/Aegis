import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "critical" | "high" | "medium" | "low" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
  dot?: boolean;
}

export const Badge = ({
  children,
  className,
  variant = "neutral",
  dot = true,
}: BadgeProps) => {
  const variants = {
    critical: "bg-red-500/5 text-red-400 border-red-500/10",
    high: "bg-amber-500/5 text-amber-400 border-amber-500/10",
    medium: "bg-yellow-500/5 text-yellow-400 border-yellow-500/10",
    low: "bg-indigo-500/5 text-indigo-400 border-indigo-500/10",
    neutral: "bg-white/5 text-slate-400 border-white/10",
  };

  const dotColors = {
    critical: "bg-red-500",
    high: "bg-amber-500",
    medium: "bg-yellow-500",
    low: "bg-indigo-500",
    neutral: "bg-slate-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1 w-1 rounded-full", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};

