// componets/auth-button.tsx
"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { type User } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils" // Assuming you have this from shadcn, otherwise remove cn() wrapper

export default function AuthButton({ className }: { className?: string }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [supabase])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  // Base styles matching your design system
  const baseClasses = "bg-tangerine text-white px-6 py-2.5 rounded-2xl font-semibold border-2 border-border hard-shadow hard-shadow-hover transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 cursor-pointer"

  if (loading) {
    return (
      <button className={baseClasses} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </button>
    )
  }

  if (user) {
    return (
      <Link href="/dashboard" className={`${baseClasses} ${className || ''}`}>
        My Pantry
      </Link>
    )
  }

  return (
    <button onClick={handleLogin} className={`${baseClasses} ${className || ''}`}>
      Open Kitchen
    </button>
  )
}