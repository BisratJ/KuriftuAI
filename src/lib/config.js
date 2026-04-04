"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const CONFIG_KEY = "kuriftu_admin_config";

const DEFAULT_CONFIG = {
  ai: {
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 1024,
    conciergePrompt: `You are KuriftuAI, the intelligent AI concierge for Kuriftu Resort & Spa in Ethiopia. You help guests with:
- Restaurant reservations and dining recommendations
- Spa treatment bookings and wellness advice
- Local activities, tours, and cultural experiences (boat tours, birdwatching, coffee ceremonies)
- Room service, amenities, and hotel information
- Personalized recommendations based on guest preferences and history

Kuriftu properties: Bishoftu (Lake Bishoftu), Bahir Dar (Lake Tana), Adama, Langano, African Village, Entoto.
Current property: Bishoftu. Signature experiences: Ethiopian Coffee Ceremony, sunset boat tours, spa treatments using local ingredients.

Guidelines:
- Be warm, professional, and knowledgeable about Ethiopian culture and hospitality
- Proactively suggest upsell opportunities (spa packages, dining upgrades, activities) when natural
- Reference guest history and preferences when available
- Provide specific times, prices, and availability when possible
- Keep responses concise but thorough (2-4 sentences, then offer next steps)
- End responses with a relevant follow-up question or actionable suggestions`,
    dashboardPrompt: `You are an AI analytics assistant for Kuriftu Resort & Spa. Analyze the provided operational data and generate actionable insights. Focus on: occupancy trends, revenue opportunities, guest satisfaction, operational efficiency, and predictive recommendations. Keep insights concise and data-driven. Output 3-5 bullet points.`,
    operationsPrompt: `You are an AI operations manager for Kuriftu Resort & Spa. Analyze task data, maintenance alerts, and staffing. Provide prioritized recommendations for operational improvements, predictive maintenance actions, and staff optimization. Be specific and actionable.`,
    revenuePrompt: `You are an AI revenue management assistant for Kuriftu Resort & Spa. Analyze pricing data, demand patterns, and upsell opportunities. Provide specific pricing recommendations and revenue optimization strategies. Include projected impact figures.`,
    marketingPrompt: `You are an AI marketing strategist for Kuriftu Resort & Spa. Analyze campaign performance data and provide recommendations for optimization, audience targeting, and new campaign ideas. Focus on ROI and conversion improvements.`,
  },
  audio: {
    ttsEnabled: true,
    ttsVoice: "default",
    ttsRate: 1.0,
    ttsPitch: 1.0,
    sttEnabled: true,
    sttLanguage: "en-US",
    autoPlayResponses: false,
  },
  features: {
    aiConcierge: true,
    aiDashboardInsights: true,
    aiOperationsInsights: true,
    aiRevenueInsights: true,
    aiMarketingInsights: true,
    voiceMode: true,
    proactiveSuggestions: true,
    guestContextPanel: true,
  },
  languages: {
    available: ["en-US", "am-ET", "om-ET", "fr-FR", "zh-CN"],
    default: "en-US",
  },
};

function loadConfig() {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (!stored) return DEFAULT_CONFIG;
    const parsed = JSON.parse(stored);
    // Deep merge with defaults to handle new keys
    return deepMerge(DEFAULT_CONFIG, parsed);
  } catch {
    return DEFAULT_CONFIG;
  }
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setConfig(loadConfig());
    setLoaded(true);
  }, []);

  const updateConfig = useCallback((section, updates) => {
    setConfig((prev) => {
      const next = { ...prev, [section]: { ...prev[section], ...updates } };
      if (typeof window !== "undefined") {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const resetConfig = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CONFIG_KEY);
    }
    setConfig(DEFAULT_CONFIG);
  }, []);

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig, loaded }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}

export { DEFAULT_CONFIG };
