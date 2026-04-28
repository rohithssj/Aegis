"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/20 hover:brightness-110",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
    danger: "bg-red-500 text-white border border-red-400/20 hover:bg-red-600",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] font-bold uppercase tracking-widest",
    md: "px-6 py-3 text-xs font-bold uppercase tracking-widest",
    lg: "px-10 py-4 text-sm font-bold uppercase tracking-widest",
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center transition-all duration-300",
        "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 font-sans",
        "hover:scale-105 active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Premium Inner Border */}
      {variant === "primary" && (
        <div className="absolute inset-[1px] rounded-full border-t border-white/20 pointer-events-none" />
      )}
      
      <span className="relative z-10">{children}</span>
    </button>
  );
};
