"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  LayoutDashboard, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown 
} from "lucide-react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll animations - refined for speed
  const height = useTransform(scrollY, [0, 50], ["72px", "56px"]);
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.9)"]
  );
  const backdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(255, 255, 255, 0)", "1px solid rgba(255, 255, 255, 0.05)"]
  );

  return (
    <motion.nav
      style={{ height, backgroundColor, backdropFilter: backdropBlur, borderBottom } as any}
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-8 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors duration-200">
            <Shield className="h-5 w-5 text-accent-primary" />
          </div>
          <span className="font-bold text-lg tracking-tighter hidden sm:block">AEGIS</span>
        </Link>

        {/* Central Nav */}
        <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] p-1 rounded-full">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
                  isActive 
                    ? "text-white" 
                    : "text-slate-500 hover:text-white hover:bg-white/[0.03]"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/5 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
               AE
            </div>
            <ChevronDown className={cn("h-3 w-3 text-slate-500 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-48 py-2 glass rounded-2xl shadow-2xl z-[60]"
              >
                <div className="px-4 py-2 border-bottom border-white/5">
                  <p className="text-xs font-semibold text-white">Administrator</p>
                  <p className="text-[10px] text-slate-500 truncate">admin@aegis-global.ai</p>
                </div>
                <div className="h-[1px] bg-white/5 my-1" />
                <button className="w-full flex items-center gap-3 px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                  <User className="h-3.5 w-3.5" /> Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                  <Settings className="h-3.5 w-3.5" /> Settings
                </button>
                <div className="h-[1px] bg-white/5 my-1" />
                <button className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-400 hover:bg-red-500/5 transition-colors">
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

