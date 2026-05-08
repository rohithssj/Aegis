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
    critical: "bg-danger/10 text-danger border-danger/20 backdrop-blur-md",
    high: "bg-warning/10 text-warning border-warning/20 backdrop-blur-md",
    medium: "bg-warning/10 text-warning border-warning/20 backdrop-blur-md",
    low: "bg-primary/10 text-primary-light border-primary/20 backdrop-blur-md",
    neutral: "bg-white/5 text-slate-400 border-white/10 backdrop-blur-md",
  };

  const dotColors = {
    critical: "bg-danger",
    high: "bg-warning",
    medium: "bg-warning",
    low: "bg-primary",
    neutral: "bg-slate-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
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


