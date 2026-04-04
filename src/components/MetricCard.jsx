"use client";

import { Icons } from "./Icons";

export default function MetricCard({ label, value, change, prefix = "" }) {
  const isPositive = change && change > 0;
  return (
    <div className="bg-white border border-sand-200 rounded-lg p-5">
      <div className="text-xs text-sand-500 font-medium tracking-wide uppercase mb-2">
        {label}
      </div>
      <div className="text-[28px] font-semibold text-kuriftu-900 tracking-tight tabular-nums">
        {prefix}{value}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-[13px] ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {Icons.trending}
          <span>{isPositive ? "+" : ""}{change}% vs last month</span>
        </div>
      )}
    </div>
  );
}
