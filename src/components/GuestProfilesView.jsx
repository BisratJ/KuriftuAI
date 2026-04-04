"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import SearchInput from "./ui/SearchInput";
import { GUEST_PROFILES, LOYALTY_TIERS } from "@/lib/data";

const TIER_COLORS = {
  Bronze: "bg-orange-100 text-orange-700",
  Silver: "bg-slate-100 text-slate-600",
  Gold: "bg-amber-100 text-amber-700",
  Platinum: "bg-purple-100 text-purple-700",
};

const SENTIMENT_COLORS = {
  very_positive: "text-green-600",
  positive: "text-green-500",
  neutral: "text-sand-500",
  negative: "text-red-500",
};

const JOURNEY_COLORS = {
  stay: "bg-kuriftu-600",
  booking: "bg-blue-500",
  interaction: "bg-purple-500",
  feedback: "bg-green-500",
};

export default function GuestProfilesView() {
  const [selectedGuest, setSelectedGuest] = useState(GUEST_PROFILES[0]);
  const [view, setView] = useState("profiles");
  const [guestSearch, setGuestSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  let filteredGuests = GUEST_PROFILES;
  if (guestSearch) {
    const q = guestSearch.toLowerCase();
    filteredGuests = filteredGuests.filter((g) => g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q));
  }
  if (tierFilter !== "all") {
    filteredGuests = filteredGuests.filter((g) => g.tier === tierFilter);
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Guest Intelligence</h1>
        <p className="text-sm text-sand-500 mt-1">AI-powered CRM, guest journey tracking, and loyalty management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <MetricCard label="Total Guests" value="2,325" change={8.4} />
        <MetricCard label="Avg Lifetime Value" value="4.2K" prefix="$" change={12.1} />
        <MetricCard label="Retention Rate" value="78%" change={3.6} />
        <MetricCard label="Active Loyalty" value="680" change={15.2} />
      </div>

      <div className="flex gap-2 mb-4">
        {[{ id: "profiles", label: "Guest Profiles" }, { id: "loyalty", label: "Loyalty Program" }].map((t) => (
          <button key={t.id} onClick={() => setView(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === t.id ? "bg-kuriftu-700 text-white" : "bg-white border border-sand-200 text-sand-600 hover:bg-sand-50"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {view === "profiles" ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
          {/* Guest List */}
          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-kuriftu-900">Guest Directory</div>
              <span className="text-[10px] text-sand-400">{filteredGuests.length} guests</span>
            </div>
            <SearchInput value={guestSearch} onChange={setGuestSearch} placeholder="Search guests..." className="mb-3" />
            <div className="flex gap-1 mb-3">
              {["all", "Platinum", "Gold", "Silver", "Bronze"].map((t) => (
                <button key={t} onClick={() => setTierFilter(t)} className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${tierFilter === t ? "bg-kuriftu-700 text-white" : "bg-sand-50 text-sand-500 hover:bg-sand-100"}`}>
                  {t === "all" ? "All" : t}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto">
              {filteredGuests.length === 0 ? (
                <div className="text-center py-6 text-sand-400 text-sm">No guests found</div>
              ) : filteredGuests.map((guest) => (
                <button
                  key={guest.id}
                  onClick={() => setSelectedGuest(guest)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border text-left transition-all ${selectedGuest.id === guest.id ? "border-kuriftu-300 bg-kuriftu-50" : "border-sand-100 bg-sand-50/50 hover:border-sand-200"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-sand-100 flex items-center justify-center font-semibold text-kuriftu-700 text-sm flex-shrink-0">
                    {guest.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-kuriftu-900 truncate">{guest.name}</div>
                    <div className="text-[11px] text-sand-500">{guest.segments[0]}</div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${TIER_COLORS[guest.tier]}`}>{guest.tier}</span>
                    <span className={`text-[10px] mt-1 ${SENTIMENT_COLORS[guest.sentiment]}`}>
                      {guest.sentiment === "very_positive" ? "Very Positive" : guest.sentiment === "positive" ? "Positive" : "Neutral"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Guest Detail */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-sand-200 rounded-lg p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-kuriftu-600 to-kuriftu-400 flex items-center justify-center font-bold text-white text-lg">
                  {selectedGuest.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-lg font-semibold text-kuriftu-900">{selectedGuest.name}</div>
                  <div className="text-xs text-sand-500">{selectedGuest.email} &middot; {selectedGuest.phone}</div>
                  <div className="flex gap-1.5 mt-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${TIER_COLORS[selectedGuest.tier]}`}>{selectedGuest.tier}</span>
                    {selectedGuest.segments.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sand-100 text-sand-600">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Total Visits", value: selectedGuest.totalVisits },
                  { label: "Total Spend", value: `$${selectedGuest.totalSpend.toLocaleString()}` },
                  { label: "Lifetime Value", value: `$${selectedGuest.lifetimeValue.toLocaleString()}` },
                  { label: "Avg Rating", value: selectedGuest.avgRating ? selectedGuest.avgRating.toFixed(1) : "N/A" },
                ].map((m) => (
                  <div key={m.label} className="bg-sand-50 rounded-lg p-3 text-center">
                    <div className="text-[10px] text-sand-500 uppercase font-semibold tracking-wider">{m.label}</div>
                    <div className="text-lg font-bold text-kuriftu-900 tabular-nums mt-1">{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-2">AI-Detected Preferences</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedGuest.preferences.map((p) => (
                    <span key={p} className="px-2.5 py-1 rounded-full bg-kuriftu-50 border border-kuriftu-200 text-kuriftu-700 text-[11px] font-medium">{p}</span>
                  ))}
                </div>
              </div>

              <div className="bg-kuriftu-50 border border-kuriftu-200 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-kuriftu-500">{Icons.sparkle}</span>
                  <span className="text-xs font-semibold text-kuriftu-700">AI Recommendation</span>
                </div>
                <p className="text-[12px] text-kuriftu-600 leading-relaxed">
                  {selectedGuest.tier === "Platinum"
                    ? `VIP guest with $${selectedGuest.lifetimeValue.toLocaleString()} LTV. Auto-assign presidential suite, arrange airport transfer, and prepare personalized welcome amenity. High upsell potential for private dining experiences.`
                    : selectedGuest.tier === "Gold"
                    ? `Loyal returning guest. Offer complimentary room upgrade and spa credit. Send personalized pre-arrival message highlighting new experiences since last visit.`
                    : selectedGuest.totalVisits <= 1
                    ? `New guest — first impression critical. Ensure exceptional onboarding experience. Monitor sentiment closely and offer a feedback incentive post-stay.`
                    : `Growing relationship. Target for loyalty tier upgrade with personalized offer. Recommend activities matching detected preferences.`
                  }
                </p>
              </div>
            </div>

            {/* Guest Journey Timeline */}
            {selectedGuest.journey.length > 0 && (
              <div className="bg-white border border-sand-200 rounded-lg p-5">
                <div className="text-sm font-semibold text-kuriftu-900 mb-4">Guest Journey Timeline</div>
                <div className="relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-sand-200" />
                  <div className="flex flex-col gap-3">
                    {selectedGuest.journey.map((event, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div className={`w-[15px] h-[15px] rounded-full border-2 border-white flex-shrink-0 z-10 ${JOURNEY_COLORS[event.type]}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-medium text-kuriftu-900">{event.event}</span>
                            <span className="text-[11px] text-sand-400">{event.date}</span>
                          </div>
                          <p className="text-[12px] text-sand-500 mt-0.5">{event.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Loyalty Program View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="text-sm font-semibold text-kuriftu-900 mb-4">Loyalty Tiers</div>
            <div className="flex flex-col gap-3">
              {LOYALTY_TIERS.map((tier) => (
                <div key={tier.tier} className={`p-4 rounded-lg border ${tier.tier === "Platinum" ? "border-purple-200 bg-purple-50/50" : tier.tier === "Gold" ? "border-amber-200 bg-amber-50/50" : tier.tier === "Silver" ? "border-slate-200 bg-slate-50/50" : "border-orange-200 bg-orange-50/50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${TIER_COLORS[tier.tier]}`}>{tier.tier}</span>
                      <span className="text-xs text-sand-500">Min spend: ${tier.minSpend.toLocaleString()}</span>
                    </div>
                    <span className="text-sm font-bold text-kuriftu-900 tabular-nums">{tier.guests.toLocaleString()} guests</span>
                  </div>
                  <p className="text-[12px] text-sand-600">{tier.perks}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white border border-sand-200 rounded-lg p-5">
              <div className="text-sm font-semibold text-kuriftu-900 mb-4">Loyalty Metrics</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Members", value: "2,325" },
                  { label: "Active This Month", value: "680" },
                  { label: "Points Redeemed", value: "145K" },
                  { label: "Avg Redemption", value: "$42" },
                  { label: "Member Retention", value: "78%" },
                  { label: "Member NPS", value: "82" },
                ].map((m) => (
                  <div key={m.label} className="bg-sand-50 rounded-lg p-3 text-center">
                    <div className="text-[10px] text-sand-500 uppercase font-semibold tracking-wider">{m.label}</div>
                    <div className="text-lg font-bold text-kuriftu-900 tabular-nums mt-1">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-kuriftu-700 to-kuriftu-800 rounded-lg p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span>{Icons.sparkle}</span>
                <span className="text-sm font-semibold">AI Loyalty Insights</span>
              </div>
              <ul className="text-[12px] leading-relaxed space-y-2 opacity-90">
                <li>42 Silver members within $500 of Gold upgrade &mdash; send targeted offer</li>
                <li>Loyalty members spend 2.4x more than non-members on average</li>
                <li>Spa credit redemption drives 38% return visit rate</li>
                <li>Recommend introducing &ldquo;Experience Points&rdquo; for cultural activities</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
