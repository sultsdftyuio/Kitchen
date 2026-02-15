// components/prep-station.tsx
"use client"

import { Clock, Star, AlertTriangle, ArrowRight, ChefHat, CalendarDays, PlusCircle, Sun, Moon, Sunrise } from "lucide-react"

export function PrepStation({ 
  pantryCount, 
  expiringItems, 
  recentWin,
  onSwitchTab
}: { 
  pantryCount: number, 
  expiringItems: any[], 
  recentWin: any,
  onSwitchTab: (tab: 'pantry' | 'history') => void
}) {
  
  // 4. Time Contextual Awareness Logic
  const getGreetingContext = () => {
    const hour = new Date().getHours()
    if (hour < 11) return { greeting: "Good morning", icon: Sunrise, context: "Time for a fresh start. Need breakfast ideas?" }
    if (hour < 17) return { greeting: "Good afternoon", icon: Sun, context: "Lunch rush or prepping for dinner?" }
    return { greeting: "Good evening", icon: Moon, context: "Winding down. Let's make dinner spectacular." }
  }

  const { greeting, icon: TimeIcon, context } = getGreetingContext()

  // 5. Weekly Canvas Logic (Dates for the next 3 days)
  const getNextDays = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    return [0, 1, 2].map(offset => {
      const d = new Date(today)
      d.setDate(today.getDate() + offset)
      return offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : days[d.getDay()]
    })
  }
  const nextThreeDays = getNextDays()

  if (pantryCount === 0 && !recentWin) {
    return (
      <div className="bg-white p-8 rounded-3xl border-2 border-border hard-shadow flex flex-col items-center text-center space-y-4 animate-in fade-in duration-500">
        <div className="bg-butter p-4 rounded-full border-2 border-border mb-2">
          <ChefHat className="w-10 h-10 text-coffee" />
        </div>
        <h3 className="text-2xl font-black text-coffee">Your kitchen is a blank canvas!</h3>
        <p className="text-coffee/70 max-w-md">
          To get the best out of KitchenOS, start by adding a few staples you already have, or log your first cooked meal.
        </p>
        <button 
          onClick={() => onSwitchTab('pantry')}
          className="mt-4 bg-tangerine text-white px-6 py-3 rounded-xl font-bold border-2 border-border hard-shadow-hover"
        >
          Add First Ingredients
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Time Contextual Greeting */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border-2 border-border hard-shadow-sm">
        <div className="bg-muted p-2.5 rounded-xl border border-border/20">
          <TimeIcon className="w-6 h-6 text-tangerine" />
        </div>
        <div>
          <h2 className="font-black text-coffee text-xl">{greeting}, Chef.</h2>
          <p className="text-sm font-bold text-coffee/60">{context}</p>
        </div>
      </div>

      {/* Recipe of the Day Callout */}
      <div className="bg-coffee p-6 sm:p-8 rounded-3xl border-2 border-border hard-shadow-lg relative overflow-hidden group cursor-pointer hover:bg-coffee-dark transition-colors">
        <div className="absolute right-0 top-0 w-48 h-48 bg-tangerine rounded-full mix-blend-overlay filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
        <div className="relative z-10 space-y-2">
          <p className="text-tangerine font-black uppercase tracking-widest text-xs flex items-center gap-2">
            <Star className="w-4 h-4" /> AI Suggestion
          </p>
          <h2 className="text-3xl font-black text-white">Chef's Special</h2>
          <p className="text-cream/80 max-w-md">
            Based on your {pantryCount} pantry items, the AI is ready to generate a custom recipe for you right now.
          </p>
          <div className="pt-4">
            <span className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors">
              Ask AI in chat <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* The Weekly Canvas */}
      <div className="bg-white p-6 rounded-3xl border-2 border-border hard-shadow">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-tangerine" />
          <h3 className="font-black text-coffee text-lg">The Weekly Canvas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextThreeDays.map((day, idx) => (
            <div key={day} className={`p-4 rounded-2xl border-2 border-dashed ${idx === 0 ? 'bg-cream border-tangerine/40' : 'bg-muted/30 border-border/20'} flex flex-col items-center justify-center text-center space-y-2 min-h-[120px] transition-colors hover:bg-muted/50`}>
              <span className="text-xs font-black uppercase tracking-widest text-coffee/50">{day}</span>
              <button className="flex items-center gap-1.5 text-sm font-bold text-coffee bg-white px-3 py-1.5 rounded-lg border border-border/20 hard-shadow-sm hover:translate-y-[1px] hover:shadow-none transition-all">
                <PlusCircle className="w-4 h-4 text-tangerine" /> Plan Meal
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Expiring Soon */}
        <div className="bg-white p-6 rounded-3xl border-2 border-border hard-shadow flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-black text-coffee text-lg">Use It Or Lose It</h3>
          </div>
          {expiringItems.length > 0 ? (
            <ul className="space-y-3 flex-1">
              {expiringItems.map(item => (
                <li key={item.id} className="flex justify-between items-center bg-muted/50 p-3 rounded-xl border border-border/20">
                  <span className="font-bold text-coffee capitalize">{item.name}</span>
                  <span className="text-xs font-bold text-coffee/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Older than 7 days
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 flex items-center justify-center text-coffee/50 font-bold text-sm bg-muted/30 rounded-xl border border-dashed border-border/30 p-4">
              Your pantry is looking fresh!
            </div>
          )}
        </div>

        {/* Recent Win */}
        <div className="bg-white p-6 rounded-3xl border-2 border-border hard-shadow flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h3 className="font-black text-coffee text-lg">Recent 5-Star Win</h3>
          </div>
          {recentWin ? (
             <div className="flex-1 bg-butter/30 p-4 rounded-xl border border-border/20 flex flex-col justify-center">
               <h4 className="font-black text-xl text-coffee capitalize mb-1">{recentWin.dish_name}</h4>
               {recentWin.notes && (
                 <p className="text-sm text-coffee/70 italic line-clamp-2">"{recentWin.notes}"</p>
               )}
               <p className="text-xs font-bold text-coffee/50 mt-4">
                 Cooked on {new Date(recentWin.cooked_at).toLocaleDateString()}
               </p>
             </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center text-coffee/50 bg-muted/30 rounded-xl border border-dashed border-border/30 p-4">
               <p className="font-bold text-sm mb-2">No 5-star meals yet.</p>
               <button onClick={() => onSwitchTab('history')} className="text-xs text-tangerine hover:underline font-bold">Log a masterpiece</button>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}