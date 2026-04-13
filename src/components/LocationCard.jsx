"use client";

import { Icons } from "./Icons";

export default function LocationCard({ location }) {
  const occupancyColor =
    location.occupancy >= 85 ? "text-green-600" :
    location.occupancy >= 70 ? "text-amber-600" : "text-sand-500";

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-all border border-white/10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-kuriftu-300 scale-90">{Icons.location}</span>
          <span className="font-bold text-white text-sm">{location.name}</span>
        </div>
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{location.rooms} rooms</span>
      </div>
      <div className="text-right">
        <div className={`text-xl font-black tabular-nums ${occupancyColor}`}>
          {location.occupancy}%
        </div>
        <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest">occupancy</div>
      </div>
    </div>
  );
}
