"use client";

import { useState, useEffect, useCallback } from "react";
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

const INITIAL_ALERTS = [
  { id: 1, type: "revenue", message: "Dynamic pricing increased weekend rates +14% — projected $720 uplift", time: "2 min ago", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { id: 2, type: "maintenance", message: "Pool pump vibration anomaly detected — maintenance dispatched", time: "18 min ago", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { id: 3, type: "guest", message: "VIP Amina Tadesse arriving tomorrow — presidential suite prep initiated", time: "1 hr ago", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  { id: 4, type: "upsell", message: "3 high-confidence upsell opportunities identified for today's guests", time: "1 hr ago", color: "text-kuriftu-600", bg: "bg-kuriftu-50", border: "border-kuriftu-200" },
];

const EXTRA_ALERTS = [
  { type: "revenue", message: "Spa package bundle sold — $460 from AI-recommended upsell", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { type: "guest", message: "Guest Kebede rated dinner 5/5 — auto-generated thank-you message sent", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  { type: "maintenance", message: "Room 205 AC filter replacement due in 3 days — parts ordered", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
];

export default function DashboardView() {
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const extra = EXTRA_ALERTS[Math.floor(Math.random() * EXTRA_ALERTS.length)];
      setAlerts((prev) => [{ ...extra, id: Date.now(), time: "Just now" }, ...prev.slice(0, 5)]);
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 600);
  }, []);

  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-sand-500 mt-1">Overview across all Kuriftu locations</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-3 py-2 rounded-lg border border-sand-200 bg-white text-sm text-kuriftu-900 font-medium focus:border-kuriftu-500 cursor-pointer"
          >
            <option value="all">All Properties</option>
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-sand-200 bg-white text-sand-500 hover:bg-sand-50 hover:text-kuriftu-700 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRefreshing ? "animate-spin" : ""}>
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
          <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
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
          <span className="text-[10px] text-sand-400 ml-2">{lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <span className="text-[10px] font-bold text-sand-400 uppercase tracking-wider ml-auto">{alerts.length} alerts</span>
        </div>
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-sand-400 text-sm">All caught up — no new alerts</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all animate-slide-up ${alert.bg} ${alert.border} group`}>
                <div className={`mt-0.5 flex-shrink-0 ${alert.color}`}>{Icons.zap}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-medium ${alert.color} leading-relaxed`}>{alert.message}</p>
                  <span className="text-[10px] text-sand-400 mt-1 block">{alert.time}</span>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-sand-400 hover:text-sand-600 p-0.5"
                  title="Dismiss"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
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
