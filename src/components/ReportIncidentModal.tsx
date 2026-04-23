"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, MapPin, AlignLeft, ShieldAlert } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";
import { useIncidents } from "@/context/IncidentContext";

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INCIDENT_TYPES = ["Flood", "Fire", "Earthquake", "Cyber Attack", "Other"];
const SEVERITY_LEVELS = ["low", "medium", "high", "critical"];

export const ReportIncidentModal = ({ isOpen, onClose }: ReportIncidentModalProps) => {
  const { addIncident } = useIncidents();
  const [formData, setFormData] = useState({
    type: "Cyber Attack",
    location: "",
    description: "",
    status: "medium" as "low" | "medium" | "high" | "critical",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.description) return;

    setIsSubmitting(true);
    // Simulate tactical delay
    setTimeout(() => {
      addIncident({
        type: formData.type,
        severity: formData.status as any,
        location: formData.location,
        description: formData.description
      });
      setIsSubmitting(false);
      onClose();
      // Reset form
      setFormData({
        type: "Cyber Attack",
        location: "",
        description: "",
        status: "medium",
      });
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg glass bg-[#0F172A] rounded-2xl border border-white/[0.08] shadow-2xl pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent-indigo/10 text-accent-indigo">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Report Incident</h2>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Emergency Protocol Initialized</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Type */}
                  <div className="space-y-2">
                    <label className="label-text lowercase flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3" /> Event Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-accent-indigo/50 transition-all appearance-none cursor-pointer"
                    >
                      {INCIDENT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-[#0F172A]">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Severity */}
                  <div className="space-y-2">
                    <label className="label-text lowercase flex items-center gap-2">
                      <ShieldAlert className="h-3 w-3" /> Severity Level
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-accent-indigo/50 transition-all appearance-none cursor-pointer"
                    >
                      {SEVERITY_LEVELS.map((s) => (
                        <option key={s} value={s} className="bg-[#0F172A]">
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="label-text lowercase flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Geographic Vector
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Sector 7-G / Core Node"
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-indigo/50 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="label-text lowercase flex items-center gap-2">
                    <AlignLeft className="h-3 w-3" /> Tactical Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide detailed incident parameters..."
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-indigo/50 transition-all resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-full text-[10px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.location || !formData.description}
                    className="min-w-[140px] rounded-full text-[10px]"
                  >
                    {isSubmitting ? "Transmitting..." : "Report Incident"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
