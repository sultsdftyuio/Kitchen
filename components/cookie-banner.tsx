"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check local storage for consent
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsOpen(false);
  };

  const declineCookies = () => {
    // In a real app, you would disable analytics here
    localStorage.setItem("cookie-consent", "false");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-coffee text-cream shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex gap-4">
          <div className="p-3 bg-white/10 rounded-xl h-fit">
            <Cookie className="w-6 h-6 text-tangerine" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-lg">We use cookies (and butter)</h4>
            <p className="text-sm text-cream/80 max-w-2xl leading-relaxed">
              KitchenOS uses cookies to improve your experience, track analytics, and keep you signed in. By continuing, you agree to our 
              <Link href="/privacy" className="text-tangerine hover:underline mx-1 font-bold">Privacy Policy</Link> 
              and 
              <Link href="/terms" className="text-tangerine hover:underline mx-1 font-bold">Terms of Service</Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={declineCookies}
            className="border-cream/20 text-cream hover:bg-white/10 hover:text-white transition-colors"
          >
            Decline
          </Button>
          <Button 
            onClick={acceptCookies}
            className="bg-tangerine text-white hover:bg-tangerine/90 font-bold px-8"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}