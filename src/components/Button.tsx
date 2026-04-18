"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "danger" | "ghost";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "variant"> {
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
    primary: "bg-gradient-to-b from-accent-indigo-light to-accent-indigo text-white border border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(91,76,240,0.2)]",
    danger: "bg-red-500 text-white border border-red-400/20 hover:bg-red-400",
    ghost: "bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.05]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest",
    md: "px-5 py-2.5 text-xs font-bold uppercase tracking-widest",
    lg: "px-8 py-3.5 text-sm font-bold uppercase tracking-widest",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -0.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "relative inline-flex items-center justify-center transition-all duration-200",
        "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo/50 font-sans",
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
      
      <span className="relative z-10">{children as React.ReactNode}</span>
    </motion.button>
  );
};

