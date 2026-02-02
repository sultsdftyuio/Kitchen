"use client"; //navbar.tsx

import { Flame, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-butter/80 backdrop-blur-md border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-tangerine p-2 rounded-xl border-2 border-border">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-coffee">
              KitchenOS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-coffee-dark hover:text-tangerine transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-coffee-dark hover:text-tangerine transition-colors font-medium"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-coffee-dark hover:text-tangerine transition-colors font-medium"
            >
              Reviews
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-tangerine text-white px-6 py-2.5 rounded-2xl font-semibold border-2 border-border hard-shadow hard-shadow-hover">
              Open Kitchen
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
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
          <div className="md:hidden py-4 border-t-2 border-border">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-coffee-dark hover:text-tangerine transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-coffee-dark hover:text-tangerine transition-colors font-medium"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-coffee-dark hover:text-tangerine transition-colors font-medium"
              >
                Reviews
              </a>
              <button className="bg-tangerine text-white px-6 py-2.5 rounded-2xl font-semibold border-2 border-border hard-shadow w-fit">
                Open Kitchen
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
