import React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";

// Font configurations
const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const _workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Metadata for SEO and sharing
export const metadata: Metadata = {
  title: "KitchenOS - AI Cooking Assistant",
  description:
    "The first culinary AI that cooks with heart, not just algorithms. Turn your leftovers into feasts.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${_playfair.variable} ${_workSans.variable} font-sans antialiased`}
      >
        {/* Main Application Content */}
        {children}

        {/* Global Components (overlays, analytics, etc.) */}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}