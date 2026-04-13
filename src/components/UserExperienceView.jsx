"use client";

import { useState, useEffect, useCallback } from "react";
import { ACTIVITIES, RESTAURANTS, RESORT_IMAGES, LOCATIONS } from "@/lib/data";
import {
  submitBookingForApproval,
  loadBookings,
  saveBookings,
  addActivityRequest,
  loadActivityRequests,
  getNotifications,
  markAllNotificationsRead,
} from "@/lib/store";

const LOCATION_RESORT_IMG = {
  Bishoftu: RESORT_IMAGES.bishoftu,
  "Bahir Dar": RESORT_IMAGES.bahirdar,
  Entoto: RESORT_IMAGES.entoto,
  Langano: RESORT_IMAGES.langano,
  "African Village": RESORT_IMAGES["african-village"],
  Adama: RESORT_IMAGES.adama,
};

// ─── Comprehensive Hotel Data ────────────────────────────────────────────
const HOTELS = [
  { id: "bishoftu", name: "Bishoftu", tagline: "Lakeside Serenity", desc: "Nestled beside a volcanic crater lake. The original Kuriftu experience.", img: RESORT_IMAGES.bishoftu, rating: 4.7, rooms: 42 },
  { id: "bahirdar", name: "Bahir Dar", tagline: "Gateway to Monasteries", desc: "On the shores of Lake Tana with access to ancient island monasteries.", img: RESORT_IMAGES.bahirdar, rating: 4.5, rooms: 28 },
  { id: "entoto", name: "Entoto", tagline: "Highland Forest Escape", desc: "Cool mountain retreat in the eucalyptus forests above Addis Ababa.", img: RESORT_IMAGES.entoto, rating: 4.3, rooms: 20 },
  { id: "langano", name: "Langano", tagline: "Rift Valley Oasis", desc: "A lakeside paradise on the unique mineral-rich waters of Lake Langano.", img: RESORT_IMAGES.langano, rating: 4.6, rooms: 25 },
  { id: "african-village", name: "African Village", tagline: "Cultural Heritage Hub", desc: "A celebration of pan-African culture in the heart of Shaggar City.", img: RESORT_IMAGES["african-village"], rating: 4.8, rooms: 36 },
  { id: "adama", name: "Adama", tagline: "Urban Wellness Retreat", desc: "Modern luxury and spa excellence in the vibrant city of Adama.", img: RESORT_IMAGES.adama, rating: 4.4, rooms: 30 },
];

const ROOM_TYPES = [
  { name: "Standard Room", price: 120, icon: "🛏️", desc: "Comfortable room with all essentials" },
  { name: "Lakeside Suite", price: 280, icon: "🌊", desc: "Premium lake view with balcony" },
  { name: "Presidential Suite", price: 650, icon: "👑", desc: "The ultimate luxury experience" },
  { name: "Family Cabin", price: 195, icon: "🏡", desc: "Spacious cabin for families" },
  { name: "Forest Bungalow", price: 240, icon: "🌿", desc: "Private bungalow in nature" },
];

const ROOM_PRICES = {};
ROOM_TYPES.forEach(r => { ROOM_PRICES[r.name] = r.price; });

// ─── Activities with Prices per Location ─────────────────────────────────
const BOOKABLE_ACTIVITIES = [
  { id: "waterpark", name: "Kuriftu Water Park", loc: "Bishoftu", price: 45, duration: "Full Day", icon: "🎢", short: "East Africa's largest and most exciting water park featuring boomerang slides, wave pool, and lazy river.", img: ACTIVITIES[0]?.img || "https://images.pexels.com/photos/1449767/pexels-photo-1449767.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "zipline", name: "Entoto Ziplining", loc: "Entoto", price: 35, duration: "2-3 Hours", icon: "🧗", short: "Soar above the eucalyptus canopy on professional ziplines and aerial rope courses.", img: ACTIVITIES[1]?.img || "https://images.pexels.com/photos/3411135/pexels-photo-3411135.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "boattour", name: "Lake Tana Boat Tour", loc: "Bahir Dar", price: 55, duration: "3-4 Hours", icon: "⛴️", short: "Cruise to historic island monasteries and spot hippos near the Blue Nile source.", img: ACTIVITIES[2]?.img || "https://images.pexels.com/photos/402026/pexels-photo-402026.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "spa", name: "Signature Spa Experience", loc: "All Resorts", price: 85, duration: "2 Hours", icon: "🧘", short: "Award-winning Ethiopian coffee scrub ritual and deep tissue massage.", img: ACTIVITIES[3]?.img || "https://images.pexels.com/photos/683506/pexels-photo-683506.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "kayaking", name: "Lake Kuriftu Kayaking", loc: "Bishoftu", price: 25, duration: "1-2 Hours", icon: "🛶", short: "Serene paddling on the calm waters of the volcanic crater lake.", img: ACTIVITIES[4]?.img || "https://images.pexels.com/photos/2405080/pexels-photo-2405080.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "cinema", name: "Private Resort Cinema", loc: "Bishoftu", price: 15, duration: "2 Hours", icon: "🎬", short: "Relaxing cinematic experience with plush lounging in our private screening room.", img: ACTIVITIES[5]?.img || "https://images.pexels.com/photos/6087685/pexels-photo-6087685.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "coffee", name: "Ethiopian Coffee Ceremony", loc: "All Resorts", price: 20, duration: "1 Hour", icon: "☕", short: "Traditional coffee ceremony with freshly roasted beans from Sidamo region.", img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "birdwatching", name: "Guided Birdwatching", loc: "Bishoftu", price: 30, duration: "3 Hours", icon: "🐦", short: "Expert-guided tour spotting endemic Ethiopian bird species around the crater lakes.", img: "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "horseriding", name: "Horseback Riding", loc: "Langano", price: 40, duration: "2 Hours", icon: "🐎", short: "Explore the Rift Valley landscapes on horseback through scenic trails.", img: "https://images.pexels.com/photos/1559203/pexels-photo-1559203.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "cooking", name: "Ethiopian Cooking Class", loc: "African Village", price: 50, duration: "3 Hours", icon: "👨‍🍳", short: "Learn to prepare authentic Ethiopian dishes with our master chefs.", img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "hiking", name: "Entoto Mountain Hike", loc: "Entoto", price: 25, duration: "4 Hours", icon: "🥾", short: "Guided hike through Entoto Natural Park with stunning city panoramas.", img: "https://images.pexels.com/photos/554609/pexels-photo-554609.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "sunset-cruise", name: "Sunset Lake Cruise", loc: "Bahir Dar", price: 65, duration: "2 Hours", icon: "🌅", short: "Private sunset cruise on Lake Tana with cocktails and canapés.", img: "https://images.pexels.com/photos/237018/pexels-photo-237018.jpeg?auto=compress&cs=tinysrgb&w=800" },
];

const INITIAL_BOOKINGS = [
  { id: "B-2941", resort: "Bishoftu", room: "Lakeside Suite", status: "confirmed", checkIn: "2026-04-15", checkOut: "2026-04-18", amount: 840, guests: 2 },
  { id: "B-3012", resort: "Entoto", room: "Forest Bungalow", status: "confirmed", checkIn: "2026-05-20", checkOut: "2026-05-23", amount: 720, guests: 2 },
  { id: "B-3105", resort: "Langano", room: "Family Cabin", status: "confirmed", checkIn: "2026-06-12", checkOut: "2026-06-15", amount: 585, guests: 4 },
  { id: "B-3200", resort: "Bahir Dar", room: "Lakeside Suite", status: "confirmed", checkIn: "2026-07-01", checkOut: "2026-07-04", amount: 840, guests: 2 },
  { id: "B-3201", resort: "African Village", room: "Presidential Suite", status: "confirmed", checkIn: "2026-07-10", checkOut: "2026-07-13", amount: 1950, guests: 2 },
  
  { id: "B-P001", resort: "Bishoftu", room: "Standard Room", status: "pending", checkIn: "2026-08-01", checkOut: "2026-08-03", amount: 240, guests: 2 },
  { id: "B-P002", resort: "Entoto", room: "Forest Bungalow", status: "pending", checkIn: "2026-08-10", checkOut: "2026-08-13", amount: 720, guests: 1 },
  { id: "B-P003", resort: "Adama", room: "Lakeside Suite", status: "pending", checkIn: "2026-08-20", checkOut: "2026-08-24", amount: 1120, guests: 2 },
  { id: "B-P004", resort: "Bahir Dar", room: "Family Cabin", status: "pending", checkIn: "2026-09-01", checkOut: "2026-09-04", amount: 585, guests: 3 },
  
  { id: "B-2837", resort: "African Village", room: "Presidential Suite", status: "completed", checkIn: "2026-03-01", checkOut: "2026-03-04", amount: 1950, guests: 3 },
  { id: "B-2751", resort: "Bahir Dar", room: "Standard Room", status: "completed", checkIn: "2026-02-15", checkOut: "2026-02-17", amount: 240, guests: 2 },
  { id: "B-2618", resort: "Adama", room: "Lakeside Suite", status: "completed", checkIn: "2026-01-10", checkOut: "2026-01-14", amount: 1120, guests: 2 },
  { id: "B-C001", resort: "Bishoftu", room: "Family Cabin", status: "completed", checkIn: "2026-01-01", checkOut: "2026-01-04", amount: 585, guests: 4 },
  { id: "B-C002", resort: "Entoto", room: "Standard Room", status: "completed", checkIn: "2025-12-20", checkOut: "2025-12-23", amount: 360, guests: 2 },
  { id: "B-C003", resort: "Langano", room: "Forest Bungalow", status: "completed", checkIn: "2025-12-10", checkOut: "2025-12-13", amount: 720, guests: 2 },
  { id: "B-C004", resort: "Bahir Dar", room: "Presidential Suite", status: "completed", checkIn: "2025-11-15", checkOut: "2025-11-18", amount: 1950, guests: 2 },
  
  { id: "B-X001", resort: "Bishoftu", room: "Lakeside Suite", status: "confirmed", checkIn: "2026-10-05", checkOut: "2026-10-08", amount: 840, guests: 2 },
  { id: "B-X002", resort: "Entoto", room: "Forest Bungalow", status: "confirmed", checkIn: "2026-11-12", checkOut: "2026-11-15", amount: 720, guests: 1 },
  { id: "B-X003", resort: "Langano", room: "Standard Room", status: "confirmed", checkIn: "2026-12-20", checkOut: "2026-12-23", amount: 360, guests: 2 },
  { id: "B-X004", resort: "Adama", room: "Presidential Suite", status: "confirmed", checkIn: "2027-01-10", checkOut: "2027-01-14", amount: 2600, guests: 2 },

  { id: "B-Y001", resort: "African Village", room: "Standard Room", status: "pending", checkIn: "2026-10-15", checkOut: "2026-10-17", amount: 240, guests: 1 },
  { id: "B-Y002", resort: "Bishoftu", room: "Family Cabin", status: "pending", checkIn: "2026-11-01", checkOut: "2026-11-04", amount: 585, guests: 4 },
  { id: "B-Y003", resort: "Entoto", room: "Standard Room", status: "pending", checkIn: "2026-12-10", checkOut: "2026-12-13", amount: 360, guests: 2 },
  { id: "B-Y004", resort: "Bahir Dar", room: "Lakeside Suite", status: "pending", checkIn: "2027-02-05", checkOut: "2027-02-08", amount: 840, guests: 2 },

  { id: "B-Z001", resort: "Adama", room: "Standard Room", status: "completed", checkIn: "2025-09-01", checkOut: "2025-09-03", amount: 240, guests: 2 },
  { id: "B-Z002", resort: "Langano", room: "Family Cabin", status: "completed", checkIn: "2025-08-15", checkOut: "2025-08-18", amount: 585, guests: 3 },
  { id: "B-Z003", resort: "African Village", room: "Lakeside Suite", status: "completed", checkIn: "2025-07-10", checkOut: "2025-07-13", amount: 840, guests: 2 },
  { id: "B-Z004", resort: "Entoto", room: "Presidential Suite", status: "completed", checkIn: "2025-06-01", checkOut: "2025-06-04", amount: 1950, guests: 2 },
];

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function nightsBetween(a, b) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));
}

function StatusBadge({ status }) {
  const map = {
    confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    completed: "bg-kuriftu-50 text-kuriftu-700 border-kuriftu-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status] || map.confirmed}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "confirmed" ? "bg-emerald-500 animate-pulse" : status === "pending" ? "bg-amber-500 animate-pulse" : status === "completed" ? "bg-kuriftu-500" : "bg-red-400"}`} />
      {status}
    </span>
  );
}

// ─── ENHANCED BOOKING MODAL ──────────────────────────────────────────────
function BookingModal({ onClose, onConfirm, guestName }) {
  const [step, setStep] = useState(1); // 1: hotel, 2: dates+room, 3: confirm
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [form, setForm] = useState({ checkIn: "", checkOut: "", room: "Standard Room", guests: 2 });
  
  const nights = nightsBetween(form.checkIn, form.checkOut);
  const total = nights * (ROOM_PRICES[form.room] || 120);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 2) { setStep(3); return; }
    if (step === 3) {
      onConfirm({
        resort: selectedHotel.name,
        room: form.room,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        amount: total || ROOM_PRICES[form.room] || 120,
        guests: parseInt(form.guests) || 1,
      });
    }
  };

  // Generate calendar days for current month view
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-kuriftu-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in border border-sand-100 max-h-[90vh] flex flex-col">
        {/* Top accent */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, #92400e, #D97706, #fcd38d)" }} />

        {/* Header */}
        <div className="p-7 pb-4 flex-shrink-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-2xl font-bold text-kuriftu-900" style={{ fontFamily: "Georgia, serif" }}>
                {step === 1 ? "Choose Your Resort" : step === 2 ? "Select Dates & Room" : "Confirm Booking"}
              </h2>
              <p className="text-sand-700 text-sm mt-1">
                {step === 1 ? "Pick a Kuriftu destination for your stay" : step === 2 ? "Set your travel dates and accommodation" : "Your booking will be sent for confirmation"}
              </p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-sand-50 text-sand-400 hover:bg-sand-100 transition-colors text-lg mt-0.5">✕</button>
          </div>

          {/* Step pills */}
          <div className="flex items-center gap-2 mt-4">
            {["Resort", "Details", "Confirm"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ${step > i + 1 ? "bg-kuriftu-700 text-white" : step === i + 1 ? "bg-kuriftu-700 text-white ring-4 ring-kuriftu-100" : "bg-sand-100 text-sand-400"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-[11px] font-semibold ${step === i + 1 ? "text-kuriftu-700" : "text-sand-400"}`}>{label}</span>
                {i < 2 && <div className={`w-6 h-px mx-1 ${step > i + 1 ? "bg-kuriftu-700" : "bg-sand-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="overflow-y-auto flex-1 px-7 pb-7">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {HOTELS.map(hotel => (
                <div
                  key={hotel.id}
                  onClick={() => { setSelectedHotel(hotel); setStep(2); }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 border-2 hover:shadow-xl hover:-translate-y-1 ${selectedHotel?.id === hotel.id ? "border-kuriftu-500 ring-4 ring-kuriftu-100" : "border-transparent"}`}
                >
                  <div className="h-32 relative">
                    <img src={hotel.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={hotel.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-kuriftu-700">⭐ {hotel.rating}</div>
                    <div className="absolute bottom-3 left-3">
                      <div className="text-[9px] font-black text-kuriftu-300 uppercase tracking-widest">{hotel.tagline}</div>
                      <div className="text-base font-bold text-white">{hotel.name}</div>
                    </div>
                  </div>
                  <div className="bg-sand-50 px-3 py-2.5">
                    <p className="text-[10px] text-sand-600 line-clamp-2 leading-relaxed">{hotel.desc}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[9px] font-bold text-sand-500 uppercase tracking-widest">{hotel.rooms} rooms</span>
                      <span className="text-[9px] font-bold text-kuriftu-600">From $120/night</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} id="booking-form" className="space-y-4">
              {/* Selected hotel banner */}
              <div className="flex items-center gap-4 p-3 bg-kuriftu-50 rounded-2xl border border-kuriftu-100">
                <img src={selectedHotel.img} className="w-14 h-14 rounded-xl object-cover" alt={selectedHotel.name} />
                <div className="flex-1">
                  <div className="text-sm font-bold text-kuriftu-900">{selectedHotel.name}</div>
                  <div className="text-xs text-kuriftu-600">{selectedHotel.tagline} · ⭐ {selectedHotel.rating}</div>
                </div>
                <button type="button" onClick={() => setStep(1)} className="text-xs text-kuriftu-600 font-bold hover:text-kuriftu-800">Change</button>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">Check-in Date</label>
                  <input type="date" required min={minDate} value={form.checkIn}
                    onChange={e => setForm({ ...form, checkIn: e.target.value, checkOut: form.checkOut && form.checkOut <= e.target.value ? "" : form.checkOut })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm outline-none focus:ring-2 focus:ring-kuriftu-300 focus:border-kuriftu-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">Check-out Date</label>
                  <input type="date" required min={form.checkIn || minDate} value={form.checkOut}
                    onChange={e => setForm({ ...form, checkOut: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm outline-none focus:ring-2 focus:ring-kuriftu-300 focus:border-kuriftu-400" />
                </div>
              </div>

              {nights > 0 && (
                <div className="text-center py-2 px-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-sm font-bold text-emerald-700">{nights} night{nights !== 1 ? "s" : ""}</span>
                  <span className="text-xs text-emerald-600 ml-2">{formatDate(form.checkIn)} → {formatDate(form.checkOut)}</span>
                </div>
              )}

              {/* Room Type Selection */}
              <div>
                <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-2">Room Type</label>
                <div className="space-y-2">
                  {ROOM_TYPES.map(room => (
                    <div
                      key={room.name}
                      onClick={() => setForm({ ...form, room: room.name })}
                      className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.room === room.name ? "border-kuriftu-500 bg-kuriftu-50" : "border-sand-100 bg-white hover:border-sand-300"}`}
                    >
                      <div className="text-xl">{room.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-kuriftu-900">{room.name}</div>
                        <div className="text-[10px] text-sand-500">{room.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-kuriftu-700">${room.price}</div>
                        <div className="text-[9px] text-sand-400">per night</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">Number of Guests</label>
                <input type="number" min="1" max="10" required value={form.guests}
                  onChange={e => setForm({ ...form, guests: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm outline-none focus:ring-2 focus:ring-kuriftu-300" />
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {/* Resort image preview */}
              <div className="h-36 rounded-2xl overflow-hidden relative">
                <img src={selectedHotel.img} className="w-full h-full object-cover" alt={selectedHotel.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs font-bold text-kuriftu-300 uppercase tracking-widest mb-0.5">{selectedHotel.tagline}</div>
                  <div className="text-lg font-bold">{selectedHotel.name}</div>
                </div>
              </div>

              <div className="bg-sand-50 rounded-2xl p-5 border border-sand-100 space-y-3">
                {[
                  ["Room", form.room],
                  ["Check-in", formatDate(form.checkIn)],
                  ["Check-out", formatDate(form.checkOut)],
                  ["Duration", `${nights} night${nights !== 1 ? "s" : ""}`],
                  ["Guests", form.guests],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs font-bold text-sand-500 uppercase tracking-wider">{label}</span>
                    <span className="text-sm font-semibold text-kuriftu-800">{val}</span>
                  </div>
                ))}
                <div className="border-t border-sand-200 pt-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-sand-500 uppercase tracking-wider">Estimated Total</span>
                  <span className="text-xl font-black text-kuriftu-700">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <div className="text-lg">⏳</div>
                <div>
                  <div className="text-sm font-bold text-amber-800">Pending Admin Confirmation</div>
                  <div className="text-xs text-amber-600 mt-0.5">Your booking will be sent to management for review. You'll receive a notification once it's confirmed.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-7 pb-7 pt-2 flex-shrink-0 border-t border-sand-100">
          <div className="flex gap-3">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)}
                className="px-5 py-3.5 rounded-xl bg-sand-50 border border-sand-200 text-kuriftu-700 font-bold text-sm hover:bg-sand-100 transition-all">
                ← Back
              </button>
            )}
            {step === 2 && (
              <button type="submit" form="booking-form"
                disabled={!form.checkIn || !form.checkOut || nights <= 0}
                className="flex-1 py-3.5 bg-kuriftu-700 hover:bg-kuriftu-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-kuriftu-700/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
                Review Booking →
              </button>
            )}
            {step === 3 && (
              <button type="button" onClick={() => {
                onConfirm({
                  resort: selectedHotel.name,
                  room: form.room,
                  checkIn: form.checkIn,
                  checkOut: form.checkOut,
                  amount: total || ROOM_PRICES[form.room] || 120,
                  guests: parseInt(form.guests) || 1,
                });
              }}
                className="flex-1 py-3.5 bg-kuriftu-700 hover:bg-kuriftu-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-kuriftu-700/20 active:scale-[0.98]">
                ✓ Submit Booking Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageBookingModal({ booking, onClose, onCancel, onUpdate }) {
  const [editDates, setEditDates] = useState({ checkIn: booking.checkIn, checkOut: booking.checkOut });
  const nights = nightsBetween(editDates.checkIn, editDates.checkOut);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-kuriftu-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in border border-sand-100">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #92400e, #D97706, #fcd38d)" }} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-kuriftu-900" style={{ fontFamily: "Georgia, serif" }}>Manage Booking</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-sand-50 text-sand-400 hover:bg-sand-100">✕</button>
          </div>

          <div className="h-28 rounded-2xl overflow-hidden relative mb-4">
            <img src={LOCATION_RESORT_IMG[booking.resort] || RESORT_IMAGES.bishoftu} className="w-full h-full object-cover" alt={booking.resort} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <div className="font-bold">{booking.resort} — {booking.room}</div>
              <div className="text-xs text-white/70">Booking #{booking.id}</div>
            </div>
          </div>

          {booking.status === "confirmed" && (
            <div className="space-y-3 mb-4">
              <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider">Modify Dates</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={editDates.checkIn} onChange={e => setEditDates({ ...editDates, checkIn: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm outline-none focus:ring-2 focus:ring-kuriftu-300" />
                <input type="date" value={editDates.checkOut} onChange={e => setEditDates({ ...editDates, checkOut: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm outline-none focus:ring-2 focus:ring-kuriftu-300" />
              </div>
              {nights > 0 && <p className="text-xs text-sand-500">{nights} night{nights !== 1 ? "s" : ""} · New total: <strong>${nights * (ROOM_PRICES[booking.room] || 120)}</strong></p>}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {booking.status === "confirmed" && (
              <button onClick={() => onUpdate({ ...booking, checkIn: editDates.checkIn, checkOut: editDates.checkOut, amount: nights * (ROOM_PRICES[booking.room] || 120) || booking.amount })}
                className="w-full py-3 rounded-xl bg-kuriftu-700 text-white font-bold text-sm hover:bg-kuriftu-800 transition-all active:scale-[0.98]">
                Save Changes
              </button>
            )}
            {booking.status === "confirmed" && (
              <button onClick={() => onCancel(booking.id)}
                className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-all border border-red-100">
                Cancel Booking
              </button>
            )}
            <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-sand-50 text-sand-600 font-semibold text-sm hover:bg-sand-100 transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserExperienceView({ section = "user-home", userData, updateUserData }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [managingBooking, setManagingBooking] = useState(null);
  const [notif, setNotif] = useState(null);
  const [activityFilter, setActivityFilter] = useState("All");
  const [userNotifications, setUserNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // ─── Load persisted bookings on mount ──────────────────────────────
  useEffect(() => {
    const saved = loadBookings();
    if (saved && saved.length > 0) {
      setBookings(saved);
    } else {
      saveBookings(INITIAL_BOOKINGS);
    }
  }, []);

  // ─── Poll for notifications ────────────────────────────────────────
  useEffect(() => {
    const check = () => {
      const notifs = getNotifications("user");
      setUserNotifications(notifs);
      // Check for newly confirmed/rejected bookings and sync
      const saved = loadBookings();
      if (saved) setBookings(saved);
    };
    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, []);

  const upcomingBooking = bookings.find(b => b.status === "confirmed");
  const pendingBookings = bookings.filter(b => b.status === "pending");
  const unreadNotifs = userNotifications.filter(n => !n.read).length;

  const showNotifMsg = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3500);
  };

  const handleNewBooking = (bookingData) => {
    const newBooking = submitBookingForApproval(bookingData, userData.name);
    setBookings(prev => [newBooking, ...prev]);
    setShowBookingModal(false);
    showNotifMsg(`⏳ Booking request submitted for ${bookingData.resort}! Awaiting admin confirmation.`, "info");
  };

  const handleCancelBooking = (id) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: "cancelled" } : b);
    setBookings(updated);
    saveBookings(updated);
    setManagingBooking(null);
    showNotifMsg("Booking cancelled.", "warning");
  };

  const handleUpdateBooking = (updated) => {
    const newBookings = bookings.map(b => b.id === updated.id ? updated : b);
    setBookings(newBookings);
    saveBookings(newBookings);
    setManagingBooking(null);
    showNotifMsg("Booking updated successfully!");
  };

  const handleBookActivity = (activity) => {
    addActivityRequest({
      activityName: activity.name,
      activityId: activity.id,
      location: activity.loc,
      price: activity.price,
      duration: activity.duration,
      guestName: userData.name,
    });
    showNotifMsg(`⏳ ${activity.name} request sent! Awaiting confirmation.`, "info");
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead("user");
    setUserNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ─── Toast ───────────────────────────────────────────────────────
  const Toast = notif && (
    <div className={`fixed top-6 right-6 z-[400] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border ${notif.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-kuriftu-900 border-white/10 text-white"}`}>
      <div className={`w-2 h-2 rounded-full ${notif.type === "warning" ? "bg-amber-500" : "bg-green-400 animate-pulse"}`} />
      <span className="text-sm font-semibold">{notif.msg}</span>
    </div>
  );

  const BrandWatermark = (
    <div className="fixed bottom-10 right-10 opacity-[0.03] pointer-events-none select-none z-0">
      <img src="/kuriftu-logo.png" alt="" className="w-64 h-64 grayscale invert" />
    </div>
  );

  // ─── BOOKINGS VIEW ────────────────────────────────────────────────
  if (section === "user-bookings") {
    const pending = bookings.filter(b => b.status === "pending");
    const confirmed = bookings.filter(b => b.status === "confirmed");
    const past = bookings.filter(b => b.status !== "confirmed" && b.status !== "pending");

    return (
      <div className="p-6 lg:p-8 animate-fade-in relative z-10">
        {Toast}
        {BrandWatermark}
        {showBookingModal && <BookingModal onClose={() => setShowBookingModal(false)} onConfirm={handleNewBooking} />}
        {managingBooking && <ManageBookingModal booking={managingBooking} onClose={() => setManagingBooking(null)} onCancel={handleCancelBooking} onUpdate={handleUpdateBooking} />}

        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-kuriftu-900 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>My Stays</h1>
            <p className="text-sand-600 mt-1">Manage your upcoming and past Kuriftu experiences.</p>
          </div>
          <button onClick={() => setShowBookingModal(true)}
            className="px-6 py-3 rounded-xl bg-kuriftu-700 text-white font-bold text-sm hover:bg-kuriftu-800 transition-all flex items-center gap-2 shadow-md shadow-kuriftu-700/20 active:scale-95">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Booking
          </button>
        </div>

        {/* Pending Requests */}
        {pending.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="text-xs font-black text-amber-600 uppercase tracking-[0.25em]">Pending Requests</div>
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black">{pending.length}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pending.map(booking => (
                <div key={booking.id} className="relative">
                  <BookingCard booking={booking} onManage={() => setManagingBooking(booking)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {confirmed.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="text-xs font-black text-kuriftu-600 uppercase tracking-[0.25em]">Confirmed Reservations</div>
                <span className="w-5 h-5 rounded-full bg-kuriftu-100 text-kuriftu-700 flex items-center justify-center text-[10px] font-black">{confirmed.length}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {confirmed.map(booking => (
                <div key={booking.id} className="relative">
                  <BookingCard booking={booking} onManage={() => setManagingBooking(booking)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past / Cancelled */}
        {past.length > 0 && (
          <div>
            <div className="text-xs font-black text-sand-500 uppercase tracking-[0.25em] mb-6">Past Journeys</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {past.map(booking => (
                <div key={booking.id} className="relative">
                  <BookingCard booking={booking} onManage={() => setManagingBooking(booking)} past />
                </div>
              ))}
            </div>
          </div>
        )}

        {bookings.length === 0 && (
          <div className="text-center py-24 text-sand-400">
            <div className="text-6xl mb-6">🛶</div>
            <div className="font-bold text-kuriftu-700 text-2xl mb-2">No bookings yet</div>
            <p className="text-base text-sand-500 mb-8 max-w-sm mx-auto">Discover the magic of Kuriftu. Start planning your first experience today.</p>
            <button onClick={() => setShowBookingModal(true)} className="px-10 py-4 rounded-xl bg-kuriftu-700 text-white font-bold text-base hover:bg-kuriftu-800 transition-all shadow-xl shadow-kuriftu-700/20 active:scale-95">Book Now</button>
          </div>
        )}
      </div>
    );
  }

  // ─── ACTIVITIES VIEW ──────────────────────────────────────────────
  if (section === "user-activities") {
    return (
      <div className="p-6 lg:p-10 animate-fade-in relative z-10 min-h-screen bg-[#07130c]" 
           style={{ backgroundImage: 'radial-gradient(rgba(202, 138, 4, 0.05) 0.8px, transparent 0.8px)', backgroundSize: '32px 32px' }}>
        {Toast}
        {BrandWatermark}
        {/* Signature Header */}
        <div className="mb-12 relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-kuriftu-green to-kuriftu-900 text-white shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-kuriftu-300/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-kuriftu-300/20 text-kuriftu-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-6 border border-kuriftu-300/30">
                Signature Experiences
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "Georgia, serif" }}>Unforgettable Moments</h1>
              <p className="text-white text-lg font-medium italic">
                Tailored activities to connect you with the heritage and nature of Kuriftu.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["All", "Bishoftu", "Entoto", "Bahir Dar", "Langano", "African Village"].map(loc => (
              <button 
                key={loc}
                onClick={() => setActivityFilter(loc)}
                className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activityFilter === loc ? 'bg-kuriftu-700 text-white shadow-lg shadow-kuriftu-700/20' : 'bg-white text-sand-500 border border-sand-200 hover:border-kuriftu-300 hover:text-kuriftu-700'}`}
              >
                {loc}
              </button>
            ))}
          </div>
          <div className="relative group">
             <input type="text" placeholder="Search experiences..." className="bg-white border border-sand-200 rounded-xl px-10 py-2.5 text-sm font-medium outline-none focus:ring-2 ring-kuriftu-100 w-64 transition-all" />
             <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {BOOKABLE_ACTIVITIES.filter(a => activityFilter === "All" || a.loc === activityFilter || a.loc === "All Resorts").map(activity => (
            <div key={activity.id} 
              onClick={() => showNotifMsg(`${activity.name} interested!`)}
              className="group relative h-[320px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-kuriftu-300/40 cursor-pointer"
            >
              {/* Card Image Section */}
              <div className="h-44 relative overflow-hidden">
                <img src={activity.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-kuriftu-900 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-black text-white uppercase tracking-widest">
                  {activity.icon} {activity.duration}
                </div>
              </div>

              {/* Card Content Section */}
              <div className="p-4 flex flex-col justify-between h-[calc(320px-176px)]">
                 <div>
                    <div className="text-[8px] font-black text-kuriftu-300 uppercase tracking-widest mb-1">{activity.loc}</div>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">{activity.name}</h3>
                    <p className="text-[10px] text-white/40 mt-1.5 line-clamp-2 leading-relaxed">{activity.short}</p>
                 </div>
                 
                 <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="text-sm font-black text-white">${activity.price}</div>
                    <button onClick={(e) => { e.stopPropagation(); handleBookActivity(activity); }}
                      className="w-8 h-8 rounded-lg bg-kuriftu-300 text-kuriftu-900 flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-95">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                 </div>
              </div>

              {/* Ticket Edge Detail */}
              <div className="absolute top-1/2 -left-2 w-4 h-4 bg-[#07130c] rounded-full border border-white/5" />
              <div className="absolute top-1/2 -right-2 w-4 h-4 bg-[#07130c] rounded-full border border-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── PROFILE VIEW ─────────────────────────────────────────────────
  if (section === "user-profile") {
    return (
      <div className="min-h-screen bg-[#07130c] p-6 lg:p-10 animate-fade-in relative z-10"
           style={{ backgroundImage: 'radial-gradient(rgba(202, 138, 4, 0.05) 0.8px, transparent 0.8px)', backgroundSize: '32px 32px' }}>
        {Toast}
        {BrandWatermark}
        <div className="mb-12 relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-kuriftu-green to-kuriftu-900 text-white shadow-2xl border border-kuriftu-300/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-kuriftu-300/10 rounded-full blur-[80px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-kuriftu-300 to-kuriftu-500 p-1 shadow-2xl overflow-hidden group border border-kuriftu-300/30">
                <div className="w-full h-full rounded-full bg-kuriftu-green flex items-center justify-center text-4xl font-black text-kuriftu-300 border border-white/10 overflow-hidden">
                  {userData.img ? <img src={userData.img} className="w-full h-full object-cover" alt="Profile" /> : userData.initials}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        updateUserData({ img: url });
                      }
                    }} />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {isEditingProfile ? (
                 <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                   <input 
                     value={userData.name} 
                     onChange={e => {
                       const newName = e.target.value;
                       updateUserData({ 
                         name: newName,
                         initials: newName.split(" ").map(n => n[0]).join("").toUpperCase()
                       });
                     }}
                     className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-3xl font-bold text-white outline-none focus:ring-2 ring-kuriftu-300" 
                   />
                   <select 
                     value={userData.tier} 
                     onChange={e => updateUserData({ tier: e.target.value })}
                     className="bg-kuriftu-300 text-kuriftu-900 rounded-full px-4 py-2 text-sm font-black uppercase tracking-widest outline-none"
                   >
                     {["Gold", "Silver", "Platinum", "Diamond"].map(t => <option key={t}>{t}</option>)}
                   </select>
                   <button onClick={() => { setIsEditingProfile(false); showNotifMsg("Profile updated!"); }} className="bg-white text-kuriftu-900 px-6 py-2 rounded-xl font-bold text-sm shadow-xl">Save</button>
                 </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4 group cursor-pointer" onClick={() => setIsEditingProfile(true)}>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "Georgia, serif" }}>{userData.name}</h1>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-white transition-colors"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 bg-kuriftu-300 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-kuriftu-300/20">
                      <span className="w-2 h-2 rounded-full bg-kuriftu-green animate-pulse" />
                      {userData.tier} Level
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 text-white/70 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                       Member Access
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/30 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">📁</span>
                  Personal Details
                </h3>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-5 py-2 rounded-xl bg-kuriftu-300 text-kuriftu-900 text-[10px] font-black uppercase tracking-widest hover:bg-kuriftu-400 transition-all shadow-lg shadow-kuriftu-300/20"
                >
                  {isEditingProfile ? "View Info" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: "Full Name", key: "name", icon: "👤", val: userData.name },
                  { label: "Email Address", key: "email", icon: "✉️", val: userData.email || "guest@kuriftu.com" },
                  { label: "Phone Number", key: "phone", icon: "📞", val: userData.phone || "+251 91 123 4567" },
                  { label: "Nationality", key: "nationality", icon: "🌍", val: userData.nationality || "Ethiopian" },
                  { label: "ID / Passport", key: "passport", icon: "🆔", val: userData.passport || "P-12345678" }
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <label className="text-[10px] font-black text-kuriftu-300 uppercase tracking-[0.2em]">{item.label}</label>
                    {isEditingProfile ? (
                      <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 text-white">{item.icon}</span>
                        <input 
                          type="text" 
                          value={item.val} 
                          onChange={(e) => updateUserData({ [item.key]: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 ring-kuriftu-300/30 transition-all"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all">
                        <span className="text-lg opacity-70 text-kuriftu-300">{item.icon}</span>
                        <span className="text-sm font-bold text-white/90">{item.val}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">✨</span>
                Personal Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-bold text-sand-500 uppercase tracking-widest mb-3 block">My Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {["Spa", "Wildlife", "Fine Dining", "Hiking", "Photography"].map(p => (
                      <span 
                        key={p} 
                        onClick={() => {
                          const current = userData.interests || [];
                          const updated = current.includes(p) ? current.filter(i => i !== p) : [...current, p];
                          updateUserData({ interests: updated });
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${userData.interests?.includes(p) ? 'bg-kuriftu-700 text-white border-kuriftu-800 shadow-md shadow-kuriftu-700/20' : 'bg-kuriftu-50 text-kuriftu-700 border-kuriftu-200 hover:border-kuriftu-300'}`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-sand-500 uppercase tracking-widest mb-3 block">Travel Style</label>
                  <div className="space-y-3">
                    {["Nature Lover", "Gourmet Enthusiast", "Spa Dedicated"].map(tag => (
                      <div 
                        key={tag} 
                        onClick={() => {
                          const current = userData.tags || [];
                          const updated = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
                          updateUserData({ tags: updated });
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${userData.tags?.includes(tag) ? 'bg-kuriftu-50 border-kuriftu-200 shadow-sm' : 'bg-sand-50 border-sand-200 opacity-60'}`}
                      >
                        <span className="text-sm font-bold text-kuriftu-800">{tag}</span>
                        <div className={`w-10 h-5 rounded-full relative p-1 transition-colors ${userData.tags?.includes(tag) ? 'bg-kuriftu-600' : 'bg-sand-300'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${userData.tags?.includes(tag) ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-sand-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-kuriftu-900 mb-6 flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-sand-50 flex items-center justify-center">🏅</span>Guest Perks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[{ title: "Free Spa Upgrade", status: "Available", emoji: "🧖" }, { title: "Late Checkout", status: "Active", emoji: "⏰" }, { title: "Airport Shuttle", status: "Platinum Perk", emoji: "✈️" }].map(p => (
                  <button key={p.title} onClick={() => showNotifMsg(`${p.title} activated!`)} className="p-5 rounded-2xl bg-sand-50 border border-sand-200 flex flex-col items-center text-center hover:bg-kuriftu-700 group transition-all duration-300">
                    <div className="text-2xl mb-2 group-hover:scale-125 transition-transform">{p.emoji}</div>
                    <div className="text-sm font-bold text-kuriftu-900 mb-1 group-hover:text-white transition-colors">{p.title}</div>
                    <div className="text-[10px] font-bold text-sand-500 uppercase tracking-widest group-hover:text-white/60 transition-colors">{p.status}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-kuriftu-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Loyalty Points</div>
                <div className="text-4xl font-bold mb-6">4,820 <span className="text-xs font-normal text-white/50">pts</span></div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm"><span className="text-white/60">Progress to Platinum</span><span className="font-bold">75%</span></div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-kuriftu-400 to-yellow-300 rounded-full" />
                  </div>
                </div>
                <button onClick={() => showNotifMsg("Redeeming points...")} className="w-full py-3 rounded-xl bg-white text-kuriftu-900 text-sm font-bold hover:bg-sand-50 transition-colors">Redeem Points</button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-sand-200 p-6 shadow-sm">
              <div className="text-xs font-bold text-sand-500 uppercase tracking-widest mb-4">Stay Weather</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><span className="text-4xl">☀️</span><div><div className="text-2xl font-bold text-kuriftu-900">28°C</div><div className="text-xs text-sand-600">Clear Sky, Bishoftu</div></div></div>
                <div className="text-right"><div className="text-xs font-bold text-kuriftu-600">Perfect for</div><div className="text-xs text-sand-500">Outdoor pool day</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── HOME VIEW ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07130c] p-6 lg:p-10 animate-fade-in relative z-10"
         style={{ backgroundImage: 'radial-gradient(rgba(202, 138, 4, 0.05) 0.8px, transparent 0.8px)', backgroundSize: '32px 32px' }}>
      {Toast}
      {BrandWatermark}
      {showBookingModal && <BookingModal onClose={() => setShowBookingModal(false)} onConfirm={handleNewBooking} />}
      {managingBooking && <ManageBookingModal booking={managingBooking} onClose={() => setManagingBooking(null)} onCancel={handleCancelBooking} onUpdate={handleUpdateBooking} />}

      {/* Integrated Greeting & Weather */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 mb-16 relative">
        <div className="z-10">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center p-3 shadow-2xl">
                <img src="/kuriftu-logo.png" alt="Seal" className="w-full h-full object-contain filter brightness-200" />
             </div>
             <div className="px-5 py-2 rounded-full bg-kuriftu-300/10 border border-kuriftu-300/20 text-[11px] font-black text-kuriftu-300 uppercase tracking-[0.25em]">
                {userData.tier} Member Identity
             </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-6">
            Welcome back,<br />
            <span className="text-kuriftu-300">{userData.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-white/40 text-lg font-medium italic max-w-xl leading-relaxed">
            "Your heritage, redesigned. Continue your Kuriftu journey where the last chapter left off."
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl relative overflow-hidden flex-1 sm:min-w-[280px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-kuriftu-300/5 rounded-full blur-3xl" />
            <div className="text-5xl">☀️</div>
            <div>
              <div className="text-[10px] font-black text-kuriftu-300 uppercase tracking-widest mb-1">Stay Climate</div>
              <div className="text-2xl font-black text-white">28°C</div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-wide">Bishoftu · Sunny</div>
            </div>
          </div>

          <button 
            onClick={() => setShowBookingModal(true)}
            className="group relative bg-kuriftu-300 hover:bg-white text-kuriftu-900 px-12 py-7 rounded-[2rem] font-black text-sm shadow-2xl shadow-kuriftu-300/30 active:scale-95 transition-all flex items-center justify-center gap-4 flex-1 sm:min-w-[320px] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-3">
              BOOK YOUR NEXT STAY
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="group-hover:translate-x-2 transition-transform duration-500"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
          {/* Main Integrated Stay Content */}
          {upcomingBooking ? (
            <div className="relative group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 bg-kuriftu-300 h-10 rounded-full shadow-lg" />
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Your active chapter</h2>
              </div>
              
              <div className="relative bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-kuriftu-300/10">
                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
                  <div className="md:col-span-6 relative overflow-hidden h-72 md:h-auto">
                    <img src={LOCATION_RESORT_IMG[upcomingBooking.resort] || RESORT_IMAGES.bishoftu}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" alt={upcomingBooking.resort} />
                    <div className="absolute inset-0 bg-gradient-to-r from-kuriftu-900/60 via-transparent to-transparent" />
                    <div className="absolute top-8 left-8">
                       <StatusBadge status={upcomingBooking.status} />
                    </div>
                  </div>
                  
                  <div className="md:col-span-6 p-6 md:p-12 flex flex-col justify-between relative bg-[#0a1b12]/60 backdrop-blur-xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-kuriftu-300/5 rounded-full blur-[100px]" />
                      
                      <div>
                        <div className="text-[11px] font-black text-kuriftu-300 uppercase tracking-[0.3em] mb-3">Currently Reserved</div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight leading-none">{upcomingBooking.resort}</h3>
                        <div className="text-base md:text-lg font-bold text-white/50 italic mb-8">{upcomingBooking.room}</div>
                        
                        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-10">
                          <div>
                            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Check-in</div>
                            <div className="text-base font-black text-white">{formatDate(upcomingBooking.checkIn)}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Stay Length</div>
                            <div className="text-base font-black text-kuriftu-300">{nightsBetween(upcomingBooking.checkIn, upcomingBooking.checkOut)} Nights</div>
                          </div>
                        </div>
                      </div>

                      <button onClick={() => setManagingBooking(upcomingBooking)}
                        className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-kuriftu-900 transition-all shadow-xl active:scale-95">
                        Manage Your Stay
                      </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] border border-white/10 p-8 md:p-16 text-center shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-kuriftu-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="text-5xl md:text-7xl mb-6 md:mb-8 transform group-hover:scale-110 transition-transform">🌅</div>
               <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tighter">No Active Reservations</h3>
               <p className="text-white/40 text-base md:text-lg mb-8 md:mb-10 max-w-sm mx-auto font-medium">Your next Kuriftu experience is waiting to be written.</p>
               <button onClick={() => setShowBookingModal(true)}
                 className="w-full sm:w-auto px-12 py-5 rounded-3xl bg-kuriftu-300 text-kuriftu-900 font-black text-sm hover:bg-white transition-all shadow-2xl active:scale-95">
                 BEGIN NEW JOURNEY
               </button>
            </div>
          )}

          {/* Personalized Recommender - The "Discovery Grid" */}
          <div className="relative">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-1 bg-white/20 h-8 rounded-full" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Curation for your mood</h2>
                </div>
                <div className="flex gap-2">
                   {["Relax", "Active", "Social"].map(m => (
                     <button key={m} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${m === 'Relax' ? 'bg-kuriftu-300 text-kuriftu-900 shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                       {m}
                     </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ACTIVITIES.slice(0, 2).map(activity => (
                  <div key={activity.id} className="group relative h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl hover:border-kuriftu-300/40 transition-all cursor-pointer">
                    <img src={activity.img} className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1s]" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-kuriftu-900 via-kuriftu-900/40 to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6">
                       <div className="text-[9px] font-black text-kuriftu-300 uppercase tracking-widest mb-1">{activity.loc}</div>
                       <h3 className="text-xl font-bold text-white mb-3">{activity.name}</h3>
                       <button className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black text-white uppercase tracking-widest group-hover:bg-kuriftu-300 group-hover:text-kuriftu-900 transition-all">
                          Experience Now
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Heritage Concierge - Now in sidebar to fit the "Right side part" */}
          <div className="flex-1 bg-gradient-to-br from-kuriftu-green to-[#041108] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 relative overflow-hidden shadow-2xl flex flex-col justify-between">
             <div className="absolute top-0 right-0 w-64 h-64 bg-kuriftu-300/5 rounded-full blur-[80px]" />
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center p-3 shadow-inner">
                     <img src="/kuriftu-logo.png" alt="" className="w-full h-full object-contain filter brightness-200" />
                   </div>
                   <div>
                     <div className="text-[10px] font-black text-kuriftu-300 uppercase tracking-widest mb-1">Heritage Concierge</div>
                     <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">How can I assist?</div>
                   </div>
                </div>
                
                <p className="text-white/60 text-sm leading-relaxed mb-8 md:mb-10 italic">"Request services, book experiences, or get expert local tips instantly through our digital hub."</p>
                
                <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                   {["Order Breakfast Buffet", "Book Private Spa", "Request Valet Parking", "In-room Dining Menu"].map(q => (
                     <button key={q} onClick={() => showNotifMsg(`${q} request sent!`)}
                       className="w-full px-4 md:px-5 py-3.5 md:py-4 rounded-xl bg-white/5 border border-white/10 text-[11px] md:text-xs font-bold text-white text-left hover:bg-white hover:text-kuriftu-900 transition-all flex items-center justify-between group">
                       {q}
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                     </button>
                   ))}
                </div>
             </div>
             
             <button onClick={() => showNotifMsg("Opening Voice Concierge...")}
               className="w-full px-8 py-5 rounded-2xl bg-kuriftu-300 text-kuriftu-900 font-black text-sm hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 z-10">
                OPEN CONCIERGE HUB
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
             </button>
          </div>
          {/* Loyalty / Membership Content */}
          <div 
            onClick={() => expandedCard === 'rewards' ? setExpandedCard(null) : setExpandedCard('rewards')}
            className={`bg-gradient-to-br from-kuriftu-green to-kuriftu-900 rounded-[2rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden border border-white/5 cursor-pointer transition-all duration-500 ${expandedCard === 'rewards' ? 'lg:scale-105 ring-2 ring-kuriftu-300' : ''}`}
          >
            {/* Background Logo Watermark */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.05] pointer-events-none">
              <img src="/kuriftu-logo.png" alt="" className="w-full h-full object-contain grayscale invert" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-kuriftu-300 to-kuriftu-500 flex items-center justify-center text-3xl shadow-xl shadow-kuriftu-500/20 p-2">
                    <img src="/kuriftu-logo.png" alt="Seal" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-kuriftu-300 uppercase tracking-[0.3em] mb-1">Kuriftu Rewards</div>
                    <div className="text-xl md:text-2xl font-black">{userData.tier} Level</div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-0.5">Points</div>
                  <div className="text-lg md:text-xl font-black text-kuriftu-300">4,820</div>
                </div>
              </div>

              {expandedCard === 'rewards' && (
                <div className="animate-fade-in mb-8 space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-[10px] font-bold text-kuriftu-300 uppercase tracking-widest mb-2">Current Tier Benefits</div>
                    <ul className="text-xs text-white/70 space-y-2">
                      <li className="flex items-center gap-2">✓ 15% Discount on Spa</li>
                      <li className="flex items-center gap-2">✓ Early Check-in (if available)</li>
                      <li className="flex items-center gap-2">✓ Welcome Fruit Basket</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-sm font-bold text-white/70">Progress to Platinum</div>
                  <div className="text-sm font-black text-kuriftu-300">75%</div>
                </div>
                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                  <div className="h-full w-[75%] bg-gradient-to-r from-kuriftu-300 to-kuriftu-500 rounded-full shadow-lg shadow-kuriftu-500/40 relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <button onClick={(e) => { e.stopPropagation(); showNotifMsg("Checking perk availability...") }}
                  className="py-4 rounded-xl bg-kuriftu-300 text-kuriftu-900 text-sm font-black hover:bg-kuriftu-200 transition-all shadow-xl active:scale-95">
                  View Perks
                </button>
                <button onClick={(e) => { e.stopPropagation(); showNotifMsg("Showing membership benefits...") }}
                  className="py-4 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all border border-white/10">
                  Membership
                </button>
              </div>
            </div>
          </div>

          {/* Quick stats and Recent */}
          <div className="bg-black/30 backdrop-blur-md rounded-[2rem] border border-white/10 p-6 shadow-xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Recent Activity</h3>
              <button className="text-[10px] font-bold text-kuriftu-300 uppercase tracking-wide hover:text-white transition-colors">History →</button>
            </div>
            <div className="space-y-3">
              {bookings.slice(0, 7).map(b => (
                <div key={b.id} onClick={() => setManagingBooking(b)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={LOCATION_RESORT_IMG[b.resort] || RESORT_IMAGES.bishoftu} className="w-full h-full object-cover" alt={b.resort} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{b.resort}</div>
                    <div className="text-[10px] text-white/40">{formatDate(b.checkIn)}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 text-center shadow-xl">
              <div className="text-3xl mb-2">🗺️</div>
              <div className="text-lg font-bold text-white">{bookings.filter(b => b.status === "completed").length + 2}</div>
              <div className="text-[10px] text-kuriftu-300 font-bold uppercase">Resorts Visited</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 text-center shadow-xl">
              <div className="text-3xl mb-2">🌙</div>
              <div className="text-lg font-bold text-white">{bookings.reduce((s, b) => s + nightsBetween(b.checkIn, b.checkOut), 0)}</div>
              <div className="text-[10px] text-kuriftu-300 font-bold uppercase">Total Nights</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, onManage, past }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      className={`relative w-full max-w-[320px] h-[400px] bg-[#fdfbf7] rounded-sm shadow-xl flex overflow-hidden group cursor-pointer transition-all duration-500 transform hover:-translate-y-2 border border-sand-200/50 ${past ? "grayscale-[0.4] opacity-80" : ""} ${expanded ? 'scale-[1.02] z-50 shadow-2xl ring-4 ring-kuriftu-300/20' : ''}`}
      style={{
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2), inset 0 0 40px rgba(0,0,0,0.02)",
        backgroundImage: "radial-gradient(#f0eada 0.5px, transparent 0.5px)",
        backgroundSize: "20px 20px"
      }}
    >
      {/* Main Ticket Content */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-dashed border-sand-300 relative">
        {/* Ticket Tear Circles */}
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-sand-50 border border-sand-200 z-10" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-sand-50 border border-sand-200 z-10" />

        {/* Top Section - Image & Status */}
        <div className="relative h-40 overflow-hidden rounded-tl-sm">
          <img src={LOCATION_RESORT_IMG[booking.resort] || RESORT_IMAGES.bishoftu}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={booking.resort} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
          
          <div className="absolute top-3 left-3">
            <StatusBadge status={booking.status} />
          </div>

          <div className="absolute bottom-3 left-3">
            <div className="text-[9px] font-black text-kuriftu-300 uppercase tracking-[0.2em] mb-1">Stay Identity</div>
            <h3 className="text-lg font-bold text-white tracking-tight">{booking.resort}</h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <div className="text-[9px] font-black text-sand-600 uppercase tracking-widest mb-1.5">Accommodation</div>
              <div className="text-sm font-bold text-kuriftu-900 truncate">{booking.room}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[9px] font-black text-sand-600 uppercase tracking-widest mb-1.5">Check-in</div>
                <div className="text-xs font-black text-kuriftu-900">{formatDate(booking.checkIn)}</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-sand-600 uppercase tracking-widest mb-1.5">Check-out</div>
                <div className="text-xs font-black text-kuriftu-900">{formatDate(booking.checkOut)}</div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            {expanded ? (
              <div className="pt-4 animate-fade-in space-y-4">
                 <div className="flex justify-between items-end border-t border-sand-300 pt-4">
                    <div>
                      <div className="text-[9px] font-black text-sand-600 uppercase tracking-widest mb-1">Total Bill</div>
                      <div className="text-base font-black text-kuriftu-800">${booking.amount.toLocaleString()}</div>
                    </div>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); onManage(); }}
                   className="w-full py-3.5 rounded-xl bg-kuriftu-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-kuriftu-800 transition-all shadow-lg active:scale-95">
                   Manage Reservation
                 </button>
              </div>
            ) : (
              <div className="pt-6 flex items-center justify-between opacity-60 transition-opacity group-hover:opacity-100">
                <div className="text-[8px] font-black text-sand-600 uppercase tracking-widest italic tracking-tighter">View Details</div>
                <div className="w-4 h-4 rounded-full bg-sand-200 flex items-center justify-center text-[8px]">↓</div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Sidebar Stub - THE "ORANGE" STRIP */}
        <div className="w-4 bg-kuriftu-500 h-full flex flex-col items-center justify-center py-6 relative">
          <div className="rotate-90 text-[7px] font-black text-white/80 uppercase tracking-[0.4em] whitespace-nowrap">
            RESERVATION · {booking.id}
          </div>
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around py-4">
          {[...Array(20)].map((_, i) => (
             <div key={i} className="w-0.5 h-0.5 rounded-full bg-kuriftu-900/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
