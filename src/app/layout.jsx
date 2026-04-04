import "./globals.css";

export const metadata = {
  title: "KuriftuAI — Intelligent Hospitality",
  description: "AI-powered hospitality management platform for Kuriftu Resort & Spa. Dashboard, AI Concierge, Revenue Intelligence, and Guest Insights.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "KuriftuAI — Intelligent Hospitality",
    description: "AI-powered hospitality management platform for Kuriftu Resort & Spa",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
