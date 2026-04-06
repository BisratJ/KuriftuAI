"use client";

import { BOOKINGS, GUEST_PROFILES, LOCATIONS, UPSELL_OPPORTUNITIES } from "@/lib/data";

const USER_NAME = "Sarah Mitchell";
const userBookings = BOOKINGS.filter((booking) => booking.guest === USER_NAME);
const upcomingBooking = userBookings.find((booking) => booking.status === "confirmed") || userBookings[0];
const userProfile = GUEST_PROFILES.find((guest) => guest.name === USER_NAME);

const ACTIVITY_CATALOG = [
  { id: 1, title: "Sunset Boat Cruise", duration: "90 min", price: "$55", location: "Bishoftu" },
  { id: 2, title: "Coffee Ceremony Masterclass", duration: "60 min", price: "$35", location: "Entoto" },
  { id: 3, title: "Volcanic Spa Ritual", duration: "120 min", price: "$95", location: "African Village" },
  { id: 4, title: "Guided Nature Walk", duration: "75 min", price: "$40", location: "Langano" },
];

export default function UserExperienceView({ section = "user-home" }) {
  if (section === "user-bookings") {
    return (
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight mb-1">My Bookings</h1>
        <p className="text-sm text-sand-500 mb-6">Track and manage your upcoming stays.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl border border-sand-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-kuriftu-900">{booking.room}</div>
                  <div className="text-xs text-sand-500">{booking.checkIn} → {booking.checkOut}</div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-kuriftu-50 text-kuriftu-700 font-semibold uppercase">
                  {booking.status.replace("_", " ")}
                </span>
              </div>
              <div className="text-sm text-sand-600">Guests: {booking.guests} · Source: {booking.source}</div>
              <div className="mt-3 text-sm font-semibold text-kuriftu-900">Total: ${booking.amount}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === "user-activities") {
    return (
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight mb-1">Activities</h1>
        <p className="text-sm text-sand-500 mb-6">Curated experiences you can book during your stay.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACTIVITY_CATALOG.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl border border-sand-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-kuriftu-900">{activity.title}</div>
                <div className="text-sm font-semibold text-kuriftu-700">{activity.price}</div>
              </div>
              <div className="text-xs text-sand-500">{activity.location} · {activity.duration}</div>
              <button className="mt-4 px-4 py-2 rounded-lg bg-kuriftu-700 text-white text-xs font-semibold hover:bg-kuriftu-800 transition-colors">
                Reserve Activity
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === "user-profile") {
    return (
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
        <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight mb-1">My Profile</h1>
        <p className="text-sm text-sand-500 mb-6">Preferences, loyalty level, and personalized perks.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-sm lg:col-span-2">
            <div className="text-sm font-semibold text-kuriftu-900 mb-2">Guest Preferences</div>
            <div className="flex flex-wrap gap-2">
              {(userProfile?.preferences || []).map((pref) => (
                <span key={pref} className="px-3 py-1 rounded-full bg-kuriftu-50 text-kuriftu-700 text-xs font-medium">
                  {pref}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-sm">
            <div className="text-xs text-sand-500">Loyalty Tier</div>
            <div className="text-2xl font-bold text-kuriftu-900 mt-1">{userProfile?.tier || "Bronze"}</div>
            <div className="text-xs text-sand-500 mt-1">Lifetime value: ${userProfile?.lifetimeValue || 0}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <h1 className="text-[22px] font-semibold text-kuriftu-900 tracking-tight mb-1">Welcome, {USER_NAME}</h1>
      <p className="text-sm text-sand-500 mb-6">Your personalized Kuriftu guest experience.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-kuriftu-900 mb-1">Upcoming Stay</div>
          {upcomingBooking ? (
            <>
              <div className="text-lg font-bold text-kuriftu-900">{upcomingBooking.room}</div>
              <div className="text-sm text-sand-500 mt-1">{upcomingBooking.checkIn} → {upcomingBooking.checkOut} · {upcomingBooking.guests} guests</div>
              <div className="mt-3 text-sm text-sand-600">Special request: {upcomingBooking.special || "None"}</div>
            </>
          ) : (
            <div className="text-sm text-sand-500">No upcoming booking yet.</div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-sm">
          <div className="text-sm font-semibold text-kuriftu-900">Quick Actions</div>
          <div className="mt-3 space-y-2">
            {[
              "Book airport transfer",
              "Reserve spa treatment",
              "Request room upgrade",
              "Chat with concierge",
            ].map((action) => (
              <button key={action} className="w-full text-left px-3 py-2 rounded-lg bg-sand-50 hover:bg-sand-100 text-sm text-kuriftu-800 transition-colors">
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-sm">
          <div className="text-sm font-semibold text-kuriftu-900 mb-3">Recommended Upsells</div>
          <div className="space-y-2">
            {UPSELL_OPPORTUNITIES.slice(0, 3).map((upsell) => (
              <div key={upsell.guest + upsell.opportunity} className="flex items-center justify-between p-3 rounded-lg bg-sand-50">
                <div>
                  <div className="text-sm font-medium text-kuriftu-900">{upsell.opportunity}</div>
                  <div className="text-xs text-sand-500">Confidence {upsell.confidence}%</div>
                </div>
                <div className="text-sm font-semibold text-kuriftu-700">{upsell.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-sm">
          <div className="text-sm font-semibold text-kuriftu-900 mb-3">Explore Kuriftu Locations</div>
          <div className="grid grid-cols-2 gap-2">
            {LOCATIONS.map((location) => (
              <div key={location.id} className="p-3 rounded-lg bg-sand-50">
                <div className="text-sm font-medium text-kuriftu-900">{location.name}</div>
                <div className="text-xs text-sand-500 mt-1">{location.rooms} rooms · {location.rating}★</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
