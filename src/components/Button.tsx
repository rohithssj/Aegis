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
    primary: "bg-accent-primary text-white shadow-glow hover:bg-accent-primary/90",
    danger: "bg-critical text-white shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:bg-critical/90",
    ghost: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative inline-flex items-center justify-center font-medium transition-colors",
        "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Subtle Inner Highlight for Premium Feel */}
      {variant !== "ghost" && (
        <div className="absolute inset-x-4 top-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      )}
      
      <span className="relative z-10">{children as React.ReactNode}</span>
    </motion.button>
  );
};
