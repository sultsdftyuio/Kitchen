// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { getGamificationStats } from "@/app/actions/gamification" // ADD THIS IMPORT

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  // Parallel Fetching - Added gamificationStats
  const [pantryRes, historyRes, profileRes, gamificationStats] = await Promise.all([
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
      .single(),
      
    getGamificationStats() // FETCHING STATS HERE ON THE SERVER
  ])

  const pantryItems = (pantryRes.data || []).map((item: any) => {
    return {
      id: item.id,
      name: item.name, 
      amount: item.amount || item.quantity || "1", 
      added_at: item.added_at
    }
  })

  const history = historyRes.data || []
  const profile = profileRes.data || { 
    dietary_restrictions: null, 
    skill_level: null 
  }

  const recentWin = history.find((meal: any) => meal.rating === 5) || null;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const expiringItems = pantryItems
    .filter(item => new Date(item.added_at) < oneWeekAgo)
    .slice(0, 3); 

  return (
    <DashboardShell 
      userEmail={user.email || "Chef"} 
      pantryItems={pantryItems}
      history={history}
      profile={profile}
      recentWin={recentWin}
      expiringItems={expiringItems}
      gamificationStats={gamificationStats} // PASSING IT DOWN
      stats={{
        pantryCount: pantryItems.length,
        mealsCooked: history.length
      }}
    />
  )
}