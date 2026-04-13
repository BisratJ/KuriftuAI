"use client";

import { useState, useCallback, useEffect } from "react";
import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import SearchInput from "./ui/SearchInput";
import { useConfig } from "@/lib/config";
import { generateInsights } from "@/lib/aiClient";
import { STAFF_TASKS, MAINTENANCE_ALERTS, OPERATIONS_METRICS } from "@/lib/data";
import { loadActivityRequests, approveActivity, rejectActivity } from "@/lib/store";

export default function OperationsView() {
  const { config } = useConfig();
  const [taskFilter, setTaskFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState(STAFF_TASKS);
  const [activityRequests, setActivityRequests] = useState([]);
  const [completedCount, setCompletedCount] = useState(STAFF_TASKS.filter(t => t.status === "completed").length);
  const [opsInsight, setOpsInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    setActivityRequests(loadActivityRequests() || []);
  }, []);

  const handleApproveActivity = (id) => {
    const updated = approveActivity(id);
    setActivityRequests(updated);
  };

  const handleRejectActivity = (id) => {
    const updated = rejectActivity(id);
    setActivityRequests(updated);
  };

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

  const pendingActivities = activityRequests.filter(r => r.status === "pending");

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="mb-7 flex justify-between items-end">
        <div>
          <h1 className="text-[26px] font-bold text-kuriftu-900 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Operations Hub</h1>
          <p className="text-sm text-sand-500 mt-1">Real-time task management, guest activities, and AI-driven operations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Tasks Done" value={`${Math.round((completedCount / tasks.length) * 100)}%`} change={4.2} />
        <MetricCard label="Activity Requests" value={pendingActivities.length} change={pendingActivities.length > 0 ? 3 : 0} />
        <MetricCard label="Avg Response" value={OPERATIONS_METRICS.avgResponseTime} />
        <MetricCard label="Staff On Duty" value={OPERATIONS_METRICS.staffOnDuty} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-6">
        <div className="space-y-6">
          {/* Activity Requests Section */}
          {pendingActivities.length > 0 && (
            <div className="bg-white border border-sand-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-amber-400">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-kuriftu-900">Activity Requests</h2>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-black">{pendingActivities.length}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingActivities.map((req) => (
                  <div key={req.id} className="p-4 rounded-xl bg-sand-50 border border-sand-100 group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-black text-kuriftu-900 uppercase tracking-widest">{req.activityName}</div>
                      <div className="text-[10px] font-bold text-sand-400">#{req.id.slice(-4).toUpperCase()}</div>
                    </div>
                    <div className="text-[11px] text-sand-600 mb-3">
                      <span className="font-bold text-kuriftu-700">{req.guestName}</span> at <span className="font-bold">{req.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApproveActivity(req.id)} className="flex-1 py-2 rounded-lg bg-kuriftu-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-kuriftu-950 transition-all">Approve</button>
                      <button onClick={() => handleRejectActivity(req.id)} className="flex-1 py-2 rounded-lg bg-white border border-sand-200 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task Board */}
          <div className="bg-white border border-sand-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-kuriftu-900">Live Task Board</h2>
              <SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." className="w-48" />
            </div>
            <div className="flex gap-1.5 mb-6 overflow-x-auto no-scrollbar pb-2">
              {[{ id: "all", label: "All" }, { id: "pending", label: "Pending" }, { id: "in_progress", label: "Active" }, { id: "completed", label: "Done" }, { id: "ai", label: "AI" }].map((f) => (
                <button key={f.id} onClick={() => setTaskFilter(f.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${taskFilter === f.id ? "bg-kuriftu-700 text-white shadow-md shadow-kuriftu-700/20" : "bg-sand-50 text-sand-500 hover:bg-sand-100"}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`flex items-center justify-between px-4 py-4 rounded-xl border transition-all ${task.status === "completed" ? "bg-sand-50/50 border-sand-100" : "bg-white border-sand-100 shadow-sm"}`}>
                  <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => toggleTaskStatus(task.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.status === "completed" ? "bg-emerald-500 border-emerald-500 text-white" : "border-sand-200"}`}>
                      {task.status === "completed" && <Icons.check className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className={`text-sm font-bold ${task.status === "completed" ? "text-sand-400 line-through" : "text-kuriftu-900"}`}>{task.task}</div>
                      <div className="text-[11px] text-sand-500 font-medium">{task.assignee} &middot; {task.department}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${task.priority === "high" ? "bg-red-50 text-red-600" : "bg-sand-100 text-sand-500"}`}>{task.priority}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-kuriftu-green rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-kuriftu-300/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Icons.sparkle className="text-kuriftu-300" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-kuriftu-300">AI OPS Summary</h3>
              </div>
              <p className="text-xs leading-relaxed opacity-90 mb-6 italic">"Activity requests are up 15%. Recommend prioritizing Entoto spa cleanups before weekend arrivals."</p>
              <button 
                onClick={fetchOpsInsight}
                disabled={insightLoading}
                className="w-full py-3 rounded-xl bg-kuriftu-300 text-kuriftu-950 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg">
                {insightLoading ? "Analyzing..." : "Refresh Intelligence"}
              </button>
            </div>
          </div>

          <div className="bg-white border border-sand-200 rounded-2xl p-6 shadow-sm">
             <h3 className="text-sm font-bold text-kuriftu-900 mb-4">Maintenance Alerts</h3>
             <div className="space-y-4">
               {MAINTENANCE_ALERTS.map(alert => (
                 <div key={alert.id} className="p-3 rounded-xl bg-sand-50 border border-sand-100">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[11px] font-bold text-kuriftu-900">{alert.device}</span>
                       <span className={`text-[8px] font-black uppercase tracking-widest ${alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>{alert.severity}</span>
                    </div>
                    <p className="text-[10px] text-sand-600">{alert.message}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
