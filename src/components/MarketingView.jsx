"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import SearchInput from "./ui/SearchInput";
import { useToast } from "./ui/Toast";
import { CAMPAIGNS, LOYALTY_STATS } from "@/lib/data";

const STATUS_STYLE = {
  active: { label: "Active", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  scheduled: { label: "Scheduled", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  completed: { label: "Completed", bg: "bg-sand-100", text: "text-sand-600", dot: "bg-sand-400" },
};

export default function MarketingView() {
  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const { addToast } = useToast();

  const totalRevenue = CAMPAIGNS.reduce((s, c) => s + c.revenue, 0);
  const totalConverted = CAMPAIGNS.reduce((s, c) => s + c.converted, 0);
  const totalSent = CAMPAIGNS.reduce((s, c) => s + c.sent, 0);
  const avgOpen = totalSent > 0 ? Math.round((CAMPAIGNS.reduce((s, c) => s + c.opened, 0) / totalSent) * 100) : 0;

  let filteredCampaigns = CAMPAIGNS;
  if (campaignFilter !== "all") filteredCampaigns = filteredCampaigns.filter((c) => c.status === campaignFilter);
  if (search) {
    const q = search.toLowerCase();
    filteredCampaigns = filteredCampaigns.filter((c) => c.name.toLowerCase().includes(q) || c.channel.toLowerCase().includes(q));
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Marketing &amp; Campaigns</h1>
        <p className="text-sm text-sand-500 mt-1">AI-optimized campaigns, cross-resort promotions, and loyalty engine</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-6">
        <MetricCard label="Campaign Revenue" value={`${(totalRevenue / 1000).toFixed(1)}K`} prefix="$" change={24.5} />
        <MetricCard label="Total Conversions" value={totalConverted} change={18.3} />
        <MetricCard label="Avg Open Rate" value={`${avgOpen}%`} change={4.8} />
        <MetricCard label="Active Campaigns" value={CAMPAIGNS.filter((c) => c.status === "active").length} />
        <MetricCard label="Loyalty Members" value={LOYALTY_STATS.totalMembers.toLocaleString()} change={8.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Campaigns Table */}
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3 gap-3">
            <div className="text-sm font-semibold text-kuriftu-900">Campaign Performance</div>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} placeholder="Search campaigns..." className="w-44" />
              <button
                onClick={() => addToast("New campaign draft created — configure in Campaign Builder", "ai")}
                className="px-3 py-2 rounded-lg bg-kuriftu-700 text-white text-xs font-medium hover:bg-kuriftu-800 transition-colors whitespace-nowrap"
              >
                + New Campaign
              </button>
            </div>
          </div>
          <div className="flex gap-1.5 mb-4">
            {[{id: "all", label: "All"}, {id: "active", label: "Active"}, {id: "scheduled", label: "Scheduled"}, {id: "completed", label: "Completed"}].map((f) => (
              <button key={f.id} onClick={() => setCampaignFilter(f.id)} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${campaignFilter === f.id ? "bg-kuriftu-700 text-white" : "bg-sand-50 text-sand-500 hover:bg-sand-100"}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-8 text-sand-400 text-sm">No campaigns match your filter</div>
            ) : filteredCampaigns.map((campaign) => {
              const ss = STATUS_STYLE[campaign.status];
              const openRate = campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0;
              const convRate = campaign.sent > 0 ? ((campaign.converted / campaign.sent) * 100).toFixed(1) : 0;
              return (
                <div key={campaign.id} className="p-4 rounded-lg border border-sand-100 bg-sand-50/30 hover:border-sand-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-mono text-sand-400">{campaign.id}</span>
                      <span className="text-[13px] font-semibold text-kuriftu-900">{campaign.name}</span>
                      {campaign.aiOptimized && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[9px] font-bold">
                          {Icons.sparkle} AI
                        </span>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${ss.bg} ${ss.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                      {ss.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-sand-500 mb-3">
                    <span>{campaign.channel}</span>
                    <span>{campaign.startDate} — {campaign.endDate}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <div className="text-[10px] text-sand-400 uppercase font-semibold">Sent</div>
                      <div className="text-sm font-bold text-kuriftu-900 tabular-nums">{campaign.sent.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-sand-400 uppercase font-semibold">Open Rate</div>
                      <div className="text-sm font-bold text-kuriftu-900 tabular-nums">{openRate}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-sand-400 uppercase font-semibold">Conversions</div>
                      <div className="text-sm font-bold text-kuriftu-900 tabular-nums">{campaign.converted}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-sand-400 uppercase font-semibold">Revenue</div>
                      <div className="text-sm font-bold text-green-600 tabular-nums">${campaign.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                  {campaign.sent > 0 && (
                    <div className="mt-2 h-1.5 bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${convRate}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="text-sm font-semibold text-kuriftu-900 mb-3">Channel Performance</div>
            {[
              { channel: "Email", sent: 5600, converted: 282, color: "bg-blue-500" },
              { channel: "WhatsApp", sent: 2400, converted: 186, color: "bg-green-500" },
              { channel: "App Push", sent: 1800, converted: 124, color: "bg-purple-500" },
              { channel: "SMS", sent: 3200, converted: 96, color: "bg-amber-500" },
              { channel: "In-App", sent: 850, converted: 42, color: "bg-kuriftu-500" },
            ].map((ch) => {
              const rate = ((ch.converted / ch.sent) * 100).toFixed(1);
              return (
                <div key={ch.channel} className="mb-3">
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-sand-600">{ch.channel}</span>
                    <span className="font-semibold text-kuriftu-900 tabular-nums">{rate}% conv.</span>
                  </div>
                  <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${ch.color}`} style={{ width: `${Math.min(parseFloat(rate) * 5, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="text-sm font-semibold text-kuriftu-900 mb-3">Audience Segments</div>
            {[
              { segment: "High-Value Repeat Guests", size: 320, response: "12.4%" },
              { segment: "Dormant (6+ months)", size: 580, response: "4.2%" },
              { segment: "Corporate Bookers", size: 210, response: "8.8%" },
              { segment: "Honeymoon & Events", size: 145, response: "15.2%" },
              { segment: "International First-Time", size: 890, response: "6.1%" },
            ].map((seg) => (
              <div key={seg.segment} className="flex items-center justify-between py-2 border-b border-sand-100 last:border-0 text-[12px]">
                <div>
                  <div className="font-medium text-kuriftu-900">{seg.segment}</div>
                  <div className="text-[10px] text-sand-400">{seg.size} contacts</div>
                </div>
                <span className="font-semibold text-kuriftu-600 tabular-nums">{seg.response}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-kuriftu-700 to-kuriftu-800 rounded-lg p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span>{Icons.sparkle}</span>
              <span className="text-sm font-semibold">AI Campaign Insights</span>
            </div>
            <ul className="text-[12px] leading-relaxed space-y-2 opacity-90">
              <li>AI-optimized campaigns outperform manual by 2.8x in conversion rate</li>
              <li>Best send time for Ethiopian market: Tue/Thu 10AM local</li>
              <li>Honeymoon segment has highest ROI &mdash; expand cross-resort bundle offers</li>
              <li>Recommend reactivation campaign for 580 dormant guests with personalized incentives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
