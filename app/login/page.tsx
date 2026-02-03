// app/login/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/login-button";
import { Flame, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function LoginPage() {
  const supabase = await createClient();

  // Redirect to dashboard if already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 -left-12 w-64 h-64 bg-butter rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-1/3 -right-12 w-64 h-64 bg-lavender rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-rose rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-border hard-shadow-lg p-8 relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-tangerine p-3 rounded-2xl border-2 border-border hard-shadow mb-4 rotate-3 hover:rotate-6 transition-transform">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-coffee mb-2">
            KitchenOS
          </h1>
          <p className="text-coffee-dark/80 text-lg">
            Your sous-chef is waiting.
          </p>
        </div>

        {/* Login Action */}
        <div className="space-y-6">
          <div className="bg-muted p-4 rounded-2xl border-2 border-border/50 text-center">
            <p className="text-coffee-dark text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-tangerine" />
              Join 12,000+ happy home cooks
            </p>
          </div>

          <LoginButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-fullQX border-t border-coffee-dark/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-coffee-dark/50">
                Or go back home
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="block text-center text-sm font-medium text-coffee hover:text-tangerine transition-colors hover:underline underline-offset-4"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>

      {/* Footer text */}
      <p className="mt-8 text-coffee-dark/60 text-sm">
        By continuing, you agree to cook with ❤️ and 🧈.
      </p>
    </main>
  );
}