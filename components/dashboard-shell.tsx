// components/dashboard-shell.tsx
"use client"

import { useState } from "react"
import { DashboardChat } from "@/components/dashboard-chat"
import { PantryManager } from "@/components/pantry-manager" 
import { CookingHistory } from "@/components/cooking-history"
import { ProfileSettings } from "@/components/profile-settings"
import { signOut } from "@/app/actions/auth"
import { Package, UtensilsCrossed, ChefHat, LogOut, Loader2, Sparkles } from "lucide-react"

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
      console.error("Sign out failed", error)
      setIsSigningOut(false)
    }
  }

  const userName = userEmail.split('@')[0]

  return (
    <main className="min-h-screen bg-cream selection:bg-tangerine selection:text-white pb-20">
      
      {/* Hero Banner Area */}
      <div className="w-full bg-coffee relative overflow-hidden flex items-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-tangerine rounded-full mix-blend-overlay filter blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl w-full mx-auto flex items-center gap-4 relative z-10">
          <div className="bg-tangerine p-3 rounded-2xl border-2 border-black hard-shadow-sm rotate-[-4deg] group-hover:rotate-0 transition-transform">
              <ChefHat className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-tight">
              Kitchen<span className="text-tangerine">OS</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 -mt-10 relative z-20">
        
        {/* Control Panel (Stats & Settings) */}
        <header className="bg-white p-4 sm:p-6 rounded-3xl border-2 border-border hard-shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-1 flex-1">
            <p className="text-coffee-dark/60 font-bold uppercase tracking-wider text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-tangerine" /> Welcome back,
            </p>
            <p className="text-2xl font-black text-coffee truncate">
              Chef {userName.charAt(0).toUpperCase() + userName.slice(1)}
            </p>
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full lg:w-auto">
             
             {/* Stat: Pantry */}
             <div className="flex-1 sm:flex-none bg-butter/30 px-5 py-3 rounded-2xl border-2 border-border/50 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="bg-butter p-2.5 rounded-xl text-coffee border-2 border-border/10">
                    <Package className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-coffee/60 font-black uppercase tracking-wider">In Pantry</p>
                    <p className="text-2xl font-black text-coffee leading-none">{stats.pantryCount}</p>
                </div>
             </div>

             {/* Stat: Cooked */}
             <div className="flex-1 sm:flex-none bg-lavender/30 px-5 py-3 rounded-2xl border-2 border-border/50 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="bg-lavender p-2.5 rounded-xl text-coffee border-2 border-border/10">
                    <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-coffee/60 font-black uppercase tracking-wider">Cooked</p>
                    <p className="text-2xl font-black text-coffee leading-none">{stats.mealsCooked}</p>
                </div>
             </div>

             <div className="hidden sm:block w-px h-10 bg-border/20 mx-2"></div>

             {/* User Actions */}
             <div className="flex items-center gap-2">
                <ProfileSettings initialProfile={profile} />
                
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="bg-white p-3 rounded-xl border-2 border-border hover:border-red-400 hard-shadow hover:translate-y-[2px] hover:shadow-none transition-all text-red-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
                  title="Sign Out"
                >
                  {isSigningOut ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <LogOut className="w-5 h-5" />
                  )}
                </button>
             </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tab Switcher */}
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border-2 border-border/50 shadow-sm w-full sm:w-fit flex gap-1 relative z-10">
                <button
                    onClick={() => setActiveTab('pantry')}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                        activeTab === 'pantry' 
                        ? 'bg-coffee text-white hard-shadow-sm scale-100' 
                        : 'bg-transparent text-coffee/50 hover:text-coffee hover:bg-muted/50 scale-95'
                    }`}
                >
                    My Pantry
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                        activeTab === 'history' 
                        ? 'bg-coffee text-white hard-shadow-sm scale-100' 
                        : 'bg-transparent text-coffee/50 hover:text-coffee hover:bg-muted/50 scale-95'
                    }`}
                >
                    Cooking History
                </button>
            </div>

            {/* Content Container */}
            <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'pantry' ? (
                    <PantryManager items={pantryItems} />
                ) : (
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
                
                <DashboardChat onLogRecipe={handleLogRecipe} />
             </div>
          </aside>

        </div>
      </div>
    </main>
  )
}