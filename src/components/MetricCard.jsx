"use client";

import { Icons } from "./Icons";

export default function MetricCard({ label, value, change, prefix = "", onClick }) {
  const isPositive = change && change > 0;
  return (
    <div
      className={`bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl p-4 lg:p-6 transition-all duration-300 hover:bg-white/5 hover:border-kuriftu-300/30 shadow-xl ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="text-[10px] lg:text-xs text-kuriftu-300 font-black tracking-[0.2em] uppercase mb-4">
        {label}
      </div>
      <div className="text-2xl lg:text-[32px] font-black text-white tracking-tight tabular-nums">
        {prefix}{value}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-1.5 text-[11px] lg:text-[13px] ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={!isPositive ? "rotate-180" : ""}>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
          </svg>
          <span>{isPositive ? "+" : ""}{change}%</span>
        </div>
      )}
    </div>
  );
}
