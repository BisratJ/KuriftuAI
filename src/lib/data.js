export const LOCATIONS = [
  { id: "bishoftu", name: "Bishoftu", rooms: 42, occupancy: 78, revenue: 4200, staff: 38, rating: 4.7, status: "operational" },
  { id: "bahirdar", name: "Bahir Dar", rooms: 28, occupancy: 85, revenue: 3100, staff: 24, rating: 4.5, status: "operational" },
  { id: "adama", name: "Adama", rooms: 30, occupancy: 72, revenue: 2800, staff: 26, rating: 4.4, status: "operational" },
  { id: "langano", name: "Langano", rooms: 25, occupancy: 68, revenue: 2200, staff: 20, rating: 4.6, status: "maintenance" },
  { id: "african-village", name: "African Village", rooms: 36, occupancy: 91, revenue: 5100, staff: 32, rating: 4.8, status: "operational" },
  { id: "entoto", name: "Entoto", rooms: 20, occupancy: 82, revenue: 2600, staff: 18, rating: 4.3, status: "operational" },
];

export const REVENUE_DATA = [
  { month: "Oct", rooms: 2800, spa: 920, dining: 1450, activities: 680 },
  { month: "Nov", rooms: 3100, spa: 1080, dining: 1620, activities: 750 },
  { month: "Dec", rooms: 4200, spa: 1560, dining: 2100, activities: 1120 },
  { month: "Jan", rooms: 3800, spa: 1340, dining: 1890, activities: 980 },
  { month: "Feb", rooms: 3500, spa: 1200, dining: 1750, activities: 870 },
  { month: "Mar", rooms: 4500, spa: 1680, dining: 2340, activities: 1250 },
];

export const SENTIMENT_DATA = [
  { category: "Service", score: 4.6, count: 342 },
  { category: "Cleanliness", score: 4.8, count: 298 },
  { category: "Dining", score: 4.3, count: 276 },
  { category: "Spa", score: 4.7, count: 189 },
  { category: "Value", score: 4.1, count: 310 },
  { category: "Location", score: 4.9, count: 287 },
];

export const GUEST_SEGMENTS = [
  { name: "International Tourists", value: 35, color: "#B45309" },
  { name: "Domestic Leisure", value: 28, color: "#D97706" },
  { name: "Business/Corporate", value: 22, color: "#F59E0B" },
  { name: "Events/Weddings", value: 15, color: "#FCD34D" },
];

export const OCCUPANCY_FORECAST = [
  { day: "Mon", actual: 72, predicted: 75 },
  { day: "Tue", actual: 68, predicted: 70 },
  { day: "Wed", actual: 74, predicted: 73 },
  { day: "Thu", actual: 80, predicted: 78 },
  { day: "Fri", actual: 88, predicted: 90 },
  { day: "Sat", actual: 95, predicted: 93 },
  { day: "Sun", actual: 82, predicted: 85 },
];

export const UPSELL_OPPORTUNITIES = [
  { guest: "Sarah M.", room: "Lakeside Suite", opportunity: "Spa Package", confidence: 92, value: "$180" },
  { guest: "James K.", room: "Garden Villa", opportunity: "Boat Tour", confidence: 87, value: "$120" },
  { guest: "Amina T.", room: "Presidential", opportunity: "Private Dining", confidence: 95, value: "$350" },
  { guest: "David L.", room: "Standard Plus", opportunity: "Room Upgrade", confidence: 78, value: "$90" },
  { guest: "Hirut B.", room: "Honeymoon Suite", opportunity: "Couples Spa", confidence: 88, value: "$240" },
];

export const DYNAMIC_PRICING = [
  { type: "Lakeside Suite", current: 280, suggested: 320, demand: "High", change: "+14%" },
  { type: "Garden Villa", current: 220, suggested: 195, demand: "Low", change: "-11%" },
  { type: "Presidential", current: 450, suggested: 520, demand: "Very High", change: "+16%" },
  { type: "Standard Plus", current: 150, suggested: 165, demand: "Medium", change: "+10%" },
];

// ─── Operations Data ──────────────────────────────────────────────────────
export const STAFF_TASKS = [
  { id: 1, task: "Turn down service — Lakeside Suite #12", assignee: "Almaz T.", status: "in_progress", priority: "high", due: "6:00 PM", department: "Housekeeping", aiGenerated: true },
  { id: 2, task: "Restock minibar — Garden Villa block", assignee: "Dawit M.", status: "pending", priority: "medium", due: "4:00 PM", department: "Housekeeping", aiGenerated: false },
  { id: 3, task: "VIP welcome setup — Presidential Suite", assignee: "Sara K.", status: "completed", priority: "high", due: "2:00 PM", department: "Front Desk", aiGenerated: true },
  { id: 4, task: "Pool area deep clean", assignee: "Team B", status: "in_progress", priority: "medium", due: "5:00 PM", department: "Maintenance", aiGenerated: false },
  { id: 5, task: "Prepare boat for sunset tour", assignee: "Kebede A.", status: "pending", priority: "high", due: "4:30 PM", department: "Activities", aiGenerated: false },
  { id: 6, task: "AI flagged: Extra towels Rm #8 (guest pattern)", assignee: "Unassigned", status: "pending", priority: "low", due: "3:00 PM", department: "Housekeeping", aiGenerated: true },
  { id: 7, task: "Kitchen prep for private dining event", assignee: "Chef Yonas", status: "in_progress", priority: "high", due: "5:30 PM", department: "F&B", aiGenerated: false },
  { id: 8, task: "Replace HVAC filter — Rm #14 (predictive)", assignee: "Maintenance", status: "pending", priority: "high", due: "Tomorrow", department: "Maintenance", aiGenerated: true },
];

export const MAINTENANCE_ALERTS = [
  { id: 1, device: "HVAC Unit — Room #14", type: "Predictive", severity: "warning", message: "Filter efficiency dropped 18% — replacement recommended within 48hrs", confidence: 89 },
  { id: 2, device: "Water Heater — Block B", type: "Predictive", severity: "info", message: "Performance trending down 5%. Schedule inspection next week.", confidence: 72 },
  { id: 3, device: "Generator — Main", type: "Scheduled", severity: "info", message: "Monthly maintenance due in 3 days", confidence: 100 },
  { id: 4, device: "Pool Pump — Main", type: "Alert", severity: "critical", message: "Unusual vibration pattern detected — immediate inspection needed", confidence: 94 },
  { id: 5, device: "Elevator — Building A", type: "Predictive", severity: "warning", message: "Door sensor response time degraded 12%", confidence: 81 },
];

export const OPERATIONS_METRICS = {
  taskCompletion: 87,
  avgResponseTime: "4.2 min",
  activeAlerts: 3,
  staffOnDuty: 24,
  aiTasksGenerated: 12,
  guestRequests: 18,
};

// ─── Bookings Data ────────────────────────────────────────────────────────
export const BOOKINGS = [
  { id: "BK-2401", guest: "Sarah Mitchell", room: "Lakeside Suite #12", checkIn: "Apr 4", checkOut: "Apr 7", status: "checked_in", guests: 2, source: "Direct", amount: 840, special: "Anniversary" },
  { id: "BK-2402", guest: "James Kimani", room: "Garden Villa #3", checkIn: "Apr 4", checkOut: "Apr 6", status: "checked_in", guests: 1, source: "Booking.com", amount: 440, special: null },
  { id: "BK-2403", guest: "Amina Tadesse", room: "Presidential Suite", checkIn: "Apr 5", checkOut: "Apr 9", status: "confirmed", guests: 4, source: "Direct", amount: 2080, special: "Corporate" },
  { id: "BK-2404", guest: "David Lee", room: "Standard Plus #7", checkIn: "Apr 5", checkOut: "Apr 7", status: "confirmed", guests: 2, source: "Expedia", amount: 300, special: null },
  { id: "BK-2405", guest: "Hirut Bekele", room: "Honeymoon Suite", checkIn: "Apr 6", checkOut: "Apr 10", status: "confirmed", guests: 2, source: "Direct", amount: 1200, special: "Honeymoon" },
  { id: "BK-2406", guest: "Michael Chen", room: "Lakeside Suite #8", checkIn: "Apr 3", checkOut: "Apr 5", status: "checkout_today", guests: 2, source: "TripAdvisor", amount: 560, special: null },
  { id: "BK-2407", guest: "Fatima Al-Rashid", room: "Garden Villa #5", checkIn: "Apr 7", checkOut: "Apr 12", status: "pending", guests: 3, source: "Direct", amount: 1100, special: "Family" },
  { id: "BK-2408", guest: "Yohannes Gebre", room: "Standard Plus #2", checkIn: "Apr 4", checkOut: "Apr 5", status: "checked_in", guests: 1, source: "Walk-in", amount: 150, special: null },
];

export const AVAILABILITY_CALENDAR = [
  { date: "Apr 4", available: 8, total: 42, price: 280, demand: "high" },
  { date: "Apr 5", available: 5, total: 42, price: 320, demand: "very_high" },
  { date: "Apr 6", available: 3, total: 42, price: 350, demand: "very_high" },
  { date: "Apr 7", available: 12, total: 42, price: 240, demand: "medium" },
  { date: "Apr 8", available: 18, total: 42, price: 200, demand: "low" },
  { date: "Apr 9", available: 15, total: 42, price: 210, demand: "low" },
  { date: "Apr 10", available: 10, total: 42, price: 260, demand: "medium" },
  { date: "Apr 11", available: 6, total: 42, price: 300, demand: "high" },
  { date: "Apr 12", available: 4, total: 42, price: 340, demand: "very_high" },
  { date: "Apr 13", available: 7, total: 42, price: 290, demand: "high" },
  { date: "Apr 14", available: 14, total: 42, price: 220, demand: "medium" },
];

// ─── Guest Profiles Data ──────────────────────────────────────────────────
export const GUEST_PROFILES = [
  {
    id: "G-1001", name: "Sarah Mitchell", email: "sarah.m@email.com", phone: "+1-555-0142",
    tier: "Gold", totalVisits: 4, totalSpend: 4820, avgRating: 4.8,
    preferences: ["Ethiopian cuisine", "Spa treatments", "Lake view rooms", "Late checkout"],
    segments: ["International Tourists", "Repeat Guest"],
    lastVisit: "Jan 2026", nextVisit: "Apr 4, 2026",
    sentiment: "very_positive", lifetimeValue: 12400,
    journey: [
      { date: "Apr 4, 2026", event: "Check-in", detail: "Lakeside Suite #12", type: "stay" },
      { date: "Apr 4, 2026", event: "AI Concierge Chat", detail: "Asked about dining & spa", type: "interaction" },
      { date: "Apr 4, 2026", event: "Spa Booking", detail: "Coffee Scrub & Massage 3PM", type: "booking" },
      { date: "Apr 4, 2026", event: "Dinner Reservation", detail: "Lakeside Restaurant 7:30PM", type: "booking" },
      { date: "Jan 15, 2026", event: "Previous Stay", detail: "Garden Villa — 3 nights", type: "stay" },
      { date: "Jan 16, 2026", event: "5-Star Review", detail: "\"Peaceful retreat, exceptional service\"", type: "feedback" },
      { date: "Oct 8, 2025", event: "First Visit", detail: "Standard Plus — 2 nights", type: "stay" },
    ],
  },
  {
    id: "G-1002", name: "James Kimani", email: "j.kimani@corp.co.ke", phone: "+254-722-0198",
    tier: "Silver", totalVisits: 2, totalSpend: 1680, avgRating: 4.5,
    preferences: ["Business center", "Early breakfast", "Quiet rooms"],
    segments: ["Business/Corporate", "Regional"],
    lastVisit: "Dec 2025", nextVisit: "Apr 4, 2026",
    sentiment: "positive", lifetimeValue: 5200,
    journey: [],
  },
  {
    id: "G-1003", name: "Amina Tadesse", email: "amina.t@company.et", phone: "+251-911-0234",
    tier: "Platinum", totalVisits: 8, totalSpend: 14200, avgRating: 4.9,
    preferences: ["Presidential Suite", "Private dining", "Airport transfer", "Cultural experiences"],
    segments: ["Business/Corporate", "VIP", "Repeat Guest"],
    lastVisit: "Mar 2026", nextVisit: "Apr 5, 2026",
    sentiment: "very_positive", lifetimeValue: 38500,
    journey: [],
  },
  {
    id: "G-1004", name: "David Lee", email: "david.lee@gmail.com", phone: "+44-7700-0891",
    tier: "Bronze", totalVisits: 1, totalSpend: 300, avgRating: null,
    preferences: ["Budget-friendly", "Activities"],
    segments: ["International Tourists", "New Guest"],
    lastVisit: null, nextVisit: "Apr 5, 2026",
    sentiment: "neutral", lifetimeValue: 300,
    journey: [],
  },
  {
    id: "G-1005", name: "Hirut Bekele", email: "hirut.b@yahoo.com", phone: "+251-922-0567",
    tier: "Gold", totalVisits: 3, totalSpend: 5400, avgRating: 4.7,
    preferences: ["Honeymoon packages", "Couples spa", "Photography spots", "Wine"],
    segments: ["Domestic Leisure", "Events/Weddings"],
    lastVisit: "Aug 2025", nextVisit: "Apr 6, 2026",
    sentiment: "positive", lifetimeValue: 8900,
    journey: [],
  },
];

export const LOYALTY_TIERS = [
  { tier: "Bronze", minSpend: 0, guests: 1240, perks: "5% dining discount, Welcome drink" },
  { tier: "Silver", minSpend: 1500, guests: 680, perks: "10% discount, Late checkout, Priority booking" },
  { tier: "Gold", minSpend: 4000, guests: 320, perks: "15% discount, Free upgrade, Spa credit $50" },
  { tier: "Platinum", minSpend: 10000, guests: 85, perks: "20% discount, Suite upgrade, Personal concierge, Airport transfer" },
];

// ─── Smart Rooms / IoT Data ──────────────────────────────────────────────
export const SMART_ROOMS = [
  { room: "Lakeside Suite #12", guest: "Sarah Mitchell", temp: 23, targetTemp: 22, humidity: 45, lighting: 70, occupancy: true, energy: 2.4, doorLocked: true, dnd: false, curtains: "open" },
  { room: "Garden Villa #3", guest: "James Kimani", temp: 24, targetTemp: 24, humidity: 48, lighting: 100, occupancy: true, energy: 3.1, doorLocked: false, dnd: true, curtains: "closed" },
  { room: "Presidential Suite", guest: "—", temp: 21, targetTemp: 21, humidity: 42, lighting: 0, occupancy: false, energy: 0.8, doorLocked: true, dnd: false, curtains: "closed" },
  { room: "Standard Plus #7", guest: "—", temp: 22, targetTemp: 22, humidity: 44, lighting: 0, occupancy: false, energy: 0.6, doorLocked: true, dnd: false, curtains: "closed" },
  { room: "Honeymoon Suite", guest: "—", temp: 21, targetTemp: 22, humidity: 46, lighting: 0, occupancy: false, energy: 0.7, doorLocked: true, dnd: false, curtains: "open" },
  { room: "Lakeside Suite #8", guest: "Michael Chen", temp: 25, targetTemp: 23, humidity: 52, lighting: 85, occupancy: true, energy: 3.8, doorLocked: false, dnd: false, curtains: "open" },
  { room: "Garden Villa #5", guest: "—", temp: 22, targetTemp: 22, humidity: 43, lighting: 0, occupancy: false, energy: 0.5, doorLocked: true, dnd: false, curtains: "closed" },
  { room: "Standard Plus #2", guest: "Yohannes Gebre", temp: 23, targetTemp: 23, humidity: 47, lighting: 60, occupancy: true, energy: 2.1, doorLocked: true, dnd: false, curtains: "open" },
];

export const ENERGY_DATA = [
  { hour: "6AM", consumption: 42, solar: 8, grid: 34 },
  { hour: "8AM", consumption: 68, solar: 22, grid: 46 },
  { hour: "10AM", consumption: 85, solar: 38, grid: 47 },
  { hour: "12PM", consumption: 95, solar: 45, grid: 50 },
  { hour: "2PM", consumption: 88, solar: 42, grid: 46 },
  { hour: "4PM", consumption: 76, solar: 30, grid: 46 },
  { hour: "6PM", consumption: 92, solar: 15, grid: 77 },
  { hour: "8PM", consumption: 98, solar: 0, grid: 98 },
  { hour: "10PM", consumption: 72, solar: 0, grid: 72 },
];

// ─── Staff Data ───────────────────────────────────────────────────────────
export const STAFF_MEMBERS = [
  { id: "S-001", name: "Almaz Tesfaye", role: "Spa Therapist", department: "Spa & Wellness", shift: "Morning", status: "on_duty", rating: 4.9, tasksCompleted: 8, hoursThisWeek: 32, photo: "AT" },
  { id: "S-002", name: "Dawit Mengistu", role: "Housekeeping Lead", department: "Housekeeping", shift: "Morning", status: "on_duty", rating: 4.7, tasksCompleted: 12, hoursThisWeek: 38, photo: "DM" },
  { id: "S-003", name: "Sara Kebede", role: "Front Desk Manager", department: "Front Office", shift: "Morning", status: "on_duty", rating: 4.8, tasksCompleted: 15, hoursThisWeek: 36, photo: "SK" },
  { id: "S-004", name: "Kebede Assefa", role: "Activities Coordinator", department: "Guest Activities", shift: "Afternoon", status: "on_duty", rating: 4.6, tasksCompleted: 6, hoursThisWeek: 28, photo: "KA" },
  { id: "S-005", name: "Chef Yonas", role: "Executive Chef", department: "F&B", shift: "Split", status: "on_duty", rating: 4.9, tasksCompleted: 10, hoursThisWeek: 42, photo: "CY" },
  { id: "S-006", name: "Hana Worku", role: "Night Auditor", department: "Front Office", shift: "Night", status: "off_duty", rating: 4.5, tasksCompleted: 7, hoursThisWeek: 30, photo: "HW" },
  { id: "S-007", name: "Biniam Desta", role: "Maintenance Tech", department: "Engineering", shift: "Morning", status: "on_duty", rating: 4.4, tasksCompleted: 9, hoursThisWeek: 35, photo: "BD" },
  { id: "S-008", name: "Tigist Haile", role: "Guest Relations", department: "Front Office", shift: "Morning", status: "on_break", rating: 4.8, tasksCompleted: 11, hoursThisWeek: 34, photo: "TH" },
];

export const STAFF_SCHEDULE_AI = [
  { day: "Mon", predicted_demand: "Medium", recommended_staff: 22, current_staff: 24, savings: "$120" },
  { day: "Tue", predicted_demand: "Low", recommended_staff: 18, current_staff: 24, savings: "$360" },
  { day: "Wed", predicted_demand: "Medium", recommended_staff: 22, current_staff: 24, savings: "$120" },
  { day: "Thu", predicted_demand: "High", recommended_staff: 28, current_staff: 24, savings: "-$240" },
  { day: "Fri", predicted_demand: "Very High", recommended_staff: 32, current_staff: 24, savings: "-$480" },
  { day: "Sat", predicted_demand: "Very High", recommended_staff: 34, current_staff: 30, savings: "-$240" },
  { day: "Sun", predicted_demand: "High", recommended_staff: 26, current_staff: 24, savings: "-$120" },
];

// ─── Analytics Data ───────────────────────────────────────────────────────
export const KPI_DATA = {
  revPAR: { current: 112, target: 125, trend: [98, 102, 108, 105, 112, 118, 112] },
  adr: { current: 248, target: 260, trend: [230, 235, 242, 238, 248, 255, 248] },
  gopPAR: { current: 78, target: 90, trend: [65, 68, 72, 70, 78, 82, 78] },
  nps: { current: 72, target: 80, trend: [65, 68, 70, 69, 72, 74, 72] },
  guestRetention: { current: 34, target: 40, trend: [28, 30, 31, 32, 34, 35, 34] },
  aiAdoption: { current: 67, target: 85, trend: [45, 52, 58, 61, 67, 70, 67] },
};

export const REVENUE_ATTRIBUTION = [
  { channel: "Direct Website", revenue: 5200, percentage: 32, aiInfluenced: 18 },
  { channel: "Booking.com", revenue: 3400, percentage: 21, aiInfluenced: 0 },
  { channel: "AI Concierge Upsell", revenue: 2800, percentage: 17, aiInfluenced: 100 },
  { channel: "Walk-in / Phone", revenue: 2100, percentage: 13, aiInfluenced: 5 },
  { channel: "Expedia", revenue: 1600, percentage: 10, aiInfluenced: 0 },
  { channel: "Corporate Deals", revenue: 1100, percentage: 7, aiInfluenced: 12 },
];

export const AI_DECISIONS_LOG = [
  { time: "2:45 PM", decision: "Upgraded room price for Apr 5-6 (+14%)", reason: "Demand surge detected: 3 new bookings in 2hrs, only 5 rooms left", impact: "+$180 projected", module: "Dynamic Pricing", confidence: 91 },
  { time: "2:30 PM", decision: "Sent spa promo to Sarah M. via app", reason: "Guest profile: spa lover, 3rd visit, anniversary trip, high LTV", impact: "$240 upsell potential", module: "Smart Upsell", confidence: 92 },
  { time: "1:15 PM", decision: "Flagged HVAC maintenance for Rm #14", reason: "IoT sensor: 18% efficiency drop over 72hrs, 3 guest complaints", impact: "Prevent $500+ repair", module: "Predictive Maintenance", confidence: 89 },
  { time: "12:00 PM", decision: "Recommended extra staff for Friday", reason: "Occupancy forecast 95%, 2 VIP arrivals, private event booked", impact: "Maintain service level", module: "Staff Optimization", confidence: 87 },
  { time: "11:30 AM", decision: "Auto-assigned lake-view room for Hirut B.", reason: "Honeymoon booking, preference history, high-value guest", impact: "Guest satisfaction +", module: "Smart Assignment", confidence: 95 },
  { time: "10:00 AM", decision: "Lowered Garden Villa price (-11%)", reason: "Low demand next week, competitor price drop detected, inventory surplus", impact: "Fill 4 empty rooms", module: "Dynamic Pricing", confidence: 83 },
];

// ─── Marketing Data ───────────────────────────────────────────────────────
export const CAMPAIGNS = [
  { id: "C-01", name: "Easter Weekend Special", status: "active", channel: "Email + WhatsApp", sent: 2400, opened: 1680, converted: 186, revenue: 28400, aiOptimized: true, startDate: "Mar 28", endDate: "Apr 10" },
  { id: "C-02", name: "Spa & Wellness Month", status: "active", channel: "App Push + SMS", sent: 1800, opened: 1080, converted: 124, revenue: 14800, aiOptimized: true, startDate: "Apr 1", endDate: "Apr 30" },
  { id: "C-03", name: "Loyalty Tier Upgrade Push", status: "scheduled", channel: "Email", sent: 0, opened: 0, converted: 0, revenue: 0, aiOptimized: true, startDate: "Apr 7", endDate: "Apr 14" },
  { id: "C-04", name: "Cross-Resort: Bahir Dar Promo", status: "active", channel: "In-App + Email", sent: 850, opened: 510, converted: 42, revenue: 8400, aiOptimized: false, startDate: "Apr 1", endDate: "Apr 15" },
  { id: "C-05", name: "Win-Back: Dormant Guests", status: "completed", channel: "Email + SMS", sent: 3200, opened: 1280, converted: 96, revenue: 12200, aiOptimized: true, startDate: "Mar 15", endDate: "Mar 31" },
];

export const LOYALTY_STATS = {
  totalMembers: 2325,
  activeThisMonth: 680,
  pointsRedeemed: 145000,
  avgRedemptionValue: 42,
  retentionRate: 78,
  npsLoyaltyMembers: 82,
};

// ─── Settings / Integrations Data ─────────────────────────────────────────
export const INTEGRATIONS = [
  { name: "Opera PMS", category: "Property Management", status: "connected", lastSync: "2 min ago", dataFlow: "bidirectional" },
  { name: "Stripe Payments", category: "Payment Gateway", status: "connected", lastSync: "Real-time", dataFlow: "bidirectional" },
  { name: "Booking.com", category: "OTA Channel", status: "connected", lastSync: "15 min ago", dataFlow: "bidirectional" },
  { name: "Expedia", category: "OTA Channel", status: "connected", lastSync: "15 min ago", dataFlow: "bidirectional" },
  { name: "WhatsApp Business", category: "Messaging", status: "connected", lastSync: "Real-time", dataFlow: "outbound" },
  { name: "Twilio SMS", category: "Messaging", status: "connected", lastSync: "Real-time", dataFlow: "outbound" },
  { name: "Salesforce CRM", category: "CRM", status: "disconnected", lastSync: "—", dataFlow: "—" },
  { name: "Google Analytics", category: "Analytics", status: "connected", lastSync: "1 hr ago", dataFlow: "inbound" },
  { name: "OpenAI GPT-4", category: "AI/ML", status: "connected", lastSync: "Real-time", dataFlow: "bidirectional" },
  { name: "AWS IoT Core", category: "IoT Platform", status: "connected", lastSync: "Real-time", dataFlow: "inbound" },
  { name: "TripAdvisor API", category: "Reviews", status: "connected", lastSync: "6 hrs ago", dataFlow: "inbound" },
  { name: "Ethiopian Airlines", category: "Partner", status: "pending", lastSync: "—", dataFlow: "—" },
];

export const SYSTEM_ROLES = [
  { role: "Super Admin", users: 2, permissions: "Full system access, all properties" },
  { role: "Resort Manager", users: 6, permissions: "Property-level access, staff management, reports" },
  { role: "Front Desk", users: 12, permissions: "Bookings, check-in/out, guest profiles" },
  { role: "Marketing", users: 4, permissions: "Campaigns, analytics, guest segments" },
  { role: "F&B Manager", users: 3, permissions: "Dining operations, inventory, menus" },
  { role: "Spa Manager", users: 2, permissions: "Spa bookings, therapist scheduling" },
  { role: "Finance", users: 3, permissions: "Revenue reports, billing, invoicing" },
  { role: "Maintenance", users: 4, permissions: "Work orders, IoT alerts, equipment" },
];

export const CONCIERGE_RESPONSES = {
  greeting: {
    text: "Welcome to Kuriftu Resort! I'm your AI concierge. I can help you with restaurant reservations, spa bookings, local activities, room service, and personalized recommendations. What would you like to explore today?",
    suggestions: ["What dining options do you have?", "I'd like to book a spa treatment", "What activities are available?", "Tell me about local attractions"],
  },
  dining: {
    text: "Kuriftu offers three distinctive dining experiences. Based on your preference for Ethiopian cuisine (from your booking profile), I'd especially recommend our Lakeside Restaurant tonight \u2014 they're featuring a special Meskel season tasting menu with dishes from across Ethiopia's regions. Shall I reserve a table for you?",
    suggestions: ["Yes, reserve for tonight", "What about international cuisine?", "Any dietary accommodations?", "Room service menu?"],
  },
  spa: {
    text: "Our spa offers a range of treatments blending Ethiopian traditions with modern wellness. Since you mentioned wanting to relax after your travels, I'd suggest our signature 90-minute Ethiopian Coffee Scrub & Massage \u2014 it uses locally sourced coffee from Sidamo. There's availability today at 3:00 PM and 5:30 PM. Would you like to book?",
    suggestions: ["Book the 3:00 PM slot", "What other treatments are available?", "Couples packages?", "How much does it cost?"],
  },
  activities: {
    text: "Great choice! Here are today's top activities at Bishoftu:\n\n\ud83d\udea3 Boat Tour on Lake Bishoftu \u2014 10:00 AM & 2:00 PM\n\ud83d\udc26 Guided Birdwatching \u2014 6:30 AM (peak season!)\n\ud83c\udfa8 Ethiopian Coffee Ceremony \u2014 4:00 PM daily\n\ud83c\udfca Infinity Pool & Waterside Lounge \u2014 open all day\n\nThe birdwatching tour is particularly special this time of year \u2014 we've spotted 12 endemic species this week. Interested?",
    suggestions: ["Book the boat tour", "Tell me about birdwatching", "Coffee ceremony sounds great", "What about off-site excursions?"],
  },
  book_spa: {
    text: "Wonderful! I've reserved your Ethiopian Coffee Scrub & Massage for today at 3:00 PM. Here are your details:\n\n\u2705 Treatment: Ethiopian Coffee Scrub & Massage (90 min)\n\u2705 Time: 3:00 PM today\n\u2705 Therapist: Almaz (our highest-rated)\n\u2705 Location: Lakeside Spa Pavilion\n\nPlease arrive 15 minutes early. I've also added a complimentary herbal tea service before your treatment. Would you like me to arrange anything else?",
    suggestions: ["Arrange dinner after", "What should I bring?", "Can I add a facial?", "That's all, thank you!"],
  },
  reserve: {
    text: "Done! Your reservation is confirmed:\n\n\u2705 Restaurant: Lakeside Restaurant\n\u2705 Time: 7:30 PM tonight\n\u2705 Party size: 2 guests\n\u2705 Special note: Window table with lake view (based on your preference)\n\nI've also let the chef know about your interest in traditional Ethiopian flavors. They'll prepare a special amuse-bouche for you. Enjoy your evening!",
    suggestions: ["What's the dress code?", "Can we get a later time?", "Wine pairing options?", "Thank you!"],
  },
};
// ─── Content Data ──────────────────────────────────────────────────────────
export const ACTIVITIES = [
  { 
    id: "waterpark",
    name: "Kuriftu Water Park", 
    loc: "Bishoftu", 
    icon: "🎢", 
    short: "East Africa's largest and most exciting water park.",
    detail: "Located adjacent to our Bishoftu resort, this massive 30,000 sqm water park features thrilling boomerang and spiral slides, a wave pool, a relaxing lazy river, and dedicated children's water houses. Fun for the whole family.",
    img: "https://images.pexels.com/photos/1449767/pexels-photo-1449767.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Boomerang Slides", "Massive Wave Pool", "Lazy River", "Performance Center"]
  },
  { 
    id: "zipline",
    name: "Entoto Adventure Ziplining", 
    loc: "Entoto", 
    icon: "🧗", 
    short: "Soar above the eucalyptus canopy in Addis Ababa.",
    detail: "Experience the thrill of our professional-grade zipline and aerial rope courses suspended high in the lush eucalyptus forests of Entoto Mountain. A safe, exhilarating adventure with panoramic views.",
    img: "https://images.pexels.com/photos/3411135/pexels-photo-3411135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Forest Zipline", "Rope Courses", "Wall Climbing", "Safe & Certified"]
  },
  { 
    id: "boattour",
    name: "Lake Tana Boat Tours", 
    loc: "Bahir Dar", 
    icon: "⛴️", 
    short: "Cruise to historic island monasteries and the Blue Nile.",
    detail: "Depart directly from the resort shores for a scenic boat ride across Lake Tana. Visit ancient, forest-veiled monasteries like Ura Kidane Mehret on the Zege Peninsula and spot hippos near the Blue Nile source.",
    img: "https://images.pexels.com/photos/402026/pexels-photo-402026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Monastery Visits", "Blue Nile Source", "Bird Watching", "Hippo Spotting"]
  },
  { 
    id: "spa",
    name: "Kuriftu Forest Spa", 
    loc: "All Resorts", 
    icon: "🧘", 
    short: "Award-winning sanctuaries for Ethiopian coffee-based rituals.",
    detail: "Our world-class spa facilities blend ancient wellness traditions with modern luxury. Relax in the sauna and steam room, then experience a signature deep-tissue massage or rejuvenating coffee scrub.",
    img: "https://images.pexels.com/photos/683506/pexels-photo-683506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Coffee Scrubs", "Deep Tissue Massage", "Sauna & Steam", "Forest Atmosphere"]
  },
  { 
    id: "kayaking",
    name: "Lake Kuriftu Kayaking", 
    loc: "Bishoftu", 
    icon: "🛶", 
    short: "Serene paddling on the calm waters of the volcanic crater lake.",
    detail: "Grab a kayak and glide across the tranquil, dark blue waters of Lake Kuriftu. Enjoy a unique perspective of the lush resort gardens and abundant birdlife from the center of the crater lake.",
    img: "https://images.pexels.com/photos/2405080/pexels-photo-2405080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Complimentary Craft", "Peaceful Waters", "Bird Watching", "Sunset Paddles"]
  },
  { 
    id: "cinema",
    name: "Private Resort Cinema", 
    loc: "Bishoftu", 
    icon: "🎬", 
    short: "Relaxing cinematic experience with plush lounging.",
    detail: "Unwind after a day of activities in our private screening room. Sink into cozy cushions and enjoy movies in a comfortable, intimate setting perfect for couples and families alike.",
    img: "https://images.pexels.com/photos/6087685/pexels-photo-6087685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["HD Projection", "Plush Cushions", "Intimate Setting", "Evening Entertainment"]
  }
];

export const RESTAURANTS = [
  { 
    id: "1963restaurant",
    name: "1963 Restaurant", 
    loc: "African Village", 
    special: "Continental African Cuisine", 
    detail: "Named after the founding year of the African Union, this signature restaurant offers a culinary journey across the African continent, featuring diverse, masterfully prepared dishes celebrating pan-African flavors.",
    img: "https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Pan-African Menu", "Thematic Decor", "Cultural Ambiance", "Signature Dining"]
  },
  { 
    id: "lakefront",
    name: "Lakefront Restaurant", 
    loc: "Bishoftu", 
    special: "Lake View Dining & Coffee", 
    detail: "Enjoy uninterrupted views of Lake Kuriftu from our outdoor seating deck. Our culinary approach weaves traditional Ethiopian specialties with international fare, complemented by the famous Ethiopian coffee ceremony.",
    img: "https://images.pexels.com/photos/1358045/pexels-photo-1358045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Outdoor Deck", "Lake Views", "Ethiopian Specialties", "International Fare"]
  },
  { 
    id: "summitgrill",
    name: "Summit Grill Restaurant", 
    loc: "African Village", 
    special: "Panoramic Dining heights", 
    detail: "Perched at the highest point of the African Village in Shaggar City, the Summit Grill provides breathtaking panoramic skyline views accompanied by a sophisticated menu of grilled international favorites.",
    img: "https://images.pexels.com/photos/286283/pexels-photo-286283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Skyline Views", "Premium Grill", "Signature Cocktails", "Sophisticated Atmosphere"]
  },
  { 
    id: "kuriftulaketana",
    name: "Kuriftu Lake Tana Restaurant", 
    loc: "Bahir Dar", 
    special: "Fresh Catch & Traditional Fare", 
    detail: "Situated right on the shores of Lake Tana, this scenic dining spot specializes in fresh fish sourced from the lake, alongside traditional Ethiopian meat dishes, providing a tranquil waterfront culinary experience.",
    img: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Waterfront Terrace", "Fresh Local Catch", "Traditional Meats", "Lake Breezes"]
  },
  { 
    id: "entotodining",
    name: "Kuriftu Entoto Restaurant", 
    loc: "Entoto", 
    special: "Highland Forest Cuisine", 
    detail: "Nestled in the cool highlands of Entoto Park, relax at modern cafes and dining spots serving organic coffee, local cuisine, and light gourmet fare—the perfect way to recharge after forest adventures.",
    img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Highland Atmosphere", "Organic Coffee", "Modern Cafes", "Scenic Forest Setting"]
  },
  { 
    id: "articoffee",
    name: "Artisan Coffee Kuriftu", 
    loc: "All Locations", 
    special: "Micro-lot Specialty Brews", 
    detail: "A celebration of Ethiopia's gift to the world. Our baristas serve expertly roasted micro-lot coffees from regional origins like Sidamo, holding true to the renowned Ethiopian coffee ceremony and exceptional daily brews.",
    img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Coffee Ceremony", "Specialty Roasts", "Artisan Baristas", "Ethiopian Heritage"]
  }
];

export const RESORT_IMAGES = {
  bishoftu: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  bahirdar: "https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  adama: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  langano: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "african-village": "https://images.pexels.com/photos/1640422/pexels-photo-1640422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  entoto: "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
};
