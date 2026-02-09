// components/cookie-banner.tsx
"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("kitchenos-cookie-consent");
    if (!consent) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("kitchenos-cookie-consent", "true");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("kitchenos-cookie-consent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-md w-[calc(100%-2rem)]",
        "bg-coffee text-cream p-6 rounded-2xl shadow-2xl border-2 border-cream/10",
        "animate-in slide-in-from-bottom-4 duration-500 fade-in"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-tangerine rounded-xl shrink-0">
          <Cookie className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 space-y-3">
          <h3 className="font-serif text-lg font-bold text-cream">
            We use cookies (the digital kind)
          </h3>
          <p className="text-sm text-cream/80 leading-relaxed">
            We use cookies to remember your pantry, keep you logged in, and improve our AI chef. 
            See our{" "}
            <Link href="/privacy" className="underline hover:text-tangerine">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button 
              onClick={acceptCookies}
              className="bg-tangerine hover:bg-tangerine/90 text-white font-bold rounded-lg flex-1"
            >
              Accept All
            </Button>
            <Button 
              variant="outline" 
              onClick={declineCookies}
              className="border-cream/20 hover:bg-cream/10 text-cream hover:text-cream flex-1"
            >
              Necessary Only
            </Button>
          </div>
        </div>
        
        <button 
          onClick={declineCookies}
          className="text-cream/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}