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
    primary: "bg-gradient-to-r from-primary to-primary-light text-white shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]",
    secondary: "bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/10 hover:border-primary/30",
    danger: "bg-red-500/80 text-white hover:bg-red-600 border border-red-500/20",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] font-bold uppercase tracking-widest",
    md: "px-6 py-3 text-xs font-bold uppercase tracking-widest",
    lg: "px-10 py-4 text-sm font-bold uppercase tracking-widest",
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center transition-all duration-200 ease-out",
        "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50 font-sans",
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
