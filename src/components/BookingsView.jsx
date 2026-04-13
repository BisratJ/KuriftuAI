"use client";

import { useState, useEffect } from "react";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import SearchInput from "./ui/SearchInput";
import { AVAILABILITY_CALENDAR } from "@/lib/data";
import { loadBookings, confirmBooking, rejectBooking } from "@/lib/store";

const STATUS_CONFIG = {
  checked_in: { label: "Checked In", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  confirmed: { label: "Confirmed", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  checkout_today: { label: "Checkout Today", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const MOCK_ADMIN_BOOKINGS = [
  { id: "B-2941", guest: "Amanuel T.", resort: "Bishoftu", room: "Lakeside Suite", status: "confirmed", checkIn: "2026-04-15", checkOut: "2026-04-18", amount: 840, submittedAt: "2026-04-10T10:00:00Z" },
  { id: "B-3012", guest: "Selam W.", resort: "Entoto", room: "Forest Bungalow", status: "confirmed", checkIn: "2026-05-20", checkOut: "2026-05-23", amount: 720, submittedAt: "2026-04-11T14:30:00Z" },
  { id: "B-3105", guest: "Dawit G.", resort: "Langano", room: "Family Cabin", status: "confirmed", checkIn: "2026-06-12", checkOut: "2026-06-15", amount: 585, submittedAt: "2026-04-12T09:15:00Z" },
  { id: "B-A101", guest: "Helen K.", resort: "Bishoftu", room: "Standard Room", status: "completed", checkIn: "2025-05-10", checkOut: "2025-05-12", amount: 240, submittedAt: "2025-05-01T11:00:00Z" },
  { id: "B-A102", guest: "Yonas B.", resort: "Bahir Dar", room: "Forest Bungalow", status: "completed", checkIn: "2025-04-20", checkOut: "2025-04-23", amount: 720, submittedAt: "2025-04-10T16:20:00Z" },
  { id: "B-A103", guest: "Martha S.", resort: "Adama", room: "Family Cabin", status: "completed", checkIn: "2025-03-15", checkOut: "2025-03-18", amount: 585, submittedAt: "2025-03-01T08:45:00Z" },
  { id: "B-H201", guest: "Samuel L.", resort: "Entoto", room: "Lakeside Suite", status: "confirmed", checkIn: "2027-03-10", checkOut: "2027-03-13", amount: 840, submittedAt: "2026-04-13T12:00:00Z" },
  { id: "B-H203", guest: "Biniam A.", resort: "Bishoftu", room: "Presidential Suite", status: "confirmed", checkIn: "2027-05-20", checkOut: "2027-05-24", amount: 2600, submittedAt: "2026-04-13T15:30:00Z" },
  { id: "B-H205", guest: "Tigist M.", resort: "Bahir Dar", room: "Forest Bungalow", status: "confirmed", checkIn: "2027-07-10", checkOut: "2027-07-13", amount: 720, submittedAt: "2026-04-13T17:45:00Z" },
  { id: "B-2837", guest: "Elias T.", resort: "African Village", room: "Presidential Suite", status: "completed", checkIn: "2026-03-01", checkOut: "2026-03-04", amount: 1950, submittedAt: "2026-02-20T10:00:00Z" },
  { id: "B-2751", guest: "Rahel K.", resort: "Bahir Dar", room: "Standard Room", status: "completed", checkIn: "2026-02-15", checkOut: "2026-02-17", amount: 240, submittedAt: "2026-02-01T14:30:00Z" },
];

export default function BookingsView() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("submittedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const saved = loadBookings() || [];
    const data = saved.length > 0 ? [...saved, ...MOCK_ADMIN_BOOKINGS] : MOCK_ADMIN_BOOKINGS;
    setBookings(data);
    // If there are pending bookings, default to that tab
    if (data.some(b => b.status === "pending")) {
      setStatusFilter("pending");
    } else {
      setStatusFilter("all");
    }
  }, []);

  const handleConfirm = (id) => {
    const updated = confirmBooking(id);
    setBookings(updated);
  };

  const handleReject = (id) => {
    const updated = rejectBooking(id, "Availability issues");
    setBookings(updated);
  };

  let filtered = statusFilter === "all" ? [...bookings] : bookings.filter((b) => b.status === statusFilter);
  
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((b) => 
      (b.guestName || b.guest || "").toLowerCase().includes(q) || 
      b.id.toLowerCase().includes(q) || 
      b.room.toLowerCase().includes(q) ||
      b.resort.toLowerCase().includes(q)
    );
  }

  if (sortField) {
    filtered.sort((a, b) => {
      const va = a[sortField];
      const vb = b[sortField];
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (field) => {
    if (sortField === field) { setSortDir(sortDir === "asc" ? "desc" : "asc"); }
    else { setSortField(field); setSortDir("asc"); }
  };

  const totalRevenue = bookings.filter(b => b.status === "confirmed" || b.status === "completed").reduce((sum, b) => sum + (b.amount || 0), 0);
  const checkedIn = bookings.filter((b) => b.status === "checked_in").length;
  const arriving = bookings.filter((b) => b.status === "confirmed").length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const SortIcon = ({ field }) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`inline ml-1 ${sortField === field ? "text-kuriftu-600" : "text-sand-300"}`}>
      {sortDir === "desc" && sortField === field ? <path d="M12 5v14M19 12l-7 7-7-7"/> : <path d="M12 19V5M5 12l7-7 7 7"/>}
    </svg>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-7 gap-4">
        <div>
          <h1 className="text-2xl md:text-[26px] font-bold text-kuriftu-900 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Booking Control</h1>
          <p className="text-sm text-sand-500 mt-1">Review requests, manage availability, and oversee guest journeys.</p>
        </div>
        <div className="flex gap-3">
           <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-sand-200 text-kuriftu-700 text-xs font-bold hover:bg-sand-50 transition-all flex items-center justify-center gap-2 shadow-sm">
             <Icons.analytics className="w-4 h-4" /> Reports
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Pending Approval" value={pendingCount} change={pendingCount > 0 ? 5 : 0} />
        <MetricCard label="Expected Arrivals" value={arriving} />
        <MetricCard label="Guest Revenue" value={`${(totalRevenue / 1000).toFixed(1)}K`} prefix="$" />
        <MetricCard label="Active Stays" value={checkedIn} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr] gap-6">
        <div className="bg-white border border-sand-200 rounded-2xl p-4 md:p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h2 className="text-lg font-bold text-kuriftu-900">Reservations</h2>
              <div className="flex bg-sand-50 p-1 rounded-xl border border-sand-100 overflow-x-auto scrollbar-hide no-scrollbar">
                {[
                  { id: "pending", label: "Pending", count: pendingCount },
                  { id: "confirmed", label: "Confirmed", count: arriving },
                  { id: "all", label: "History", count: bookings.length }
                ].map((f) => (
                  <button 
                    key={f.id} 
                    onClick={() => setStatusFilter(f.id)} 
                    className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${statusFilter === f.id ? "bg-white text-kuriftu-700 shadow-sm" : "text-sand-400 hover:text-sand-600"}`}
                  >
                    {f.label}
                    {f.count > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${statusFilter === f.id ? "bg-kuriftu-700 text-white" : "bg-sand-200 text-sand-500"}`}>{f.count}</span>}
                  </button>
                ))}
              </div>
            </div>
            <SearchInput value={search} onChange={setSearch} placeholder="Search guest, resort..." className="w-full xl:w-64" />
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-sand-100 text-left">
                  <th className="px-4 py-3 text-sand-400 font-bold text-[10px] uppercase tracking-widest cursor-pointer" onClick={() => handleSort("id")}>Ref <SortIcon field="id" /></th>
                  <th className="px-4 py-3 text-sand-400 font-bold text-[10px] uppercase tracking-widest cursor-pointer" onClick={() => handleSort("guestName")}>Guest <SortIcon field="guestName" /></th>
                  <th className="px-4 py-3 text-sand-400 font-bold text-[10px] uppercase tracking-widest cursor-pointer" onClick={() => handleSort("resort")}>Location <SortIcon field="resort" /></th>
                  <th className="px-4 py-3 text-sand-400 font-bold text-[10px] uppercase tracking-widest">Room Type</th>
                  <th className="px-4 py-3 text-sand-400 font-bold text-[10px] uppercase tracking-widest cursor-pointer" onClick={() => handleSort("checkIn")}>Dates <SortIcon field="checkIn" /></th>
                  <th className="px-4 py-3 text-sand-400 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-sand-400 font-bold text-[10px] uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-sand-400 font-medium italic">No reservations found in this category.</td></tr>
                ) : filtered.map((booking) => {
                  const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed;
                  return (
                    <tr key={booking.id} className="hover:bg-sand-50/50 transition-colors group">
                      <td className="px-4 py-4 font-mono text-xs text-kuriftu-600 font-bold">{booking.id}</td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-kuriftu-900">{booking.guestName || booking.guest || "Guest"}</div>
                        <div className="text-[11px] text-sand-400 font-bold uppercase tracking-tighter">{booking.guests} guest{booking.guests > 1 ? "s" : ""}</div>
                      </td>
                      <td className="px-4 py-4 font-medium text-kuriftu-800">{booking.resort}</td>
                      <td className="px-4 py-4 text-kuriftu-700 text-xs font-medium">{booking.room}</td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-bold text-kuriftu-900 whitespace-nowrap">{booking.checkIn}</div>
                        <div className="text-[10px] text-sand-400">{booking.checkOut}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.bg} ${sc.text} border`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {booking.status === "pending" ? (
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleConfirm(booking.id)} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Confirm Booking">
                              <Icons.check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleReject(booking.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Reject Booking">
                              <Icons.close className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setSelectedBooking(booking)} className="text-[10px] font-black uppercase text-kuriftu-400 hover:text-kuriftu-800 transition-colors">Details</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
