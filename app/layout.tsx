// app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CookieBanner } from "@/components/cookie-banner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

// 1. Font Configurations (Keep your elegant choice)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// 2. SEO Metadata for KernelCook
export const metadata: Metadata = {
  metadataBase: new URL("https://kernelcook.com"),
  title: {
    default: "KernelCook | AI Culinary Inventory & Coaching",
    template: "%s | KernelCook",
  },
  description:
    "The first culinary AI that cooks with heart. Manage your pantry, get AI recipe suggestions, and turn leftovers into feasts.",
  keywords: ["cooking", "pantry manager", "AI recipes", "kitchen organization", "culinary ai"],
  authors: [{ name: "KernelCook Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kernelcook.com",
    title: "KernelCook | AI Culinary Assistant",
    description: "Turn your leftovers into feasts with AI-powered cooking coaching.",
    siteName: "KernelCook",
  },
  // Add your Google Search Console verification code here later
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${workSans.variable} font-sans antialiased flex min-h-screen flex-col`}
      >
        {/* Navigation Bar (Appears on all pages) */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer (Appears on all pages) */}
        <Footer />

        {/* Global Overlays & Analytics */}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}