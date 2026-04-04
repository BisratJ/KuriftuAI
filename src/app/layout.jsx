import "./globals.css";
import { ToastWrapper } from "@/components/ui/ToastWrapper";

export const metadata = {
  title: "KuriftuAI — Intelligent Hospitality",
  description: "AI-powered hospitality management platform for Kuriftu Resort & Spa. Dashboard, AI Concierge, Revenue Intelligence, and Guest Insights.",
  icons: {
    icon: "/kuriftu-logo.png",
    shortcut: "/kuriftu-logo.png",
    apple: "/kuriftu-logo.png",
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
      <body>
        <ToastWrapper>{children}</ToastWrapper>
      </body>
    </html>
  );
}
