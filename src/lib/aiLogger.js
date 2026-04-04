"use client";

const LOG_KEY = "kuriftu_ai_logs";
const MAX_LOGS = 200;

export function getAILogs() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch {
    return [];
  }
}

export function logAIInteraction({ module, userInput, aiOutput, model, tokens, latencyMs, language = "en", status = "success" }) {
  if (typeof window === "undefined") return;
  const logs = getAILogs();
  logs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    module,
    userInput: userInput?.slice(0, 500),
    aiOutput: aiOutput?.slice(0, 1000),
    model,
    tokens,
    latencyMs,
    language,
    status,
  });
  // Cap at MAX_LOGS
  if (logs.length > MAX_LOGS) logs.length = MAX_LOGS;
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

export function clearAILogs() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOG_KEY);
}

export function getAIStats() {
  const logs = getAILogs();
  const total = logs.length;
  const successful = logs.filter((l) => l.status === "success").length;
  const failed = total - successful;
  const totalTokens = logs.reduce((s, l) => s + (l.tokens || 0), 0);
  const avgLatency = total > 0 ? Math.round(logs.reduce((s, l) => s + (l.latencyMs || 0), 0) / total) : 0;
  const byModule = {};
  logs.forEach((l) => {
    byModule[l.module] = (byModule[l.module] || 0) + 1;
  });
  return { total, successful, failed, totalTokens, avgLatency, byModule };
}
