"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import { useToast } from "./ui/Toast";
import { SENTIMENT_DATA } from "@/lib/data";

const FLAGGED_FEEDBACK = [
  { text: "Breakfast buffet variety could be improved \u2014 guests mentioned wanting more traditional Ethiopian options alongside continental.", sentiment: "action", priority: "Medium", source: "TripAdvisor" },
  { text: "Multiple guests praised the new sunset boat tour. Consider expanding to daily departures.", sentiment: "positive", priority: "Opportunity", source: "Google Reviews" },
  { text: "Room 14 AC unit reported slow by 3 guests this week. Predictive maintenance flagged.", sentiment: "alert", priority: "High", source: "In-App Feedback" },
  { text: "\u201CThe coffee ceremony was the highlight of our trip\u201D \u2014 trending phrase across 18 reviews.", sentiment: "positive", priority: "Insight", source: "Booking.com" },
];

export default function GuestInsightsView() {
  const [feedback, setFeedback] = useState(FLAGGED_FEEDBACK);
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const { addToast } = useToast();

  const resolveFeedback = (idx) => {
    setResolvedIds((prev) => new Set([...prev, idx]));
    addToast("Feedback marked as resolved", "success");
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Guest Insights</h1>
        <p className="text-sm text-sand-500 mt-1">AI-driven sentiment analysis and guest intelligence</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6">
        <MetricCard label="Avg Rating" value="4.6" change={3.1} />
        <MetricCard label="Reviews Analyzed" value="1,702" change={15.3} />
        <MetricCard label="Response Rate" value="98%" change={2.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-kuriftu-900 mb-4">Sentiment by Category</div>
          <div className="flex flex-col gap-3">
            {SENTIMENT_DATA.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1 text-[13px]">
                  <span className="text-kuriftu-900 font-medium">{item.category}</span>
                  <span className="text-kuriftu-600 font-semibold tabular-nums flex items-center gap-1">
                    <span className="text-amber-400">{Icons.star}</span> {item.score.toFixed(1)}
                  </span>
                </div>
                <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.score >= 4.5 ? "bg-green-600" : item.score >= 4.0 ? "bg-amber-600" : "bg-red-600"
                    }`}
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-sand-500 mt-0.5">{item.count} reviews</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-kuriftu-900 mb-4">Recent AI-Flagged Feedback</div>
          <div className="flex flex-col gap-2.5">
            {feedback.map((item, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border transition-all group ${
                  resolvedIds.has(i) ? "opacity-50 border-sand-200 bg-sand-50" :
                  item.sentiment === "alert" ? "border-red-200 bg-red-50" :
                  item.sentiment === "positive" ? "border-green-200 bg-green-50" :
                  "border-yellow-200 bg-yellow-50"
                }`}
              >
                <div className="text-[13px] text-kuriftu-900 leading-relaxed mb-1.5">{item.text}</div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className={`px-2 py-0.5 rounded-lg font-medium ${
                    item.priority === "High" ? "bg-red-200 text-red-600" :
                    item.priority === "Opportunity" ? "bg-green-200 text-green-600" :
                    "bg-sand-200 text-sand-600"
                  }`}>
                    {item.priority}
                  </span>
                  <span className="text-sand-500">via {item.source}</span>
                  <span className="ml-auto">
                    {resolvedIds.has(i) ? (
                      <span className="text-green-600 font-semibold text-[10px]">Resolved</span>
                    ) : (
                      <button onClick={() => resolveFeedback(i)} className="opacity-0 group-hover:opacity-100 transition-opacity text-kuriftu-600 font-semibold text-[10px] hover:text-kuriftu-800">Mark Resolved</button>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
