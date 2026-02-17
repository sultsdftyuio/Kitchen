// components/navbar.tsx
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthButton } from "@/components/auth-button";
import { User } from "@supabase/supabase-js";
import { KitchenLogo } from "@/components/kitchen-logo";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-butter/80 backdrop-blur-md border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <KitchenLogo size="md" href="/" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-coffee-dark hover:text-tangerine transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-coffee-dark hover:text-tangerine transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-coffee-dark hover:text-tangerine transition-colors font-medium"
            >
              Reviews
            </Link>
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <AuthButton user={user} />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-black/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-coffee" />
            ) : (
              <Menu className="w-6 h-6 text-coffee" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-border bg-butter animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4 px-2">
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-coffee-dark hover:text-tangerine transition-colors font-medium p-2 rounded-lg hover:bg-white/50"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-coffee-dark hover:text-tangerine transition-colors font-medium p-2 rounded-lg hover:bg-white/50"
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="text-coffee-dark hover:text-tangerine transition-colors font-medium p-2 rounded-lg hover:bg-white/50"
              >
                Reviews
              </Link>
              <div className="pt-2 border-t border-coffee/10">
                 <AuthButton user={user} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}