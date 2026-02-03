// app/forgot-password/page.tsx
"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { forgotPassword } from "@/app/actions/auth";
import { Loader2, KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const result = await forgotPassword(formData);
      setMessage(result);
    });
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 relative overflow-hidden">
       {/* Background */}
       <div className="absolute top-10 left-10 w-32 h-32 bg-tangerine/20 rounded-full blur-xl" />
       <div className="absolute bottom-10 right-10 w-40 h-40 bg-coffee/10 rounded-full blur-xl" />

      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-border hard-shadow-lg p-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-butter p-3 rounded-2xl border-2 border-border hard-shadow mb-4">
            <KeyRound className="w-8 h-8 text-coffee" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-coffee mb-2">
            Forgot Password?
          </h1>
          <p className="text-coffee-dark/80 text-sm">
            Don't worry, it happens to the best of us. Enter your email and we'll send you a rescue link.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-coffee ml-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="chef@kitchenos.com"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-cream/30 focus:border-tangerine focus:ring-0 outline-none transition-colors text-coffee"
            />
          </div>

          {message?.error && (
             <div className="bg-rose/20 border-2 border-rose text-rose-dark p-3 rounded-xl text-sm text-center font-medium">
               {message.error}
             </div>
          )}
          
          {message?.success && (
             <div className="bg-green-100 border-2 border-green-500 text-green-800 p-3 rounded-xl text-sm text-center font-medium">
               {message.success}
             </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-coffee hover:bg-coffee/90 text-white font-bold py-3 px-6 rounded-xl border-2 border-transparent hard-shadow hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border flex justify-center">
          <Link
            href="/login"
            className="text-sm font-medium text-coffee-dark hover:text-tangerine flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}