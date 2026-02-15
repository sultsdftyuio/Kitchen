// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  // Parallel Fetching - Left completely untouched as requested
  const [pantryRes, historyRes, profileRes] = await Promise.all([
    supabase
      .from("pantry_items")
      .select("*")
      .eq("user_id", user.id)
      .not("name", "is", null) 
      .neq("name", "")
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

  // Map for UI consistency - Left completely untouched
  const pantryItems = (pantryRes.data || []).map((item: any) => {
    let amt = item.amount;
    let unit = item.unit;
    
    if ((!amt || !unit) && item.quantity) {
       const parts = item.quantity.split(" ");
       if (parts.length >= 2) {
         amt = parts[0];
         unit = parts.slice(1).join(" ");
       }
    }

    return {
      ...item,
      name: item.name, 
      amount: amt || 1,
      unit: unit || 'pcs'
    }
  })

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