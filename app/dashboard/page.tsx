// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  // Parallel Fetching
  const [pantryRes, historyRes, profileRes] = await Promise.all([
    supabase
      .from("pantry_items")
      .select("*")
      .eq("user_id", user.id)
      .not("name", "is", null) // FIX: Changed from item_name to name
      .neq("name", "")         // FIX: Changed from item_name to name
      .order("added_at", { ascending: false }),
    
    supabase
      .from("cooking_history")
      .select("*")
      .eq("user_id", user.id)
      .order("cooked_at", { ascending: false }),

    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
  ])

  // Map for UI consistency
  const pantryItems = (pantryRes.data || []).map((item: any) => {
    return {
      id: item.id,
      name: item.name, // FIX: Direct mapping to item.name
      amount: item.amount || item.quantity || "1", // Fallback for UI
      added_at: item.added_at
    }
  })

  const history = historyRes.data || []
  const profile = profileRes.data || { 
    dietary_restrictions: null, 
    skill_level: null 
  }

  // Prep Station Logic: Recent Win (Latest 5-star meal)
  const recentWin = history.find((meal: any) => meal.rating === 5) || null;

  // Prep Station Logic: Expiring Soon (Added > 7 days ago for MVP)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const expiringItems = pantryItems
    .filter(item => new Date(item.added_at) < oneWeekAgo)
    .slice(0, 3); // Top 3 oldest items

  return (
    <DashboardShell 
      userEmail={user.email || "Chef"} 
      pantryItems={pantryItems}
      history={history}
      profile={profile}
      recentWin={recentWin}
      expiringItems={expiringItems}
      stats={{
        pantryCount: pantryItems.length,
        mealsCooked: history.length
      }}
    />
  )
}