"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import LocationCard from "./LocationCard";
import {
  LOCATIONS, REVENUE_DATA, GUEST_SEGMENTS, OCCUPANCY_FORECAST,
} from "@/lib/data";

const AI_ALERTS = [
  { type: "revenue", message: "Dynamic pricing increased weekend rates +14% — projected $720 uplift", time: "2 min ago", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { type: "maintenance", message: "Pool pump vibration anomaly detected — maintenance dispatched", time: "18 min ago", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { type: "guest", message: "VIP Amina Tadesse arriving tomorrow — presidential suite prep initiated", time: "1 hr ago", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  { type: "upsell", message: "3 high-confidence upsell opportunities identified for today's guests", time: "1 hr ago", color: "text-kuriftu-600", bg: "bg-kuriftu-50", border: "border-kuriftu-200" },
];

export default function DashboardView() {
  const [selectedProperty, setSelectedProperty] = useState("all");

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-sand-500 mt-1">Overview across all Kuriftu locations</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-3 py-2 rounded-lg border border-sand-200 bg-white text-sm text-kuriftu-900 font-medium outline-none focus:border-kuriftu-500 cursor-pointer"
          >
            <option value="all">All Properties</option>
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
          <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Revenue" value="20.0K" prefix="$" change={12.4} />
        <MetricCard label="Avg Occupancy" value="79%" change={5.2} />
        <MetricCard label="Guest Satisfaction" value="4.6" change={3.1} />
        <MetricCard label="AI Upsell Revenue" value="4.9K" prefix="$" change={28.6} />
      </div>

      {/* AI Action Feed */}
      <div className="bg-white border border-sand-200 rounded-lg p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-kuriftu-500">{Icons.sparkle}</span>
          <span className="text-sm font-semibold text-kuriftu-900">AI Action Feed</span>
          <span className="text-[10px] font-bold text-sand-400 uppercase tracking-wider ml-auto">Real-time</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {AI_ALERTS.map((alert, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${alert.bg} ${alert.border}`}>
              <div className={`mt-0.5 ${alert.color}`}>{Icons.zap}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-medium ${alert.color} leading-relaxed`}>{alert.message}</p>
                <span className="text-[10px] text-sand-400 mt-1 block">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-6">
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-kuriftu-900 mb-4">Revenue by Service</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={REVENUE_DATA} barSize={12} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8c7e6f" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8c7e6f" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e7e0d8" }} />
              <Bar dataKey="rooms" fill="#92400e" radius={[3, 3, 0, 0]} name="Rooms" />
              <Bar dataKey="spa" fill="#B45309" radius={[3, 3, 0, 0]} name="Spa" />
              <Bar dataKey="dining" fill="#D97706" radius={[3, 3, 0, 0]} name="Dining" />
              <Bar dataKey="activities" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Activities" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-kuriftu-900 mb-4">Guest Segments</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={GUEST_SEGMENTS} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {GUEST_SEGMENTS.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e7e0d8" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center">
            {GUEST_SEGMENTS.map((s, i) => (
              <div key={i} className="flex items-center gap-1 text-[11px] text-sand-600">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-kuriftu-900 mb-4">Occupancy Forecast (AI Predicted)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={OCCUPANCY_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8c7e6f" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8c7e6f" }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e7e0d8" }} />
              <Area type="monotone" dataKey="predicted" stroke="#B45309" fill="rgba(180,83,9,0.08)" strokeWidth={2} strokeDasharray="6 3" name="AI Predicted" />
              <Area type="monotone" dataKey="actual" stroke="#92400e" fill="rgba(146,64,14,0.08)" strokeWidth={2} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-kuriftu-900 mb-3">Location Performance</div>
          <div className="flex flex-col gap-2">
            {LOCATIONS.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
