"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import SearchInput from "./ui/SearchInput";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { STAFF_MEMBERS, STAFF_SCHEDULE_AI } from "@/lib/data";

const STATUS_STYLE = {
  on_duty: { label: "On Duty", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  off_duty: { label: "Off Duty", bg: "bg-sand-100", text: "text-sand-600", dot: "bg-sand-300" },
  on_break: { label: "On Break", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

export default function StaffView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const onDuty = STAFF_MEMBERS.filter((s) => s.status === "on_duty").length;
  const avgRating = (STAFF_MEMBERS.reduce((s, m) => s + m.rating, 0) / STAFF_MEMBERS.length).toFixed(1);
  const totalTasks = STAFF_MEMBERS.reduce((s, m) => s + m.tasksCompleted, 0);

  let filteredStaff = STAFF_MEMBERS;
  if (search) {
    const q = search.toLowerCase();
    filteredStaff = filteredStaff.filter((m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.department.toLowerCase().includes(q));
  }
  if (statusFilter !== "all") {
    filteredStaff = filteredStaff.filter((m) => m.status === statusFilter);
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Staff Management</h1>
        <p className="text-sm text-sand-500 mt-1">AI-optimized scheduling, performance tracking, and workload balancing</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-6">
        <MetricCard label="On Duty" value={`${onDuty}/${STAFF_MEMBERS.length}`} />
        <MetricCard label="Avg Rating" value={avgRating} change={2.1} />
        <MetricCard label="Tasks Today" value={totalTasks} change={8.5} />
        <MetricCard label="Avg Hours/Week" value="34.4" change={-3.2} />
        <MetricCard label="AI Schedule Savings" value="$480" change={22} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">
        {/* Staff Roster */}
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3 gap-3">
            <div className="text-sm font-semibold text-kuriftu-900">Staff Roster</div>
            <SearchInput value={search} onChange={setSearch} placeholder="Search staff..." className="w-48" />
          </div>
          <div className="flex gap-1.5 mb-3">
            {[{id: "all", label: "All"}, {id: "on_duty", label: "On Duty"}, {id: "off_duty", label: "Off Duty"}, {id: "on_break", label: "On Break"}].map((f) => (
              <button key={f.id} onClick={() => setStatusFilter(f.id)} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${statusFilter === f.id ? "bg-kuriftu-700 text-white" : "bg-sand-50 text-sand-500 hover:bg-sand-100"}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-sand-200">
                  {["Name", "Role", "Shift", "Status", "Tasks", "Rating"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-sand-500 font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-sand-400 text-sm">No staff match your search</td></tr>
                ) : filteredStaff.map((member) => {
                  const ss = STATUS_STYLE[member.status];
                  return (
                    <tr key={member.id} className="border-b border-sand-100 hover:bg-sand-50/50 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center font-semibold text-kuriftu-700 text-[11px] flex-shrink-0">
                            {member.photo}
                          </div>
                          <div>
                            <div className="font-medium text-kuriftu-900">{member.name}</div>
                            <div className="text-[10px] text-sand-500">{member.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-sand-600">{member.role}</td>
                      <td className="px-3 py-2.5 text-sand-600">{member.shift}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${ss.bg} ${ss.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                          {ss.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 tabular-nums font-semibold text-kuriftu-900">{member.tasksCompleted}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400">{Icons.star}</span>
                          <span className="tabular-nums font-semibold text-kuriftu-900">{member.rating}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Schedule & Insights */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="text-sm font-semibold text-kuriftu-900 mb-1">AI Staff Schedule Optimizer</div>
            <div className="text-xs text-sand-500 mb-4">Recommended staffing based on demand forecast</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={STAFF_SCHEDULE_AI} barSize={14} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8c7e6f" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8c7e6f" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e7e0d8" }} />
                <Bar dataKey="current_staff" fill="#e7e0d8" radius={[3, 3, 0, 0]} name="Current" />
                <Bar dataKey="recommended_staff" fill="#92400e" radius={[3, 3, 0, 0]} name="AI Recommended" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-col gap-1">
              {STAFF_SCHEDULE_AI.map((day) => {
                const isUnder = day.recommended_staff > day.current_staff;
                return (
                  <div key={day.day} className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded hover:bg-sand-50">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-kuriftu-900 w-8">{day.day}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        day.predicted_demand === "Very High" ? "bg-red-50 text-red-600" :
                        day.predicted_demand === "High" ? "bg-amber-50 text-amber-600" :
                        day.predicted_demand === "Low" ? "bg-green-50 text-green-600" :
                        "bg-sand-100 text-sand-500"
                      }`}>
                        {day.predicted_demand}
                      </span>
                    </div>
                    <span className={`font-semibold tabular-nums ${isUnder ? "text-red-600" : "text-green-600"}`}>
                      {day.savings}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="text-sm font-semibold text-kuriftu-900 mb-3">Department Load</div>
            {[
              { dept: "Housekeeping", load: 85, staff: 4 },
              { dept: "Front Office", load: 72, staff: 3 },
              { dept: "F&B", load: 90, staff: 2 },
              { dept: "Spa & Wellness", load: 65, staff: 2 },
              { dept: "Engineering", load: 78, staff: 1 },
              { dept: "Guest Activities", load: 55, staff: 1 },
            ].map((d) => (
              <div key={d.dept} className="mb-2.5">
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-sand-600">{d.dept} <span className="text-sand-400">({d.staff} staff)</span></span>
                  <span className={`font-semibold tabular-nums ${d.load >= 85 ? "text-red-600" : d.load >= 70 ? "text-amber-600" : "text-green-600"}`}>{d.load}%</span>
                </div>
                <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${d.load >= 85 ? "bg-red-500" : d.load >= 70 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${d.load}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-kuriftu-700 to-kuriftu-800 rounded-lg p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span>{Icons.sparkle}</span>
              <span className="text-sm font-semibold">AI Workforce Insights</span>
            </div>
            <ul className="text-[12px] leading-relaxed space-y-2 opacity-90">
              <li>F&amp;B department at 90% capacity &mdash; consider adding 1 staff for dinner shift</li>
              <li>Thursday-Saturday predicted high demand &mdash; 8 additional staff-hours needed</li>
              <li>Almaz T. consistently top-rated &mdash; candidate for team lead promotion</li>
              <li>Tuesday overstaffed by 6 &mdash; reassign to training or cross-department support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
