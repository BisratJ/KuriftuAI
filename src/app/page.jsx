"use client";

import { useState } from "react";
import { Icons } from "@/components/Icons";
import DashboardView from "@/components/DashboardView";
import ConciergeView from "@/components/ConciergeView";
import RevenueView from "@/components/RevenueView";
import GuestInsightsView from "@/components/GuestInsightsView";
import LoginView from "@/components/LoginView";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { id: "concierge", label: "AI Concierge", icon: Icons.chat },
  { id: "revenue", label: "Revenue", icon: Icons.revenue },
  { id: "guests", label: "Guest Insights", icon: Icons.guests },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen font-sans bg-sand-50 text-kuriftu-900">
      {/* Sidebar */}
      <div className="w-[240px] bg-white border-r border-sand-200 flex flex-col flex-shrink-0 shadow-sm z-10">
        <div className="p-6 border-b border-sand-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-kuriftu-700 to-kuriftu-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-kuriftu-700/20">
              K
            </div>
            <div>
              <div className="font-bold text-[15px] text-kuriftu-900 tracking-tight">KuriftuAI</div>
              <div className="text-[11px] text-sand-500">Intelligent Hospitality</div>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1">
          <div className="text-[10px] font-bold text-sand-400 uppercase tracking-widest mb-4 px-3">
            Main Menu
          </div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border-none text-sm cursor-pointer text-left transition-all duration-200 mb-1 group ${
                activeView === item.id
                  ? "bg-kuriftu-700 text-white font-semibold shadow-md shadow-kuriftu-700/20"
                  : "bg-transparent text-sand-600 font-medium hover:bg-sand-50 hover:text-kuriftu-800"
              }`}
            >
              <span className={`transition-colors duration-200 ${
                activeView === item.id ? "text-white" : "text-sand-400 group-hover:text-kuriftu-600"
              }`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sand-200">
          <div className="px-3 py-3 rounded-xl bg-sand-50 border border-sand-100 mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-medium text-sand-600">All systems online</span>
            </div>
            <div className="text-[10px] text-sand-400 font-medium">Bishoftu Resort & Spa</div>
          </div>
          
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border-none text-sm cursor-pointer text-left text-red-500 font-medium hover:bg-red-50 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-sand-50 scroll-smooth">
        <main className="max-w-[1400px] mx-auto h-full min-h-screen">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "concierge" && <ConciergeView />}
          {activeView === "revenue" && <RevenueView />}
          {activeView === "guests" && <GuestInsightsView />}
        </main>
      </div>
    </div>
  );
}
