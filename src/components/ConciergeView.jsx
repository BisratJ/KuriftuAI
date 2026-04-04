"use client";

import { useState, useEffect, useRef } from "react";
import { Icons } from "./Icons";
import { CONCIERGE_RESPONSES } from "@/lib/data";

export default function ConciergeView() {
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
    <div className="flex h-full bg-sand-50">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col">
        <div className="px-8 py-5 border-b border-sand-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-kuriftu-700 to-kuriftu-500 flex items-center justify-center text-white">
              {Icons.sparkle}
            </div>
            <div>
              <div className="font-semibold text-[15px] text-kuriftu-900">Kuriftu AI Concierge</div>
              <div className="text-xs text-green-600">Online — Bishoftu Location</div>
            </div>
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
              placeholder="Ask me anything about Kuriftu..."
              className="flex-1 px-4 py-3 rounded-[10px] border border-sand-200 text-sm outline-none bg-sand-50 text-kuriftu-900 focus:border-kuriftu-600 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              className="px-4 py-3 rounded-[10px] border-none bg-kuriftu-700 text-white cursor-pointer flex items-center hover:bg-kuriftu-800 transition-colors"
            >
              {Icons.send}
            </button>
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
            <div className="text-xs text-sand-500">Returning Guest</div>
          </div>
        </div>

        {[
          { label: "Stay", value: "Apr 4 - Apr 7, 2026" },
          { label: "Room", value: "Lakeside Suite #12" },
          { label: "Location", value: "Bishoftu" },
          { label: "Previous Visits", value: "3" },
          { label: "Loyalty Tier", value: "Gold" },
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
      </div>
    </div>
  );
}
