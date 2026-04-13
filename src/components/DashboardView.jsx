"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import LocationCard from "./LocationCard";
import { useConfig } from "@/lib/config";
import { generateInsights } from "@/lib/aiClient";
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
  const { config } = useConfig();
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const fetchInsight = useCallback(async () => {
    if (!config.features.aiDashboardInsights) return;
    setInsightLoading(true);
    try {
      const result = await generateInsights({
        prompt: config.ai.dashboardPrompt,
        data: {
          locations: LOCATIONS.map((l) => ({ name: l.name, occupancy: l.occupancy, revenue: l.revenue, rating: l.rating })),
          revenueByMonth: REVENUE_DATA,
          guestSegments: GUEST_SEGMENTS,
          forecast: OCCUPANCY_FORECAST,
        },
        module: "dashboard",
      });
      setAiInsight(result.reply);
    } catch {
      setAiInsight(null);
    } finally {
      setInsightLoading(false);
    }
  }, [config]);

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
    <div className="p-4 md:p-8 lg:p-12 animate-fade-in relative z-10 overflow-x-hidden">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Operations Intelligence</h1>
          <p className="text-kuriftu-300 font-bold text-sm mt-2 uppercase tracking-[0.2em]">Real-time Performance Overview</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="appearance-none pl-5 pr-12 py-3.5 rounded-2xl border border-white/10 bg-black/40 text-sm text-white font-bold outline-none focus:ring-4 ring-kuriftu-300/20 cursor-pointer min-w-[200px] transition-all"
            >
              <option value="all">All Properties</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-kuriftu-900">{loc.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-kuriftu-300">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-kuriftu-300 hover:bg-kuriftu-300 hover:text-kuriftu-950 transition-all disabled:opacity-50 shadow-lg active:scale-95"
            title="Refresh data"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={isRefreshing ? "animate-spin" : ""}>
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
          <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-500/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Feed
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
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-kuriftu-300/5 rounded-full blur-[80px]" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-kuriftu-300 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center p-1.5">{Icons.sparkle}</span>
            <span className="text-base font-bold text-white">AI Intelligence Stream</span>
          </div>
          <span className="text-[10px] text-kuriftu-300/40 font-black uppercase tracking-widest sm:ml-4">{lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <div className="sm:ml-auto px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-kuriftu-300 uppercase tracking-widest text-center self-start sm:self-auto">{alerts.length} Pending Actions</div>
        </div>
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-white/20 font-bold italic tracking-wide">All operational systems clear — no pending alerts</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-kuriftu-300/30 hover:bg-white/10 transition-all group animate-slide-up shadow-lg">
                <div className="mt-1 flex-shrink-0 text-kuriftu-300 bg-kuriftu-300/10 p-2 rounded-xl scale-90">{Icons.zap}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-white/90 leading-relaxed truncate-3-lines">{alert.message}</p>
                  <span className="text-[10px] font-black text-kuriftu-300/40 uppercase tracking-widest mt-2 block">{alert.time}</span>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white p-2"
                  title="Archive"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Insights Panel */}
      {config.features.aiDashboardInsights && (
        <div className="bg-gradient-to-br from-kuriftu-green to-[#051109] border border-kuriftu-300/20 rounded-3xl p-5 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-kuriftu-300/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-kuriftu-300 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center p-2.5 shadow-inner flex-shrink-0">{Icons.sparkle}</span>
              <div>
                <span className="text-lg font-bold text-white block">Executive AI Insights</span>
                <span className="text-[10px] font-black text-kuriftu-300 uppercase tracking-widest">Deep Business Analysis</span>
              </div>
            </div>
            <button
              onClick={fetchInsight}
              disabled={insightLoading}
              className="px-8 py-3.5 rounded-2xl bg-kuriftu-300 text-kuriftu-900 text-sm font-black hover:bg-kuriftu-200 transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-kuriftu-300/20 active:scale-95"
            >
              {insightLoading ? (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin"><circle cx="12" cy="12" r="10" strokeDasharray="30 10"/></svg> Processing...</>
              ) : (
                <>Analyze Performance →</>
              )}
            </button>
          </div>
          {aiInsight ? (
            <div className="text-[14px] text-white/90 leading-relaxed whitespace-pre-line bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 relative z-10 font-medium italic shadow-inner">
               "{aiInsight}"
            </div>
          ) : (
            <div className="text-[13px] text-kuriftu-300/60 font-medium italic relative z-10 bg-black/10 p-6 rounded-2xl border border-dashed border-white/10 text-center">
              Request a comprehensive AI analysis of your multi-resort performance data.
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl overflow-x-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="text-base font-bold text-white">Revenue by Service Line</div>
            <div className="text-[10px] font-black text-kuriftu-300 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10 whitespace-nowrap hidden sm:block">Yearly Distribution</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={REVENUE_DATA} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)", fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)", fontWeight: 'bold' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ backgroundColor: "#07130c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }} 
                itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Bar dataKey="rooms" fill="#CA8A04" radius={[4, 4, 0, 0]} name="Rooms" />
              <Bar dataKey="spa" fill="#A16207" radius={[4, 4, 0, 0]} name="Spa" />
              <Bar dataKey="dining" fill="#854D0E" radius={[4, 4, 0, 0]} name="Dining" />
              <Bar dataKey="activities" fill="#713F12" radius={[4, 4, 0, 0]} name="Activities" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl flex flex-col">
          <div className="text-base font-bold text-white mb-2">Guest Segments</div>
          <div className="text-[10px] font-black text-kuriftu-300 uppercase tracking-widest mb-6 block opacity-50">Demographic Split</div>
          <div className="flex-1 flex flex-col justify-center overflow-hidden">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={GUEST_SEGMENTS} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                  {GUEST_SEGMENTS.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#07130c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-8 grid grid-cols-2 gap-y-3 gap-x-4">
              {GUEST_SEGMENTS.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] text-white/60 font-bold uppercase tracking-wide">
                  <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ background: s.color }} />
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl overflow-x-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
             <div className="text-base font-bold text-white">Occupancy Engine <span className="text-[10px] font-black text-kuriftu-300 ml-2 uppercase tracking-[0.2em] block sm:inline mt-1 sm:mt-0">AI Predicted</span></div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={OCCUPANCY_FORECAST}>
              <defs>
                <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CA8A04" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#CA8A04" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)", fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)", fontWeight: 'bold' }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: "#07130c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="predicted" stroke="#CA8A04" fill="url(#predictedGrad)" strokeWidth={3} strokeDasharray="6 4" name="AI Logic" />
              <Area type="monotone" dataKey="actual" stroke="#fff" fill="rgba(255,255,255,0.05)" strokeWidth={3} name="Current" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">Location Performance</h3>
            <span className="text-[10px] font-black text-kuriftu-300 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto hidden sm:block">All Regions</span>
          </div>
          <div className="flex flex-col gap-3">
            {LOCATIONS.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
