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
      .select("*") // Select all to get IDs, etc.
      .eq("user_id", user.id)
      .not("item_name", "is", null) // Correct DB column
      .neq("item_name", "")
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

  // Map DB 'item_name' to UI 'name'
  const pantryItems = (pantryRes.data || []).map((item: any) => ({
    ...item,
    name: item.item_name // <--- CRITICAL FIX: UI expects 'name'
  }))

  const history = historyRes.data || []
  const profile = profileRes.data || { 
    dietary_restrictions: null, 
    skill_level: null, 
    kitchen_equipment: null 
  }

  return (
    <DashboardShell 
      userEmail={user.email || "Chef"} 
      pantryItems={pantryItems}
      history={history}
      profile={profile}
      stats={{
        pantryCount: pantryItems.length,
        mealsCooked: history.length
      }}
    />
  )
}