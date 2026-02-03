// app/actions/auth.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return { error: error.message };
  }

  return { success: "Check your email to confirm your account." };
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    console.error("Forgot Password error:", error);
    return { error: error.message };
  }

  return { success: "Check your email for the password reset link." };
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}