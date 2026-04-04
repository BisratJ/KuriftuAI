"use client";

import { useState } from "react";
import MetricCard from "./MetricCard";
import { useToast } from "./ui/Toast";
import { DYNAMIC_PRICING, UPSELL_OPPORTUNITIES } from "@/lib/data";

export default function RevenueView() {
  const [approvedPrices, setApprovedPrices] = useState({});
  const [actedUpsells, setActedUpsells] = useState({});
  const { addToast } = useToast();

  const approvePrice = (type) => {
    setApprovedPrices((p) => ({ ...p, [type]: true }));
    addToast(`AI price for ${type} approved and applied`, "success");
  };

  const actOnUpsell = (guest) => {
    setActedUpsells((p) => ({ ...p, [guest]: true }));
    addToast(`Upsell offer sent to ${guest}`, "ai");
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Revenue Intelligence</h1>
        <p className="text-sm text-sand-500 mt-1">AI-powered pricing and upsell optimization</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6">
        <MetricCard label="Monthly Revenue" value="14.2K" prefix="$" change={12.4} />
        <MetricCard label="AI Upsell Conversion" value="34%" change={18.2} />
        <MetricCard label="RevPAR" value="112" prefix="$" change={8.7} />
      </div>

      {/* Dynamic Pricing */}
      <div className="bg-white border border-sand-200 rounded-lg p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-kuriftu-900">Dynamic Pricing Recommendations</div>
            <div className="text-xs text-sand-500 mt-0.5">AI-optimized based on demand, season, and competitor analysis</div>
          </div>
          <div className="px-3.5 py-1.5 rounded-md bg-kuriftu-50 text-kuriftu-600 text-xs font-semibold">
            Live
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-sand-200">
                {["Room Type", "Current Price", "AI Suggested", "Demand", "Change", ""].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-sand-500 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DYNAMIC_PRICING.map((row, i) => (
                <tr key={i} className="border-b border-sand-100">
                  <td className="px-3 py-2.5 font-medium text-kuriftu-900">{row.type}</td>
                  <td className="px-3 py-2.5 tabular-nums text-sand-500">${row.current}</td>
                  <td className="px-3 py-2.5 tabular-nums font-semibold text-kuriftu-900">${row.suggested}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.demand === "Very High" ? "bg-red-50 text-red-600" :
                      row.demand === "High" ? "bg-kuriftu-50 text-kuriftu-600" :
                      row.demand === "Low" ? "bg-green-50 text-green-600" :
                      "bg-stone-100 text-sand-600"
                    }`}>
                      {row.demand}
                    </span>
                  </td>
                  <td className={`px-3 py-2.5 tabular-nums font-semibold ${row.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                    {row.change}
                  </td>
                  <td className="px-3 py-2.5">
                    {approvedPrices[row.type] ? (
                      <span className="text-[11px] text-green-600 font-semibold">Applied</span>
                    ) : (
                      <button onClick={() => approvePrice(row.type)} className="px-2.5 py-1 rounded-lg bg-kuriftu-700 text-white text-[10px] font-semibold hover:bg-kuriftu-800 transition-colors">Apply</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upsell Opportunities */}
      <div className="bg-white border border-sand-200 rounded-lg p-5">
        <div className="text-sm font-semibold text-kuriftu-900 mb-4">AI-Identified Upsell Opportunities</div>
        <div className="flex flex-col gap-2">
          {UPSELL_OPPORTUNITIES.map((opp, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg border border-sand-100 bg-sand-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sand-100 flex items-center justify-center font-semibold text-kuriftu-700 text-[13px]">
                  {opp.guest.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-medium text-sm text-kuriftu-900">{opp.guest}</div>
                  <div className="text-xs text-sand-500">{opp.room}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm text-kuriftu-600">{opp.opportunity}</div>
                <div className="text-xs text-sand-500">{opp.value}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                  opp.confidence >= 90 ? "bg-green-50 text-green-600" : "bg-kuriftu-50 text-kuriftu-600"
                }`}>
                  {opp.confidence}%
                </span>
                {actedUpsells[opp.guest] ? (
                  <span className="text-[11px] text-green-600 font-semibold">Sent</span>
                ) : (
                  <button onClick={() => actOnUpsell(opp.guest)} className="px-2.5 py-1 rounded-lg bg-kuriftu-700 text-white text-[10px] font-semibold hover:bg-kuriftu-800 transition-colors">Send Offer</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
