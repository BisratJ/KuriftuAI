export const LOCATIONS = [
  { id: "bishoftu", name: "Bishoftu", rooms: 42, occupancy: 78 },
  { id: "bahirdar", name: "Bahir Dar", rooms: 28, occupancy: 85 },
  { id: "adama", name: "Adama", rooms: 30, occupancy: 72 },
  { id: "langano", name: "Langano", rooms: 25, occupancy: 68 },
  { id: "african-village", name: "African Village", rooms: 36, occupancy: 91 },
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
