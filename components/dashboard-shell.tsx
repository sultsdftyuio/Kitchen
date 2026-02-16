// components/dashboard-shell.tsx
"use client"

import { useState } from "react"
import { DashboardChat } from "@/components/dashboard-chat"
import { PantryManager } from "@/components/pantry-manager" 
import { CookingHistory } from "@/components/cooking-history"
import { ProfileSettings } from "@/components/profile-settings"
import { PrepStation } from "@/components/prep-station"
import { QuickAddModal } from "@/components/quick-add-modal"
import { CommandPalette } from "@/components/command-palette"
import { signOut } from "@/app/actions/auth"
import { ChefHat, LogOut, Loader2, Search } from "lucide-react"

export function DashboardShell({ 
  userEmail, 
  pantryItems, 
  history,
  profile,
  stats,
  recentWin,
  expiringItems
}: { 
  userEmail: string
  pantryItems: any[]
  history: any[]
  profile: any
  stats: { pantryCount: number, mealsCooked: number }
  recentWin: any
  expiringItems: any[]
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pantry' | 'history'>('overview')
  const [prefillDish, setPrefillDish] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)
  
  // Quick Add Modal State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [quickAddTab, setQuickAddTab] = useState<'ingredient' | 'meal'>('ingredient')

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
      console.error("Sign out failed", error)
      setIsSigningOut(false)
    }
  }

  // Gamification & MVP Logic
  const getChefLevel = (meals: number) => {
    if (meals < 5) return { title: "Apprentice", next: 5, progress: (meals/5)*100 };
    if (meals < 15) return { title: "Line Cook", next: 15, progress: ((meals-5)/10)*100 };
    if (meals < 30) return { title: "Sous Chef", next: 30, progress: ((meals-15)/15)*100 };
    return { title: "Executive Chef", next: meals, progress: 100 };
  }

  const zeroWasteStreak = Math.max(0, stats.pantryCount - expiringItems.length);
  const levelInfo = getChefLevel(stats.mealsCooked);
  const userName = userEmail.split('@')[0]

  return (
    <main className="min-h-screen bg-cream selection:bg-tangerine selection:text-white pb-20">
      <CommandPalette pantryItems={pantryItems} history={history} onNavigate={setActiveTab} />

      {/* SLEEK TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b-2 border-border/50 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-tangerine p-1.5 rounded-lg border-2 border-black hard-shadow-sm rotate-[-4deg]">
              <ChefHat className="text-white w-5 h-5" />
          </div>
          <span className="font-serif font-black text-2xl text-coffee tracking-tight hidden sm:block">
            Kitchen<span className="text-tangerine">OS</span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-sans font-bold bg-muted text-coffee/60 px-2 py-1.5 rounded-md border border-border/50">
            <Search className="w-3.5 h-3.5" /> CMD + K
          </div>
          
          <div className="w-px h-6 bg-border/30 mx-1 hidden sm:block"></div>

          <ProfileSettings initialProfile={profile} />
          <button 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Sign Out"
          >
            {isSigningOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* MAIN DASHBOARD LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTENT AREA (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Elegant Tab Switcher */}
            <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border-2 border-border/30 w-full sm:w-fit flex gap-1 overflow-x-auto scrollbar-hide">
                {(['overview', 'pantry', 'history'] as const).map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-none px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 capitalize ${
                          activeTab === tab 
                          ? 'bg-coffee text-white hard-shadow-sm' 
                          : 'bg-transparent text-coffee/50 hover:text-coffee hover:bg-white/50'
                      }`}
                  >
                      {tab === 'overview' ? 'Bento Grid' : tab}
                  </button>
                ))}
            </div>

            {/* Dynamic Views */}
            <div className="min-h-[600px]">
                {activeTab === 'overview' && (
                  <PrepStation 
                    pantryItems={pantryItems}
                    pantryCount={stats.pantryCount} 
                    expiringItems={expiringItems} 
                    recentWin={recentWin}
                    stats={stats}
                    levelInfo={levelInfo}
                    zeroWasteStreak={zeroWasteStreak}
                    userName={userName}
                    onSwitchTab={setActiveTab}
                    onOpenQuickAdd={(tab) => { setQuickAddTab(tab); setIsQuickAddOpen(true); }}
                  />
                )}
                {activeTab === 'pantry' && <PantryManager items={pantryItems} />}
                {activeTab === 'history' && (
                  <CookingHistory 
                      initialHistory={history} 
                      pantryItems={pantryItems} 
                      prefillDishName={prefillDish}
                  />
                )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: AI Chef Chat (4 Columns, Sticky) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 z-20">
             <div className="relative">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-300/40 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-tangerine/40 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <DashboardChat 
                  onLogRecipe={handleLogRecipe} 
                  pantryCount={stats.pantryCount} 
                  activeTab={activeTab} 
                />
             </div>
          </aside>

        </div>
      </div>

      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} defaultTab={quickAddTab} />
    </main>
  )
}