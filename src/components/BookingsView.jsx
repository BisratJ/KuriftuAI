"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import SearchInput from "./ui/SearchInput";
import { BOOKINGS, AVAILABILITY_CALENDAR } from "@/lib/data";

const STATUS_CONFIG = {
  checked_in: { label: "Checked In", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  confirmed: { label: "Confirmed", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  checkout_today: { label: "Checkout Today", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export default function BookingsView() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [selectedBooking, setSelectedBooking] = useState(null);

  let filtered = statusFilter === "all" ? [...BOOKINGS] : BOOKINGS.filter((b) => b.status === statusFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((b) => b.guest.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.room.toLowerCase().includes(q));
  }
  if (sortField) {
    filtered.sort((a, b) => {
      const va = sortField === "amount" ? a.amount : a[sortField];
      const vb = sortField === "amount" ? b.amount : b[sortField];
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (field) => {
    if (sortField === field) { setSortDir(sortDir === "asc" ? "desc" : "asc"); }
    else { setSortField(field); setSortDir("asc"); }
  };

  const totalRevenue = BOOKINGS.reduce((sum, b) => sum + b.amount, 0);
  const checkedIn = BOOKINGS.filter((b) => b.status === "checked_in").length;
  const arriving = BOOKINGS.filter((b) => b.status === "confirmed").length;

  const SortIcon = ({ field }) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`inline ml-1 ${sortField === field ? "text-kuriftu-600" : "text-sand-300"}`}>
      {sortDir === "desc" && sortField === field ? <path d="M12 5v14M19 12l-7 7-7-7"/> : <path d="M12 19V5M5 12l7-7 7 7"/>}
    </svg>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Booking Management</h1>
          <p className="text-sm text-sand-500 mt-1">Reservation orchestration, availability, and AI-optimized pricing</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <MetricCard label="Active Bookings" value={BOOKINGS.length} change={12} />
        <MetricCard label="Checked In" value={checkedIn} />
        <MetricCard label="Arriving Soon" value={arriving} />
        <MetricCard label="Booking Revenue" value={`${(totalRevenue / 1000).toFixed(1)}K`} prefix="$" change={15.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Bookings Table */}
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3 gap-3">
            <div className="text-sm font-semibold text-kuriftu-900">Reservations</div>
            <SearchInput value={search} onChange={setSearch} placeholder="Search guest, room..." className="w-52" />
          </div>
          <div className="flex gap-1.5 mb-4">
            {[{ id: "all", label: "All", count: BOOKINGS.length }, { id: "checked_in", label: "Checked In", count: checkedIn }, { id: "confirmed", label: "Arriving", count: arriving }, { id: "checkout_today", label: "Checkout", count: BOOKINGS.filter(b => b.status === "checkout_today").length }].map((f) => (
              <button key={f.id} onClick={() => setStatusFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === f.id ? "bg-kuriftu-700 text-white" : "bg-sand-50 text-sand-500 hover:bg-sand-100"}`}>
                {f.label} <span className="opacity-60 ml-0.5">{f.count}</span>
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-sand-200">
                  <th className="text-left px-3 py-2 text-sand-500 font-medium text-xs">Booking</th>
                  <th className="text-left px-3 py-2 text-sand-500 font-medium text-xs cursor-pointer select-none hover:text-kuriftu-600" onClick={() => handleSort("guest")}>Guest<SortIcon field="guest" /></th>
                  <th className="text-left px-3 py-2 text-sand-500 font-medium text-xs">Room</th>
                  <th className="text-left px-3 py-2 text-sand-500 font-medium text-xs cursor-pointer select-none hover:text-kuriftu-600" onClick={() => handleSort("checkIn")}>Check-in<SortIcon field="checkIn" /></th>
                  <th className="text-left px-3 py-2 text-sand-500 font-medium text-xs">Status</th>
                  <th className="text-left px-3 py-2 text-sand-500 font-medium text-xs cursor-pointer select-none hover:text-kuriftu-600" onClick={() => handleSort("amount")}>Amount<SortIcon field="amount" /></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-sand-400 text-sm">No bookings match your search</td></tr>
                ) : filtered.map((booking) => {
                  const sc = STATUS_CONFIG[booking.status];
                  return (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                      className={`border-b border-sand-100 cursor-pointer transition-colors ${selectedBooking === booking.id ? "bg-kuriftu-50/60" : "hover:bg-sand-50/50"}`}
                    >
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-xs text-kuriftu-600 font-semibold">{booking.id}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-kuriftu-900">{booking.guest}</div>
                        <div className="text-[11px] text-sand-500">{booking.guests} guest{booking.guests > 1 ? "s" : ""} &middot; {booking.source}</div>
                      </td>
                      <td className="px-3 py-2.5 text-sand-600">{booking.room}</td>
                      <td className="px-3 py-2.5 tabular-nums text-sand-600">{booking.checkIn}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 tabular-nums font-semibold text-kuriftu-900">${booking.amount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-sand-100 text-[11px] text-sand-400">
            <span>Showing {filtered.length} of {BOOKINGS.length} bookings</span>
            <span className="tabular-nums font-semibold text-kuriftu-600">${filtered.reduce((s, b) => s + b.amount, 0).toLocaleString()} total</span>
          </div>
        </div>

        {/* Availability & Dynamic Pricing Calendar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="text-sm font-semibold text-kuriftu-900 mb-1">Availability & AI Pricing</div>
            <div className="text-xs text-sand-500 mb-4">Dynamic rates based on demand forecast</div>
            <div className="flex flex-col gap-1.5">
              {AVAILABILITY_CALENDAR.map((day) => {
                const pct = ((day.total - day.available) / day.total) * 100;
                const demandColor = day.demand === "very_high" ? "text-red-600" : day.demand === "high" ? "text-amber-600" : day.demand === "low" ? "text-green-600" : "text-sand-600";
                return (
                  <div key={day.date} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-sand-50 transition-colors">
                    <span className="text-xs font-medium text-kuriftu-900 w-12">{day.date}</span>
                    <div className="flex-1 h-2 bg-sand-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : pct >= 50 ? "bg-kuriftu-500" : "bg-green-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] tabular-nums text-sand-500 w-8 text-right">{day.available}</span>
                    <span className={`text-xs font-bold tabular-nums w-12 text-right ${demandColor}`}>${day.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="text-sm font-semibold text-kuriftu-900 mb-3">Booking Sources</div>
            {[
              { source: "Direct", pct: 38, color: "bg-kuriftu-600" },
              { source: "Booking.com", pct: 25, color: "bg-blue-500" },
              { source: "Expedia", pct: 15, color: "bg-amber-500" },
              { source: "TripAdvisor", pct: 12, color: "bg-green-500" },
              { source: "Walk-in", pct: 10, color: "bg-sand-400" },
            ].map((s) => (
              <div key={s.source} className="mb-2">
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-sand-600">{s.source}</span>
                  <span className="font-semibold text-kuriftu-900 tabular-nums">{s.pct}%</span>
                </div>
                <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
