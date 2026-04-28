"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  Search,
  Menu,
  X
} from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { AegisLogo } from "./AegisLogo";
import { ReportIncidentModal } from "./ReportIncidentModal";
import { isAdmin, logoutAdmin } from "@/lib/auth";

const ADMIN_NAV = [
  { name: "Command", path: "/dashboard", icon: LayoutDashboard },
  { name: "Intelligence", path: "/incidents", icon: AlertCircle },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
];

const USER_NAV = [
  { name: "Report", path: "/report", icon: AlertCircle },
  { name: "Track", path: "/track", icon: Search },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Snappier transitions for a tactical feel
  const height = useTransform(scrollY, [0, 40], ["64px", "52px"]);
  const backgroundColor = useTransform(
    scrollY,
    [0, 40],
    ["rgba(11, 17, 32, 0)", "rgba(11, 17, 32, 0.8)"]
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 40],
    ["1px solid rgba(255, 255, 255, 0)", "1px solid rgba(255, 255, 255, 0.08)"]
  );

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(isAdmin() ? "admin" : "user");
  }, [pathname]);

  // Hide navbar on entry page
  if (pathname === "/") return null;

  // For users on the report page, we might want to hide the full navbar 
  // or show a simplified one. The user asked to hide it on / and /report.
  if (pathname === "/report") return null;

  return (
    <>
      <motion.nav
        style={{ 
          height, 
          backgroundColor, 
          backdropFilter: "blur(12px)", 
          borderBottom,
          WebkitBackdropFilter: "blur(12px)"
        } as any}
        className="fixed top-0 left-0 right-0 z-50 flex items-center transition-colors"
      >
        <div className="container-premium flex items-center justify-between">
          {/* LOGO */}
          <Link href={role === 'admin' ? "/dashboard" : "/"} className="hover:opacity-90 transition-opacity">
            <AegisLogo className="w-8 h-8" />
          </Link>

          {/* INTEGRATED NAV (Linear style) */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] p-1 rounded-full text-slate-100">
            {(role === "admin" ? ADMIN_NAV : USER_NAV).map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all",
                    isActive 
                      ? "text-white" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <item.icon className={cn("h-3.5 w-3.5", isActive ? "text-accent-indigo" : "text-slate-600")} />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setIsReportModalOpen(true)}
              size="sm" 
              className="hidden lg:flex rounded-full bg-accent-indigo hover:translate-y-0 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>+ Report Incident</span>
              </div>
            </Button>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="group flex items-center gap-3 p-1 pl-3 rounded-full border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all"
              >
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <p className="text-[10px] font-bold text-white uppercase">Rohith S.</p>
                  <p className="text-[8px] font-medium text-accent-cyan/80 uppercase tracking-widest">Root Control</p>
                </div>
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-indigo-light flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-accent-indigo/20">
                   RS
                </div>
                <ChevronDown className={cn("h-3 w-3 text-slate-500 transition-transform duration-300 mr-1", isDropdownOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-48 bg-surface/95 border border-white/10 rounded-2xl shadow-2xl z-[60] backdrop-blur-xl p-1.5"
                  >
                    <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all">
                      <User className="h-3.5 w-3.5" /> Profile
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all">
                      <Settings className="h-3.5 w-3.5" /> System Configuration
                    </Link>
                    <div className="h-px bg-white/5 my-1 mx-2" />
                    <button 
                      onClick={() => {
                        logoutAdmin();
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Deactivate Session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-[#0B1120] border-t border-white/10 overflow-hidden z-[55] shadow-2xl"
            >
              <div className="flex flex-col p-4 gap-2">
                {(role === "admin" ? ADMIN_NAV : USER_NAV).map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      pathname === item.path ? "bg-accent-indigo/10 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
                <div className="h-px bg-white/5 my-2" />
                <Button 
                  onClick={() => {
                    setIsReportModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-4 p-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-accent-indigo/20 text-accent-indigo hover:bg-accent-indigo/30"
                >
                  <AlertCircle className="h-4 w-4" />
                  Report Incident
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Incident Modal */}
      <ReportIncidentModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </>
  );
};
