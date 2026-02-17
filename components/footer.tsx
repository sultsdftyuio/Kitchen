// components/footer.tsx
import Link from "next/link";
import { KitchenLogo } from "@/components/kitchen-logo";

export function Footer() {
  return (
    <footer className="bg-coffee py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <KitchenLogo size="md" href="/" />
            </div>
            <p className="text-cream/80 max-w-sm leading-relaxed">
              The AI cooking assistant that remembers your tastes, tracks your
              ingredients, and helps you cook with soul.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-cream mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/#features"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-serif text-2xl sm:text-3xl text-cream text-center md:text-left">
              {"Made with ❤️ and 🧈 (Butter)."}
            </p>
            <p className="text-cream/60 text-sm">
              © 2026 kernelcook. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}