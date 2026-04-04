"use client";

import { useState, useCallback } from "react";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import SearchInput from "./ui/SearchInput";
import { useConfig } from "@/lib/config";
import { generateInsights } from "@/lib/aiClient";
import { STAFF_TASKS, MAINTENANCE_ALERTS, OPERATIONS_METRICS } from "@/lib/data";

export default function OperationsView() {
  const { config } = useConfig();
  const [taskFilter, setTaskFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState(STAFF_TASKS);
  const [completedCount, setCompletedCount] = useState(STAFF_TASKS.filter(t => t.status === "completed").length);
  const [opsInsight, setOpsInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const fetchOpsInsight = useCallback(async () => {
    if (!config.features.aiOperationsInsights) return;
    setInsightLoading(true);
    try {
      const result = await generateInsights({
        prompt: config.ai.operationsPrompt,
        data: { tasks: STAFF_TASKS, alerts: MAINTENANCE_ALERTS, metrics: OPERATIONS_METRICS },
        module: "operations",
      });
      setOpsInsight(result.reply);
    } catch { setOpsInsight(null); }
    finally { setInsightLoading(false); }
  }, [config]);

  let filteredTasks = taskFilter === "all"
    ? tasks
    : taskFilter === "ai"
    ? tasks.filter((t) => t.aiGenerated)
    : tasks.filter((t) => t.status === taskFilter);

  if (search) {
    const q = search.toLowerCase();
    filteredTasks = filteredTasks.filter((t) => t.task.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q) || t.department.toLowerCase().includes(q));
  }

  const toggleTaskStatus = useCallback((taskId) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t;
      const next = t.status === "completed" ? "pending" : t.status === "pending" ? "in_progress" : "completed";
      if (next === "completed") setCompletedCount((c) => c + 1);
      if (t.status === "completed" && next !== "completed") setCompletedCount((c) => c - 1);
      return { ...t, status: next };
    }));
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Operations Hub</h1>
        <p className="text-sm text-sand-500 mt-1">Real-time task management, maintenance alerts, and AI-driven operations</p>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-6">
        <MetricCard label="Task Completion" value={`${Math.round((completedCount / tasks.length) * 100)}%`} change={4.2} />
        <MetricCard label="Avg Response" value={OPERATIONS_METRICS.avgResponseTime} change={-12.5} />
        <MetricCard label="Active Alerts" value={OPERATIONS_METRICS.activeAlerts} />
        <MetricCard label="Staff On Duty" value={OPERATIONS_METRICS.staffOnDuty} />
        <MetricCard label="AI Tasks" value={OPERATIONS_METRICS.aiTasksGenerated} change={34} />
        <MetricCard label="Guest Requests" value={OPERATIONS_METRICS.guestRequests} change={8.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3 gap-3">
            <div>
              <div className="text-sm font-semibold text-kuriftu-900">Live Task Board</div>
              <div className="text-xs text-sand-500 mt-0.5">{completedCount}/{tasks.length} completed</div>
            </div>
            <SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." className="w-48" />
          </div>
          <div className="flex gap-1.5 mb-4">
            {[{ id: "all", label: "All" }, { id: "pending", label: "Pending" }, { id: "in_progress", label: "Active" }, { id: "completed", label: "Done" }, { id: "ai", label: "AI Generated" }].map((f) => (
              <button key={f.id} onClick={() => setTaskFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${taskFilter === f.id ? "bg-kuriftu-700 text-white" : "bg-sand-50 text-sand-500 hover:bg-sand-100"}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-sand-400 text-sm">No tasks match your filter</div>
            ) : filteredTasks.map((task) => (
              <div key={task.id} className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all group ${task.status === "completed" ? "border-green-200 bg-green-50/50" : task.status === "in_progress" ? "border-kuriftu-200 bg-kuriftu-50/50" : "border-sand-100 bg-sand-50/50"}`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.status === "completed" ? "border-green-500 bg-green-500 text-white" : task.status === "in_progress" ? "border-kuriftu-400 bg-kuriftu-100" : "border-sand-300 hover:border-kuriftu-400"}`}
                    title={task.status === "completed" ? "Mark as pending" : task.status === "pending" ? "Start task" : "Complete task"}
                  >
                    {task.status === "completed" && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                    {task.status === "in_progress" && (
                      <div className="w-2 h-2 rounded-full bg-kuriftu-500 animate-pulse" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <div className={`text-[13px] font-medium truncate flex items-center gap-2 ${task.status === "completed" ? "text-sand-400 line-through" : "text-kuriftu-900"}`}>
                      {task.task}
                      {task.aiGenerated && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold flex-shrink-0 no-underline">
                          {Icons.sparkle} AI
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-sand-500 mt-0.5">{task.assignee} &middot; {task.department}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${task.priority === "high" ? "bg-red-50 text-red-600" : task.priority === "medium" ? "bg-amber-50 text-amber-600" : "bg-sand-100 text-sand-500"}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-sand-500 tabular-nums w-16 text-right">{task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500">{Icons.alert}</span>
              <div className="text-sm font-semibold text-kuriftu-900">Predictive Maintenance</div>
            </div>
            <div className="flex flex-col gap-2.5">
              {MAINTENANCE_ALERTS.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${alert.severity === "critical" ? "border-red-200 bg-red-50" : alert.severity === "warning" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-kuriftu-900">{alert.device}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${alert.severity === "critical" ? "bg-red-200 text-red-700" : alert.severity === "warning" ? "bg-amber-200 text-amber-700" : "bg-blue-200 text-blue-700"}`}>
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-sand-600 leading-relaxed">{alert.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-sand-400">AI Confidence: {alert.confidence}%</span>
                    <div className="h-1 w-16 bg-sand-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${alert.confidence >= 90 ? "bg-green-500" : alert.confidence >= 80 ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${alert.confidence}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-kuriftu-700 to-kuriftu-800 rounded-lg p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>{Icons.sparkle}</span>
                <span className="text-sm font-semibold">AI Operations Summary</span>
              </div>
              {config.features.aiOperationsInsights && (
                <button
                  onClick={fetchOpsInsight}
                  disabled={insightLoading}
                  className="px-2.5 py-1 rounded-lg bg-white/20 text-white text-[10px] font-semibold hover:bg-white/30 transition-colors disabled:opacity-50"
                >
                  {insightLoading ? "Analyzing..." : "Generate AI Analysis"}
                </button>
              )}
            </div>
            {opsInsight ? (
              <div className="text-[12px] leading-relaxed opacity-90 whitespace-pre-line">{opsInsight}</div>
            ) : (
              <ul className="text-[12px] leading-relaxed space-y-2 opacity-90">
                <li>{tasks.filter(t => t.aiGenerated).length} tasks auto-generated from guest patterns and IoT data today</li>
                <li>Pool pump alert requires immediate attention &mdash; dispatched to maintenance</li>
                <li>Predicted 32% more housekeeping load for weekend &mdash; extra shift recommended</li>
                <li>Average task response improved 12.5% vs last week</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
