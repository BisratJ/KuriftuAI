"use client";

import { useState } from "react";
import { Icons } from "@/components/Icons";
import DashboardView from "@/components/DashboardView";
import ConciergeView from "@/components/ConciergeView";
import RevenueView from "@/components/RevenueView";
import GuestInsightsView from "@/components/GuestInsightsView";
import OperationsView from "@/components/OperationsView";
import BookingsView from "@/components/BookingsView";
import GuestProfilesView from "@/components/GuestProfilesView";
import SmartRoomsView from "@/components/SmartRoomsView";
import StaffView from "@/components/StaffView";
import AnalyticsView from "@/components/AnalyticsView";
import MarketingView from "@/components/MarketingView";
import SettingsView from "@/components/SettingsView";
import AdminView from "@/components/AdminView";
import UserExperienceView from "@/components/UserExperienceView";
import LandingPage from "@/components/LandingPage";

const ADMIN_NAV_SECTIONS = [
  {
    label: "Core",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
      { id: "concierge", label: "AI Concierge", icon: Icons.chat },
      { id: "bookings", label: "Bookings", icon: Icons.bookings },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { id: "revenue", label: "Revenue", icon: Icons.revenue },
      { id: "guests", label: "Guest Insights", icon: Icons.guests },
      { id: "profiles", label: "Guest Profiles", icon: Icons.profiles },
      { id: "analytics", label: "Analytics", icon: Icons.analytics },
    ],
  },
  {
    label: "Operations",
    items: [
      { id: "operations", label: "Ops Hub", icon: Icons.operations },
      { id: "staff", label: "Staff", icon: Icons.staff },
      { id: "smartrooms", label: "Smart Rooms", icon: Icons.smartRoom },
    ],
  },
  {
    label: "Growth",
    items: [
      { id: "marketing", label: "Marketing", icon: Icons.marketing },
      { id: "settings", label: "Settings", icon: Icons.settings },
      { id: "admin", label: "Admin Panel", icon: Icons.shield },
    ],
  },
];

const USER_NAV_SECTIONS = [
  {
    label: "My Stay",
    items: [
      { id: "user-home", label: "Overview", icon: Icons.dashboard },
      { id: "user-bookings", label: "My Bookings", icon: Icons.bookings },
      { id: "user-activities", label: "Activities", icon: Icons.sparkle },
      { id: "user-profile", label: "Profile & Perks", icon: Icons.profiles },
    ],
  },
  {
    label: "Support",
    items: [{ id: "concierge", label: "Concierge", icon: Icons.chat }],
  },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("admin");
  const [activeView, setActiveView] = useState("dashboard");

  const handleLogin = (loginConfig = {}) => {
    if (typeof loginConfig === "string") {
      setUserRole("admin");
      setActiveView(loginConfig);
      setIsLoggedIn(true);
      return;
    }

    const role = loginConfig.role || "admin";
    const targetView =
      loginConfig.targetView || (role === "user" ? "user-home" : "dashboard");

    setUserRole(role);
    setActiveView(targetView);
    setIsLoggedIn(true);
  };

  const navSections = userRole === "user" ? USER_NAV_SECTIONS : ADMIN_NAV_SECTIONS;

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen font-sans bg-sand-50 text-kuriftu-900">
      {/* Sidebar */}
      <div className="w-[240px] bg-white border-r border-sand-200 flex flex-col flex-shrink-0 shadow-sm z-10">
        <div className="p-6 border-b border-sand-200">
          <div className="flex items-center gap-3">
            <img src="/kuriftu-logo.png" alt="KuriftuAI" className="w-9 h-9 object-contain mix-blend-screen" />
            <div>
              <div className="font-bold text-[15px] text-kuriftu-900 tracking-tight">KuriftuAI</div>
              <div className="text-[11px] text-sand-500">Enterprise Platform</div>
            </div>
          </div>
        </div>

        <nav className="p-3 flex-1 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label} className="mb-3">
              <div className="text-[10px] font-bold text-sand-400 uppercase tracking-widest mb-2 px-3">
                {section.label}
              </div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg border-none text-[13px] cursor-pointer text-left transition-all duration-200 mb-0.5 group ${
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
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-sand-200">
          <div className="px-3 py-2.5 rounded-xl bg-sand-50 border border-sand-100 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-medium text-sand-600">All systems online</span>
            </div>
            <div className="text-[10px] text-sand-400 font-medium">
              {userRole === "user" ? "Guest Experience Mode" : "6 Properties · 158 Staff"}
            </div>
          </div>
          
          <button 
            onClick={() => {
              setIsLoggedIn(false);
              setUserRole("admin");
              setActiveView("dashboard");
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border-none text-[13px] cursor-pointer text-left text-red-500 font-medium hover:bg-red-50 transition-all duration-200"
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
        <main className="max-w-[1400px] mx-auto h-full min-h-screen" key={activeView}>
          <div className="view-transition">
            {userRole === "user" && activeView === "user-home" && <UserExperienceView section="user-home" />}
            {userRole === "user" && activeView === "user-bookings" && <UserExperienceView section="user-bookings" />}
            {userRole === "user" && activeView === "user-activities" && <UserExperienceView section="user-activities" />}
            {userRole === "user" && activeView === "user-profile" && <UserExperienceView section="user-profile" />}
            {userRole === "user" && activeView === "concierge" && <ConciergeView />}

            {userRole !== "user" && activeView === "dashboard" && <DashboardView />}
            {userRole !== "user" && activeView === "concierge" && <ConciergeView />}
            {userRole !== "user" && activeView === "bookings" && <BookingsView />}
            {userRole !== "user" && activeView === "revenue" && <RevenueView />}
            {userRole !== "user" && activeView === "guests" && <GuestInsightsView />}
            {userRole !== "user" && activeView === "profiles" && <GuestProfilesView />}
            {userRole !== "user" && activeView === "analytics" && <AnalyticsView />}
            {userRole !== "user" && activeView === "operations" && <OperationsView />}
            {userRole !== "user" && activeView === "staff" && <StaffView />}
            {userRole !== "user" && activeView === "smartrooms" && <SmartRoomsView />}
            {userRole !== "user" && activeView === "marketing" && <MarketingView />}
            {userRole !== "user" && activeView === "settings" && <SettingsView />}
            {userRole !== "user" && activeView === "admin" && <AdminView />}
          </div>
        </main>
      </div>
    </div>
  );
}
