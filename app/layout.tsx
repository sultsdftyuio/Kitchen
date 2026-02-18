// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"; 
import { CookieBanner } from "@/components/cookie-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Set the base URL for all relative links/images in metadata
  metadataBase: new URL('https://kernelcook.com'),
  
  title: "kernelcook | AI Kitchen Management",
  description: "Master your kitchen with AI-powered inventory management and personalized coaching.",
  keywords: ["cooking", "inventory", "AI chef", "pantry tracker", "kernelcook"],
  
  // Fix: Ensure canonical points to your actual production domain
  alternates: {
    canonical: '/', 
  },
  
  // Add this for Google Search Console verification
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_STRING_HERE", // Get this from GSC settings
  },
  
  openGraph: {
    title: "kernelcook | AI Kitchen Management",
    description: "Master your kitchen with AI-powered inventory management and personalized coaching.",
    url: 'https://kernelcook.com',
    siteName: 'kernelcook',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "kernelcook",
    "operatingSystem": "Web",
    "applicationCategory": "LifestyleApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}