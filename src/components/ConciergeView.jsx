"use client";

import { useState, useEffect, useRef } from "react";
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
  { text: "The sunset boat tour departs in 2 hours — perfect weather today! Shall I book?", type: "activity" },
  { text: "Based on your spa booking at 3PM, I suggest a light lunch at Lakeside Cafe at 1:30PM.", type: "dining" },
  { text: "Ethiopian Coffee Ceremony starts at 4PM — a guest favorite this season.", type: "activity" },
];

export default function ConciergeView() {
  const [messages, setMessages] = useState([
    { role: "ai", text: CONCIERGE_RESPONSES.greeting.text, suggestions: CONCIERGE_RESPONSES.greeting.suggestions },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showLangPicker, setShowLangPicker] = useState(false);
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

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="flex h-full bg-sand-50 mx-auto max-w-[1400px]">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col">
        <div className="px-8 py-4 border-b border-sand-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-kuriftu-700 to-kuriftu-500 flex items-center justify-center text-white">
                {Icons.sparkle}
              </div>
              <div>
                <div className="font-semibold text-[15px] text-kuriftu-900">Kuriftu AI Concierge</div>
                <div className="text-xs text-green-600">Online &mdash; Bishoftu Location &mdash; Multilingual LLM</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowLangPicker(!showLangPicker)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand-200 bg-sand-50 text-xs font-medium text-sand-600 hover:bg-sand-100 transition-colors"
                >
                  {Icons.globe}
                  <span>{currentLang.flag}</span>
                </button>
                {showLangPicker && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-sand-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangPicker(false); }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-sand-50 transition-colors flex items-center justify-between ${language === lang.code ? "font-semibold text-kuriftu-700 bg-kuriftu-50" : "text-sand-600"}`}
                      >
                        {lang.label}
                        <span className="text-[10px] text-sand-400">{lang.flag}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Voice Toggle */}
              <button
                onClick={() => setVoiceMode(!voiceMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  voiceMode
                    ? "border-kuriftu-300 bg-kuriftu-50 text-kuriftu-700"
                    : "border-sand-200 bg-sand-50 text-sand-600 hover:bg-sand-100"
                }`}
              >
                {Icons.mic}
                <span>{voiceMode ? "Voice On" : "Voice"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Proactive AI suggestions bar */}
        <div className="px-8 py-2.5 bg-kuriftu-50 border-b border-kuriftu-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-kuriftu-500 flex-shrink-0">{Icons.sparkle}</span>
            <span className="text-[11px] font-semibold text-kuriftu-600 flex-shrink-0">Proactive:</span>
            {PROACTIVE_SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s.text)}
                className="flex-shrink-0 px-3 py-1 rounded-full bg-white border border-kuriftu-200 text-[11px] text-kuriftu-700 font-medium hover:bg-kuriftu-700 hover:text-white hover:border-kuriftu-700 transition-all whitespace-nowrap"
              >
                {s.text.length > 60 ? s.text.slice(0, 60) + "..." : s.text}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-[18px] py-[14px] text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-kuriftu-700 text-white rounded-[16px_16px_4px_16px]"
                    : "bg-white text-kuriftu-900 border border-sand-200 rounded-[16px_16px_16px_4px]"
                }`}
              >
                {msg.text}
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {msg.suggestions.map((s, j) => (
                      <button
                        key={j}
                        onClick={() => handleSend(s)}
                        className="px-3.5 py-1.5 rounded-full border border-sand-300 bg-sand-50 text-kuriftu-700 text-xs font-medium cursor-pointer transition-all duration-150 hover:bg-kuriftu-700 hover:text-white hover:border-kuriftu-700"
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
            <div className="flex gap-1.5 px-[18px] py-[14px] bg-white border border-sand-200 rounded-[16px_16px_16px_4px] w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-kuriftu-600 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-kuriftu-600 animate-pulse [animation-delay:200ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-kuriftu-600 animate-pulse [animation-delay:400ms]" />
            </div>
          )}
        </div>

        <div className="px-8 py-4 border-t border-sand-200 bg-white">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={voiceMode ? "Listening... (or type here)" : "Ask me anything about Kuriftu..."}
              className="flex-1 px-4 py-3 rounded-[10px] border border-sand-200 text-sm outline-none bg-sand-50 text-kuriftu-900 focus:border-kuriftu-600 transition-colors"
            />
            {voiceMode && (
              <button className="px-4 py-3 rounded-[10px] border border-kuriftu-200 bg-kuriftu-50 text-kuriftu-600 cursor-pointer flex items-center hover:bg-kuriftu-100 transition-colors">
                {Icons.mic}
              </button>
            )}
            <button
              onClick={() => handleSend()}
              className="px-4 py-3 rounded-[10px] border-none bg-kuriftu-700 text-white cursor-pointer flex items-center hover:bg-kuriftu-800 transition-colors"
            >
              {Icons.send}
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-sand-400">
            <span>Powered by GPT-4 &middot; Context-aware &middot; {currentLang.label}</span>
            <span className="ml-auto">Knowledge graph: 2,400+ resort data points</span>
          </div>
        </div>
      </div>

      {/* Side panel — guest context */}
      <div className="w-[280px] border-l border-sand-200 bg-white p-5 overflow-y-auto hidden lg:block">
        <div className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-4">Guest Profile</div>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-full bg-sand-100 flex items-center justify-center font-semibold text-kuriftu-700 text-[15px]">SM</div>
          <div>
            <div className="font-semibold text-sm text-kuriftu-900">Sarah Mitchell</div>
            <div className="text-xs text-sand-500">Returning Guest &middot; Gold</div>
          </div>
        </div>

        {[
          { label: "Stay", value: "Apr 4 - Apr 7, 2026" },
          { label: "Room", value: "Lakeside Suite #12" },
          { label: "Location", value: "Bishoftu" },
          { label: "Previous Visits", value: "3" },
          { label: "Loyalty Tier", value: "Gold" },
          { label: "Lifetime Value", value: "$12,400" },
        ].map((item, i) => (
          <div key={i} className="flex justify-between py-2 border-b border-sand-100 text-[13px]">
            <span className="text-sand-500">{item.label}</span>
            <span className="text-kuriftu-900 font-medium">{item.value}</span>
          </div>
        ))}

        <div className="mt-5 text-xs font-semibold text-sand-500 uppercase tracking-wider mb-2.5">
          AI Insights
        </div>
        <div className="bg-kuriftu-50 border border-kuriftu-200 rounded-lg p-3 text-[13px] text-kuriftu-700 leading-relaxed">
          <strong>High upsell potential:</strong> Guest previously booked spa + dining. Recommend couples spa package ($240) and private lakeside dinner ($180).
          <div className="mt-2 tabular-nums text-kuriftu-600">
            Confidence: 92%
          </div>
        </div>

        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-[13px] text-green-800 leading-relaxed">
          <strong>Sentiment:</strong> Very positive from previous stays. Mentions &quot;peaceful&quot;, &quot;authentic&quot;, &quot;beautiful lake views&quot; in past reviews.
        </div>

        <div className="mt-4 text-xs font-semibold text-sand-500 uppercase tracking-wider mb-2.5">
          Conversation Context
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-[12px] text-purple-700 leading-relaxed">
          <strong>Detected Intent:</strong> Leisure exploration
          <br /><strong>Emotion:</strong> Excited, curious
          <br /><strong>Topics:</strong> Dining, Spa, Activities
          <br /><strong>Upsell Window:</strong> Open
        </div>
      </div>
    </div>
  );
}
