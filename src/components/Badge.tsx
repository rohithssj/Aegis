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
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
    high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  const dotColors = {
    critical: "bg-red-400",
    high: "bg-amber-400",
    medium: "bg-yellow-400",
    low: "bg-emerald-400",
    neutral: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};
