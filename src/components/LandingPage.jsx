"use client";

import { useState, useEffect, useRef } from "react";
import { LOCATIONS as REAL_LOCATIONS } from "@/lib/data";

const LOCATION_DETAILS = {
  bishoftu: {
    city: "Bishoftu",
    description:
      "A flagship lakeside paradise adjacent to East Africa's largest water park, offering ultimate family fun and forest spa retreats.",
    tag: "Flagship & Waterpark",
    emoji: "🌊",
    gradient: "from-[#0d3b2e] to-[#1a6b50]",
  },
  bahirdar: {
    city: "Bahir Dar",
    description:
      "Set directly on the shores of Lake Tana, your gateway to historic island monasteries and Blue Nile boat tours.",
    tag: "Lake Tana",
    emoji: "⛵",
    gradient: "from-[#0a2d3a] to-[#1a5a6e]",
  },
  adama: {
    city: "Adama",
    description:
      "A vibrant and relaxed getaway destination with modern resort comforts, swimming pools, and excellent dining.",
    tag: "City Escape",
    emoji: "⛱️",
    gradient: "from-[#1a2a4a] to-[#2d4a7a]",
  },
  langano: {
    city: "Langano",
    description:
      "A tranquil lakeside environment ideal for family retreats, outdoor recreation, and nature-based experiences.",
    tag: "Nature",
    emoji: "🌿",
    gradient: "from-[#2d1a0a] to-[#6e3a1a]",
  },
  "african-village": {
    city: "African Village",
    description:
      "A luxury pan-African cultural hub in Shaggar City, featuring 54 uniquely themed villas and continental cuisine.",
    tag: "Cultural Hub",
    emoji: "🛖",
    gradient: "from-[#3a1a2d] to-[#6e2d5a]",
  },
  entoto: {
    city: "Entoto",
    description:
      "An adventure park and retreat in the highland eucalyptus forest above Addis Ababa, featuring ziplines and rope courses.",
    tag: "Adventure Park",
    emoji: "🏔️",
    gradient: "from-[#2d2a0a] to-[#5a4d1a]",
  },
};

const LOCATION_IMAGES = {
  bishoftu: "/bishoftu.png",
  bahirdar: "/bahirdar.png",
  adama:
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
  langano:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  "african-village": "/african-village.png",
  entoto: "/entoto.png",
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
  const [phone, setPhone] = useState("");
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
    setPhone("");
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

  // Focus state for form blurring
  const [focusedInput, setFocusedInput] = useState(null);

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

  // ─── ACTIVITY & DINING DATA ───
  const ACTIVITIES = [
    { 
      id: "waterpark",
      name: "Kuriftu Water Park", 
      loc: "Bishoftu", 
      icon: "🎢", 
      short: "East Africa's largest and most exciting water park.",
      detail: "Located adjacent to our Bishoftu resort, this massive 30,000 sqm water park features thrilling boomerang and spiral slides, a wave pool, a relaxing lazy river, and dedicated children's water houses. Fun for the whole family.",
      img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
      features: ["Boomerang Slides", "Massive Wave Pool", "Lazy River", "Performance Center"]
    },
    { 
      id: "zipline",
      name: "Entoto Adventure Ziplining", 
      loc: "Entoto", 
      icon: "🧗", 
      short: "Soar above the eucalyptus canopy in Addis Ababa.",
      detail: "Experience the thrill of our professional-grade zipline and aerial rope courses suspended high in the lush eucalyptus forests of Entoto Mountain. A safe, exhilarating adventure with panoramic views.",
      img: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=800&q=80",
      features: ["Forest Zipline", "Rope Courses", "Wall Climbing", "Safe & Certified"]
    },
    { 
      id: "boattour",
      name: "Lake Tana Boat Tours", 
      loc: "Bahir Dar", 
      icon: "⛴️", 
      short: "Cruise to historic island monasteries and the Blue Nile.",
      detail: "Depart directly from the resort shores for a scenic boat ride across Lake Tana. Visit ancient, forest-veiled monasteries like Ura Kidane Mehret on the Zege Peninsula and spot hippos near the Blue Nile source.",
      img: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80",
      features: ["Monastery Visits", "Blue Nile Source", "Bird Watching", "Hippo Spotting"]
    },
    { 
      id: "spa",
      name: "Kuriftu Forest Spa", 
      loc: "All Resorts", 
      icon: "🧘", 
      short: "Award-winning sanctuaries for Ethiopian coffee-based rituals.",
      detail: "Our world-class spa facilities blend ancient wellness traditions with modern luxury. Relax in the sauna and steam room, then experience a signature deep-tissue massage or rejuvenating coffee scrub.",
      img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      features: ["Coffee Scrubs", "Deep Tissue Massage", "Sauna & Steam", "Forest Atmosphere"]
    },
    { 
      id: "kayaking",
      name: "Lake Kuriftu Kayaking", 
      loc: "Bishoftu", 
      icon: "🛶", 
      short: "Serene paddling on the calm waters of the volcanic crater lake.",
      detail: "Grab a kayak and glide across the tranquil, dark blue waters of Lake Kuriftu. Enjoy a unique perspective of the lush resort gardens and abundant birdlife from the center of the crater lake.",
      img: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80",
      features: ["Complimentary Craft", "Peaceful Waters", "Bird Watching", "Sunset Paddles"]
    },
    { 
      id: "cinema",
      name: "Private Resort Cinema", 
      loc: "Bishoftu", 
      icon: "🎬", 
      short: "Relaxing cinematic experience with plush lounging.",
      detail: "Unwind after a day of activities in our private screening room. Sink into cozy cushions and enjoy movies in a comfortable, intimate setting perfect for couples and families alike.",
      img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      features: ["HD Projection", "Plush Cushions", "Intimate Setting", "Evening Entertainment"]
    }
  ];

  const RESTAURANTS = [
    { 
      id: "1963restaurant",
      name: "1963 Restaurant", 
      loc: "African Village", 
      special: "Continental African Cuisine", 
      detail: "Named after the founding year of the African Union, this signature restaurant offers a culinary journey across the African continent, featuring diverse, masterfully prepared dishes celebrating pan-African flavors.",
      img: "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&w=800&q=80",
      features: ["Pan-African Menu", "Thematic Decor", "Cultural Ambiance", "Signature Dining"]
    },
    { 
      id: "lakefront",
      name: "Lakefront Restaurant", 
      loc: "Bishoftu", 
      special: "Lake View Dining & Coffee", 
      detail: "Enjoy uninterrupted views of Lake Kuriftu from our outdoor seating deck. Our culinary approach weaves traditional Ethiopian specialties with international fare, complemented by the famous Ethiopian coffee ceremony.",
      img: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=800&q=80",
      features: ["Outdoor Deck", "Lake Views", "Ethiopian Specialties", "International Fare"]
    },
    { 
      id: "summitgrill",
      name: "Summit Grill Restaurant", 
      loc: "African Village", 
      special: "Panoramic Dining heights", 
      detail: "Perched at the highest point of the African Village in Shaggar City, the Summit Grill provides breathtaking panoramic skyline views accompanied by a sophisticated menu of grilled international favorites.",
      img: "https://images.unsplash.com/photo-1541512416146-3cf58d6b27cc?auto=format&fit=crop&w=800&q=80",
      features: ["Skyline Views", "Premium Grill", "Signature Cocktails", "Sophisticated Atmosphere"]
    },
    { 
      id: "kuriftulaketana",
      name: "Kuriftu Lake Tana Restaurant", 
      loc: "Bahir Dar", 
      special: "Fresh Catch & Traditional Fare", 
      detail: "Situated right on the shores of Lake Tana, this scenic dining spot specializes in fresh fish sourced from the lake, alongside traditional Ethiopian meat dishes, providing a tranquil waterfront culinary experience.",
      img: "https://kuriftu-media.s3.amazonaws.com/tana/dining/1.webp",
      features: ["Waterfront Terrace", "Fresh Local Catch", "Traditional Meats", "Lake Breezes"]
    },
    { 
      id: "entotodining",
      name: "Kuriftu Entoto Restaurant", 
      loc: "Entoto", 
      special: "Highland Forest Cuisine", 
      detail: "Nestled in the cool highlands of Entoto Park, relax at modern cafes and dining spots serving organic coffee, local cuisine, and light gourmet fare—the perfect way to recharge after forest adventures.",
      img: "https://kuriftu-media.s3.amazonaws.com/tana/dining/3.webp",
      features: ["Highland Atmosphere", "Organic Coffee", "Modern Cafes", "Scenic Forest Setting"]
    },
    { 
      id: "articoffee",
      name: "Artisan Coffee Kuriftu", 
      loc: "All Locations", 
      special: "Micro-lot Specialty Brews", 
      detail: "A celebration of Ethiopia's gift to the world. Our baristas serve expertly roasted micro-lot coffees from regional origins like Sidamo, holding true to the renowned Ethiopian coffee ceremony and exceptional daily brews.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWHrFKRH3Ch5P35uxM8h3MS0-1pQJpL23xQg&s",
      features: ["Coffee Ceremony", "Specialty Roasts", "Artisan Baristas", "Ethiopian Heritage"]
    }
  ];

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* ──────────────── NAVIGATION ──────────────── */}
      <nav
        className={`fixed z-50 transition-all duration-500 flex justify-center w-full px-6 pt-4 pointer-events-none`}
      >
        <div
          className={`w-full max-w-6xl mx-auto rounded-full transition-all duration-500 pointer-events-auto border overflow-hidden ${
            scrolled
              ? "bg-white/75 backdrop-blur-xl shadow-lg border-sand-100 py-1"
              : "bg-white/10 backdrop-blur-md border-white/20 py-2"
          }`}
        >
          <div className="px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/kuriftu-logo.png"
              alt="KuriftuAI logo"
              className="w-16 h-16 object-contain transition-all duration-300 drop-shadow-md"
            />
            <div>
              <div
                className={`font-bold text-lg tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-kuriftu-900" : "text-white"
                }`}
              >
                Kuriftu Resort
              </div>
              <div
                className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  scrolled ? "text-sand-400" : "text-white/60"
                }`}
              >
                &amp; Spa
              </div>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {["Resorts", "Activities", "Booking"].map(
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
      </div>

      {/* Mobile menu - Floating dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-6 right-6 lg:hidden bg-white/95 backdrop-blur-xl border border-sand-100 px-6 py-5 space-y-4 shadow-2xl rounded-[2.5rem] pointer-events-auto animate-fade-in-down">
            {["Resorts", "Activities", "Booking"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="block text-base font-semibold text-kuriftu-800 hover:text-kuriftu-600 border-b border-sand-50 pb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button
              onClick={() => openAuth("signin")}
              className="block w-full text-center py-3 rounded-2xl bg-kuriftu-700 text-white text-sm font-bold shadow-lg"
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
          {/* Fallback image always behind the video */}
          <img
            src={LOCATION_IMAGES["african-village"]}
            alt="Kuriftu African Village"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Local video from /public — no CORS issues */}
          <video
            ref={heroVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
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
            <source src="/herovideo.mp4" type="video/mp4" />
          </video>
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

      {/* Awards section removed per request */}

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

      {/* ──────────────── ACTIVITIES & DINING (RESTRUCTURED) ──────────────── */}
      <section id="activities" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kuriftu-50/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 bg-kuriftu-50 text-kuriftu-700 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-4 border border-kuriftu-100">
              Lifestyle & Leisure
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-kuriftu-950 mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Experience the Kuriftu Lifestyle
            </h2>
            <div className="w-24 h-1 bg-kuriftu-600 mx-auto rounded-full mb-8" />
          </div>

          {/* 🚣 ACTIVITIES SECTION (TOP) */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10 pb-4 border-b border-sand-100">
               <span className="w-10 h-10 rounded-full bg-kuriftu-100 flex items-center justify-center text-xl">🚣</span>
               <h3 className="text-2xl font-bold text-kuriftu-900 tracking-tight">Signature Resort Activities</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ACTIVITIES.map((activity) => (
                <div 
                  key={activity.id} 
                  onClick={() => setSelectedItem({ ...activity, type: 'activity' })}
                  className="group relative h-72 rounded-3xl overflow-hidden bg-sand-100 shadow-sm cursor-pointer hover:shadow-2xl transition-all duration-500"
                >
                  <img src={activity.img} alt={activity.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-300 pointer-events-none" />
                  
                  <div className="absolute inset-x-6 bottom-6 transition-all duration-500 group-hover:bottom-8">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl bg-white/20 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center">{activity.icon}</span>
                        <span className="text-[10px] font-bold text-kuriftu-300 uppercase tracking-widest">{activity.loc}</span>
                     </div>
                     <h4 className="text-xl font-bold text-white mb-2">{activity.name}</h4>
                     
                     <p className="text-white/70 text-xs leading-relaxed line-clamp-2 max-h-0 group-hover:max-h-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        {activity.short}
                     </p>
                  </div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                      View Details
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🍽️ RESTAURANTS SECTION (BOTTOM) */}
          <div>
            <div className="flex items-center gap-4 mb-10 pb-4 border-b border-sand-100">
               <span className="w-10 h-10 rounded-full bg-kuriftu-100 flex items-center justify-center text-xl">🍽️</span>
               <h3 className="text-2xl font-bold text-kuriftu-900 tracking-tight">Exceptional Dining & Coffee</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {RESTAURANTS.map((dining) => (
                <div 
                  key={dining.id} 
                  onClick={() => setSelectedItem({ ...dining, type: 'dining' })}
                  className="group cursor-pointer"
                >
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-5 shadow-sm transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                    <img src={dining.img} alt={dining.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-kuriftu-800 uppercase tracking-widest border border-white">
                      {dining.loc}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 text-kuriftu-900 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl">
                        View Menu & Details
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between">
                     <div>
                        <h4 className="text-lg font-bold text-kuriftu-900 group-hover:text-kuriftu-600 transition-colors mb-1">{dining.name}</h4>
                        <div className="text-xs text-kuriftu-500 font-medium mb-3">{dining.special}</div>
                     </div>
                     <div className="w-8 h-8 rounded-full border border-sand-200 flex items-center justify-center group-hover:bg-kuriftu-700 group-hover:border-kuriftu-700 transition-all">
                        <span className="text-kuriftu-400 group-hover:text-white transition-colors">→</span>
                     </div>
                  </div>
                  
                  <p className="text-sand-500 text-sm leading-relaxed line-clamp-2">
                    {dining.detail.substring(0, 90)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ──────────────── DETAIL MODAL ──────────────── */}
        {selectedItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-lg animate-fade-in" 
              onClick={() => setSelectedItem(null)}
            />
            <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in max-h-[90vh]">
              {/* Left Side: Image */}
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={selectedItem.img} 
                  alt={selectedItem.name} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                <div className="absolute bottom-6 left-6 md:bottom-auto md:top-8 md:left-8">
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/30 text-white">
                    <span className="text-2xl">{selectedItem.icon || "🍽️"}</span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">{selectedItem.type}</div>
                      <div className="text-sm font-bold">{selectedItem.loc}</div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 md:hidden bg-white/20 backdrop-blur-md p-2 rounded-full text-white"
                >
                   <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Right Side: Content */}
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="hidden md:flex absolute top-6 right-6 text-sand-400 hover:text-kuriftu-600 transition-colors p-2"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div className="mb-8">
                  <div className="text-kuriftu-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">
                    {selectedItem.type === 'activity' ? 'Signature Activity' : 'Featured Dining'}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-kuriftu-900 leading-tight mb-4" style={{ fontFamily: "Georgia, serif" }}>
                    {selectedItem.name}
                  </h2>
                  <div className="w-16 h-1 bg-kuriftu-600 rounded-full" />
                </div>

                <p className="text-sand-600 text-base md:text-lg leading-relaxed mb-8">
                  {selectedItem.detail}
                </p>

                {selectedItem.features && (
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {selectedItem.features.map(f => (
                      <div key={f} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-kuriftu-50 flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-kuriftu-800">{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                   <button 
                    onClick={() => {
                      setSelectedItem(null);
                      openAuth("signup", "bookings");
                    }}
                    className="flex-1 py-4 bg-kuriftu-700 hover:bg-kuriftu-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-kuriftu-900/20"
                   >
                     Book Now
                   </button>
                   {selectedItem.type === 'dining' && (
                     <button className="flex-1 py-4 border border-sand-200 hover:bg-sand-50 text-kuriftu-900 rounded-2xl font-bold transition-all">
                       View Menu
                     </button>
                   )}
                </div>
              </div>
            </div>
          </div>
        )}
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

      <footer className="bg-kuriftu-900/90 backdrop-blur-md text-white py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/kuriftu-logo.png" alt="KuriftuAI" className="w-16 h-16 object-contain" />
            <div>
              <div className="font-bold text-xl">KuriftuAI</div>
              <div className="text-xs text-white/40 tracking-widest uppercase">Hospitality Intelligence</div>
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
            className="absolute inset-0 bg-black/80"
            onClick={closeAuth}
          />
          <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Top accent */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #92400e, #D97706, #fcd38d)" }}
            />

            {/* Header - Centered */}
            <div className="p-8 pb-4 flex flex-col items-center text-center relative">
              <button
                onClick={closeAuth}
                className="absolute top-4 right-4 text-sand-400 hover:text-sand-600 transition-colors p-1"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              
              <div className="flex flex-col items-center gap-3">
                <img src="/kuriftu-logo.png" alt="KuriftuAI" className="w-32 h-32 object-contain mb-4" />
                <div>
                  <h2 className="text-3xl font-bold text-kuriftu-900 mb-1">
                    {authMode === "signin" ? "Welcome Back" : "Joining Kuriftu"}
                  </h2>
                  <p className="text-sand-500 text-base max-w-[320px]">
                    {authMode === "signin"
                      ? "Sign in to access your luxury dashboard"
                      : "Start your extraordinary journey with us"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={authMode === "signin" ? handleSignIn : handleSignUp}
              className="px-6 pb-6 space-y-4 transition-all duration-500"
            >
              {authMode === "signup" && (
                <div className="space-y-4">
                  <div className="transition-all duration-300">
                    <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onFocus={() => setFocusedInput('name')}
                      onBlur={() => setFocusedInput(null)}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm focus:border-kuriftu-500 focus:ring-2 focus:ring-kuriftu-200 transition-all placeholder:text-sand-300"
                    />
                  </div>
                  <div className="transition-all duration-300">
                    <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onFocus={() => setFocusedInput('phone')}
                      onBlur={() => setFocusedInput(null)}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 ..."
                      className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm focus:border-kuriftu-500 focus:ring-2 focus:ring-kuriftu-200 transition-all placeholder:text-sand-300"
                    />
                  </div>
                </div>
              )}

              <div className="transition-all duration-300">
                <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm focus:border-kuriftu-500 focus:ring-2 focus:ring-kuriftu-200 transition-all placeholder:text-sand-300"
                />
              </div>

              <div className="transition-all duration-300">
                <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm focus:border-kuriftu-500 focus:ring-2 focus:ring-kuriftu-200 transition-all placeholder:text-sand-300"
                />
              </div>

              {authMode === "signup" && (
                <div className="transition-all duration-300">
                  <label className="block text-xs font-bold text-sand-600 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onFocus={() => setFocusedInput('confirm')}
                    onBlur={() => setFocusedInput(null)}
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
