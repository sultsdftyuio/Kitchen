// components/navbar.tsx
import Link from "next/link";
import { Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { AuthButton } from "@/components/auth-button"; // Assuming this exists or we replace it

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-coffee/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-tangerine p-1.5 rounded-lg border-2 border-coffee hard-shadow group-hover:rotate-12 transition-transform">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-xl font-bold text-coffee">
            KitchenOS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-coffee-dark/80 hover:text-coffee font-medium text-sm">
            Features
          </Link>
          <Link href="#how-it-works" className="text-coffee-dark/80 hover:text-coffee font-medium text-sm">
            How it works
          </Link>
          <Link href="#pricing" className="text-coffee-dark/80 hover:text-coffee font-medium text-sm">
            Pricing
          </Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
             <Link
              href="/dashboard"
              className="bg-coffee text-white text-sm font-bold px-4 py-2 rounded-xl border-2 border-transparent hover:bg-coffee-dark transition-colors"
            >
              Go to Kitchen
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:block text-coffee font-bold text-sm hover:underline underline-offset-4"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-tangerine hover:bg-tangerine-dark text-white text-sm font-bold px-5 py-2.5 rounded-xl border-2 border-coffee hard-shadow hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}