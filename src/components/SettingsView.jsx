"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import { INTEGRATIONS, SYSTEM_ROLES, LOCATIONS } from "@/lib/data";

const STATUS_COLORS = {
  connected: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  disconnected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

export default function SettingsView() {
  const [tab, setTab] = useState("integrations");

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Settings &amp; Administration</h1>
        <p className="text-sm text-sand-500 mt-1">Multi-property configuration, integrations, roles, and security</p>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { id: "integrations", label: "Integrations" },
          { id: "properties", label: "Properties" },
          { id: "roles", label: "Roles & Access" },
          { id: "security", label: "Security & Privacy" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-kuriftu-700 text-white" : "bg-white border border-sand-200 text-sand-600 hover:bg-sand-50"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "integrations" && (
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-kuriftu-900">Connected Systems</div>
              <div className="text-xs text-sand-500 mt-0.5">{INTEGRATIONS.filter((i) => i.status === "connected").length} of {INTEGRATIONS.length} integrations active</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-kuriftu-700 text-white text-xs font-medium hover:bg-kuriftu-800 transition-colors">
              + Add Integration
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {INTEGRATIONS.map((integration) => {
              const sc = STATUS_COLORS[integration.status];
              return (
                <div key={integration.name} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${integration.status === "connected" ? "border-sand-100 bg-sand-50/30" : integration.status === "disconnected" ? "border-red-100 bg-red-50/30" : "border-amber-100 bg-amber-50/30"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-sand-200 flex items-center justify-center text-kuriftu-600 font-bold text-xs">
                      {integration.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-kuriftu-900">{integration.name}</div>
                      <div className="text-[11px] text-sand-500">{integration.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {integration.status}
                    </span>
                    <div className="text-[10px] text-sand-400 mt-1">
                      {integration.lastSync !== "—" ? `Sync: ${integration.lastSync}` : "Not configured"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "properties" && (
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-kuriftu-900">Multi-Property Configuration</div>
            <button className="px-3 py-1.5 rounded-lg bg-kuriftu-700 text-white text-xs font-medium hover:bg-kuriftu-800 transition-colors">
              + Add Property
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {LOCATIONS.map((loc) => (
              <div key={loc.id} className="flex items-center justify-between p-4 rounded-lg border border-sand-100 bg-sand-50/30 hover:border-sand-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kuriftu-600 to-kuriftu-400 flex items-center justify-center text-white font-bold text-sm">
                    {loc.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-kuriftu-900">Kuriftu Resort — {loc.name}</div>
                    <div className="text-[11px] text-sand-500 mt-0.5">{loc.rooms} rooms &middot; {loc.staff} staff &middot; Rating: {loc.rating}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-kuriftu-900 tabular-nums">{loc.occupancy}%</div>
                    <div className="text-[10px] text-sand-400">Occupancy</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${loc.status === "operational" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {loc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "roles" && (
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-kuriftu-900">Role-Based Access Control</div>
              <div className="text-xs text-sand-500 mt-0.5">Enterprise RBAC with granular permissions per module</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-kuriftu-700 text-white text-xs font-medium hover:bg-kuriftu-800 transition-colors">
              + Add Role
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-sand-200">
                  {["Role", "Users", "Permissions", "Actions"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-sand-500 font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SYSTEM_ROLES.map((role) => (
                  <tr key={role.role} className="border-b border-sand-100 hover:bg-sand-50/50 transition-colors">
                    <td className="px-3 py-3">
                      <span className="font-semibold text-kuriftu-900">{role.role}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2.5 py-1 rounded-full bg-kuriftu-50 text-kuriftu-700 text-xs font-bold tabular-nums">{role.users}</span>
                    </td>
                    <td className="px-3 py-3 text-sand-600 max-w-[300px]">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.split(", ").map((p) => (
                          <span key={p} className="px-2 py-0.5 rounded bg-sand-50 border border-sand-100 text-[10px] font-medium text-sand-600">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <button className="text-kuriftu-600 text-xs font-medium hover:text-kuriftu-800 transition-colors">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-kuriftu-600">{Icons.shield}</span>
              <div className="text-sm font-semibold text-kuriftu-900">Security Overview</div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: "Authentication", value: "SSO + MFA Enabled", status: "secure" },
                { label: "Data Encryption", value: "AES-256 at rest, TLS 1.3 in transit", status: "secure" },
                { label: "API Security", value: "OAuth 2.0 + Rate limiting", status: "secure" },
                { label: "Audit Logging", value: "All actions logged, 90-day retention", status: "secure" },
                { label: "Backup", value: "Daily automated, 30-day retention", status: "secure" },
                { label: "PCI Compliance", value: "Level 1 certified via Stripe", status: "secure" },
                { label: "GDPR / Privacy", value: "Consent management active", status: "secure" },
                { label: "Penetration Test", value: "Last: Mar 2026 — 0 critical findings", status: "secure" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-sand-100 last:border-0">
                  <span className="text-[13px] text-sand-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-kuriftu-900">{item.value}</span>
                    <span className="text-green-500">{Icons.check}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white border border-sand-200 rounded-lg p-5">
              <div className="text-sm font-semibold text-kuriftu-900 mb-3">AI Model Security</div>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Model Provider", value: "OpenAI GPT-4 (API)" },
                  { label: "Data Handling", value: "No guest PII sent to external models" },
                  { label: "Prompt Logging", value: "All prompts logged and auditable" },
                  { label: "Output Filtering", value: "Content safety filters active" },
                  { label: "Fallback", value: "On-premise Llama 3 for offline mode" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-sand-100 last:border-0 text-[12px]">
                    <span className="text-sand-500">{item.label}</span>
                    <span className="font-medium text-kuriftu-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-sand-200 rounded-lg p-5">
              <div className="text-sm font-semibold text-kuriftu-900 mb-3">Infrastructure</div>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Cloud Provider", value: "AWS (eu-west-1 + af-south-1)" },
                  { label: "CDN", value: "CloudFront — 99.99% uptime" },
                  { label: "Database", value: "PostgreSQL (RDS Multi-AZ)" },
                  { label: "Cache", value: "Redis ElastiCache" },
                  { label: "Edge AI", value: "NVIDIA Jetson on-property nodes" },
                  { label: "DR Strategy", value: "Hot standby, RPO < 1hr" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-sand-100 last:border-0 text-[12px]">
                    <span className="text-sand-500">{item.label}</span>
                    <span className="font-medium text-kuriftu-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-kuriftu-700 to-kuriftu-800 rounded-lg p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span>{Icons.shield}</span>
                <span className="text-sm font-semibold">Compliance Status</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["PCI DSS L1", "GDPR Ready", "SOC 2 Type II", "ISO 27001"].map((cert) => (
                  <div key={cert} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-green-400">{Icons.check}</span>
                    <span className="text-[12px] font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
