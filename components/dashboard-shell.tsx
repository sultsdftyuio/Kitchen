// components/dashboard-shell.tsx
"use client"

import { useState } from "react"
import { DashboardChat } from "@/components/dashboard-chat"
import { PantryManager } from "@/components/pantry-manager"
import { CookingHistory } from "@/components/cooking-history"
import { Package, UtensilsCrossed } from "lucide-react"

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
  }

  return (
    <main className="min-h-screen bg-cream p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-coffee">
              Kitchen<span className="text-tangerine">OS</span>
            </h1>
            <p className="text-coffee-dark/60 font-medium">{userEmail}'s Kitchen</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white px-4 py-2 rounded-xl border-2 border-border hard-shadow flex items-center gap-3">
                <div className="bg-muted p-1.5 rounded-lg text-coffee">
                    <Package className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs text-coffee-dark/60 font-bold uppercase">Pantry</p>
                    <p className="text-lg font-bold text-coffee leading-none">{stats.pantryCount}</p>
                </div>
             </div>
             <div className="bg-white px-4 py-2 rounded-xl border-2 border-border hard-shadow flex items-center gap-3">
                <div className="bg-muted p-1.5 rounded-lg text-coffee">
                    <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs text-coffee-dark/60 font-bold uppercase">Meals</p>
                    <p className="text-lg font-bold text-coffee leading-none">{stats.mealsCooked}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Custom Tab Switcher */}
            <div className="flex p-1.5 bg-white border-2 border-border rounded-xl w-fit hard-shadow-sm">
                <button
                    onClick={() => setActiveTab('pantry')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${
                        activeTab === 'pantry' 
                        ? 'bg-coffee text-white shadow-sm' 
                        : 'text-coffee/60 hover:text-coffee'
                    }`}
                >
                    My Pantry
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${
                        activeTab === 'history' 
                        ? 'bg-tangerine text-white shadow-sm' 
                        : 'text-coffee/60 hover:text-coffee'
                    }`}
                >
                    Cooking History
                </button>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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

          {/* RIGHT COLUMN: Chef Chat */}
          <div className="lg:col-span-1">
             <DashboardChat onLogRecipe={handleLogRecipe} />
          </div>

        </div>
      </div>
    </main>
  )
}