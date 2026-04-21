"use client";

import React from "react";

export const AegisLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="none"
        className={className}
      >
        {/* Outer Shield / 'A' Silhouette */}
        <path
          d="M16 3L4 9V17C4 23.5 9 28.5 16 31C23 28.5 28 23.5 28 17V9L16 3Z"
          stroke="#5B4CF0" // Primary Indigo
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        
        {/* Crossbar forming the 'A' */}
        <path
          d="M9 19H23"
          stroke="#5B4CF0" // Primary Indigo
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Central AI / Data Node */}
        <circle 
          cx="16" 
          cy="12" 
          r="3.5" 
          fill="#22D3EE" // Accent Cyan
        />
      </svg>
      
      {/* Brand Text */}
      <span className="text-xl font-semibold tracking-wide text-white">
        Aegis<span className="text-[#22D3EE]">AI</span>
      </span>
    </div>
  );
};
