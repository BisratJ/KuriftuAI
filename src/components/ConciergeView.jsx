"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Icons } from "./Icons";
import { CONCIERGE_RESPONSES } from "@/lib/data";

const LANGUAGES = [
  { code: "en", label: "English", flag: "EN" },
  { code: "am", label: "Amharic", flag: "AM" },
  { code: "om", label: "Afaan Oromo", flag: "OR" },
  { code: "fr", label: "French", flag: "FR" },
  { code: "zh", label: "Chinese", flag: "ZH" },
];

const PROACTIVE_SUGGESTIONS = [
  { text: "Book sunset boat tour — perfect weather!", icon: "🚤", full: "The sunset boat tour departs in 2 hours — perfect weather today! Shall I book?" },
  { text: "Light lunch at 1:30PM before spa", icon: "🍽️", full: "Based on your spa booking at 3PM, I suggest a light lunch at Lakeside Cafe at 1:30PM." },
  { text: "Coffee Ceremony at 4PM", icon: "☕", full: "Ethiopian Coffee Ceremony starts at 4PM — a guest favorite this season." },
];

function detectIntent(messages) {
  const userMsgs = messages.filter((m) => m.role === "user").map((m) => m.text.toLowerCase());
  const all = userMsgs.join(" ");
  const topics = [];
  const intents = [];
  if (all.includes("dining") || all.includes("food") || all.includes("restaurant") || all.includes("eat") || all.includes("reserve")) { topics.push("Dining"); intents.push("Booking"); }
  if (all.includes("spa") || all.includes("massage") || all.includes("treatment") || all.includes("wellness")) { topics.push("Spa"); intents.push("Booking"); }
  if (all.includes("activit") || all.includes("tour") || all.includes("boat")) { topics.push("Activities"); intents.push("Exploration"); }
  if (all.includes("book") || all.includes("reserve")) intents.push("Reservation");
  if (all.includes("room") || all.includes("checkout") || all.includes("check-in")) topics.push("Room");
  if (all.includes("help") || all.includes("recommend") || all.includes("suggest")) intents.push("Assistance");
  return {
    topics: topics.length > 0 ? [...new Set(topics)] : ["General"],
    intent: intents.length > 0 ? [...new Set(intents)].join(", ") : "Exploration",
    emotion: userMsgs.length === 0 ? "Neutral" : userMsgs.length <= 2 ? "Curious" : "Engaged",
    upsell: topics.includes("Spa") || topics.includes("Dining") ? "High" : topics.length > 0 ? "Medium" : "Open",
    msgCount: userMsgs.length,
  };
}

export default function ConciergeView() {
  const [messages, setMessages] = useState([
    { role: "ai", text: CONCIERGE_RESPONSES.greeting.text, suggestions: CONCIERGE_RESPONSES.greeting.suggestions, ts: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [sidePanel, setSidePanel] = useState("profile");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handler = (e) => { if (showLangPicker) setShowLangPicker(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showLangPicker]);

  const getResponse = useCallback((text) => {
    const lower = text.toLowerCase();
    if (lower.includes("dining") || lower.includes("restaurant") || lower.includes("food") || lower.includes("eat")) return CONCIERGE_RESPONSES.dining;
    if (lower.includes("spa") || lower.includes("massage") || lower.includes("treatment") || lower.includes("wellness")) return CONCIERGE_RESPONSES.spa;
    if (lower.includes("activit") || lower.includes("tour") || lower.includes("boat") || lower.includes("bird")) return CONCIERGE_RESPONSES.activities;
    if (lower.includes("book") || lower.includes("3:00") || lower.includes("slot")) return CONCIERGE_RESPONSES.book_spa;
    if (lower.includes("reserve") || lower.includes("tonight") || lower.includes("table") || lower.includes("yes")) return CONCIERGE_RESPONSES.reserve;
    if (lower.includes("weather") || lower.includes("temperature")) return {
      text: "It's a beautiful day in Bishoftu! Currently 26°C with clear skies — perfect for lakeside activities. The sunset today is at 6:42 PM, ideal for our boat tour. Shall I arrange something?",
      suggestions: ["Book sunset tour", "Outdoor dining", "Lake activities"],
    };
    if (lower.includes("checkout") || lower.includes("check-out") || lower.includes("leave")) return {
      text: "Your checkout is scheduled for Apr 7. I can arrange a late checkout (subject to availability) or help with airport transfer. We also offer express checkout — I'll have your bill ready at the front desk. Would you like any of these services?",
      suggestions: ["Late checkout", "Airport transfer", "Express checkout", "View my bill"],
    };
    if (lower.includes("room service") || lower.includes("order")) return {
      text: "I'd be happy to help with room service! Our kitchen is open until 10 PM. Today's specials include Doro Wot (Ethiopian chicken stew) and fresh Lake Bishoftu tilapia. Based on your past preferences, I think you'd enjoy our Ethiopian tasting platter. Shall I send the full menu to your room?",
      suggestions: ["View full menu", "Order Ethiopian platter", "Dietary options", "Wine list"],
    };
    return {
      text: "I'd be happy to help with that! At Kuriftu, we offer world-class dining, spa treatments, water activities, and cultural experiences. Based on your profile as a returning Gold member, I can offer personalized recommendations. What interests you most?",
      suggestions: ["Dining options", "Spa treatments", "Activities & tours", "Room service"],
    };
  }, []);

  const handleSend = useCallback((text) => {
    const msg = text || input;
    if (!msg.trim() || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", text: msg, ts: new Date() }]);
    setInput("");
    setIsTyping(true);
    setVoiceListening(false);

    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      const response = getResponse(msg);
      setMessages((prev) => [...prev, { role: "ai", text: response.text, suggestions: response.suggestions, ts: new Date() }]);
      setIsTyping(false);
    }, delay);
  }, [input, isTyping, getResponse]);

  const handleVoiceToggle = () => {
    if (!voiceMode) {
      setVoiceMode(true);
      setVoiceListening(true);
      setTimeout(() => {
        setVoiceListening(false);
        const phrases = ["What spa treatments do you have?", "Book a table for dinner tonight", "What activities are available today?"];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        setInput(phrase);
        inputRef.current?.focus();
      }, 2500);
    } else {
      setVoiceMode(false);
      setVoiceListening(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      { role: "ai", text: CONCIERGE_RESPONSES.greeting.text, suggestions: CONCIERGE_RESPONSES.greeting.suggestions, ts: new Date() },
    ]);
  };

  const currentLang = LANGUAGES.find((l) => l.code === language);
  const context = detectIntent(messages);
  const formatTime = (d) => d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="flex h-full bg-sand-50">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-3 border-b border-sand-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-kuriftu-700 to-kuriftu-500 flex items-center justify-center text-white flex-shrink-0">
                {Icons.sparkle}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[14px] text-kuriftu-900">Kuriftu AI Concierge</div>
                <div className="text-[11px] text-green-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Online &mdash; Bishoftu &mdash; {currentLang.label}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={handleClearChat} className="p-2 rounded-lg text-sand-400 hover:bg-sand-50 hover:text-sand-600 transition-colors" title="Clear chat">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              </button>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowLangPicker(!showLangPicker)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sand-200 bg-white text-xs font-medium text-sand-600 hover:bg-sand-50 transition-colors"
                >
                  {Icons.globe}
                  <span>{currentLang.flag}</span>
                </button>
                {showLangPicker && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-sand-200 rounded-lg shadow-xl z-30 py-1 min-w-[150px] animate-scale-in">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangPicker(false); }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-sand-50 transition-colors flex items-center justify-between ${language === lang.code ? "font-semibold text-kuriftu-700 bg-kuriftu-50" : "text-sand-600"}`}
                      >
                        <span>{lang.label}</span>
                        {language === lang.code && <span className="text-kuriftu-500">{Icons.check}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleVoiceToggle}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  voiceMode
                    ? "border-kuriftu-300 bg-kuriftu-50 text-kuriftu-700 shadow-sm"
                    : "border-sand-200 bg-white text-sand-600 hover:bg-sand-50"
                }`}
              >
                <span className={voiceListening ? "animate-pulse text-red-500" : ""}>{Icons.mic}</span>
                <span className="hidden sm:inline">{voiceListening ? "Listening..." : voiceMode ? "Voice On" : "Voice"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Proactive suggestions */}
        <div className="px-6 py-2 bg-kuriftu-50/70 border-b border-kuriftu-100/60 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-kuriftu-500 flex-shrink-0">{Icons.sparkle}</span>
            {PROACTIVE_SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s.full)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-kuriftu-200/70 text-[11px] text-kuriftu-700 font-medium hover:bg-kuriftu-700 hover:text-white hover:border-kuriftu-700 transition-all"
              >
                <span>{s.icon}</span>
                {s.text}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}>
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-kuriftu-700 to-kuriftu-500 flex items-center justify-center text-white flex-shrink-0 mr-2 mt-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>
                </div>
              )}
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-kuriftu-700 text-white rounded-[14px_14px_4px_14px]"
                      : "bg-white text-kuriftu-900 border border-sand-200 rounded-[14px_14px_14px_4px] shadow-sm"
                  }`}
                >
                  {msg.text}
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-sand-100">
                      {msg.suggestions.map((s, j) => (
                        <button
                          key={j}
                          onClick={() => handleSend(s)}
                          disabled={isTyping}
                          className="px-3 py-1.5 rounded-full border border-sand-200 bg-sand-50 text-kuriftu-700 text-[11px] font-medium cursor-pointer transition-all duration-150 hover:bg-kuriftu-700 hover:text-white hover:border-kuriftu-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`text-[10px] text-sand-400 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  {formatTime(msg.ts)}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start animate-fade-in">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-kuriftu-700 to-kuriftu-500 flex items-center justify-center text-white flex-shrink-0 mr-2 mt-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-sand-200 rounded-[14px_14px_14px_4px] shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-kuriftu-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-kuriftu-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-kuriftu-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-[11px] text-sand-400 ml-1.5">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Voice listening overlay */}
        {voiceListening && (
          <div className="px-6 py-3 bg-kuriftu-50 border-t border-kuriftu-200 flex items-center justify-center gap-3 animate-fade-in flex-shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                {Icons.mic}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-kuriftu-900">Listening...</div>
              <div className="text-[11px] text-sand-500">Speak naturally — I understand English, Amharic, and more</div>
            </div>
            <button onClick={() => { setVoiceListening(false); setVoiceMode(false); }} className="ml-auto px-3 py-1.5 rounded-lg border border-sand-200 text-xs text-sand-600 hover:bg-white transition-colors">
              Cancel
            </button>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-3 border-t border-sand-200 bg-white flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask me anything about Kuriftu..."
              disabled={voiceListening}
              className="flex-1 px-4 py-2.5 rounded-xl border border-sand-200 text-sm bg-sand-50 text-kuriftu-900 focus:border-kuriftu-500 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="px-4 py-2.5 rounded-xl bg-kuriftu-700 text-white flex items-center hover:bg-kuriftu-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {Icons.send}
            </button>
          </div>
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[10px] text-sand-400">Powered by GPT-4 &middot; Context-aware &middot; {currentLang.label}</span>
            <span className="text-[10px] text-sand-400">{messages.filter(m => m.role === "user").length} messages &middot; 2,400+ data points</span>
          </div>
        </div>
      </div>

      {/* Right panel — collapsible guest context */}
      <div className="w-[260px] border-l border-sand-200 bg-white flex flex-col flex-shrink-0 hidden xl:flex">
        {/* Panel tabs */}
        <div className="flex border-b border-sand-200 flex-shrink-0">
          {[{ id: "profile", label: "Guest" }, { id: "context", label: "AI Context" }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSidePanel(tab.id)}
              className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                sidePanel === tab.id ? "text-kuriftu-700 border-b-2 border-kuriftu-600 bg-kuriftu-50/50" : "text-sand-400 hover:text-sand-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {sidePanel === "profile" ? (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kuriftu-600 to-kuriftu-400 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">SM</div>
                <div className="min-w-0">
                  <div className="font-semibold text-[13px] text-kuriftu-900">Sarah Mitchell</div>
                  <div className="text-[11px] text-sand-500 flex items-center gap-1">
                    Returning Guest
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-bold">GOLD</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-0">
                {[
                  { label: "Stay", value: "Apr 4–7, 2026" },
                  { label: "Room", value: "Lakeside Suite #12" },
                  { label: "Location", value: "Bishoftu" },
                  { label: "Visits", value: "4th stay" },
                  { label: "LTV", value: "$12,400" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-sand-100 text-[12px]">
                    <span className="text-sand-400">{item.label}</span>
                    <span className="text-kuriftu-900 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="text-[10px] font-bold text-sand-400 uppercase tracking-wider mb-2">AI Insights</div>
                <div className="bg-kuriftu-50 border border-kuriftu-200 rounded-lg p-2.5 text-[11px] text-kuriftu-700 leading-relaxed">
                  <strong>High upsell potential.</strong> Previous spa + dining bookings. Recommend couples spa ($240) and private lakeside dinner ($180).
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-kuriftu-200/50">
                    <span className="text-kuriftu-500">Confidence</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1 bg-kuriftu-200 rounded-full overflow-hidden">
                        <div className="h-full bg-kuriftu-600 rounded-full" style={{ width: "92%" }} />
                      </div>
                      <span className="font-bold tabular-nums">92%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-[11px] text-green-700 leading-relaxed">
                  <strong>Sentiment: Very Positive</strong>
                  <div className="text-green-600 mt-1">Past reviews: &ldquo;peaceful&rdquo;, &ldquo;authentic&rdquo;, &ldquo;beautiful lake views&rdquo;</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[10px] font-bold text-sand-400 uppercase tracking-wider mb-2">Preferences</div>
                <div className="flex flex-wrap gap-1">
                  {["Ethiopian cuisine", "Spa treatments", "Lake views", "Late checkout"].map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded-full bg-sand-100 text-sand-600 text-[10px] font-medium">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="text-[10px] font-bold text-sand-400 uppercase tracking-wider mb-3">Live Context</div>

              <div className="flex flex-col gap-2.5">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5">
                  <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                    <div>
                      <div className="text-purple-400 text-[10px] font-medium">Intent</div>
                      <div className="text-purple-700 font-semibold">{context.intent}</div>
                    </div>
                    <div>
                      <div className="text-purple-400 text-[10px] font-medium">Emotion</div>
                      <div className="text-purple-700 font-semibold">{context.emotion}</div>
                    </div>
                    <div>
                      <div className="text-purple-400 text-[10px] font-medium">Upsell Window</div>
                      <div className={`font-semibold ${context.upsell === "High" ? "text-green-600" : context.upsell === "Medium" ? "text-amber-600" : "text-purple-700"}`}>{context.upsell}</div>
                    </div>
                    <div>
                      <div className="text-purple-400 text-[10px] font-medium">Messages</div>
                      <div className="text-purple-700 font-semibold tabular-nums">{context.msgCount}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-sand-400 uppercase tracking-wider mb-1.5">Topics Detected</div>
                  <div className="flex flex-wrap gap-1">
                    {context.topics.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-kuriftu-50 border border-kuriftu-200 text-kuriftu-700 text-[10px] font-semibold">{t}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-sand-400 uppercase tracking-wider mb-1.5">Model Info</div>
                  <div className="flex flex-col gap-1 text-[11px]">
                    {[
                      { label: "Model", value: "GPT-4 Turbo" },
                      { label: "Temp", value: "0.7" },
                      { label: "Context Window", value: "8K tokens" },
                      { label: "Knowledge", value: "2,400+ entries" },
                      { label: "Language", value: currentLang.label },
                      { label: "Latency", value: `~${(800 + Math.random() * 400).toFixed(0)}ms` },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between py-1 border-b border-sand-100">
                        <span className="text-sand-400">{item.label}</span>
                        <span className="text-kuriftu-900 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-sand-400 uppercase tracking-wider mb-1.5">RAG Sources</div>
                  <div className="flex flex-col gap-1">
                    {["Guest profile DB", "Booking history", "Menu & services", "Activity catalog", "Weather API", "Sentiment logs"].map((s) => (
                      <div key={s} className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-green-500">{Icons.check}</span>
                        <span className="text-sand-600">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
