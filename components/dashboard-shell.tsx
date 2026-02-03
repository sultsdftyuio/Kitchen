// components/dashboard-shell.tsx
"use client"

import { useState } from "react"
import { DashboardChat } from "@/components/dashboard-chat"
import { PantryManager } from "@/components/pantry-manager"
import { CookingHistory } from "@/components/cooking-history"
import { Package, UtensilsCrossed, ChefHat } from "lucide-react"

export function DashboardShell({ 
  userEmail, 
  pantryItems, 
  history,
  stats 
}: { 
  userEmail: string
  pantryItems: any[]
  history: any[]
  stats: { pantryCount: number, mealsCooked: number }
}) {
  const [activeTab, setActiveTab] = useState<'pantry' | 'history'>('pantry')
  const [prefillDish, setPrefillDish] = useState("")

  const handleLogRecipe = (dishName: string) => {
    setPrefillDish(dishName)
    setActiveTab('history')
    // Scroll to top on mobile to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-cream p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Navigation / Header */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b-2 border-coffee/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="bg-tangerine p-2 rounded-lg border-2 border-black hard-shadow-sm rotate-3">
                    <ChefHat className="text-white w-6 h-6" />
                </div>
                <h1 className="font-serif text-4xl font-black text-coffee tracking-tight">
                Kitchen<span className="text-tangerine">OS</span>
                </h1>
            </div>
            <p className="text-coffee-dark/70 font-medium pl-1">
                Welcome back, <span className="font-bold text-coffee underline decoration-tangerine decoration-2 underline-offset-2">{userEmail.split('@')[0]}</span>
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <div className="flex-1 md:flex-none bg-white px-5 py-3 rounded-2xl border-2 border-border hard-shadow flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                <div className="bg-butter p-2 rounded-xl text-coffee border-2 border-border/10">
                    <Package className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-coffee-dark/60 font-black uppercase tracking-wider">In Pantry</p>
                    <p className="text-2xl font-black text-coffee leading-none">{stats.pantryCount}</p>
                </div>
             </div>
             <div className="flex-1 md:flex-none bg-white px-5 py-3 rounded-2xl border-2 border-border hard-shadow flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                <div className="bg-lavender p-2 rounded-xl text-coffee border-2 border-border/10">
                    <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-coffee-dark/60 font-black uppercase tracking-wider">Cooked</p>
                    <p className="text-2xl font-black text-coffee leading-none">{stats.mealsCooked}</p>
                </div>
             </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN CONTENT AREA (Left Side) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tab Switcher */}
            <div className="bg-white/50 p-1.5 rounded-2xl border-2 border-transparent w-full sm:w-fit flex gap-2">
                <button
                    onClick={() => setActiveTab('pantry')}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                        activeTab === 'pantry' 
                        ? 'bg-coffee text-white border-coffee shadow-md' 
                        : 'bg-white text-coffee/60 border-border hover:text-coffee hover:border-coffee/50'
                    }`}
                >
                    My Pantry
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                        activeTab === 'history' 
                        ? 'bg-tangerine text-white border-tangerine shadow-md' 
                        : 'bg-white text-coffee/60 border-border hover:text-coffee hover:border-coffee/50'
                    }`}
                >
                    Cooking History
                </button>
            </div>

            {/* Content Container */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
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

          {/* SIDEBAR: Chef Chat (Right Side) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 z-20">
             <div className="relative">
                {/* Decorative Elements behind chat */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-tangerine rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                
                <DashboardChat onLogRecipe={handleLogRecipe} />
             </div>
          </aside>

        </div>
      </div>
    </main>
  )
}