"use client";

import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import DashboardView from "@/components/DashboardView";
import ConciergeView from "@/components/ConciergeView";
import BookingsView from "@/components/BookingsView";
import RevenueView from "@/components/RevenueView";
import GuestInsightsView from "@/components/GuestInsightsView";
import GuestProfilesView from "@/components/GuestProfilesView";
import AnalyticsView from "@/components/AnalyticsView";
import OperationsView from "@/components/OperationsView";
import StaffView from "@/components/StaffView";
import SmartRoomsView from "@/components/SmartRoomsView";
import MarketingView from "@/components/MarketingView";
import SettingsView from "@/components/SettingsView";
import AdminView from "@/components/AdminView";
import UserExperienceView from "@/components/UserExperienceView";
import { Icons } from "@/components/Icons";
import { 
  loadSession, 
  saveSession, 
  clearSession, 
  loadUserData, 
  saveUserData,
  getNotifications,
  markAllNotificationsRead 
} from "@/lib/store";

const ADMIN_NAV_SECTIONS = [
  {
    label: "Main Room",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
      { id: "concierge", label: "Concierge AI", icon: Icons.chat },
      { id: "bookings", label: "Reservations", icon: Icons.bookings },
      { id: "revenue", label: "Revenue Mgmt", icon: Icons.revenue },
    ],
  },
  {
    label: "Guests",
    items: [
      { id: "guests", label: "Guest Insights", icon: Icons.insights },
      { id: "profiles", label: "Guest Profiles", icon: Icons.profiles },
      { id: "analytics", label: "Analytics", icon: Icons.analytics },
    ],
  },
  {
    label: "Back Office",
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

const DEFAULT_USER_DATA = {
  name: "Sarah Mitchell",
  initials: "SM",
  tier: "Gold",
  img: null,
  interests: ["Spa", "Fine Dining"],
  tags: ["Nature Lover"],
  email: "sarah.m@heritage.com",
  phone: "+251 91 123 4567",
  nationality: "Ethiopian",
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("admin");
  const [activeView, setActiveView] = useState("dashboard");
  const [userData, setUserData] = useState(DEFAULT_USER_DATA);
  const [isHydrated, setIsHydrated] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // ─── Session Restoration on Mount ───────────────────────────────────
  useEffect(() => {
    const session = loadSession();
    if (session && session.isLoggedIn) {
      setIsLoggedIn(true);
      setUserRole(session.userRole);
      setActiveView(session.activeView);
    }
    const savedUser = loadUserData();
    if (savedUser) {
      setUserData(prev => ({ ...prev, ...savedUser }));
    }
    setIsHydrated(true);
  }, []);

  // ─── Save session when state changes ────────────────────────────────
  useEffect(() => {
    if (!isHydrated) return;
    if (isLoggedIn) {
      saveSession({ isLoggedIn, userRole, activeView });
    }
  }, [isLoggedIn, userRole, activeView, isHydrated]);

  // ─── Save user data on changes ──────────────────────────────────────
  useEffect(() => {
    if (!isHydrated) return;
    saveUserData(userData);
  }, [userData, isHydrated]);

  // ─── Notification polling ───────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    const check = () => {
      const data = getNotifications(userRole);
      setNotifs(data);
    };
    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, [isLoggedIn, userRole]);

  const unreadCount = notifs.filter(n => !n.read).length;

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

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

  const handleLogout = () => {
    clearSession();
    localStorage.removeItem("kuriftu_user_data"); // Reset user data on logout for demo
    setIsLoggedIn(false);
    setUserRole("admin");
    setActiveView("dashboard");
  };

  const handleToggleNotifs = () => {
    setShowNotifPanel(!showNotifPanel);
    if (!showNotifPanel && unreadCount > 0) {
      markAllNotificationsRead(userRole);
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const navSections = userRole === "user" ? USER_NAV_SECTIONS : ADMIN_NAV_SECTIONS;

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f6f1]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-kuriftu-50 border border-kuriftu-100 flex items-center justify-center p-2 animate-pulse">
            <img src="/kuriftu-logo.png" alt="Loading" className="w-full h-full object-contain" />
          </div>
          <div className="text-sm font-bold text-sand-400 uppercase tracking-widest text-center">Resorting to Excellence...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen font-sans text-kuriftu-900 bg-[#f8f6f1]">
      {/* Sidebar */}
      <div className={`w-[260px] flex flex-col flex-shrink-0 z-10 transition-colors duration-500 ${userRole === "user" ? "bg-[#0d1f16] text-white" : "bg-white border-r border-sand-200 shadow-sm"}`}>
        {/* Logo */}
        <div className={`p-8 ${userRole === "user" ? "border-b border-white/5" : "border-b border-sand-200"}`}>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveView(userRole === "user" ? "user-home" : "dashboard")}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center p-1.5 shadow-2xl transition-all duration-500 ${userRole === "user" ? "bg-white/10 backdrop-blur-md border border-white/20" : "bg-kuriftu-50 border border-kuriftu-100"}`}>
              <img src="/kuriftu-logo.png" alt="Kuriftu Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className={`font-bold text-base tracking-tight leading-tight ${userRole === "user" ? "text-white" : "text-kuriftu-900"}`} style={{ fontFamily: "Georgia, serif" }}>
                Kuriftu Resort
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${userRole === "user" ? "text-kuriftu-300" : "text-sand-400"}`}>
                & Spa
              </div>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto mt-4 custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              <div className={`text-[10px] font-black uppercase tracking-[0.25em] mb-4 px-3 ${userRole === "user" ? "text-white/20" : "text-sand-400"}`}>
                {section.label}
              </div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl border-none text-[13px] cursor-pointer text-left transition-all duration-300 mb-1.5 group relative overflow-hidden ${
                    activeView === item.id
                      ? userRole === "user"
                        ? "bg-kuriftu-500 text-kuriftu-950 font-black shadow-xl shadow-kuriftu-500/20 active:scale-95"
                        : "bg-kuriftu-700 text-white font-semibold shadow-md shadow-kuriftu-700/20"
                      : userRole === "user"
                        ? "bg-transparent text-white/50 font-bold hover:bg-white/5 hover:text-white"
                        : "bg-transparent text-sand-600 font-medium hover:bg-sand-50 hover:text-kuriftu-800"
                  }`}
                >
                  <span className={`transition-all duration-300 ${
                    activeView === item.id 
                      ? userRole === "user" ? "text-kuriftu-950 scale-110" : "text-white" 
                      : userRole === "user" ? "text-white/30 group-hover:text-kuriftu-300" : "text-sand-400 group-hover:text-kuriftu-600"
                  }`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {/* Local badge for nav items if needed */}
                  {((item.id === "bookings" && userRole === "admin") || (item.id === "user-bookings" && userRole === "user")) && notifs.filter(n => !n.read && (n.msg.toLowerCase().includes("booking") || n.msg.toLowerCase().includes("confirmed"))).length > 0 && (
                    <div className="absolute right-4 w-2 h-2 rounded-full bg-red-500 animate-pulse border border-white" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User context footer */}
        <div className={`p-4 ${userRole === "user" ? "border-t border-white/10" : "border-t border-sand-100"}`}>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-none text-[13px] cursor-pointer text-left font-bold transition-all duration-300 ${userRole === "user" ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-sand-200 px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
             <div className="text-xs font-black text-sand-400 uppercase tracking-[0.2em]">{activeView.replace('user-', '').replace('-', ' ')}</div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Global Search */}
            <div className="hidden md:flex relative group">
               <input type="text" placeholder="Search heritage..." className="bg-sand-50 border border-sand-200 rounded-full pl-10 pr-4 py-2 text-xs font-medium outline-none focus:ring-2 ring-kuriftu-100 w-48 focus:w-64 transition-all" />
               <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={handleToggleNotifs}
                className={`p-2 rounded-xl transition-all ${unreadCount > 0 ? "bg-amber-50 text-amber-600 animate-bounce-slow" : "bg-sand-50 text-sand-500 hover:bg-sand-100"}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">{unreadCount}</span>}
              </button>

              {/* Notification Panel */}
              {showNotifPanel && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifPanel(false)} />
                  <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-sand-100 p-4 z-40 animate-fade-in origin-top-right">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-sand-50">
                      <h4 className="text-sm font-black text-kuriftu-900 uppercase tracking-widest">Notifications</h4>
                      <button onClick={() => { markAllNotificationsRead(userRole); setNotifs(prev => prev.map(n => ({...n, read: true}))); }} className="text-[10px] font-bold text-kuriftu-600 hover:underline">Clear All</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-3 custom-scrollbar">
                      {notifs.length === 0 ? (
                        <div className="text-center py-8">
                           <div className="text-2xl mb-2">🔕</div>
                           <div className="text-xs text-sand-400 font-medium">Your inbox is clear</div>
                        </div>
                      ) : notifs.map(n => (
                        <div key={n.id} className={`p-3 rounded-xl border transition-all ${n.read ? "bg-white border-sand-50" : "bg-kuriftu-50 border-kuriftu-100 shadow-sm"}`}>
                           <div className="flex justify-between items-start mb-1">
                              <div className={`text-[11px] font-bold ${n.read ? "text-kuriftu-800" : "text-kuriftu-950"}`}>{n.msg}</div>
                              {!n.read && <div className="w-2 h-2 rounded-full bg-kuriftu-600 mt-1" />}
                           </div>
                           <div className="text-[9px] text-sand-400 font-bold uppercase tracking-widest">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Role/Section Info */}
            <div className="h-8 border-l border-sand-200 mx-2 hidden md:block" />
            
            <div className="flex items-center gap-3 bg-sand-50 px-4 py-1.5 rounded-full border border-sand-100">
               <div className="text-right">
                  <div className="text-[10px] font-black text-kuriftu-900 leading-none">{userRole === 'user' ? userData.name : 'Super Admin'}</div>
                  <div className="text-[8px] font-bold text-kuriftu-400 uppercase tracking-widest mt-1">{userRole.toUpperCase()} SESSION</div>
               </div>
               <div className="w-8 h-8 rounded-lg bg-kuriftu-950 flex items-center justify-center p-1 cursor-pointer hover:scale-110 transition-all" onClick={() => userRole === 'admin' ? handleLogin({role: 'user'}) : handleLogin({role: 'admin'})}>
                  <img src="/kuriftu-logo.png" alt="Profile" className="w-full h-full object-contain filter invert" />
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <main className="max-w-[1400px] mx-auto min-h-full pb-20">
            {userRole === "user" && activeView === "user-home" && <UserExperienceView section="user-home" userData={userData} updateUserData={updateUserData} />}
            {userRole === "user" && activeView === "user-bookings" && <UserExperienceView section="user-bookings" userData={userData} updateUserData={updateUserData} />}
            {userRole === "user" && activeView === "user-activities" && <UserExperienceView section="user-activities" userData={userData} updateUserData={updateUserData} />}
            {userRole === "user" && activeView === "user-profile" && <UserExperienceView section="user-profile" userData={userData} updateUserData={updateUserData} />}
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
          </main>
        </div>
      </div>
    </div>
  );
}
