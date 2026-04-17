"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, LayoutDashboard, AlertCircle, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Incidents", path: "/incidents", icon: AlertCircle },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Scroll animations
  const height = useTransform(scrollY, [0, 50], ["80px", "60px"]);
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"]
  );
  const backdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(255, 255, 255, 0)", "1px solid rgba(255, 255, 255, 0.08)"]
  );

  return (
    <motion.nav
      style={{ height, backgroundColor, backdropFilter: backdropBlur, borderBottom } as any}
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-8 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors">
            <Shield className="h-6 w-6 text-accent-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">AEGIS</span>
        </Link>

        <div className="flex items-center gap-1 md:gap-4 bg-white/[0.03] border border-white/5 p-1 rounded-full">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "text-white bg-white/10" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center p-[1px]">
             <div className="h-full w-full rounded-full bg-[#020617] flex items-center justify-center text-[10px] font-bold">
               OP
             </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
