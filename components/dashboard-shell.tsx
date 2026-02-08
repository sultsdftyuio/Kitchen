// components/dashboard-shell.tsx
"use client"

import { useState } from "react"
import { DashboardChat } from "@/components/dashboard-chat"
import PantryUI from "@/app/pantry/pantry-ui" 
import { CookingHistory } from "@/components/cooking-history"
import { ProfileSettings } from "@/components/profile-settings"
import { signOut } from "@/app/actions/auth"
import { Package, UtensilsCrossed, ChefHat, LogOut, Loader2, Sword, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardShell({ 
  userEmail, 
  pantryItems, 
  history,
  profile,
  stats 
}: { 
  userEmail: string
  pantryItems: any[]
  history: any[]
  profile: any
  stats: { pantryCount: number, mealsCooked: number }
}) {
  const [activeTab, setActiveTab] = useState<'pantry' | 'history'>('pantry')
  const [prefillDish, setPrefillDish] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogRecipe = (dishName: string) => {
    setPrefillDish(dishName)
    setActiveTab('history')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
    } catch (error) {
      setIsSigningOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFCF0] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* GAME HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-4 border-coffee/10">
          <div className="flex items-center gap-4">
              <div className="bg-tangerine p-3 rounded-2xl border-4 border-coffee hard-shadow rotate-3">
                  <ChefHat className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-coffee uppercase tracking-tighter">
                    Kitchen<span className="text-tangerine underline decoration-8 decoration-yellow-400 underline-offset-[-2px]">OS</span>
                </h1>
                <p className="text-xs font-black text-coffee/40 uppercase tracking-[0.2em]">Player: {userEmail.split('@')[0]}</p>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-xl border-4 border-coffee hard-shadow flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400 border-2 border-coffee rounded flex items-center justify-center font-black">P</div>
                <div className="text-sm font-black text-coffee">{stats.pantryCount} ITEMS</div>
             </div>
             <div className="bg-white px-4 py-2 rounded-xl border-4 border-coffee hard-shadow flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-400 border-2 border-coffee rounded flex items-center justify-center font-black text-white">M</div>
                <div className="text-sm font-black text-coffee">{stats.mealsCooked} MEALS</div>
             </div>
             <ProfileSettings initialProfile={profile} />
             <button onClick={handleSignOut} className="bg-red-100 p-2.5 rounded-xl border-4 border-coffee text-red-600 hover:bg-red-200 transition-colors">
                <LogOut className="w-6 h-6 stroke-[3px]" />
             </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* INVENTORY & QUEST LOG (Left Side) */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('pantry')}
                    className={cn(
                        "flex-1 py-4 rounded-2xl font-black text-lg uppercase tracking-tight border-4 transition-all hard-shadow",
                        activeTab === 'pantry' ? "bg-coffee text-white border-coffee -translate-y-1 shadow-none" : "bg-white text-coffee border-coffee hover:bg-cream"
                    )}
                >
                    🎒 Inventory
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "flex-1 py-4 rounded-2xl font-black text-lg uppercase tracking-tight border-4 transition-all hard-shadow",
                        activeTab === 'history' ? "bg-tangerine text-white border-coffee -translate-y-1 shadow-none" : "bg-white text-coffee border-coffee hover:bg-cream"
                    )}
                >
                    📜 Quest Log
                </button>
            </div>

            <div className="bg-white border-4 border-coffee rounded-[2rem] p-6 hard-shadow-lg min-h-[600px]">
                {activeTab === 'pantry' ? (
                    <PantryUI items={pantryItems} />
                ) : (
                    <CookingHistory 
                        initialHistory={history} 
                        pantryItems={pantryItems} 
                        prefillDishName={prefillDish}
                    />
                )}
            </div>
          </div>

          {/* THE CHEF (Right Side Sidebar) */}
          <aside className="lg:col-span-5 order-1 lg:order-2">
             <div className="sticky top-8">
                <DashboardChat onLogRecipe={handleLogRecipe} />
                
                {/* Game Tip Footer */}
                <div className="mt-4 bg-yellow-100 border-2 border-dashed border-coffee/30 p-3 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-coffee/60 uppercase">Tip: Tell the chef you want a "15-minute speedrun" for fast recipes!</p>
                </div>
             </div>
          </aside>

        </div>
      </div>
    </main>
  )
}