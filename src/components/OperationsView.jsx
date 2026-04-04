"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import { STAFF_TASKS, MAINTENANCE_ALERTS, OPERATIONS_METRICS } from "@/lib/data";

export default function OperationsView() {
  const [taskFilter, setTaskFilter] = useState("all");

  const filteredTasks = taskFilter === "all"
    ? STAFF_TASKS
    : taskFilter === "ai"
    ? STAFF_TASKS.filter((t) => t.aiGenerated)
    : STAFF_TASKS.filter((t) => t.status === taskFilter);

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Operations Hub</h1>
        <p className="text-sm text-sand-500 mt-1">Real-time task management, maintenance alerts, and AI-driven operations</p>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <MetricCard label="Task Completion" value={`${OPERATIONS_METRICS.taskCompletion}%`} change={4.2} />
        <MetricCard label="Avg Response" value={OPERATIONS_METRICS.avgResponseTime} change={-12.5} />
        <MetricCard label="Active Alerts" value={OPERATIONS_METRICS.activeAlerts} />
        <MetricCard label="Staff On Duty" value={OPERATIONS_METRICS.staffOnDuty} />
        <MetricCard label="AI Tasks" value={OPERATIONS_METRICS.aiTasksGenerated} change={34} />
        <MetricCard label="Guest Requests" value={OPERATIONS_METRICS.guestRequests} change={8.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-kuriftu-900">Live Task Board</div>
              <div className="text-xs text-sand-500 mt-0.5">AI-prioritized task queue across departments</div>
            </div>
            <div className="flex gap-1.5">
              {[{ id: "all", label: "All" }, { id: "pending", label: "Pending" }, { id: "in_progress", label: "Active" }, { id: "ai", label: "AI Generated" }].map((f) => (
                <button key={f.id} onClick={() => setTaskFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${taskFilter === f.id ? "bg-kuriftu-700 text-white" : "bg-sand-50 text-sand-500 hover:bg-sand-100"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {filteredTasks.map((task) => (
              <div key={task.id} className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${task.status === "completed" ? "border-green-200 bg-green-50/50" : task.status === "in_progress" ? "border-kuriftu-200 bg-kuriftu-50/50" : "border-sand-100 bg-sand-50/50"}`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === "completed" ? "bg-green-500" : task.status === "in_progress" ? "bg-kuriftu-500 animate-pulse" : "bg-sand-300"}`} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-kuriftu-900 truncate flex items-center gap-2">
                      {task.task}
                      {task.aiGenerated && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold flex-shrink-0">
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
            <div className="flex items-center gap-2 mb-3">
              <span>{Icons.sparkle}</span>
              <span className="text-sm font-semibold">AI Operations Summary</span>
            </div>
            <ul className="text-[12px] leading-relaxed space-y-2 opacity-90">
              <li>12 tasks auto-generated from guest patterns and IoT data today</li>
              <li>Pool pump alert requires immediate attention &mdash; dispatched to maintenance</li>
              <li>Predicted 32% more housekeeping load for weekend &mdash; extra shift recommended</li>
              <li>Average task response improved 12.5% vs last week</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
