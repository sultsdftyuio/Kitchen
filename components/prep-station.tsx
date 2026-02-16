// components/prep-station.tsx
"use client"

import { useState, useEffect } from "react"
import { Clock, Star, AlertTriangle, ArrowRight, CalendarDays, PlusCircle, Sun, Moon, Sunrise, Check, X, Edit2, Plus, UtensilsCrossed, Package, Leaf } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PrepStationProps {
  pantryItems: any[];
  pantryCount: number;
  expiringItems: any[];
  recentWin: any;
  stats: { pantryCount: number, mealsCooked: number };
  levelInfo: { title: string, next: number, progress: number };
  zeroWasteStreak: number;
  userName: string;
  onSwitchTab: (tab: 'pantry' | 'history') => void;
  onOpenQuickAdd: (tab: 'ingredient' | 'meal') => void;
}

export function PrepStation({ 
  pantryItems,
  pantryCount, 
  expiringItems, 
  recentWin,
  stats,
  levelInfo,
  zeroWasteStreak,
  userName,
  onSwitchTab,
  onOpenQuickAdd
}: PrepStationProps) {
  
  const [plannedMeals, setPlannedMeals] = useState<Record<string, string>>({})
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    try {
      const saved = localStorage.getItem("kitchenOS_meal_plan")
      if (saved) setPlannedMeals(JSON.parse(saved))
    } catch (e) {}
  }, [])

  const handleSavePlan = (dateKey: string) => {
    const updated = { ...plannedMeals }
    editValue.trim() === "" ? delete updated[dateKey] : updated[dateKey] = editValue.trim()
    setPlannedMeals(updated)
    localStorage.setItem("kitchenOS_meal_plan", JSON.stringify(updated))
    setEditingDay(null)
  }

  const getGreetingContext = () => {
    const hour = new Date().getHours()
    if (hour < 11) return { greeting: "Good morning", icon: Sunrise, context: "Ready for a fresh start?" }
    if (hour < 17) return { greeting: "Good afternoon", icon: Sun, context: "Prepping for the dinner rush?" }
    return { greeting: "Good evening", icon: Moon, context: "Let's make dinner spectacular." }
  }

  const { greeting, icon: TimeIcon, context } = getGreetingContext()

  const getNextDays = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    return [0, 1, 2].map(offset => {
      const d = new Date(today)
      d.setDate(today.getDate() + offset)
      return { label: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : days[d.getDay()], dateKey: d.toISOString().split('T')[0] }
    })
  }
  const nextThreeDays = getNextDays()

  // Reusable card class for SaaS aesthetic
  const saasCard = "bg-white rounded-[24px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col justify-between transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 auto-rows-auto animate-in fade-in duration-700">
      
      {/* TILE 1: Welcome & Quick Actions */}
      <div className={`col-span-1 md:col-span-2 ${saasCard} gap-6`}>
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-2xl text-tangerine">
                    <TimeIcon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="font-semibold text-slate-900 text-2xl tracking-tight">{greeting}, <span className="capitalize">{userName}</span>.</h2>
                    <p className="text-sm text-slate-500 mt-1">{context}</p>
                </div>
            </div>
        </div>
        <div className="flex flex-wrap gap-3">
            <button onClick={() => onOpenQuickAdd('ingredient')} className="flex-1 bg-white text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Ingredient
            </button>
            <button onClick={() => onOpenQuickAdd('meal')} className="flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> Log Meal
            </button>
        </div>
      </div>

      {/* TILE 2: Gamification & Stats */}
      <div className={`${saasCard} gap-4 bg-gradient-to-b from-white to-slate-50/50`}>
        <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-900 font-semibold text-sm tracking-tight">{levelInfo.title}</span>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Lvl {Math.floor(stats.mealsCooked / 5) + 1}</span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Progress</span>
                    <span>{stats.mealsCooked} / {levelInfo.next}</span>
                </div>
                <Progress value={levelInfo.progress} className="h-1.5 bg-slate-100 [&>div]:bg-tangerine" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-slate-800">{stats.pantryCount}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">Items</p>
            </div>
            <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-emerald-700">{zeroWasteStreak}</p>
                <p className="text-[10px] font-medium text-emerald-600/70 uppercase tracking-wider mt-0.5">Saved</p>
            </div>
        </div>
      </div>

      {/* TILE 3: The Weekly Canvas */}
      <div className={`col-span-1 md:col-span-2 xl:col-span-3 ${saasCard}`}>
        <div className="flex items-center gap-2 mb-5">
          <CalendarDays className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-slate-900 text-base">Meal Planner</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {nextThreeDays.map((day, idx) => {
            const isEditing = editingDay === day.dateKey;
            const plannedMeal = plannedMeals[day.dateKey];
            return (
              <div key={day.dateKey} className={`p-4 rounded-2xl border ${idx === 0 ? 'bg-orange-50/30 border-orange-200/50' : 'bg-slate-50/50 border-slate-200/60'} flex flex-col items-center justify-center text-center space-y-3 min-h-[110px] transition-colors hover:bg-slate-50 relative group`}>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{day.label}</span>
                
                {isMounted && isEditing ? (
                  <div className="flex items-center gap-1 w-full bg-white rounded-xl p-1 shadow-sm border border-slate-200 z-10">
                    <input type="text" autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSavePlan(day.dateKey); if (e.key === 'Escape') setEditingDay(null); }} className="w-full text-sm font-medium text-slate-900 bg-transparent border-none outline-none px-2 py-1 placeholder:text-slate-300" placeholder="Type meal..." />
                    <button onClick={() => handleSavePlan(day.dateKey)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Check className="w-3.5 h-3.5" /></button>
                  </div>
                ) : isMounted && plannedMeal ? (
                  <div className="flex flex-col items-center gap-1 w-full">
                    <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">{plannedMeal}</p>
                    <button onClick={() => { setEditValue(plannedMeal); setEditingDay(day.dateKey); }} className="md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-400 hover:text-tangerine"><Edit2 className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <button onClick={() => { setEditValue(""); setEditingDay(day.dateKey); }} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:text-slate-900 transition-all"><PlusCircle className="w-3.5 h-3.5 text-slate-400" /> Plan Meal</button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* TILE 4: Chef's Special (The Sleek Dark Mode AI Card) */}
      <div className="col-span-1 md:col-span-2 bg-[#0F172A] p-7 rounded-[24px] shadow-lg relative overflow-hidden group flex flex-col justify-between border border-slate-800">
        {/* Subtle, highly refined glows */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-tangerine/20 rounded-full mix-blend-screen filter blur-[80px] group-hover:bg-tangerine/30 transition-colors duration-700"></div>
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full mix-blend-screen filter blur-[60px]"></div>
        
        <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 mb-2">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-slate-200 font-semibold text-[10px] uppercase tracking-wider">AI Suggestion</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Chef's Special</h2>
            <p className="text-slate-400 text-sm max-w-[85%] leading-relaxed">Let the KitchenOS AI generate a custom recipe based strictly on the {pantryCount} items you have right now.</p>
        </div>
        
        <div className="relative z-10 mt-6">
            <button className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:bg-slate-100 hover:scale-[1.02] transition-all cursor-pointer">
                Generate Recipe <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
        </div>
      </div>

      {/* TILE 5: Mini Pantry / Expiring Status */}
      <div className={`${saasCard} bg-slate-50/30`}>
          <div>
            <div className="flex items-center gap-2 mb-5 text-slate-900">
                <Package className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-base">Inventory Status</h3>
            </div>
            {expiringItems.length > 0 ? (
                <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm mb-4">
                    <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5 mb-2"><AlertTriangle className="w-3.5 h-3.5" /> {expiringItems.length} items expiring</p>
                    <p className="text-sm font-medium text-slate-800 capitalize line-clamp-1">{expiringItems[0].name}</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm mb-4 flex items-center gap-3">
                    <div className="bg-emerald-50 p-2 rounded-full"><Leaf className="w-4 h-4 text-emerald-600" /></div>
                    <p className="text-sm font-medium text-slate-800">Your pantry is fresh</p>
                </div>
            )}
          </div>
          <button onClick={() => onSwitchTab('pantry')} className="w-full bg-white text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 shadow-sm hover:text-slate-900 hover:bg-slate-50 transition-colors">
            Manage Full Pantry
          </button>
      </div>

    </div>
  )
}