/**
 * Kuriftu Shared Store
 * 
 * A localStorage-backed store for session persistence and cross-role data sharing.
 * Handles bookings, activity requests, notifications, and user sessions.
 */

const STORE_KEYS = {
  SESSION: "kuriftu_session",
  USER_BOOKINGS: "kuriftu_user_bookings",
  ACTIVITY_REQUESTS: "kuriftu_activity_requests",
  NOTIFICATIONS: "kuriftu_notifications",
  USER_DATA: "kuriftu_user_data",
};

// ─── Helpers ─────────────────────────────────────────────────────────────
function safeGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Store write failed:", e);
  }
}

// ─── Session ─────────────────────────────────────────────────────────────
export function saveSession(data) {
  safeSet(STORE_KEYS.SESSION, {
    isLoggedIn: data.isLoggedIn,
    userRole: data.userRole,
    activeView: data.activeView,
    timestamp: Date.now(),
  });
}

export function loadSession() {
  const session = safeGet(STORE_KEYS.SESSION);
  if (!session) return null;
  // Sessions expire after 24 hours
  if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
    clearSession();
    return null;
  }
  return session;
}

export function clearSession() {
  localStorage.removeItem(STORE_KEYS.SESSION);
}

// ─── User Data ───────────────────────────────────────────────────────────
export function saveUserData(data) {
  safeSet(STORE_KEYS.USER_DATA, data);
}

export function loadUserData() {
  return safeGet(STORE_KEYS.USER_DATA);
}

// ─── User Bookings ───────────────────────────────────────────────────────
export function saveBookings(bookings) {
  safeSet(STORE_KEYS.USER_BOOKINGS, bookings);
}

export function loadBookings() {
  return safeGet(STORE_KEYS.USER_BOOKINGS);
}

// ─── Activity Requests ───────────────────────────────────────────────────
export function saveActivityRequests(requests) {
  safeSet(STORE_KEYS.ACTIVITY_REQUESTS, requests);
}

export function loadActivityRequests() {
  return safeGet(STORE_KEYS.ACTIVITY_REQUESTS, []);
}

export function addActivityRequest(request) {
  const current = loadActivityRequests();
  const newRequest = {
    ...request,
    id: "AR-" + Math.floor(1000 + Math.random() * 9000),
    status: "pending",
    requestedAt: new Date().toISOString(),
  };
  current.unshift(newRequest);
  saveActivityRequests(current);
  // Also create a notification for admin
  addNotification({
    type: "activity_request",
    title: `Activity Request: ${request.activityName}`,
    message: `${request.guestName} requested ${request.activityName} at ${request.location} for $${request.price}`,
    targetRole: "admin",
    relatedId: newRequest.id,
  });
  return newRequest;
}

export function updateActivityRequest(id, updates) {
  const current = loadActivityRequests();
  const updated = current.map(r => r.id === id ? { ...r, ...updates } : r);
  saveActivityRequests(updated);
  return updated;
}

// ─── Notifications ───────────────────────────────────────────────────────
export function addNotification(notif) {
  const current = safeGet(STORE_KEYS.NOTIFICATIONS, []);
  current.unshift({
    ...notif,
    id: "N-" + Date.now() + Math.floor(Math.random() * 100),
    read: false,
    createdAt: new Date().toISOString(),
  });
  // Keep only last 50 notifications
  safeSet(STORE_KEYS.NOTIFICATIONS, current.slice(0, 50));
}

export function getNotifications(role = "all") {
  const all = safeGet(STORE_KEYS.NOTIFICATIONS, []);
  if (role === "all") return all;
  return all.filter(n => n.targetRole === role || n.targetRole === "all");
}

export function markNotificationRead(id) {
  const current = safeGet(STORE_KEYS.NOTIFICATIONS, []);
  const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
  safeSet(STORE_KEYS.NOTIFICATIONS, updated);
}

export function markAllNotificationsRead(role) {
  const current = safeGet(STORE_KEYS.NOTIFICATIONS, []);
  const updated = current.map(n => 
    (n.targetRole === role || n.targetRole === "all") ? { ...n, read: true } : n
  );
  safeSet(STORE_KEYS.NOTIFICATIONS, updated);
}

// ─── Booking Confirmation Flow ───────────────────────────────────────────
export function submitBookingForApproval(booking, guestName) {
  const bookings = loadBookings() || [];
  const newBooking = {
    ...booking,
    id: "B-" + Math.floor(1000 + Math.random() * 9000),
    status: "pending",
    submittedAt: new Date().toISOString(),
    guestName,
  };
  bookings.unshift(newBooking);
  saveBookings(bookings);

  // Create an admin notification
  addNotification({
    type: "booking_request",
    title: `New Booking Request`,
    message: `${guestName} requested ${newBooking.room} at ${newBooking.resort} (${newBooking.checkIn} → ${newBooking.checkOut}) · $${newBooking.amount}`,
    targetRole: "admin",
    relatedId: newBooking.id,
  });

  return newBooking;
}

export function confirmBooking(bookingId) {
  const bookings = loadBookings() || [];
  const updated = bookings.map(b => b.id === bookingId ? { ...b, status: "confirmed" } : b);
  saveBookings(updated);

  const booking = updated.find(b => b.id === bookingId);
  if (booking) {
    addNotification({
      type: "booking_confirmed",
      title: "Booking Confirmed! ✓",
      message: `Your reservation at ${booking.resort} (${booking.room}) has been confirmed by management.`,
      targetRole: "user",
      relatedId: bookingId,
    });
  }
  return updated;
}

export function rejectBooking(bookingId, reason = "") {
  const bookings = loadBookings() || [];
  const updated = bookings.map(b => b.id === bookingId ? { ...b, status: "cancelled", rejectReason: reason } : b);
  saveBookings(updated);

  const booking = updated.find(b => b.id === bookingId);
  if (booking) {
    addNotification({
      type: "booking_rejected",
      title: "Booking Update",
      message: `Your reservation at ${booking.resort} could not be confirmed. ${reason ? `Reason: ${reason}` : "Please contact us for details."}`,
      targetRole: "user",
      relatedId: bookingId,
    });
  }
  return updated;
}

export function approveActivity(requestId) {
  const requests = loadActivityRequests();
  const updated = requests.map(r => r.id === requestId ? { ...r, status: "confirmed" } : r);
  saveActivityRequests(updated);

  const request = updated.find(r => r.id === requestId);
  if (request) {
    addNotification({
      type: "activity_confirmed",
      title: "Activity Confirmed! ✓",
      message: `Your ${request.activityName} experience has been confirmed. See you there!`,
      targetRole: "user",
      relatedId: requestId,
    });
  }
  return updated;
}

export function rejectActivity(requestId) {
  const requests = loadActivityRequests();
  const updated = requests.map(r => r.id === requestId ? { ...r, status: "rejected" } : r);
  saveActivityRequests(updated);

  const request = updated.find(r => r.id === requestId);
  if (request) {
    addNotification({
      type: "activity_rejected",
      title: "Activity Update",
      message: `Your request for ${request.activityName} could not be fulfilled at this time.`,
      targetRole: "user",
      relatedId: requestId,
    });
  }
  return updated;
}
