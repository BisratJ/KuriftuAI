"use client";

import { logAIInteraction } from "./aiLogger";

/**
 * Send a chat request to the AI API route.
 * @param {Object} opts
 * @param {Array} opts.messages - Conversation messages [{role, text}]
 * @param {string} opts.systemPrompt - System prompt for the AI
 * @param {string} opts.model - Model name
 * @param {number} opts.temperature - Sampling temperature
 * @param {number} opts.maxTokens - Max response tokens
 * @param {Object} opts.context - Additional context object
 * @param {string} opts.module - Module name for logging
 * @param {string} opts.language - Language code
 * @returns {Promise<{reply: string, model: string, usage: Object}>}
 */
export async function sendAIMessage({
  messages = [],
  systemPrompt = "",
  model = "gpt-4o-mini",
  temperature = 0.7,
  maxTokens = 1024,
  context = {},
  module = "concierge",
  language = "en",
}) {
  const start = Date.now();

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        systemPrompt,
        model,
        temperature,
        maxTokens,
        context,
      }),
    });

    const data = await res.json();
    const latencyMs = Date.now() - start;

    if (!res.ok || data.error) {
      logAIInteraction({
        module,
        userInput: messages[messages.length - 1]?.text || "",
        aiOutput: data.error || "API error",
        model,
        tokens: 0,
        latencyMs,
        language,
        status: "error",
      });
      throw new Error(data.error || `API request failed: ${res.status}`);
    }

    logAIInteraction({
      module,
      userInput: messages[messages.length - 1]?.text || messages[messages.length - 1]?.content || "",
      aiOutput: data.reply,
      model: data.model,
      tokens: data.usage?.totalTokens || 0,
      latencyMs,
      language,
      status: "success",
    });

    return {
      reply: data.reply,
      model: data.model,
      usage: data.usage,
      latencyMs,
    };
  } catch (err) {
    const latencyMs = Date.now() - start;
    // If it's a network error or the API key isn't set, provide a graceful fallback
    if (err.message?.includes("API key not configured") || err.message?.includes("Failed to fetch")) {
      logAIInteraction({
        module,
        userInput: messages[messages.length - 1]?.text || "",
        aiOutput: "Fallback: API unavailable",
        model,
        tokens: 0,
        latencyMs,
        language,
        status: "fallback",
      });
    }
    throw err;
  }
}

/**
 * Generate AI insights for a specific module with data context.
 */
export async function generateInsights({
  prompt = "",
  data = {},
  model = "gpt-4o-mini",
  temperature = 0.5,
  maxTokens = 512,
  module = "dashboard",
}) {
  return sendAIMessage({
    messages: [{ role: "user", text: `Analyze this data and provide insights:\n${JSON.stringify(data, null, 2)}` }],
    systemPrompt: prompt,
    model,
    temperature,
    maxTokens,
    module,
  });
}
