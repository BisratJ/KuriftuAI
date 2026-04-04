"use client";

import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { KPI_DATA, REVENUE_ATTRIBUTION, AI_DECISIONS_LOG } from "@/lib/data";

const KPI_LABELS = {
  revPAR: { name: "RevPAR", prefix: "$", unit: "", desc: "Revenue Per Available Room" },
  adr: { name: "ADR", prefix: "$", unit: "", desc: "Average Daily Rate" },
  gopPAR: { name: "GOPPAR", prefix: "$", unit: "", desc: "Gross Operating Profit Per Available Room" },
  nps: { name: "NPS", prefix: "", unit: "", desc: "Net Promoter Score" },
  guestRetention: { name: "Retention", prefix: "", unit: "%", desc: "Guest Return Rate" },
  aiAdoption: { name: "AI Adoption", prefix: "", unit: "%", desc: "AI Feature Usage Rate" },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PIE_COLORS = ["#92400e", "#B45309", "#D97706", "#F59E0B", "#FCD34D", "#e7e0d8"];

export default function AnalyticsView() {
  const kpiCards = Object.entries(KPI_DATA).map(([key, data]) => {
    const meta = KPI_LABELS[key];
    const trendData = data.trend.map((v, i) => ({ day: DAYS[i], value: v }));
    const progress = Math.round((data.current / data.target) * 100);
    return { key, ...meta, ...data, trendData, progress };
  });

  const attrData = REVENUE_ATTRIBUTION.map((r) => ({ name: r.channel, value: r.revenue }));

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Analytics Center</h1>
        <p className="text-sm text-sand-500 mt-1">Enterprise KPIs, AI explainability, and revenue attribution</p>
      </div>

      {/* KPI Cards with sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {kpiCards.map((kpi) => (
          <div key={kpi.key} className="bg-white border border-sand-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-sand-500 font-semibold uppercase tracking-wider">{kpi.name}</div>
              <div className="text-[10px] text-sand-400">{kpi.desc}</div>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-2xl font-bold text-kuriftu-900 tabular-nums">
                {kpi.prefix}{kpi.current}{kpi.unit}
              </div>
              <div className="text-right">
                <div className="text-[10px] text-sand-400">Target</div>
                <div className="text-sm font-semibold text-sand-500 tabular-nums">{kpi.prefix}{kpi.target}{kpi.unit}</div>
              </div>
            </div>
            <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all ${kpi.progress >= 90 ? "bg-green-500" : kpi.progress >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(kpi.progress, 100)}%` }}
              />
            </div>
            <ResponsiveContainer width="100%" height={40}>
              <LineChart data={kpi.trendData}>
                <Line type="monotone" dataKey="value" stroke="#B45309" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 mb-4">
        {/* Revenue Attribution */}
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-kuriftu-900 mb-4">Revenue Attribution</div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="45%" height={180}>
              <PieChart>
                <Pie data={attrData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                  {attrData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e7e0d8" }} formatter={(v) => `$${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 flex flex-col gap-2">
              {REVENUE_ATTRIBUTION.map((r, i) => (
                <div key={r.channel} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-sand-600">{r.channel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-kuriftu-900 tabular-nums">${r.revenue.toLocaleString()}</span>
                    {r.aiInfluenced > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[9px] font-bold">
                        {r.aiInfluenced}% AI
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Impact Summary */}
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-kuriftu-900 mb-4">AI Business Impact</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "AI-Driven Revenue", value: "$4,900", change: "+34%", color: "text-green-600" },
              { label: "Cost Savings", value: "$2,320", change: "+18%", color: "text-green-600" },
              { label: "Guest Satisfaction Lift", value: "+0.4 pts", change: "vs baseline", color: "text-kuriftu-600" },
              { label: "Operational Efficiency", value: "+22%", change: "task automation", color: "text-kuriftu-600" },
            ].map((m) => (
              <div key={m.label} className="bg-sand-50 rounded-lg p-3">
                <div className="text-[10px] text-sand-500 uppercase font-semibold tracking-wider">{m.label}</div>
                <div className={`text-lg font-bold tabular-nums mt-1 ${m.color}`}>{m.value}</div>
                <div className="text-[10px] text-sand-400 mt-0.5">{m.change}</div>
              </div>
            ))}
          </div>
          <div className="bg-kuriftu-50 border border-kuriftu-200 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-kuriftu-500">{Icons.sparkle}</span>
              <span className="text-xs font-semibold text-kuriftu-700">ROI Summary</span>
            </div>
            <p className="text-[12px] text-kuriftu-600 leading-relaxed">
              KuriftuAI has generated $4,900 in incremental revenue and $2,320 in cost savings this month.
              Combined AI ROI: <strong>342%</strong> against platform operating cost. Guest satisfaction improved
              0.4 points, and 67% of staff actively use AI recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* AI Decision Log - Explainability */}
      <div className="bg-white border border-sand-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-kuriftu-900">AI Decision Log</div>
            <div className="text-xs text-sand-500 mt-0.5">Full transparency — every AI decision explained</div>
          </div>
          <div className="px-3 py-1.5 rounded-md bg-purple-50 text-purple-600 text-xs font-semibold flex items-center gap-1.5">
            {Icons.shield} Auditable
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {AI_DECISIONS_LOG.map((entry, i) => (
            <div key={i} className="flex items-start gap-4 px-4 py-3 rounded-lg border border-sand-100 bg-sand-50/50 hover:border-sand-200 transition-colors">
              <div className="flex-shrink-0 text-center">
                <div className="text-xs font-mono font-semibold text-kuriftu-600 tabular-nums">{entry.time}</div>
                <div className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-kuriftu-50 text-kuriftu-600">{entry.module}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-kuriftu-900">{entry.decision}</div>
                <div className="text-[11px] text-sand-500 mt-1 leading-relaxed">
                  <strong className="text-sand-600">Why:</strong> {entry.reason}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-[12px] font-semibold text-green-600">{entry.impact}</div>
                <div className="text-[10px] text-sand-400 mt-1">Confidence: {entry.confidence}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
