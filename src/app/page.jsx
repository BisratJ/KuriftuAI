"use client";

import { useState } from "react";
import { Icons } from "@/components/Icons";
import DashboardView from "@/components/DashboardView";
import ConciergeView from "@/components/ConciergeView";
import RevenueView from "@/components/RevenueView";
import GuestInsightsView from "@/components/GuestInsightsView";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { id: "concierge", label: "AI Concierge", icon: Icons.chat },
  { id: "revenue", label: "Revenue", icon: Icons.revenue },
  { id: "guests", label: "Guest Insights", icon: Icons.guests },
];

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="flex h-screen font-sans bg-sand-50 text-kuriftu-900">
      {/* Sidebar */}
      <div className="w-[220px] bg-white border-r border-sand-200 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-sand-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kuriftu-700 to-kuriftu-500 flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <div>
              <div className="font-bold text-[15px] text-kuriftu-900 tracking-tight">KuriftuAI</div>
              <div className="text-[11px] text-sand-500">Intelligent Hospitality</div>
            </div>
          </div>
        </div>

        <nav className="p-3 flex-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md border-none text-sm cursor-pointer text-left transition-all duration-150 mb-0.5 ${
                activeView === item.id
                  ? "bg-kuriftu-50 text-kuriftu-700 font-semibold"
                  : "bg-transparent text-sand-600 font-normal hover:bg-sand-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sand-200 text-xs text-sand-500">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
            All systems operational
          </div>
          <div className="text-sand-400">Kuriftu Resort & Spa</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {activeView === "dashboard" && <DashboardView />}
        {activeView === "concierge" && <ConciergeView />}
        {activeView === "revenue" && <RevenueView />}
        {activeView === "guests" && <GuestInsightsView />}
      </div>
    </div>
  );
}
