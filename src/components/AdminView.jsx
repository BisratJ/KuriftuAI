"use client";

import { useState, useEffect } from "react";
import { Icons } from "./Icons";
import { useConfig, DEFAULT_CONFIG } from "@/lib/config";
import { useToast } from "./ui/Toast";
import { getAILogs, clearAILogs, getAIStats } from "@/lib/aiLogger";
import { getAvailableVoices } from "@/lib/speech";

export default function AdminView() {
  const { config, updateConfig, resetConfig } = useConfig();
  const { addToast } = useToast();
  const [tab, setTab] = useState("ai");
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [voices, setVoices] = useState([]);
  const [expandedLog, setExpandedLog] = useState(null);

  // Local form state for AI config
  const [aiForm, setAiForm] = useState({ ...config.ai });
  const [audioForm, setAudioForm] = useState({ ...config.audio });
  const [featuresForm, setFeaturesForm] = useState({ ...config.features });

  useEffect(() => {
    setAiForm({ ...config.ai });
    setAudioForm({ ...config.audio });
    setFeaturesForm({ ...config.features });
  }, [config]);

  useEffect(() => {
    if (tab === "logs") {
      setLogs(getAILogs());
      setStats(getAIStats());
    }
  }, [tab]);

  useEffect(() => {
    const loadVoices = () => setVoices(getAvailableVoices());
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const saveAI = () => {
    updateConfig("ai", aiForm);
    addToast("AI configuration saved successfully", "success");
  };

  const saveAudio = () => {
    updateConfig("audio", audioForm);
    addToast("Audio settings saved", "success");
  };

  const saveFeatures = () => {
    updateConfig("features", featuresForm);
    addToast("Feature toggles updated", "success");
  };

  const handleReset = () => {
    resetConfig();
    addToast("All settings reset to defaults", "warning");
  };

  const handleClearLogs = () => {
    clearAILogs();
    setLogs([]);
    setStats(getAIStats());
    addToast("AI logs cleared", "info");
  };

  const TABS = [
    { id: "ai", label: "AI Model Config" },
    { id: "audio", label: "Audio & Language" },
    { id: "features", label: "Feature Toggles" },
    { id: "prompts", label: "Prompt Editor" },
    { id: "logs", label: "AI Logs" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Admin & Control Panel</h1>
        <p className="text-sm text-sand-500 mt-1">Manage AI parameters, prompts, audio, features, and review interaction logs</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? "bg-kuriftu-700 text-white" : "bg-white border border-sand-200 text-sand-600 hover:bg-sand-50"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── AI Model Config ─── */}
      {tab === "ai" && (
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold text-kuriftu-900">AI Model Parameters</div>
              <div className="text-xs text-sand-500 mt-0.5">Configure the OpenAI model, temperature, and token limits</div>
            </div>
            <button onClick={handleReset} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors">
              Reset All Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-sand-600 mb-1.5">Model</label>
              <select
                value={aiForm.model}
                onChange={(e) => setAiForm((p) => ({ ...p, model: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-sand-200 text-sm bg-sand-50 text-kuriftu-900 focus:border-kuriftu-500 transition-colors"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Fast, Cost-effective)</option>
                <option value="gpt-4o">gpt-4o (Most Capable)</option>
                <option value="gpt-4-turbo">gpt-4-turbo (High Quality)</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo (Legacy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-600 mb-1.5">Max Tokens</label>
              <input
                type="number"
                value={aiForm.maxTokens}
                onChange={(e) => setAiForm((p) => ({ ...p, maxTokens: parseInt(e.target.value) || 512 }))}
                min={128}
                max={4096}
                className="w-full px-3 py-2 rounded-lg border border-sand-200 text-sm bg-sand-50 text-kuriftu-900 focus:border-kuriftu-500 transition-colors"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-sand-600 mb-1.5">
                Temperature: <span className="text-kuriftu-600 font-bold">{aiForm.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={aiForm.temperature}
                onChange={(e) => setAiForm((p) => ({ ...p, temperature: parseFloat(e.target.value) }))}
                className="w-full accent-kuriftu-600"
              />
              <div className="flex justify-between text-[10px] text-sand-400 mt-1">
                <span>Precise (0)</span>
                <span>Balanced (0.7)</span>
                <span>Creative (2)</span>
              </div>
            </div>
          </div>

          <button onClick={saveAI} className="mt-5 px-5 py-2.5 rounded-lg bg-kuriftu-700 text-white text-sm font-semibold hover:bg-kuriftu-800 transition-colors">
            Save AI Configuration
          </button>
        </div>
      )}

      {/* ─── Audio & Language ─── */}
      {tab === "audio" && (
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <div className="text-sm font-semibold text-kuriftu-900 mb-1">Audio & Language Settings</div>
          <div className="text-xs text-sand-500 mb-5">Configure speech-to-text, text-to-speech, and language preferences</div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-sand-50 border border-sand-100">
              <div>
                <div className="text-[13px] font-medium text-kuriftu-900">Speech-to-Text (STT)</div>
                <div className="text-[11px] text-sand-500">Enable voice input via microphone</div>
              </div>
              <button
                onClick={() => setAudioForm((p) => ({ ...p, sttEnabled: !p.sttEnabled }))}
                className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 ${audioForm.sttEnabled ? "bg-green-500" : "bg-sand-300"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${audioForm.sttEnabled ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-sand-50 border border-sand-100">
              <div>
                <div className="text-[13px] font-medium text-kuriftu-900">Text-to-Speech (TTS)</div>
                <div className="text-[11px] text-sand-500">AI reads responses aloud in voice mode</div>
              </div>
              <button
                onClick={() => setAudioForm((p) => ({ ...p, ttsEnabled: !p.ttsEnabled }))}
                className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 ${audioForm.ttsEnabled ? "bg-green-500" : "bg-sand-300"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${audioForm.ttsEnabled ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-sand-50 border border-sand-100">
              <div>
                <div className="text-[13px] font-medium text-kuriftu-900">Auto-Play Responses</div>
                <div className="text-[11px] text-sand-500">Automatically speak all AI responses</div>
              </div>
              <button
                onClick={() => setAudioForm((p) => ({ ...p, autoPlayResponses: !p.autoPlayResponses }))}
                className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 ${audioForm.autoPlayResponses ? "bg-green-500" : "bg-sand-300"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${audioForm.autoPlayResponses ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-600 mb-1.5">STT Language</label>
              <select
                value={audioForm.sttLanguage}
                onChange={(e) => setAudioForm((p) => ({ ...p, sttLanguage: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-sand-200 text-sm bg-sand-50 text-kuriftu-900 focus:border-kuriftu-500 transition-colors"
              >
                <option value="en-US">English (US)</option>
                <option value="am-ET">Amharic</option>
                <option value="om-ET">Afaan Oromo</option>
                <option value="fr-FR">French</option>
                <option value="zh-CN">Chinese (Mandarin)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-600 mb-1.5">
                TTS Speed: <span className="text-kuriftu-600 font-bold">{audioForm.ttsRate}x</span>
              </label>
              <input
                type="range" min="0.5" max="2" step="0.1"
                value={audioForm.ttsRate}
                onChange={(e) => setAudioForm((p) => ({ ...p, ttsRate: parseFloat(e.target.value) }))}
                className="w-full accent-kuriftu-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-600 mb-1.5">
                TTS Pitch: <span className="text-kuriftu-600 font-bold">{audioForm.ttsPitch}</span>
              </label>
              <input
                type="range" min="0.5" max="2" step="0.1"
                value={audioForm.ttsPitch}
                onChange={(e) => setAudioForm((p) => ({ ...p, ttsPitch: parseFloat(e.target.value) }))}
                className="w-full accent-kuriftu-600"
              />
            </div>

            {voices.length > 0 && (
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-sand-600 mb-1.5">TTS Voice ({voices.length} available)</label>
                <select
                  value={audioForm.ttsVoice}
                  onChange={(e) => setAudioForm((p) => ({ ...p, ttsVoice: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-sand-200 text-sm bg-sand-50 text-kuriftu-900 focus:border-kuriftu-500 transition-colors"
                >
                  <option value="default">System Default</option>
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.name}>{v.name} ({v.lang})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button onClick={saveAudio} className="mt-5 px-5 py-2.5 rounded-lg bg-kuriftu-700 text-white text-sm font-semibold hover:bg-kuriftu-800 transition-colors">
            Save Audio Settings
          </button>
        </div>
      )}

      {/* ─── Feature Toggles ─── */}
      {tab === "features" && (
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <div className="text-sm font-semibold text-kuriftu-900 mb-1">Feature Toggles</div>
          <div className="text-xs text-sand-500 mb-5">Enable or disable AI-powered features across the platform</div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[
              { key: "aiConcierge", label: "AI Concierge", desc: "Real-time AI chat for guests" },
              { key: "aiDashboardInsights", label: "Dashboard AI Insights", desc: "AI-generated dashboard analysis" },
              { key: "aiOperationsInsights", label: "Operations AI", desc: "AI task and maintenance recommendations" },
              { key: "aiRevenueInsights", label: "Revenue AI", desc: "AI pricing and upsell optimization" },
              { key: "aiMarketingInsights", label: "Marketing AI", desc: "AI campaign recommendations" },
              { key: "voiceMode", label: "Voice Mode", desc: "Speech-to-text and text-to-speech" },
              { key: "proactiveSuggestions", label: "Proactive Suggestions", desc: "AI suggests actions before guest asks" },
              { key: "guestContextPanel", label: "Guest Context Panel", desc: "Show guest profile in concierge sidebar" },
            ].map((f) => (
              <div key={f.key} className="flex items-center justify-between p-3 rounded-lg bg-sand-50 border border-sand-100">
                <div>
                  <div className="text-[13px] font-medium text-kuriftu-900">{f.label}</div>
                  <div className="text-[11px] text-sand-500">{f.desc}</div>
                </div>
                <button
                  onClick={() => setFeaturesForm((p) => ({ ...p, [f.key]: !p[f.key] }))}
                  className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 ${featuresForm[f.key] ? "bg-green-500" : "bg-sand-300"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${featuresForm[f.key] ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={saveFeatures} className="mt-5 px-5 py-2.5 rounded-lg bg-kuriftu-700 text-white text-sm font-semibold hover:bg-kuriftu-800 transition-colors">
            Save Feature Toggles
          </button>
        </div>
      )}

      {/* ─── Prompt Editor ─── */}
      {tab === "prompts" && (
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <div className="text-sm font-semibold text-kuriftu-900 mb-1">System Prompt Editor</div>
          <div className="text-xs text-sand-500 mb-5">Edit AI system prompts for each module. Changes take effect immediately after saving.</div>

          <div className="flex flex-col gap-5">
            {[
              { key: "conciergePrompt", label: "AI Concierge", desc: "Guest-facing chat assistant" },
              { key: "dashboardPrompt", label: "Dashboard Insights", desc: "Dashboard analytics AI" },
              { key: "operationsPrompt", label: "Operations AI", desc: "Task and maintenance AI" },
              { key: "revenuePrompt", label: "Revenue AI", desc: "Pricing and upsell AI" },
              { key: "marketingPrompt", label: "Marketing AI", desc: "Campaign optimization AI" },
            ].map((p) => (
              <div key={p.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-sand-600">{p.label}</label>
                  <span className="text-[10px] text-sand-400">{p.desc}</span>
                </div>
                <textarea
                  value={aiForm[p.key] || ""}
                  onChange={(e) => setAiForm((prev) => ({ ...prev, [p.key]: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg border border-sand-200 text-[12px] bg-sand-50 text-kuriftu-900 font-mono leading-relaxed focus:border-kuriftu-500 transition-colors resize-y"
                />
                <div className="text-[10px] text-sand-400 mt-0.5 text-right">{(aiForm[p.key] || "").length} chars</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button onClick={saveAI} className="px-5 py-2.5 rounded-lg bg-kuriftu-700 text-white text-sm font-semibold hover:bg-kuriftu-800 transition-colors">
              Save All Prompts
            </button>
            <button
              onClick={() => {
                setAiForm((p) => ({
                  ...p,
                  conciergePrompt: DEFAULT_CONFIG.ai.conciergePrompt,
                  dashboardPrompt: DEFAULT_CONFIG.ai.dashboardPrompt,
                  operationsPrompt: DEFAULT_CONFIG.ai.operationsPrompt,
                  revenuePrompt: DEFAULT_CONFIG.ai.revenuePrompt,
                  marketingPrompt: DEFAULT_CONFIG.ai.marketingPrompt,
                }));
                addToast("Prompts reset to defaults (save to apply)", "info");
              }}
              className="px-4 py-2.5 rounded-lg border border-sand-200 text-sand-600 text-sm font-medium hover:bg-sand-50 transition-colors"
            >
              Reset Prompts to Default
            </button>
          </div>
        </div>
      )}

      {/* ─── AI Logs ─── */}
      {tab === "logs" && (
        <div className="flex flex-col gap-4">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: "Total Requests", value: stats.total },
                { label: "Successful", value: stats.successful, color: "text-green-600" },
                { label: "Failed", value: stats.failed, color: "text-red-600" },
                { label: "Total Tokens", value: stats.totalTokens.toLocaleString() },
                { label: "Avg Latency", value: `${stats.avgLatency}ms` },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-sand-200 rounded-lg p-4">
                  <div className="text-[10px] text-sand-500 font-semibold uppercase tracking-wider">{s.label}</div>
                  <div className={`text-xl font-bold tabular-nums mt-1 ${s.color || "text-kuriftu-900"}`}>{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Module breakdown */}
          {stats?.byModule && Object.keys(stats.byModule).length > 0 && (
            <div className="bg-white border border-sand-200 rounded-lg p-5">
              <div className="text-sm font-semibold text-kuriftu-900 mb-3">Requests by Module</div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(stats.byModule).map(([mod, count]) => (
                  <div key={mod} className="px-3 py-1.5 rounded-lg bg-kuriftu-50 border border-kuriftu-200 text-[12px]">
                    <span className="font-semibold text-kuriftu-700">{mod}</span>
                    <span className="text-kuriftu-500 ml-1.5">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Log entries */}
          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-kuriftu-900">Interaction Log</div>
                <div className="text-xs text-sand-500 mt-0.5">{logs.length} entries — full audit trail</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setLogs(getAILogs()); setStats(getAIStats()); }} className="px-3 py-1.5 rounded-lg border border-sand-200 text-xs text-sand-600 hover:bg-sand-50 transition-colors">
                  Refresh
                </button>
                <button onClick={handleClearLogs} className="px-3 py-1.5 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 transition-colors">
                  Clear Logs
                </button>
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-12 text-sand-400 text-sm">No AI interactions logged yet. Use the AI Concierge or other AI features to generate logs.</div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      log.status === "error" ? "border-red-200 bg-red-50/50" :
                      log.status === "fallback" ? "border-amber-200 bg-amber-50/50" :
                      "border-sand-100 bg-sand-50/50 hover:border-sand-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${log.status === "success" ? "bg-green-500" : log.status === "error" ? "bg-red-500" : "bg-amber-500"}`} />
                        <span className="text-[11px] font-mono text-sand-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-kuriftu-50 text-kuriftu-600">{log.module}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-sand-400">
                        {log.tokens > 0 && <span>{log.tokens} tok</span>}
                        {log.latencyMs > 0 && <span>{log.latencyMs}ms</span>}
                        <span>{log.model}</span>
                      </div>
                    </div>
                    {expandedLog === log.id && (
                      <div className="mt-2 pt-2 border-t border-sand-200 animate-slide-up">
                        <div className="mb-2">
                          <div className="text-[10px] font-semibold text-sand-500 uppercase mb-0.5">User Input</div>
                          <div className="text-[12px] text-kuriftu-900 bg-white rounded p-2 border border-sand-100">{log.userInput || "—"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-sand-500 uppercase mb-0.5">AI Output</div>
                          <div className="text-[12px] text-kuriftu-900 bg-white rounded p-2 border border-sand-100 max-h-[200px] overflow-y-auto">{log.aiOutput || "—"}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
