// app/login/page.tsx
"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { signInWithEmail } from "@/app/actions/auth";
import { LoginButton } from "@/components/login-button";
import { Flame, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await signInWithEmail(formData);
      if (result?.error) {
        setError(result.error);
      }
      // On success, the server action redirects to /dashboard
    });
  };

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
            Welcome back, Chef.
          </p>
        </div>

        <div className="space-y-6">
          <LoginButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-coffee-dark/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-coffee-dark/50">
                Or login with email
              </span>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-coffee ml-1" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-coffee-dark/40" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-cream/30 focus:border-tangerine focus:ring-0 outline-none transition-colors text-coffee"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-coffee" htmlFor="password">Password</label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-coffee-dark/70 hover:text-tangerine hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-coffee-dark/40" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-cream/30 focus:border-tangerine focus:ring-0 outline-none transition-colors text-coffee"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose/20 border-2 border-rose text-rose-dark p-3 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-coffee hover:bg-coffee/90 text-white font-bold py-3 px-6 rounded-xl border-2 border-transparent hard-shadow hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Log In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-coffee-dark/70 text-sm">
              Don't have a pantry yet?{" "}
              <Link href="/signup" className="font-bold text-tangerine hover:underline underline-offset-2">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}