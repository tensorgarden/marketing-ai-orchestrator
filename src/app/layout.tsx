import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketing AI Orchestrator -- Campaign Optimization & Multi-Channel Analytics",
  description:
    "Campaign optimization, multi-channel analytics, content strategy, and ROI attribution for premium marketing operations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
