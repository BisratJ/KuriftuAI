"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import MetricCard from "./MetricCard";
import LocationCard from "./LocationCard";
import {
  LOCATIONS, REVENUE_DATA, GUEST_SEGMENTS, OCCUPANCY_FORECAST,
} from "@/lib/data";

export default function DashboardView() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-sand-500 mt-1">
          Overview across all Kuriftu locations
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Revenue" value="14.2K" prefix="$" change={12.4} />
        <MetricCard label="Avg Occupancy" value="79%" change={5.2} />
        <MetricCard label="Guest Satisfaction" value="4.6" change={3.1} />
        <MetricCard label="AI Upsell Revenue" value="2.8K" prefix="$" change={28.6} />
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4 mb-6">
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

      <div className="grid grid-cols-2 gap-4">
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
