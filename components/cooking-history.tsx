// components/cooking-history.tsx
"use client"

import { logMeal, deleteMeal } from "@/app/actions/history"
import { Trash2, Star, Calendar, Check, PenTool, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type HistoryItem = {
  id: number
  dish_name: string
  rating: number
  notes: string | null
  cooked_at: string
}

type PantryItem = {
  id: number
  item_name: string 
  quantity: string
}

export function CookingHistory({ 
  initialHistory,
  pantryItems,
  prefillDishName 
}: { 
  initialHistory: HistoryItem[],
  pantryItems: PantryItem[],
  prefillDishName?: string
}) {
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([])
  const [dishName, setDishName] = useState(prefillDishName || "")
  
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    if (prefillDishName) setDishName(prefillDishName)
  }, [prefillDishName])

  const toggleIngredient = (id: number) => {
    setSelectedIngredients(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Log Meal Form (Premium SaaS Card) */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        
        <div className="flex items-center gap-4 mb-6">
           <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-700">
               <PenTool className="w-5 h-5" />
           </div>
           <div>
               <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Log a Masterpiece</h3>
               <p className="text-slate-500 text-sm font-medium mt-0.5">Record what you cooked to track your culinary journey.</p>
           </div>
        </div>
        
        <form 
          action={async (formData) => {
            await logMeal(formData)
            setSelectedIngredients([]) 
            setDishName("") 
            setRating(5)
          }} 
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <input
              name="dish_name"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              type="text"
              placeholder="What did you cook? (e.g., Spicy Garlic Noodles)"
              required
              className="flex-1 w-full bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm"
            />
            
            <input type="hidden" name="rating" value={rating} />
            
            {/* Elegant Interactive Stars */}
            <div className="flex items-center justify-between gap-4 bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm shrink-0 h-[50px]">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Rating</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95 p-0.5"
                        >
                            <Star 
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    (hoverRating || rating) >= star 
                                        ? "fill-yellow-400 text-yellow-400" 
                                        : "fill-transparent text-slate-300"
                                )} 
                            />
                        </button>
                    ))}
                </div>
            </div>
          </div>
          
          {/* Used Ingredients Selector */}
          {pantryItems.length > 0 && (
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Mark ingredients used (removes from pantry)
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin pr-2">
                {pantryItems.map((item) => {
                  const isSelected = selectedIngredients.includes(item.id)
                  return (
                    <label 
                      key={item.id}
                      className={cn(
                        "cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 select-none",
                        isSelected 
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm"
                      )}
                    >
                      <input 
                        type="checkbox" 
                        name="used_items" 
                        value={item.id} 
                        checked={isSelected}
                        onChange={() => toggleIngredient(item.id)}
                        className="hidden" 
                      />
                      {item.item_name}
                      {isSelected && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full ml-1" />}
                    </label>
                  )
                })}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              name="notes"
              type="text"
              placeholder="Any notes? (e.g., Needs a squeeze of lime next time)"
              className="flex-1 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 transition-all text-sm font-medium"
            />
            <button
              type="submit"
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md active:scale-[0.98] transition-all font-semibold text-sm whitespace-nowrap flex items-center justify-center"
            >
              Log Meal
            </button>
          </div>
        </form>
      </div>

      {/* History List */}
      <div className="space-y-5">
        <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2 px-1">
            <BookOpen className="w-5 h-5 text-slate-400" /> Past Creations
        </h4>

        {initialHistory?.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-[24px] text-slate-500 font-medium text-sm">
                No meals logged yet. Get cooking!
            </div>
        ) : (
             <div className="grid gap-4 md:grid-cols-2">
             {initialHistory?.map((meal, idx) => (
               <div
                 key={meal.id}
                 className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group flex flex-col justify-between"
               >
                 <div className="flex items-start justify-between gap-4 mb-3">
                   <div className="flex-1">
                     <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-1.5 group-hover:text-tangerine transition-colors">{meal.dish_name}</h3>
                     
                     <div className="flex gap-0.5 text-yellow-400">
                       {[...Array(5)].map((_, i) => (
                         <Star 
                            key={i} 
                            className={cn(
                                "w-3.5 h-3.5", 
                                i < meal.rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-slate-200"
                            )} 
                         />
                       ))}
                     </div>
                   </div>
                   
                   <form action={deleteMeal.bind(null, meal.id)}>
                     <button type="submit" className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all" title="Delete record">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </form>
                 </div>

                 {meal.notes && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative mt-2 mb-4">
                        <p className="text-slate-600 text-[13px] italic leading-relaxed">"{meal.notes}"</p>
                    </div>
                 )}
                 
                 <div className="mt-auto flex items-center gap-1.5 text-[11px] text-slate-400 font-medium uppercase tracking-wider pt-2 border-t border-slate-50">
                   <Calendar className="w-3.5 h-3.5 opacity-70" />
                   {new Date(meal.cooked_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                 </div>
               </div>
             ))}
             </div>
        )}
      </div>
    </div>
  )
}