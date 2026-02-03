// app/login/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/login-button";
import { Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { signInWithEmail } from "@/app/actions/auth"; // We'll add a simple email form too

export default async function LoginPage() {
  const supabase = await createClient();

  // Redirect if logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs... (same as before) */}
      
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-border hard-shadow-lg p-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-tangerine p-3 rounded-2xl border-2 border-border hard-shadow mb-4 rotate-3">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-coffee">Welcome Back</h1>
        </div>

        <div className="space-y-6">
          <LoginButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-coffee-dark/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-coffee-dark/50">Or login with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form action={signInWithEmail} className="space-y-4">
            <div>
               <input name="email" type="email" placeholder="Email" required className="w-full p-3 rounded-xl border-2 border-border bg-cream/30 focus:border-tangerine outline-none text-coffee" />
            </div>
            <div>
               <input name="password" type="password" placeholder="Password" required className="w-full p-3 rounded-xl border-2 border-border bg-cream/30 focus:border-tangerine outline-none text-coffee" />
            </div>
            
            {/* Forgot Password Link */}
            <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs font-bold text-tangerine hover:underline">
                    Forgot Password?
                </Link>
            </div>

            <button type="submit" className="w-full bg-coffee text-white font-bold py-3 rounded-xl hover:bg-coffee-dark transition-colors">
                Log In
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-coffee-dark/70">Don't have a pantry? </span>
            <Link href="/signup" className="font-bold text-tangerine hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}