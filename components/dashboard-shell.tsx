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
import { Package, UtensilsCrossed, ChefHat, LogOut, Loader2, Plus, Leaf, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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

  // Gamification Logic
  const getChefLevel = (meals: number) => {
    if (meals < 5) return { title: "Apprentice", next: 5, progress: (meals/5)*100 };
    if (meals < 15) return { title: "Line Cook", next: 15, progress: ((meals-5)/10)*100 };
    if (meals < 30) return { title: "Sous Chef", next: 30, progress: ((meals-15)/15)*100 };
    return { title: "Executive Chef", next: meals, progress: 100 };
  }

  // 3. Zero-Waste Impact Logic (MVP Calculation based on items avoiding expiration)
  const zeroWasteStreak = Math.max(0, stats.pantryCount - expiringItems.length);
  const levelInfo = getChefLevel(stats.mealsCooked);
  const userName = userEmail.split('@')[0]

  return (
    <main className="min-h-screen bg-cream selection:bg-tangerine selection:text-white pb-20">
      
      {/* Global Command Palette */}
      <CommandPalette 
        pantryItems={pantryItems} 
        history={history} 
        onNavigate={setActiveTab} 
      />

      {/* Hero Banner Area */}
      <div className="w-full bg-coffee relative overflow-hidden flex items-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-tangerine rounded-full mix-blend-overlay filter blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-tangerine p-3 rounded-2xl border-2 border-black hard-shadow-sm rotate-[-4deg]">
                <ChefHat className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                Kitchen<span className="text-tangerine">OS</span>
                {/* Search Hint Button */}
                <span className="hidden md:flex items-center gap-1.5 text-[10px] font-sans font-bold bg-white/10 text-white/80 px-2 py-1 rounded-md border border-white/20">
                  <Search className="w-3 h-3" /> CMD + K
                </span>
              </h1>
            </div>
          </div>

          {/* Frictionless Quick Add Buttons */}
          <div className="hidden sm:flex gap-3">
             <button 
               onClick={() => { setQuickAddTab('ingredient'); setIsQuickAddOpen(true); }} 
               className="bg-white text-coffee px-4 py-2 rounded-xl font-bold border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition-all flex items-center gap-2"
             >
               <Plus className="w-4 h-4" /> Ingredient
             </button>
             <button 
               onClick={() => { setQuickAddTab('meal'); setIsQuickAddOpen(true); }} 
               className="bg-tangerine text-white px-4 py-2 rounded-xl font-bold border-2 border-black hard-shadow-hover flex items-center gap-2"
             >
               <Plus className="w-4 h-4" /> Log Meal
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 -mt-10 relative z-20">
        
        {/* Control Panel (Stats, Progression & Settings) */}
        <header className="bg-white p-4 sm:p-6 rounded-3xl border-2 border-border hard-shadow-lg flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <span className="bg-coffee text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider">
                {levelInfo.title}
              </span>
              <p className="text-2xl font-black text-coffee truncate">
                {userName.charAt(0).toUpperCase() + userName.slice(1)}
              </p>
            </div>
            {/* Gamification Progress */}
            <div className="space-y-1 max-w-xs">
              <div className="flex justify-between text-[10px] font-bold text-coffee/60 uppercase">
                <span>Level Progress</span>
                {stats.mealsCooked < 30 && <span>{stats.mealsCooked} / {levelInfo.next} meals</span>}
              </div>
              <Progress value={levelInfo.progress} className="h-2 bg-muted [&>div]:bg-tangerine" />
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
             
             {/* Stat 1: Pantry */}
             <div className="flex-none bg-butter/30 px-5 py-3 rounded-2xl border-2 border-border/50 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setActiveTab('pantry')}>
                <div className="bg-butter p-2.5 rounded-xl text-coffee border-2 border-border/10">
                    <Package className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-coffee/60 font-black uppercase tracking-wider">In Pantry</p>
                    <p className="text-2xl font-black text-coffee leading-none">{stats.pantryCount}</p>
                </div>
             </div>

             {/* Stat 2: Cooked */}
             <div className="flex-none bg-lavender/30 px-5 py-3 rounded-2xl border-2 border-border/50 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setActiveTab('history')}>
                <div className="bg-lavender p-2.5 rounded-xl text-coffee border-2 border-border/10">
                    <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-coffee/60 font-black uppercase tracking-wider">Cooked</p>
                    <p className="text-2xl font-black text-coffee leading-none">{stats.mealsCooked}</p>
                </div>
             </div>

             {/* Stat 3: Zero-Waste Streak */}
             <div className="flex-none bg-emerald-100/50 px-5 py-3 rounded-2xl border-2 border-border/50 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="bg-emerald-200 p-2.5 rounded-xl text-emerald-900 border-2 border-border/10">
                    <Leaf className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-emerald-900/60 font-black uppercase tracking-wider">Items Saved</p>
                    <p className="text-2xl font-black text-emerald-900 leading-none">{zeroWasteStreak}</p>
                </div>
             </div>

             <div className="hidden md:block w-px h-10 bg-border/20 mx-2"></div>

             {/* User Actions */}
             <div className="flex items-center gap-2">
                <ProfileSettings initialProfile={profile} />
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="bg-white p-3 rounded-xl border-2 border-border hover:border-red-400 hard-shadow hover:translate-y-[2px] hover:shadow-none transition-all text-red-400 disabled:opacity-50"
                  title="Sign Out"
                >
                  {isSigningOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                </button>
             </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tab Switcher */}
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border-2 border-border/50 shadow-sm w-full sm:w-fit flex gap-1 relative z-10 overflow-x-auto scrollbar-hide">
                {(['overview', 'pantry', 'history'] as const).map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 capitalize ${
                          activeTab === tab 
                          ? 'bg-coffee text-white hard-shadow-sm scale-100' 
                          : 'bg-transparent text-coffee/50 hover:text-coffee hover:bg-muted/50 scale-95'
                      }`}
                  >
                      {tab === 'overview' ? 'Prep Station' : tab}
                  </button>
                ))}
            </div>

            {/* Content Container */}
            <div className="min-h-[500px]">
                {activeTab === 'overview' && (
                  <PrepStation 
                    pantryCount={stats.pantryCount} 
                    recentWin={recentWin} 
                    expiringItems={expiringItems} 
                    onSwitchTab={setActiveTab} 
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

          {/* SIDEBAR: Chef Chat */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 z-20">
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

      {/* Global Quick Add Modal */}
      <QuickAddModal 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
        defaultTab={quickAddTab} 
      />
    </main>
  )
}