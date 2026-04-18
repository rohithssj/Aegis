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
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/10",
    danger: "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/10",
    ghost: "bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.05]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest",
    md: "px-5 py-2 text-xs font-bold uppercase tracking-widest",
    lg: "px-8 py-3 text-sm font-bold uppercase tracking-widest",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className={cn(
        "relative inline-flex items-center justify-center transition-all duration-200",
        "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children as React.ReactNode}</span>
    </motion.button>
  );
};
