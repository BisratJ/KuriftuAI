"use client";

import { Icons } from "./Icons";
import MetricCard from "./MetricCard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { SMART_ROOMS, ENERGY_DATA } from "@/lib/data";

export default function SmartRoomsView() {
  const occupied = SMART_ROOMS.filter((r) => r.occupancy).length;
  const totalEnergy = SMART_ROOMS.reduce((s, r) => s + r.energy, 0).toFixed(1);
  const avgTemp = (SMART_ROOMS.reduce((s, r) => s + r.temp, 0) / SMART_ROOMS.length).toFixed(1);
  const dndCount = SMART_ROOMS.filter((r) => r.dnd).length;

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight">Smart Rooms &amp; IoT</h1>
        <p className="text-sm text-sand-500 mt-1">Real-time room monitoring, energy optimization, and IoT controls</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard label="Occupied Rooms" value={`${occupied}/${SMART_ROOMS.length}`} />
        <MetricCard label="Total Energy" value={`${totalEnergy} kWh`} change={-8.2} />
        <MetricCard label="Avg Temperature" value={`${avgTemp}°C`} />
        <MetricCard label="DND Active" value={dndCount} />
        <MetricCard label="Solar Offset" value="32%" change={5.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-4">
        {/* Room Grid */}
        <div className="bg-white border border-sand-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-kuriftu-900 mb-4">Room Status Monitor</div>
          <div className="grid grid-cols-2 gap-3">
            {SMART_ROOMS.map((room) => (
              <div key={room.room} className={`p-4 rounded-lg border transition-all ${room.occupancy ? "border-kuriftu-200 bg-kuriftu-50/30" : "border-sand-100 bg-sand-50/50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-kuriftu-900 truncate">{room.room}</span>
                  <div className="flex items-center gap-1.5">
                    {room.dnd && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-600">DND</span>}
                    <span className={`w-2 h-2 rounded-full ${room.occupancy ? "bg-green-500" : "bg-sand-300"}`} />
                  </div>
                </div>
                <div className="text-[11px] text-sand-500 mb-3">
                  {room.guest !== "—" ? room.guest : "Vacant"}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-0.5 text-sand-400 mb-0.5">
                      {Icons.thermometer}
                    </div>
                    <div className="text-[11px] font-semibold text-kuriftu-900 tabular-nums">{room.temp}°C</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-0.5 text-sand-400 mb-0.5">
                      {Icons.zap}
                    </div>
                    <div className="text-[11px] font-semibold text-kuriftu-900 tabular-nums">{room.energy}kW</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-0.5 text-sand-400 mb-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><circle cx="12" cy="12" r="4"/></svg>
                    </div>
                    <div className="text-[11px] font-semibold text-kuriftu-900 tabular-nums">{room.lighting}%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-sand-100">
                  <span className="text-[10px] text-sand-400">Humidity: {room.humidity}%</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium ${room.doorLocked ? "text-green-600" : "text-amber-600"}`}>
                      {room.doorLocked ? "Locked" : "Unlocked"}
                    </span>
                    <span className="text-[10px] text-sand-400">
                      Curtains: {room.curtains}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Dashboard */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="text-sm font-semibold text-kuriftu-900 mb-4">Energy Consumption Today</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={ENERGY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#8c7e6f" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8c7e6f" }} axisLine={false} tickLine={false} unit="kW" />
                <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e7e0d8" }} />
                <Area type="monotone" dataKey="consumption" stroke="#92400e" fill="rgba(146,64,14,0.1)" strokeWidth={2} name="Total" />
                <Area type="monotone" dataKey="solar" stroke="#16a34a" fill="rgba(22,163,74,0.1)" strokeWidth={2} name="Solar" />
                <Area type="monotone" dataKey="grid" stroke="#B45309" fill="rgba(180,83,9,0.08)" strokeWidth={1.5} strokeDasharray="4 3" name="Grid" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-sand-200 rounded-lg p-5">
            <div className="text-sm font-semibold text-kuriftu-900 mb-3">AI Energy Optimization</div>
            <div className="flex flex-col gap-2.5">
              {[
                { action: "Auto-dimmed lights in 3 vacant rooms", savings: "0.8 kWh saved", time: "2:15 PM" },
                { action: "Pre-cooled Suite #12 before guest arrival", savings: "Comfort optimized", time: "1:30 PM" },
                { action: "Shifted water heating to solar peak hours", savings: "1.2 kWh saved", time: "11:00 AM" },
                { action: "Reduced HVAC in empty conference room", savings: "2.1 kWh saved", time: "9:00 AM" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-green-50 border border-green-100">
                  <span className="text-green-500 mt-0.5">{Icons.zap}</span>
                  <div className="flex-1">
                    <div className="text-[12px] font-medium text-green-800">{item.action}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-green-600 font-semibold">{item.savings}</span>
                      <span className="text-[10px] text-green-500">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-kuriftu-700 to-kuriftu-800 rounded-lg p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span>{Icons.sparkle}</span>
              <span className="text-sm font-semibold">IoT Intelligence</span>
            </div>
            <ul className="text-[12px] leading-relaxed space-y-2 opacity-90">
              <li>Solar panels offsetting 32% of energy today &mdash; up from 28% last week</li>
              <li>Edge AI adjusting room climate based on occupancy patterns</li>
              <li>Suite #8 guest prefers cooler temps &mdash; target auto-adjusted to 23°C</li>
              <li>Estimated monthly savings from smart controls: $1,840</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
