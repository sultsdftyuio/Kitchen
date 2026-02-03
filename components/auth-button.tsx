// components/auth-button.tsx
"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { User } from "@supabase/supabase-js";

interface AuthButtonProps {
  user: User | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setIsLoading(false);
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="bg-coffee text-white text-sm font-bold px-4 py-2 rounded-xl border-2 border-transparent hover:bg-coffee-dark transition-colors flex items-center gap-2"
        >
          <UserIcon className="w-4 h-4" />
          Kitchen
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="text-coffee-dark/70 hover:text-rose-600 transition-colors p-2"
          title="Sign out"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
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
    </div>
  );
}