import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const LOCATIONS = [
  { id: "bishoftu", name: "Bishoftu", rooms: 42, occupancy: 78 },
  { id: "bahirdar", name: "Bahir Dar", rooms: 28, occupancy: 85 },
  { id: "adama", name: "Adama", rooms: 30, occupancy: 72 },
  { id: "langano", name: "Langano", rooms: 25, occupancy: 68 },
  { id: "african-village", name: "African Village", rooms: 36, occupancy: 91 },
];

const REVENUE_DATA = [
  { month: "Oct", rooms: 2800, spa: 920, dining: 1450, activities: 680 },
  { month: "Nov", rooms: 3100, spa: 1080, dining: 1620, activities: 750 },
  { month: "Dec", rooms: 4200, spa: 1560, dining: 2100, activities: 1120 },
  { month: "Jan", rooms: 3800, spa: 1340, dining: 1890, activities: 980 },
  { month: "Feb", rooms: 3500, spa: 1200, dining: 1750, activities: 870 },
  { month: "Mar", rooms: 4500, spa: 1680, dining: 2340, activities: 1250 },
];

const SENTIMENT_DATA = [
  { category: "Service", score: 4.6, count: 342 },
  { category: "Cleanliness", score: 4.8, count: 298 },
  { category: "Dining", score: 4.3, count: 276 },
  { category: "Spa", score: 4.7, count: 189 },
  { category: "Value", score: 4.1, count: 310 },
  { category: "Location", score: 4.9, count: 287 },
];

const GUEST_SEGMENTS = [
  { name: "International Tourists", value: 35, color: "#B45309" },
  { name: "Domestic Leisure", value: 28, color: "#D97706" },
  { name: "Business/Corporate", value: 22, color: "#F59E0B" },
  { name: "Events/Weddings", value: 15, color: "#FCD34D" },
];

const OCCUPANCY_FORECAST = [
  { day: "Mon", actual: 72, predicted: 75 },
  { day: "Tue", actual: 68, predicted: 70 },
  { day: "Wed", actual: 74, predicted: 73 },
  { day: "Thu", actual: 80, predicted: 78 },
  { day: "Fri", actual: 88, predicted: 90 },
  { day: "Sat", actual: 95, predicted: 93 },
  { day: "Sun", actual: 82, predicted: 85 },
];

const UPSELL_OPPORTUNITIES = [
  { guest: "Sarah M.", room: "Lakeside Suite", opportunity: "Spa Package", confidence: 92, value: "$180" },
  { guest: "James K.", room: "Garden Villa", opportunity: "Boat Tour", confidence: 87, value: "$120" },
  { guest: "Amina T.", room: "Presidential", opportunity: "Private Dining", confidence: 95, value: "$350" },
  { guest: "David L.", room: "Standard Plus", opportunity: "Room Upgrade", confidence: 78, value: "$90" },
  { guest: "Hirut B.", room: "Honeymoon Suite", opportunity: "Couples Spa", confidence: 88, value: "$240" },
];

const DYNAMIC_PRICING = [
  { type: "Lakeside Suite", current: 280, suggested: 320, demand: "High", change: "+14%" },
  { type: "Garden Villa", current: 220, suggested: 195, demand: "Low", change: "-11%" },
  { type: "Presidential", current: 450, suggested: 520, demand: "Very High", change: "+16%" },
  { type: "Standard Plus", current: 150, suggested: 165, demand: "Medium", change: "+10%" },
];

// ─── Concierge Conversations ────────────────────────────────────────────────

const CONCIERGE_RESPONSES = {
  greeting: {
    text: "Welcome to Kuriftu Resort! I'm your AI concierge. I can help you with restaurant reservations, spa bookings, local activities, room service, and personalized recommendations. What would you like to explore today?",
    suggestions: ["What dining options do you have?", "I'd like to book a spa treatment", "What activities are available?", "Tell me about local attractions"],
  },
  dining: {
    text: "Kuriftu offers three distinctive dining experiences. Based on your preference for Ethiopian cuisine (from your booking profile), I'd especially recommend our Lakeside Restaurant tonight — they're featuring a special Meskel season tasting menu with dishes from across Ethiopia's regions. Shall I reserve a table for you?",
    suggestions: ["Yes, reserve for tonight", "What about international cuisine?", "Any dietary accommodations?", "Room service menu?"],
  },
  spa: {
    text: "Our spa offers a range of treatments blending Ethiopian traditions with modern wellness. Since you mentioned wanting to relax after your travels, I'd suggest our signature 90-minute Ethiopian Coffee Scrub & Massage — it uses locally sourced coffee from Sidamo. There's availability today at 3:00 PM and 5:30 PM. Would you like to book?",
    suggestions: ["Book the 3:00 PM slot", "What other treatments are available?", "Couples packages?", "How much does it cost?"],
  },
  activities: {
    text: "Great choice! Here are today's top activities at Bishoftu:\n\n🚣 Boat Tour on Lake Bishoftu — 10:00 AM & 2:00 PM\n🐦 Guided Birdwatching — 6:30 AM (peak season!)\n🎨 Ethiopian Coffee Ceremony — 4:00 PM daily\n🏊 Infinity Pool & Waterside Lounge — open all day\n\nThe birdwatching tour is particularly special this time of year — we've spotted 12 endemic species this week. Interested?",
    suggestions: ["Book the boat tour", "Tell me about birdwatching", "Coffee ceremony sounds great", "What about off-site excursions?"],
  },
  book_spa: {
    text: "Wonderful! I've reserved your Ethiopian Coffee Scrub & Massage for today at 3:00 PM. Here are your details:\n\n✅ Treatment: Ethiopian Coffee Scrub & Massage (90 min)\n✅ Time: 3:00 PM today\n✅ Therapist: Almaz (our highest-rated)\n✅ Location: Lakeside Spa Pavilion\n\nPlease arrive 15 minutes early. I've also added a complimentary herbal tea service before your treatment. Would you like me to arrange anything else?",
    suggestions: ["Arrange dinner after", "What should I bring?", "Can I add a facial?", "That's all, thank you!"],
  },
  reserve: {
    text: "Done! Your reservation is confirmed:\n\n✅ Restaurant: Lakeside Restaurant\n✅ Time: 7:30 PM tonight\n✅ Party size: 2 guests\n✅ Special note: Window table with lake view (based on your preference)\n\nI've also let the chef know about your interest in traditional Ethiopian flavors. They'll prepare a special amuse-bouche for you. Enjoy your evening!",
    suggestions: ["What's the dress code?", "Can we get a later time?", "Wine pairing options?", "Thank you!"],
  },
};

// ─── Icons (inline SVG) ─────────────────────────────────────────────────────

const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="4" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="11" width="7" height="10" rx="1" />
    </svg>
  ),
  chat: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  revenue: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  guests: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  trending: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  send: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  sparkle: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
    </svg>
  ),
  location: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

// ─── Components ─────────────────────────────────────────────────────────────

function MetricCard({ label, value, change, prefix = "" }) {
  const isPositive = change && change > 0;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e7e0d8",
      borderRadius: "8px",
      padding: "20px",
    }}>
      <div style={{ fontSize: "12px", color: "#8c7e6f", fontWeight: 500, letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ fontSize: "28px", fontWeight: 600, color: "#2c1810", letterSpacing: "-0.02em", fontFeatureSettings: '"tnum"' }}>
        {prefix}{value}
      </div>
      {change !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "13px", color: isPositive ? "#16a34a" : "#dc2626" }}>
          {Icons.trending}
          <span>{isPositive ? "+" : ""}{change}% vs last month</span>
        </div>
      )}
    </div>
  );
}

function LocationCard({ location }) {
  const occupancyColor = location.occupancy >= 85 ? "#16a34a" : location.occupancy >= 70 ? "#d97706" : "#8c7e6f";
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e7e0d8",
      borderRadius: "8px",
      padding: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span style={{ color: "#B45309" }}>{Icons.location}</span>
          <span style={{ fontWeight: 600, color: "#2c1810", fontSize: "14px" }}>{location.name}</span>
        </div>
        <span style={{ fontSize: "12px", color: "#8c7e6f" }}>{location.rooms} rooms</span>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "22px", fontWeight: 600, color: occupancyColor, fontFeatureSettings: '"tnum"' }}>
          {location.occupancy}%
        </div>
        <div style={{ fontSize: "11px", color: "#8c7e6f" }}>occupancy</div>
      </div>
    </div>
  );
}

// ─── Dashboard View ─────────────────────────────────────────────────────────

function DashboardView() {
  return (
    <div style={{ padding: "32px", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#2c1810", margin: 0, letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "#8c7e6f", margin: "4px 0 0 0" }}>
          Overview across all Kuriftu locations
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <MetricCard label="Total Revenue" value="14.2K" prefix="$" change={12.4} />
        <MetricCard label="Avg Occupancy" value="79%" change={5.2} />
        <MetricCard label="Guest Satisfaction" value="4.6" change={3.1} />
        <MetricCard label="AI Upsell Revenue" value="2.8K" prefix="$" change={28.6} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#fff", border: "1px solid #e7e0d8", borderRadius: "8px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#2c1810", marginBottom: "16px" }}>Revenue by Service</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={REVENUE_DATA} barSize={12} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8c7e6f" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8c7e6f" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e7e0d8" }} />
              <Bar dataKey="rooms" fill="#92400e" radius={[3, 3, 0, 0]} name="Rooms" />
              <Bar dataKey="spa" fill="#B45309" radius={[3, 3, 0, 0]} name="Spa" />
              <Bar dataKey="dining" fill="#D97706" radius={[3, 3, 0, 0]} name="Dining" />
              <Bar dataKey="activities" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Activities" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e7e0d8", borderRadius: "8px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#2c1810", marginBottom: "16px" }}>Guest Segments</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={GUEST_SEGMENTS} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {GUEST_SEGMENTS.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e7e0d8" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            {GUEST_SEGMENTS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6b5c4d" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={{ background: "#fff", border: "1px solid #e7e0d8", borderRadius: "8px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#2c1810", marginBottom: "16px" }}>Occupancy Forecast (AI Predicted)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={OCCUPANCY_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8c7e6f" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8c7e6f" }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e7e0d8" }} />
              <Area type="monotone" dataKey="predicted" stroke="#B45309" fill="#B4530915" strokeWidth={2} strokeDasharray="6 3" name="AI Predicted" />
              <Area type="monotone" dataKey="actual" stroke="#92400e" fill="#92400e15" strokeWidth={2} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e7e0d8", borderRadius: "8px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#2c1810", marginBottom: "12px" }}>Location Performance</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {LOCATIONS.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Concierge View ─────────────────────────────────────────────────────────

function ConciergeView() {
  const [messages, setMessages] = useState([
    { role: "ai", text: CONCIERGE_RESPONSES.greeting.text, suggestions: CONCIERGE_RESPONSES.greeting.suggestions },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("dining") || lower.includes("restaurant") || lower.includes("food") || lower.includes("eat")) return CONCIERGE_RESPONSES.dining;
    if (lower.includes("spa") || lower.includes("massage") || lower.includes("treatment") || lower.includes("wellness")) return CONCIERGE_RESPONSES.spa;
    if (lower.includes("activit") || lower.includes("tour") || lower.includes("boat") || lower.includes("bird") || lower.includes("do")) return CONCIERGE_RESPONSES.activities;
    if (lower.includes("book") || lower.includes("3:00") || lower.includes("slot")) return CONCIERGE_RESPONSES.book_spa;
    if (lower.includes("reserve") || lower.includes("tonight") || lower.includes("table") || lower.includes("yes")) return CONCIERGE_RESPONSES.reserve;
    return {
      text: "I'd be happy to help with that! At Kuriftu, we offer a wide range of services including world-class dining, spa treatments, water activities, and cultural experiences. Would you like me to recommend something specific based on your interests?",
      suggestions: ["Dining options", "Spa treatments", "Activities & tours", "Room service"],
    };
  };

  const handleSend = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(msg);
      setMessages((prev) => [...prev, { role: "ai", text: response.text, suggestions: response.suggestions }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div style={{ display: "flex", height: "100%", background: "#faf8f5" }}>
      {/* Chat panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 32px", borderBottom: "1px solid #e7e0d8", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #92400e, #D97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              {Icons.sparkle}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "15px", color: "#2c1810" }}>Kuriftu AI Concierge</div>
              <div style={{ fontSize: "12px", color: "#16a34a" }}>Online — Bishoftu Location</div>
            </div>
          </div>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "75%",
                padding: "14px 18px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "#92400e" : "#fff",
                color: msg.role === "user" ? "#fff" : "#2c1810",
                border: msg.role === "ai" ? "1px solid #e7e0d8" : "none",
                fontSize: "14px",
                lineHeight: "1.6",
                whiteSpace: "pre-line",
              }}>
                {msg.text}
                {msg.suggestions && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                    {msg.suggestions.map((s, j) => (
                      <button
                        key={j}
                        onClick={() => handleSend(s)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "20px",
                          border: "1px solid #d4c8b8",
                          background: "#faf8f5",
                          color: "#92400e",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 150ms ease",
                        }}
                        onMouseOver={(e) => { e.target.style.background = "#92400e"; e.target.style.color = "#fff"; e.target.style.borderColor = "#92400e"; }}
                        onMouseOut={(e) => { e.target.style.background = "#faf8f5"; e.target.style.color = "#92400e"; e.target.style.borderColor = "#d4c8b8"; }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", gap: "6px", padding: "14px 18px", background: "#fff", border: "1px solid #e7e0d8", borderRadius: "16px 16px 16px 4px", width: "fit-content" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B45309", animation: "pulse 1.2s infinite", animationDelay: "0s" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B45309", animation: "pulse 1.2s infinite", animationDelay: "0.2s" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B45309", animation: "pulse 1.2s infinite", animationDelay: "0.4s" }} />
            </div>
          )}
        </div>

        <div style={{ padding: "16px 32px", borderTop: "1px solid #e7e0d8", background: "#fff" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about Kuriftu..."
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #e7e0d8",
                fontSize: "14px",
                outline: "none",
                background: "#faf8f5",
                color: "#2c1810",
              }}
            />
            <button
              onClick={() => handleSend()}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#92400e",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {Icons.send}
            </button>
          </div>
        </div>
      </div>

      {/* Side panel — guest context */}
      <div style={{ width: "280px", borderLeft: "1px solid #e7e0d8", background: "#fff", padding: "20px", overflowY: "auto" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "#8c7e6f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Guest Profile</div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0ebe4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "#92400e", fontSize: "15px" }}>SM</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#2c1810" }}>Sarah Mitchell</div>
            <div style={{ fontSize: "12px", color: "#8c7e6f" }}>Returning Guest</div>
          </div>
        </div>

        {[
          { label: "Stay", value: "Apr 4 - Apr 7, 2026" },
          { label: "Room", value: "Lakeside Suite #12" },
          { label: "Location", value: "Bishoftu" },
          { label: "Previous Visits", value: "3" },
          { label: "Loyalty Tier", value: "Gold" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ebe4", fontSize: "13px" }}>
            <span style={{ color: "#8c7e6f" }}>{item.label}</span>
            <span style={{ color: "#2c1810", fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}

        <div style={{ marginTop: "20px", fontSize: "12px", fontWeight: 600, color: "#8c7e6f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
          AI Insights
        </div>
        <div style={{ background: "#fef9f0", border: "1px solid #f0e0c0", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#92400e", lineHeight: "1.5" }}>
          <strong>High upsell potential:</strong> Guest previously booked spa + dining. Recommend couples spa package ($240) and private lakeside dinner ($180).
          <div style={{ marginTop: "8px", fontFeatureSettings: '"tnum"', color: "#B45309" }}>
            Confidence: 92%
          </div>
        </div>

        <div style={{ marginTop: "16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#166534", lineHeight: "1.5" }}>
          <strong>Sentiment:</strong> Very positive from previous stays. Mentions "peaceful", "authentic", "beautiful lake views" in past reviews.
        </div>
      </div>
    </div>
  );
}

// ─── Revenue View ───────────────────────────────────────────────────────────

function RevenueView() {
  return (
    <div style={{ padding: "32px", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#2c1810", margin: 0 }}>Revenue Intelligence</h1>
        <p style={{ fontSize: "14px", color: "#8c7e6f", margin: "4px 0 0 0" }}>AI-powered pricing and upsell optimization</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <MetricCard label="Monthly Revenue" value="14.2K" prefix="$" change={12.4} />
        <MetricCard label="AI Upsell Conversion" value="34%" change={18.2} />
        <MetricCard label="RevPAR" value="112" prefix="$" change={8.7} />
      </div>

      {/* Dynamic Pricing */}
      <div style={{ background: "#fff", border: "1px solid #e7e0d8", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#2c1810" }}>Dynamic Pricing Recommendations</div>
            <div style={{ fontSize: "12px", color: "#8c7e6f", marginTop: "2px" }}>AI-optimized based on demand, season, and competitor analysis</div>
          </div>
          <div style={{ padding: "6px 14px", borderRadius: "6px", background: "#fef9f0", color: "#B45309", fontSize: "12px", fontWeight: 600 }}>
            Live
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e7e0d8" }}>
                {["Room Type", "Current Price", "AI Suggested", "Demand", "Change"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#8c7e6f", fontWeight: 500, fontSize: "12px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DYNAMIC_PRICING.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f0ebe4" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500, color: "#2c1810" }}>{row.type}</td>
                  <td style={{ padding: "10px 12px", fontFeatureSettings: '"tnum"', color: "#8c7e6f" }}>${row.current}</td>
                  <td style={{ padding: "10px 12px", fontFeatureSettings: '"tnum"', fontWeight: 600, color: "#2c1810" }}>${row.suggested}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      padding: "2px 10px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: 500,
                      background: row.demand === "Very High" ? "#fef2f2" : row.demand === "High" ? "#fef9f0" : row.demand === "Low" ? "#f0fdf4" : "#f5f5f4",
                      color: row.demand === "Very High" ? "#dc2626" : row.demand === "High" ? "#B45309" : row.demand === "Low" ? "#16a34a" : "#6b5c4d",
                    }}>
                      {row.demand}
                    </span>
                  </td>
                  <td style={{
                    padding: "10px 12px",
                    fontFeatureSettings: '"tnum"',
                    fontWeight: 600,
                    color: row.change.startsWith("+") ? "#16a34a" : "#dc2626",
                  }}>{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upsell Opportunities */}
      <div style={{ background: "#fff", border: "1px solid #e7e0d8", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#2c1810", marginBottom: "16px" }}>AI-Identified Upsell Opportunities</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {UPSELL_OPPORTUNITIES.map((opp, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #f0ebe4",
              background: "#faf8f5",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0ebe4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "#92400e", fontSize: "13px" }}>
                  {opp.guest.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "14px", color: "#2c1810" }}>{opp.guest}</div>
                  <div style={{ fontSize: "12px", color: "#8c7e6f" }}>{opp.room}</div>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#B45309" }}>{opp.opportunity}</div>
                <div style={{ fontSize: "12px", color: "#8c7e6f" }}>{opp.value}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  background: opp.confidence >= 90 ? "#f0fdf4" : "#fef9f0",
                  color: opp.confidence >= 90 ? "#16a34a" : "#B45309",
                  fontSize: "12px",
                  fontWeight: 600,
                }}>
                  {opp.confidence}% match
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Guest Insights View ────────────────────────────────────────────────────

function GuestInsightsView() {
  return (
    <div style={{ padding: "32px", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#2c1810", margin: 0 }}>Guest Insights</h1>
        <p style={{ fontSize: "14px", color: "#8c7e6f", margin: "4px 0 0 0" }}>AI-driven sentiment analysis and guest intelligence</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <MetricCard label="Avg Rating" value="4.6" change={3.1} />
        <MetricCard label="Reviews Analyzed" value="1,702" change={15.3} />
        <MetricCard label="Response Rate" value="98%" change={2.1} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#fff", border: "1px solid #e7e0d8", borderRadius: "8px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#2c1810", marginBottom: "16px" }}>Sentiment by Category</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {SENTIMENT_DATA.map((item, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px" }}>
                  <span style={{ color: "#2c1810", fontWeight: 500 }}>{item.category}</span>
                  <span style={{ color: "#B45309", fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
                    <span style={{ color: "#F59E0B" }}>{Icons.star}</span> {item.score.toFixed(1)}
                  </span>
                </div>
                <div style={{ height: "6px", background: "#f0ebe4", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(item.score / 5) * 100}%`, background: item.score >= 4.5 ? "#16a34a" : item.score >= 4.0 ? "#D97706" : "#dc2626", borderRadius: "3px", transition: "width 500ms ease" }} />
                </div>
                <div style={{ fontSize: "11px", color: "#8c7e6f", marginTop: "2px" }}>{item.count} reviews</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e7e0d8", borderRadius: "8px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#2c1810", marginBottom: "16px" }}>Recent AI-Flagged Feedback</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { text: "Breakfast buffet variety could be improved — guests mentioned wanting more traditional Ethiopian options alongside continental.", sentiment: "action", priority: "Medium", source: "TripAdvisor" },
              { text: "Multiple guests praised the new sunset boat tour. Consider expanding to daily departures.", sentiment: "positive", priority: "Opportunity", source: "Google Reviews" },
              { text: "Room 14 AC unit reported slow by 3 guests this week. Predictive maintenance flagged.", sentiment: "alert", priority: "High", source: "In-App Feedback" },
              { text: "\"The coffee ceremony was the highlight of our trip\" — trending phrase across 18 reviews.", sentiment: "positive", priority: "Insight", source: "Booking.com" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: item.sentiment === "alert" ? "#fecaca" : item.sentiment === "positive" ? "#bbf7d0" : "#fde68a",
                background: item.sentiment === "alert" ? "#fef2f2" : item.sentiment === "positive" ? "#f0fdf4" : "#fefce8",
              }}>
                <div style={{ fontSize: "13px", color: "#2c1810", lineHeight: "1.5", marginBottom: "6px" }}>{item.text}</div>
                <div style={{ display: "flex", gap: "8px", fontSize: "11px" }}>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: "8px",
                    background: item.priority === "High" ? "#fecaca" : item.priority === "Opportunity" ? "#bbf7d0" : "#e7e0d8",
                    color: item.priority === "High" ? "#dc2626" : item.priority === "Opportunity" ? "#16a34a" : "#6b5c4d",
                    fontWeight: 500,
                  }}>
                    {item.priority}
                  </span>
                  <span style={{ color: "#8c7e6f" }}>via {item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { id: "concierge", label: "AI Concierge", icon: Icons.chat },
  { id: "revenue", label: "Revenue", icon: Icons.revenue },
  { id: "guests", label: "Guest Insights", icon: Icons.guests },
];

export default function KuriftuAI() {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#faf8f5", color: "#2c1810" }}>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #d4c8b8; border-radius: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#fff",
        borderRight: "1px solid #e7e0d8",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #e7e0d8" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "8px",
              background: "linear-gradient(135deg, #92400e, #D97706)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: "14px",
            }}>
              K
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#2c1810", letterSpacing: "-0.02em" }}>KuriftuAI</div>
              <div style={{ fontSize: "11px", color: "#8c7e6f" }}>Intelligent Hospitality</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "12px 8px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "none",
                background: activeView === item.id ? "#fef9f0" : "transparent",
                color: activeView === item.id ? "#92400e" : "#6b5c4d",
                fontWeight: activeView === item.id ? 600 : 400,
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 150ms ease",
                marginBottom: "2px",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #e7e0d8", fontSize: "12px", color: "#8c7e6f" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
            All systems operational
          </div>
          <div style={{ color: "#b5a898" }}>Kuriftu Resort & Spa</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeView === "dashboard" && <DashboardView />}
        {activeView === "concierge" && <ConciergeView />}
        {activeView === "revenue" && <RevenueView />}
        {activeView === "guests" && <GuestInsightsView />}
      </div>
    </div>
  );
}