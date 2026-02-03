// app/signup/page.tsx
"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { signUp } from "@/app/actions/auth";
import { Loader2, ChefHat, Sparkles, Mail, Lock, CheckSquare } from "lucide-react";
import { LoginButton } from "@/components/login-button";

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result) setMessage(result);
    });
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 relative overflow-hidden">
       {/* Decorative Background Elements */}
       <div className="absolute top-1/4 -left-12 w-64 h-64 bg-butter rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-1/3 -right-12 w-64 h-64 bg-lavender rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-rose rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-border hard-shadow-lg p-8 relative z-10 my-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-lavender p-3 rounded-2xl border-2 border-border hard-shadow mb-4 rotate-[-3deg] hover:rotate-[-6deg] transition-transform">
            <ChefHat className="w-8 h-8 text-coffee" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-coffee mb-2">
            Claim Your Kitchen
          </h1>
          <p className="text-coffee-dark/80">
            Join 12,000+ home cooks saving time & reducing waste.
          </p>
        </div>

        {/* OAuth Section */}
        <div className="mb-6">
           <LoginButton />
        </div>
        
        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-coffee-dark/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-coffee-dark/50">
                Or sign up with email
              </span>
            </div>
        </div>

        {/* Email Sign Up Form */}
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-coffee ml-1" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-coffee-dark/40" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="chef@kitchenos.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-cream/30 focus:border-tangerine focus:ring-0 outline-none transition-colors text-coffee"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-coffee ml-1" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-coffee-dark/40" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-cream/30 focus:border-tangerine focus:ring-0 outline-none transition-colors text-coffee"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-coffee ml-1" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-coffee-dark/40" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-cream/30 focus:border-tangerine focus:ring-0 outline-none transition-colors text-coffee"
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 pt-2 px-1">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="w-5 h-5 rounded border-2 border-border text-tangerine focus:ring-offset-0 focus:ring-tangerine transition-all cursor-pointer accent-tangerine"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-coffee-dark/80 cursor-pointer select-none">
              I agree to the{" "}
              <Link href="#" className="font-bold text-coffee hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-bold text-coffee hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {message?.error && (
             <div className="bg-rose/20 border-2 border-rose text-rose-dark p-3 rounded-xl text-sm text-center font-medium">
               {message.error}
             </div>
          )}
          
          {message?.success && (
             <div className="bg-green-100 border-2 border-green-500 text-green-800 p-3 rounded-xl text-sm text-center font-medium flex items-center justify-center gap-2">
               <Sparkles className="w-4 h-4" />
               {message.success}
             </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-tangerine hover:bg-tangerine-dark text-white font-bold py-3 px-6 rounded-xl border-2 border-coffee hard-shadow hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-coffee-dark/70 text-sm">
            Already have a pantry?{" "}
            <Link href="/login" className="font-bold text-tangerine hover:underline underline-offset-2">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}