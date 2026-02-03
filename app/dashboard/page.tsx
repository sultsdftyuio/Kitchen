// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"

export default async function Dashboard() {
  const supabase = await createClient()

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/")
  }

  // 2. Fetch All Data Parallelly
  const [pantryRes, historyRes] = await Promise.all([
    supabase
      .from("pantry_items")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false }),
    
    supabase
      .from("cooking_history")
      .select("*")
      .eq("user_id", user.id)
      .order("cooked_at", { ascending: false })
  ])

  const pantryItems = pantryRes.data || []
  const history = historyRes.data || []

  // 3. Render Shell
  return (
    <DashboardShell 
      userEmail={user.email || "Chef"} 
      pantryItems={pantryItems}
      history={history}
      stats={{
        pantryCount: pantryItems.length,
        mealsCooked: history.length
      }}
    />
  )
}