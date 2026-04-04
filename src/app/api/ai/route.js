import { NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

/* ── Smart local fallback when no API key is configured ── */
function getLocalFallback(messages, context) {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
  const guestName = context?.guestName || "valued guest";

  const FALLBACK_RESPONSES = [
    {
      keywords: ["dining", "restaurant", "food", "eat", "breakfast", "lunch", "dinner", "menu"],
      reply: `Great choice, ${guestName}! Kuriftu offers several dining experiences:\n\n🍽️ **Lakeside Restaurant** — Ethiopian & international cuisine (7AM–10PM)\n🥩 **The Grill House** — Premium steaks & grilled specialties (12PM–10PM)\n☕ **Cafe Kuriftu** — Light bites, pastries, Ethiopian coffee ceremony (6AM–8PM)\n\nToday's specials include Doro Wot (Ethiopian chicken stew) and fresh Lake Bishoftu tilapia. I'd recommend reserving a lakeside table for sunset dining — it's a guest favorite!\n\nWould you like me to make a reservation?`,
      suggestions: ["Reserve lakeside table", "View full menu", "Room service options", "Wine list"],
    },
    {
      keywords: ["spa", "massage", "treatment", "wellness", "relax"],
      reply: `Wonderful choice, ${guestName}! Our Kuriftu Spa offers world-class treatments:\n\n💆 **Signature Ethiopian Coffee Scrub** — 60 min, $120\n🌿 **Hot Stone Massage** — 90 min, $150\n🧖 **Couples Spa Package** — 120 min, $240 (highly recommended!)\n🏊 **Hydrotherapy Circuit** — Included with any treatment\n\nAvailable slots today: 2:00 PM, 3:30 PM, and 5:00 PM. Based on your preferences, I'd suggest the Couples Spa Package — our most popular option!\n\nShall I book a slot for you?`,
      suggestions: ["Book for 3:30 PM", "Couples package details", "All spa treatments", "Spa gift cards"],
    },
    {
      keywords: ["activity", "activities", "tour", "boat", "bird", "hike", "swim", "lake"],
      reply: `There's so much to do at Kuriftu, ${guestName}! Here are today's activities:\n\n🚤 **Sunset Boat Tour** — 5:30 PM, $45/person (weather is perfect today!)\n🐦 **Birdwatching Walk** — 6:30 AM, complimentary with guide\n🏊 **Lake Swimming** — Open all day, lifeguard on duty 8AM–6PM\n🚴 **Mountain Bike Trail** — Self-guided, bikes available at reception\n☕ **Coffee Ceremony** — 4:00 PM at the cultural center (don't miss this!)\n\nThe sunset boat tour is especially beautiful this time of year. Shall I reserve a spot?`,
      suggestions: ["Book boat tour", "Tomorrow's activities", "Coffee ceremony details", "Guided hikes"],
    },
    {
      keywords: ["book", "reserve", "reservation", "table", "slot"],
      reply: `I'd be happy to help with a reservation, ${guestName}! I can book:\n\n• 🍽️ Restaurant tables (Lakeside or Grill House)\n• 💆 Spa treatments and packages\n• 🚤 Activity spots and tours\n• 🏨 Extended stay or room upgrades\n\nWhat would you like to reserve? Just let me know the details and I'll take care of everything!`,
      suggestions: ["Dinner tonight", "Spa tomorrow", "Boat tour", "Room upgrade"],
    },
    {
      keywords: ["room", "checkout", "check-out", "check-in", "service", "housekeeping", "minibar"],
      reply: `Of course, ${guestName}! Here's your room information:\n\n🏨 **Lakeside Suite #12** — Premium lake view\n📅 **Stay:** Apr 4–7, 2026\n⏰ **Checkout:** 11:00 AM (late checkout available upon request)\n\nI can help with:\n• Room service (kitchen open until 10 PM)\n• Extra pillows, towels, or amenities\n• Late checkout request\n• Airport transfer arrangement\n\nWhat do you need?`,
      suggestions: ["Late checkout", "Room service menu", "Extra towels", "Airport transfer"],
    },
    {
      keywords: ["weather", "temperature", "rain", "sun"],
      reply: `Great question! Here's the weather for Bishoftu today:\n\n☀️ **26°C** — Clear skies, light breeze\n🌅 Sunset at 6:42 PM — perfect for the boat tour!\n🌡️ Evening: 18°C — bring a light layer for outdoor dining\n\nTomorrow looks equally beautiful. This is ideal weather for all outdoor activities!`,
      suggestions: ["Book sunset tour", "Outdoor dining", "Lake activities", "Tomorrow's forecast"],
    },
    {
      keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
      reply: `Hello ${guestName}! Welcome back to Kuriftu Resort & Spa! 🌟\n\nAs a valued Gold member on your 4th visit, it's wonderful to see you again. I'm here to make your stay exceptional.\n\nHere's what I'd recommend for today:\n• ☀️ Perfect weather for the sunset boat tour at 5:30 PM\n• 💆 Open spa slots at 2:00 PM and 3:30 PM\n• 🍽️ Chef's special tonight: Fresh tilapia with injera\n• ☕ Ethiopian Coffee Ceremony at 4:00 PM\n\nHow can I help you today?`,
      suggestions: ["Book boat tour", "Spa availability", "Dinner reservation", "Local attractions"],
    },
    {
      keywords: ["thank", "thanks", "appreciate"],
      reply: `You're very welcome, ${guestName}! It's my pleasure to help. Don't hesitate to ask if you need anything else during your stay. Enjoy Kuriftu! 🌟`,
      suggestions: ["Anything else", "Today's activities", "Dining options", "Spa treatments"],
    },
  ];

  for (const fb of FALLBACK_RESPONSES) {
    if (fb.keywords.some((kw) => lastMsg.includes(kw))) {
      return { reply: fb.reply, suggestions: fb.suggestions };
    }
  }

  // Default response
  return {
    reply: `I'd be happy to help, ${guestName}! At Kuriftu Resort & Spa in Bishoftu, we offer:\n\n🍽️ **Dining** — Lakeside Restaurant, Grill House, Cafe Kuriftu\n💆 **Spa & Wellness** — Signature treatments, couples packages, hydrotherapy\n🚤 **Activities** — Boat tours, birdwatching, hiking, swimming\n☕ **Cultural** — Ethiopian Coffee Ceremony, local excursions\n🏨 **Services** — Room service, concierge, transfers\n\nAs a Gold member, you also have access to priority booking and complimentary upgrades when available.\n\nWhat would you like to explore?`,
    suggestions: ["Dining options", "Spa treatments", "Today's activities", "Room services"],
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      messages = [],
      systemPrompt = "",
      model = "gpt-4o-mini",
      temperature = 0.7,
      maxTokens = 1024,
      context = {},
    } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your-openai-api-key-here") {
      // Use smart local fallback instead of returning an error
      const fallback = getLocalFallback(messages, context);
      return NextResponse.json({
        reply: fallback.reply,
        suggestions: fallback.suggestions,
        model: "local-fallback",
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        fallback: true,
      });
    }

    // Build the full messages array with system prompt
    const fullMessages = [];

    if (systemPrompt) {
      fullMessages.push({ role: "system", content: systemPrompt });
    }

    // Inject context as a system message if provided
    if (context && Object.keys(context).length > 0) {
      fullMessages.push({
        role: "system",
        content: `Current context:\n${JSON.stringify(context, null, 2)}`,
      });
    }

    // Add conversation messages
    for (const msg of messages) {
      fullMessages.push({
        role: msg.role === "ai" ? "assistant" : msg.role,
        content: msg.content || msg.text || "",
      });
    }

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", err);
      return NextResponse.json(
        { error: err.error?.message || `OpenAI API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";
    const usage = data.usage || {};

    return NextResponse.json({
      reply,
      model: data.model,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      },
    });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
