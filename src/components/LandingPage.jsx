"use client";

import { useState, useEffect, useRef } from "react";
import { LOCATIONS as REAL_LOCATIONS } from "@/lib/data";

const LOCATION_DETAILS = {
  bishoftu: {
    city: "Bishoftu",
    description:
      "A lakeside paradise on the shores of volcanic crater lakes, known for luxury escapes and serene wellness retreats.",
    tag: "Most Popular",
    emoji: "🌊",
    gradient: "from-[#0d3b2e] to-[#1a6b50]",
  },
  bahirdar: {
    city: "Bahir Dar",
    description:
      "Set near Lake Tana and the source of the Blue Nile, blending heritage, nature, and waterfront relaxation.",
    tag: "Heritage",
    emoji: "⛵",
    gradient: "from-[#0a2d3a] to-[#1a5a6e]",
  },
  adama: {
    city: "Adama",
    description:
      "A vibrant gateway destination with modern comfort, warm hospitality, and easy access to central Ethiopia.",
    tag: "City Escape",
    emoji: "�️",
    gradient: "from-[#1a2a4a] to-[#2d4a7a]",
  },
  langano: {
    city: "Langano",
    description:
      "A tranquil lakeside environment ideal for family retreats, outdoor recreation, and nature-based experiences.",
    tag: "Nature",
    emoji: "�",
    gradient: "from-[#2d1a0a] to-[#6e3a1a]",
  },
  "african-village": {
    city: "African Village",
    description:
      "A distinctive cultural and luxury concept where design, storytelling, and hospitality meet in one destination.",
    tag: "Signature",
    emoji: "🛖",
    gradient: "from-[#3a1a2d] to-[#6e2d5a]",
  },
  entoto: {
    city: "Entoto",
    description:
      "A highland forest retreat above Addis Ababa with panoramic city views, cool climate, and eucalyptus trails.",
    tag: "Mountain View",
    emoji: "🏔️",
    gradient: "from-[#2d2a0a] to-[#5a4d1a]",
  },
};

const LOCATION_IMAGES = {
  bishoftu:
    "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1200&q=80",
  bahirdar:
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80",
  adama:
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
  langano:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  "african-village":
    "https://images.unsplash.com/photo-1542042161-d5fe4b34c6ff?auto=format&fit=crop&w=1200&q=80",
  entoto:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
};

export default function LandingPage({ onLogin }) {
  const heroVideoRef = useRef(null);
  const [authMode, setAuthMode] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState("dashboard");
  const [videoFailed, setVideoFailed] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalRooms = REAL_LOCATIONS.reduce((sum, loc) => sum + loc.rooms, 0);
  const totalStaff = REAL_LOCATIONS.reduce((sum, loc) => sum + loc.staff, 0);
  const averageOccupancy = Math.round(
    REAL_LOCATIONS.reduce((sum, loc) => sum + loc.occupancy, 0) / REAL_LOCATIONS.length
  );
  const averageRating = (
    REAL_LOCATIONS.reduce((sum, loc) => sum + loc.rating, 0) / REAL_LOCATIONS.length
  ).toFixed(1);

  const heroStats = [
    { n: `${REAL_LOCATIONS.length}`, label: "Resort Locations" },
    { n: `${totalRooms}`, label: "Total Rooms" },
    { n: `${averageOccupancy}%`, label: "Avg Occupancy" },
    { n: `${averageRating}★`, label: "Average Rating" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!heroVideoRef.current || videoFailed) return;
    heroVideoRef.current.play().catch(() => {
      setVideoFailed(true);
    });
  }, [videoFailed]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
  };

  const openAuth = (mode, redirect = "dashboard") => {
    resetForm();
    setAuthMode(mode);
    setPendingRedirect(redirect);
    setMobileMenuOpen(false);
  };

  const closeAuth = () => {
    setAuthMode(null);
    resetForm();
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const isAdminEmail = email.trim().toLowerCase().includes("admin");
      const role = isAdminEmail ? "admin" : "user";
      const targetView =
        role === "user"
          ? pendingRedirect === "bookings"
            ? "user-bookings"
            : pendingRedirect.startsWith("user-")
              ? pendingRedirect
              : "user-home"
          : pendingRedirect;

      onLogin({ targetView, role });
      setLoading(false);
    }, 1000);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const targetView =
        pendingRedirect === "bookings"
          ? "user-bookings"
          : pendingRedirect.startsWith("user-")
            ? pendingRedirect
            : "user-home";

      onLogin({ targetView, role: "user" });
      setLoading(false);
    }, 1200);
  };

  const handleDemoLogin = (role = "user") => {
    setLoading(true);
    setTimeout(() => {
      const targetView = role === "admin" ? "dashboard" : "user-home";
      onLogin({ targetView, role });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* ──────────────── NAVIGATION ──────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/kuriftu-logo.png"
              alt="KuriftuAI logo"
              className="w-10 h-10 object-contain mix-blend-screen"
            />
            <div>
              <div
                className={`font-bold text-base tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-kuriftu-900" : "text-white"
                }`}
              >
                Kuriftu Resort
              </div>
              <div
                className={`text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                  scrolled ? "text-sand-400" : "text-white/60"
                }`}
              >
                &amp; Spa
              </div>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {["Resorts", "Booking"].map(
              (link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-kuriftu-500 ${
                    scrolled ? "text-kuriftu-800" : "text-white/90"
                  }`}
                >
                  {link}
                </a>
              )
            )}
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth("signin")}
              className={`hidden sm:block px-5 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                scrolled
                  ? "border-kuriftu-700 text-kuriftu-700 hover:bg-kuriftu-50"
                  : "border-white/60 text-white hover:bg-white/10"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-kuriftu-700 text-white hover:bg-kuriftu-800 transition-all duration-200 shadow-md"
            >
              Sign Up
            </button>
            {/* Mobile hamburger */}
            <button
              className={`lg:hidden p-2 transition-colors ${
                scrolled ? "text-kuriftu-800" : "text-white"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="17" x2="21" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-sand-100 px-6 py-4 space-y-3 shadow-lg">
            {["Resorts", "Booking"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="block text-sm font-medium text-kuriftu-800 hover:text-kuriftu-600 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button
              onClick={() => openAuth("signin")}
              className="block w-full text-left text-sm font-semibold text-kuriftu-700 py-1"
            >
              Sign In
            </button>
          </div>
        )}
      </nav>

      {/* ──────────────── HERO ──────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#071a0f]"
      >
        {/* MP4 video background */}
        <div className="absolute inset-0 overflow-hidden">
          {!videoFailed ? (
            <video
              ref={heroVideoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => setVideoFailed(true)}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "177.78vh",
                height: "56.25vw",
                minWidth: "100%",
                minHeight: "100%",
                objectFit: "cover",
              }}
            >
              <source
                src="https://kuriftu-media.s3.amazonaws.com/africanvillage/african_village720p.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              src={LOCATION_IMAGES["african-village"]}
              alt="Kuriftu African Village"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(7,26,15,0.72) 0%, rgba(7,26,15,0.55) 50%, rgba(7,26,15,0.75) 100%)" }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20 pb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-white/80 text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-kuriftu-400 animate-pulse" />
            Ethiopia's Premier Luxury Resort Chain
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Discover Ethiopia's<br />
            <span
              style={{
                background: "linear-gradient(90deg, #fcd38d, #D97706)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Most Enchanting
            </span>
            <br />Resorts
          </h1>

          <p className="text-lg sm:text-xl text-white/65 mb-10 max-w-2xl mx-auto leading-relaxed">
            Where African nature meets world-class luxury. Six extraordinary
            destinations across Ethiopia's most breathtaking landscapes.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => openAuth("signup", "bookings")}
              className="px-8 py-4 bg-kuriftu-600 hover:bg-kuriftu-700 text-white rounded-xl font-bold text-base transition-all transform hover:scale-105 shadow-2xl shadow-kuriftu-900/40"
            >
              Book Your Stay
            </button>
            <a
              href="#resorts"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold text-base transition-all border border-white/25"
            >
              Explore Resorts
            </a>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-16 text-sm">
            {heroStats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && (
                  <div className="hidden sm:block w-px h-8 bg-white/20" />
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{s.n}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/25" />
        </div>
      </section>

      {/* ──────────────── AWARD STRIP ──────────────── */}
      <div className="bg-kuriftu-900 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-white/50 text-xs font-medium uppercase tracking-widest">
          {[
            "🏆 Africa Travel Awards — Best Resort Chain 2024",
            "⭐ Condé Nast Traveller — Top 10 African Resorts",
            "🌿 Eco-Certified Luxury — Green Globe",
            "💎 Forbes Travel Guide — Recommended",
          ].map((a) => (
            <span key={a} className="text-white/40 hover:text-white/70 transition-colors cursor-default">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* ──────────────── RESORTS ──────────────── */}
      <section id="resorts" className="py-24 bg-sand-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-kuriftu-600 text-xs font-bold uppercase tracking-widest mb-3">
              Our Destinations
            </div>
            <h2
              className="text-4xl font-bold text-kuriftu-900 mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Six Extraordinary Resorts
            </h2>
            <p className="text-sand-500 text-lg max-w-2xl mx-auto">
              Each property uniquely positioned within Ethiopia's most spectacular
              natural settings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REAL_LOCATIONS.map((loc) => {
              const details = LOCATION_DETAILS[loc.id] || {
                city: loc.name,
                description: "Luxury hospitality in one of Ethiopia's premier destinations.",
                tag: "Kuriftu",
                emoji: "🏨",
                gradient: "from-[#0d3b2e] to-[#1a6b50]",
              };

              return (
              <div
                key={loc.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sand-100 cursor-pointer"
              >
                {/* Card hero */}
                <div className="h-52 relative overflow-hidden">
                  <img
                    src={LOCATION_IMAGES[loc.id] || LOCATION_IMAGES.bishoftu}
                    alt={`Kuriftu ${loc.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
                  <div className="absolute top-4 right-5 text-3xl">{details.emoji}</div>
                  <span className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/25 tracking-wide">
                    {details.tag}
                  </span>
                </div>

                <div className="p-5">
                  <div className="text-xs text-kuriftu-600 font-bold uppercase tracking-widest mb-1">
                    {details.city}
                  </div>
                  <h3 className="text-lg font-bold text-kuriftu-900 mb-2">
                    Kuriftu Resort — {loc.name}
                  </h3>
                  <p className="text-sand-500 text-sm leading-relaxed mb-4">
                    {details.description}
                  </p>
                  <div className="text-[11px] text-sand-400 font-medium mb-3">
                    {loc.rooms} rooms · {loc.occupancy}% occupancy · {loc.rating}★ rating
                  </div>
                  <button
                    onClick={() => openAuth("signup", "bookings")}
                    className="text-kuriftu-700 text-sm font-semibold hover:text-kuriftu-900 flex items-center gap-1 group-hover:gap-2 transition-all duration-200"
                  >
                    Explore Resort →
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="booking" className="py-20 bg-sand-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-kuriftu-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Book Any Kuriftu Destination
          </h2>
          <p className="text-sand-600 max-w-2xl mx-auto mb-8">
            Choose your preferred resort and continue to the booking dashboard for real-time reservation management.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => openAuth("signup", "bookings")}
              className="px-8 py-3.5 bg-kuriftu-700 hover:bg-kuriftu-800 text-white rounded-xl font-semibold transition-all"
            >
              Start Booking
            </button>
            <button
              onClick={() => openAuth("signin", "bookings")}
              className="px-8 py-3.5 border border-kuriftu-200 bg-white hover:bg-kuriftu-50 text-kuriftu-800 rounded-xl font-semibold transition-all"
            >
              Sign In to Bookings
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-kuriftu-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/kuriftu-logo.png" alt="KuriftuAI" className="w-9 h-9 object-contain mix-blend-screen" />
            <div>
              <div className="font-semibold">KuriftuAI</div>
              <div className="text-xs text-white/50">Hospitality Intelligence</div>
            </div>
          </div>
          <div className="text-white/40 text-sm text-center sm:text-right">
            © 2026 Kuriftu Resort &amp; Spa · All rights reserved.
          </div>
        </div>
      </footer>

      {/* ──────────────── AUTH MODAL ──────────────── */}
      {authMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeAuth}
          />
          <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Top accent */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #92400e, #D97706, #fcd38d)" }}
            />

            {/* Header */}
            <div className="p-6 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/kuriftu-logo.png" alt="KuriftuAI" className="w-10 h-10 object-contain mix-blend-screen" />
                <div>
                  <div className="font-bold text-kuriftu-900">
                    {authMode === "signin" ? "Welcome Back" : "Join Kuriftu"}
                  </div>
                  <div className="text-sand-400 text-xs">
                    {authMode === "signin"
                      ? "Sign in to your account"
                      : "Create your account"}
                  </div>
                </div>
              </div>
              <button
                onClick={closeAuth}
                className="text-sand-400 hover:text-sand-600 transition-colors p-1"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={authMode === "signin" ? handleSignIn : handleSignUp}
              className="px-6 pb-6 space-y-4"
            >
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm focus:border-kuriftu-500 focus:ring-2 focus:ring-kuriftu-200 transition-all placeholder:text-sand-300"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm focus:border-kuriftu-500 focus:ring-2 focus:ring-kuriftu-200 transition-all placeholder:text-sand-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm focus:border-kuriftu-500 focus:ring-2 focus:ring-kuriftu-200 transition-all placeholder:text-sand-300"
                />
              </div>

              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm focus:border-kuriftu-500 focus:ring-2 focus:ring-kuriftu-200 transition-all placeholder:text-sand-300"
                  />
                </div>
              )}

              {authMode === "signin" && (
                <div className="text-right -mt-1">
                  <a href="#" className="text-xs text-kuriftu-600 hover:text-kuriftu-700 font-semibold">
                    Forgot password?
                  </a>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2.5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-kuriftu-700 hover:bg-kuriftu-800 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-md shadow-kuriftu-700/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : authMode === "signin" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="relative py-1 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sand-200" />
                </div>
                <span className="relative px-4 bg-white text-[10px] font-bold text-sand-400 uppercase tracking-widest">
                  Or
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("user")}
                  disabled={loading}
                  className="py-3 border border-sand-200 bg-sand-50 hover:bg-sand-100 text-kuriftu-800 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <span>👤</span> Demo User
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={loading}
                  className="py-3 border border-kuriftu-200 bg-kuriftu-50 hover:bg-kuriftu-100 text-kuriftu-800 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <span>🛡️</span> Demo Admin
                </button>
              </div>

              <div className="text-center text-xs text-sand-400 pt-1">
                {authMode === "signin" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => openAuth("signup")}
                      className="text-kuriftu-600 font-bold hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => openAuth("signin")}
                      className="text-kuriftu-600 font-bold hover:underline"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
