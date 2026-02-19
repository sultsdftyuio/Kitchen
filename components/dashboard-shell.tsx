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
import { GamificationPanel } from "@/components/gamification-panel" // Added Import
import { signOut } from "@/app/actions/auth"
import { LogOut, Loader2, Search } from "lucide-react"
import { KitchenLogo } from "@/components/kitchen-logo"

export function DashboardShell({ 
  userEmail, 
  pantryItems, 
  history,
  profile,
  stats,
  recentWin,
  expiringItems}: { 
  userEmail: string
  pantryItems: any[]
  history: any[]
  profile: any
  stats: { pantryCount: number, mealsCooked: number }
  recentWin: any
  expiringItems: any[]
}) {
  // Added 'achievements' to activeTab state
  const [activeTab, setActiveTab] = useState<'overview' | 'pantry' | 'history' | 'achievements'>('overview')
  const [prefillDish, setPrefillDish] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)
  
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
    <main className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-tangerine selection:text-white pb-20 font-sans">
      <CommandPalette pantryItems={pantryItems} history={history} onNavigate={setActiveTab as any} />

      {/* PREMIUM FROSTED NAV */}
      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <KitchenLogo size="sm" href="/" />

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/60 transition-colors">
            <Search className="w-3.5 h-3.5" /> 
            <span>Search</span>
            <kbd className="font-sans text-[10px] bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200">⌘K</kbd>
          </button>
          
          <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block"></div>

          <ProfileSettings initialProfile={profile} />
          <button 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="p-2 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Sign Out"
          >
            {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* DASHBOARD LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN CONTENT (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* iOS Style Pill Tab Switcher */}
            <div className="bg-slate-100/80 p-1 rounded-2xl w-full sm:w-fit flex gap-1 items-center border border-slate-200/50 shadow-inner overflow-x-auto">
                {/* Added 'achievements' to the tabs map */}
                {(['overview', 'pantry', 'history', 'achievements'] as const).map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-none px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
                          activeTab === tab 
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                          : 'bg-transparent text-slate-500 hover:text-slate-700'
                      }`}
                  >
                      {tab === 'overview' ? 'Overview' : tab}
                  </button>
                ))}
            </div>

            {/* View Container */}
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
                    onSwitchTab={setActiveTab as any}
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
                {/* Render the Gamification Panel when active */}
                {activeTab === 'achievements' && <GamificationPanel initialStats={null} />}
            </div>
          </div>

          {/* AI SIDEBAR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 z-20">
             <div className="relative">
                {/* Subtle soft glow under the chat instead of hard colors */}
                <div className="absolute -inset-4 bg-gradient-to-b from-orange-50/50 to-transparent blur-2xl -z-10 rounded-[3rem]"></div>
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