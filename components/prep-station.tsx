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
    if (hour < 11) return { greeting: "Good morning", icon: Sunrise, context: "Time for a fresh start." }
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 auto-rows-auto animate-in fade-in duration-500">
      
      {/* TILE 1: Welcome & Quick Actions (Spans 2 columns) */}
      <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-3xl border-2 border-border hard-shadow flex flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-2xl border border-border/20">
                    <TimeIcon className="w-8 h-8 text-tangerine" />
                </div>
                <div>
                    <h2 className="font-black text-coffee text-2xl sm:text-3xl">{greeting}, <span className="capitalize">{userName}</span>.</h2>
                    <p className="text-sm font-bold text-coffee/60">{context}</p>
                </div>
            </div>
        </div>
        <div className="flex flex-wrap gap-3">
            <button onClick={() => onOpenQuickAdd('ingredient')} className="flex-1 bg-cream text-coffee px-4 py-3 rounded-xl font-bold border-2 border-border hard-shadow-sm hover:bg-butter transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Ingredient
            </button>
            <button onClick={() => onOpenQuickAdd('meal')} className="flex-1 bg-tangerine text-white px-4 py-3 rounded-xl font-bold border-2 border-black hard-shadow-sm hover:shadow-none hover:translate-y-[2px] transition-all flex items-center justify-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> Log Meal
            </button>
        </div>
      </div>

      {/* TILE 2: Gamification & Stats */}
      <div className="col-span-1 bg-lavender/30 p-6 rounded-3xl border-2 border-border hard-shadow flex flex-col justify-between gap-4">
        <div>
            <span className="bg-coffee text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider">
                {levelInfo.title}
            </span>
            <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs font-bold text-coffee/60 uppercase">
                    <span>Level Progress</span>
                    <span>{stats.mealsCooked}/{levelInfo.next}</span>
                </div>
                <Progress value={levelInfo.progress} className="h-2 bg-white/50 [&>div]:bg-tangerine" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-white/60 p-3 rounded-xl border border-white/40 text-center">
                <p className="text-xl font-black text-coffee">{stats.pantryCount}</p>
                <p className="text-[10px] font-bold text-coffee/50 uppercase">Items</p>
            </div>
            <div className="bg-emerald-100/50 p-3 rounded-xl border border-emerald-200/50 text-center">
                <p className="text-xl font-black text-emerald-800">{zeroWasteStreak}</p>
                <p className="text-[10px] font-bold text-emerald-800/50 uppercase">Saved</p>
            </div>
        </div>
      </div>

      {/* TILE 3: The Weekly Canvas (Wide) */}
      <div className="col-span-1 md:col-span-2 xl:col-span-3 bg-white p-6 rounded-3xl border-2 border-border hard-shadow">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-tangerine" />
          <h3 className="font-black text-coffee text-lg">The Weekly Canvas</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {nextThreeDays.map((day, idx) => {
            const isEditing = editingDay === day.dateKey;
            const plannedMeal = plannedMeals[day.dateKey];
            return (
              <div key={day.dateKey} className={`p-4 rounded-2xl border-2 ${idx === 0 ? 'bg-cream border-tangerine/40 border-dashed' : 'bg-muted/30 border-border/20 border-dashed'} flex flex-col items-center justify-center text-center space-y-2 min-h-[100px] transition-colors hover:bg-muted/50 relative group`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-coffee/50">{day.label}</span>
                
                {isMounted && isEditing ? (
                  <div className="flex items-center gap-1 w-full bg-white rounded-lg p-1 border border-tangerine hard-shadow-sm z-10">
                    <input type="text" autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSavePlan(day.dateKey); if (e.key === 'Escape') setEditingDay(null); }} className="w-full text-sm font-bold text-coffee bg-transparent border-none outline-none px-2 py-1 placeholder:text-coffee/30" />
                    <button onClick={() => handleSavePlan(day.dateKey)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"><Check className="w-4 h-4" /></button>
                  </div>
                ) : isMounted && plannedMeal ? (
                  <div className="flex flex-col items-center gap-1 w-full">
                    <p className="text-sm font-bold text-coffee leading-snug line-clamp-2">{plannedMeal}</p>
                    <button onClick={() => { setEditValue(plannedMeal); setEditingDay(day.dateKey); }} className="md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1.5 bg-white rounded-md border border-border/20 text-coffee/50 hover:text-tangerine"><Edit2 className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <button onClick={() => { setEditValue(""); setEditingDay(day.dateKey); }} className="flex items-center gap-1.5 text-xs font-bold text-coffee bg-white px-3 py-1.5 rounded-lg border border-border/20 hard-shadow-sm hover:shadow-none hover:translate-y-[1px] transition-all"><PlusCircle className="w-3.5 h-3.5 text-tangerine" /> Plan Meal</button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* TILE 4: Chef's Special (AI Spotlight) */}
      <div className="col-span-1 md:col-span-2 bg-coffee p-6 rounded-3xl border-2 border-border hard-shadow relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-48 h-48 bg-tangerine rounded-full mix-blend-overlay filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
        <div className="relative z-10 space-y-2 flex flex-col h-full justify-between">
            <div>
                <p className="text-tangerine font-black uppercase tracking-widest text-[10px] flex items-center gap-2 mb-2"><Star className="w-3 h-3" /> AI Suggestion</p>
                <h2 className="text-2xl font-black text-white">Chef's Special</h2>
                <p className="text-cream/80 text-sm mt-2 max-w-[80%]">Generate a custom recipe based on the {pantryCount} items in your pantry right now.</p>
            </div>
            <div className="pt-4">
                <span className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl font-bold text-sm backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors cursor-pointer">
                    Ask AI in chat <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </div>
      </div>

      {/* TILE 5: Mini Pantry / Expiring */}
      <div className="col-span-1 bg-butter/30 p-6 rounded-3xl border-2 border-border hard-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-coffee">
                <Package className="w-5 h-5" />
                <h3 className="font-black text-lg">Pantry Status</h3>
            </div>
            {expiringItems.length > 0 ? (
                <div className="bg-white/60 rounded-xl p-3 border border-red-200/50 mb-4">
                    <p className="text-xs font-bold text-red-500 flex items-center gap-1 mb-2"><AlertTriangle className="w-3 h-3" /> {expiringItems.length} items expiring soon</p>
                    <p className="text-sm font-bold text-coffee capitalize line-clamp-1">{expiringItems[0].name}</p>
                </div>
            ) : (
                <div className="bg-white/60 rounded-xl p-3 border border-emerald-200/50 mb-4">
                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Leaf className="w-3 h-3" /> Pantry is fresh</p>
                </div>
            )}
          </div>
          <button onClick={() => onSwitchTab('pantry')} className="w-full bg-white text-coffee px-4 py-2 rounded-xl text-sm font-bold border-2 border-border hard-shadow-sm hover:bg-muted transition-colors text-center">
            Manage Full Pantry
          </button>
      </div>

    </div>
  )
}