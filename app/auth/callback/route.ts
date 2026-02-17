// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // The 'next' param is where we want to redirect the user after exchanging the code
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    
    // Exchange the secure code for an actual user session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // If successful, redirect to the intended page (e.g., /reset-password)
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If there's an error or no code, redirect to login with an error message
  return NextResponse.redirect(
    new URL("/login?error=Could not verify your session. Please try again.", request.url)
  );
}