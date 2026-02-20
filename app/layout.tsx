// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

// 🚀 THIS IS THE SEO GOLDMINE
export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'), // REQUIRED for absolute image URLs in OG tags
  title: {
    default: "Kernelcook | Your AI Culinary Assistant",
    template: "%s | Kernelcook", 
  },
  description: "Stop wasting food. Manage your pantry, track your cooking history, and get AI-generated recipes based on what you already have in your kitchen.",
  keywords: ["recipe generator", "pantry manager", "AI cooking", "zero waste cooking", "meal prep"],
  authors: [{ name: "Kernelcook Team" }],
  creator: "Kernelcook",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    title: "Kernelcook | Your AI Culinary Assistant",
    description: "Manage your pantry, reduce waste, and cook delicious meals with AI-powered recipes.",
    siteName: "Kernelcook",
    images: [
      {
        url: "/og-image.jpg", // Add a nice 1200x630 image to your /public folder!
        width: 1200,
        height: 630,
        alt: "Kernelcook Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kernelcook | Your AI Culinary Assistant",
    description: "Manage your pantry, reduce waste, and cook delicious meals with AI-powered recipes.",
    creator: "@kernelcook", // Replace with your twitter handle
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}