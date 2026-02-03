// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { addPantryItem, deletePantryItem } from "@/app/actions/pantry"
import { Trash2, Plus } from "lucide-react"
import { CookingHistory } from "@/components/cooking-history"
import { ProfileSettings } from "@/components/profile-settings"

export default async function Dashboard() {
  const supabase = await createClient()

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/")
  }

  // 2. Fetch Data (Parallel for speed)
  const [pantryResponse, historyResponse, profileResponse] = await Promise.all([
    supabase.from("pantry_items").select("*").eq("user_id", user.id).order("added_at", { ascending: false }),
    supabase.from("cooking_history").select("*").eq("user_id", user.id).order("cooked_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("id", user.id).single()
  ])

  const pantryItems = pantryResponse.data || [] // Ensure array
  const historyItems = historyResponse.data || []
  const userProfile = profileResponse.data

  return (
    <main className="min-h-screen bg-cream p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-4xl font-bold text-coffee">
              Kitchen<span className="text-tangerine">OS</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <ProfileSettings initialProfile={userProfile} />
            <div className="hidden sm:block bg-white px-4 py-3 rounded-xl border-2 border-border hard-shadow text-coffee font-medium">
              {user.email}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT COLUMN: PANTRY */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl font-bold text-coffee">
                Your <span className="text-tangerine">Pantry</span>
              </h2>
            </div>

            {/* Add Item Form */}
            <div className="bg-white p-6 rounded-3xl border-2 border-border hard-shadow-lg">
              <form action={addPantryItem} className="flex gap-3">
                <input
                  name="item_name"
                  type="text"
                  placeholder="e.g., Avocados 🥑"
                  required
                  className="flex-1 bg-muted px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee"
                />
                <input
                  name="quantity"
                  type="text"
                  placeholder="Qty"
                  className="w-20 bg-muted px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee"
                />
                <button
                  type="submit"
                  className="bg-tangerine text-white p-3 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </form>
            </div>

            {/* Items Grid */}
            <div className="space-y-3">
              {pantryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border-2 border-border hard-shadow flex items-center justify-between group"
                >
                  <div>
                    <h3 className="font-bold text-coffee text-lg">{item.name}</h3>
                    <p className="text-coffee-dark/60 text-sm">Qty: {item.quantity}</p>
                  </div>
                  
                  <form action={deletePantryItem.bind(null, item.id)}>
                    <button
                      type="submit"
                      className="text-coffee-dark/40 hover:text-destructive transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              ))}

              {pantryItems.length === 0 && (
                <div className="text-center py-12 text-coffee-dark/50">
                  <p>Your pantry is empty.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: COOKING HISTORY */}
          <div>
            {/* Now passing pantryItems so we can deduce inventory */}
            <CookingHistory 
              initialHistory={historyItems} 
              pantryItems={pantryItems}
            />
          </div>
        </div>
      </div>
    </main>
  )
}