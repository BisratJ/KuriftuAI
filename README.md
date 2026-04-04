# KuriftuAI — Intelligent Hospitality Platform

AI-powered hospitality management platform for Kuriftu Resort & Spa.

## Features

- **Dashboard** — Real-time overview across all Kuriftu locations with occupancy, revenue, and guest satisfaction metrics
- **AI Concierge** — Interactive chat interface for guest services, dining reservations, spa bookings, and activity recommendations
- **Revenue Intelligence** — AI-powered dynamic pricing and upsell opportunity identification
- **Guest Insights** — Sentiment analysis and AI-flagged feedback from multiple review platforms

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 + Tailwind CSS
- **Charts:** Recharts
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

This project is configured for one-click deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KuriftuAI/KuriftuAI)

## Project Structure

```
src/
  app/
    layout.jsx      # Root layout with metadata
    page.jsx        # Main app with navigation
    globals.css     # Global styles + Tailwind
  components/
    DashboardView   # Metrics, charts, location cards
    ConciergeView   # AI chat interface + guest context
    RevenueView     # Dynamic pricing + upsell table
    GuestInsightsView # Sentiment analysis + flagged feedback
    MetricCard      # Reusable metric display
    LocationCard    # Location occupancy card
    Icons           # SVG icon components
  lib/
    data.js         # All mock data and constants
```

## License

Proprietary — Kuriftu Resort & Spa
