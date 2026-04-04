"use client";

import { Icons } from "./Icons";

export default function LocationCard({ location }) {
  const occupancyColor =
    location.occupancy >= 85 ? "text-green-600" :
    location.occupancy >= 70 ? "text-amber-600" : "text-sand-500";

  return (
    <div className="bg-white border border-sand-200 rounded-lg p-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-kuriftu-600">{Icons.location}</span>
          <span className="font-semibold text-kuriftu-900 text-sm">{location.name}</span>
        </div>
        <span className="text-xs text-sand-500">{location.rooms} rooms</span>
      </div>
      <div className="text-right">
        <div className={`text-[22px] font-semibold tabular-nums ${occupancyColor}`}>
          {location.occupancy}%
        </div>
        <div className="text-[11px] text-sand-500">occupancy</div>
      </div>
    </div>
  );
}
