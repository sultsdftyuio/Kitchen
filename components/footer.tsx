import { Flame } from "lucide-react"; // footer.tsx

export function Footer() {
  return (
    <footer className="bg-coffee py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-tangerine p-2 rounded-xl border-2 border-cream/20">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-cream">
                KitchenOS
              </span>
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
                  href="#features"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
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
                <a
                  href="#"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-cream/70 hover:text-tangerine transition-colors"
                >
                  Contact
                </a>
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
              © 2026 KitchenOS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
