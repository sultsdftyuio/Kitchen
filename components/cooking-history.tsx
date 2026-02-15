// components/cooking-history.tsx
"use client"

import { logMeal, deleteMeal } from "@/app/actions/history"
import { Trash2, Star, Calendar, Check, PenTool } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Types Left Exactly As Original
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
  
  // Custom UI state for rating
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
    <div className="space-y-8">
      {/* Log Meal Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-border hard-shadow-lg relative overflow-hidden">
        
        <div className="flex items-center gap-3 mb-6">
           <div className="bg-coffee p-2.5 rounded-xl">
               <PenTool className="w-5 h-5 text-white" />
           </div>
           <div>
               <h3 className="font-serif text-2xl font-bold text-coffee">Log a masterpiece</h3>
               <p className="text-coffee/50 text-sm font-medium">Record what you cooked to track your journey.</p>
           </div>
        </div>
        
        <form 
          action={async (formData) => {
            // Unchanged action binding
            await logMeal(formData)
            setSelectedIngredients([]) 
            setDishName("") 
            setRating(5)
          }} 
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <input
              name="dish_name"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              type="text"
              placeholder="What did you cook? (e.g. Spicy Garlic Noodles)"
              required
              className="flex-1 w-full bg-muted/50 px-5 py-4 rounded-2xl border-2 border-transparent focus:outline-none focus:border-tangerine focus:bg-white text-coffee font-bold text-lg transition-all"
            />
            
            {/* Hidden native input ensures form data works exactly as before */}
            <input type="hidden" name="rating" value={rating} />
            
            {/* Custom Interactive Stars UI */}
            <div className="flex flex-col items-center justify-center bg-muted/50 px-5 py-3.5 rounded-2xl border-2 border-transparent">
                <span className="text-[10px] font-bold text-coffee/40 uppercase tracking-wider mb-1">Rating</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-125"
                        >
                            <Star 
                                className={cn(
                                    "w-6 h-6 transition-colors",
                                    (hoverRating || rating) >= star 
                                        ? "fill-tangerine text-tangerine" 
                                        : "fill-transparent text-coffee/20"
                                )} 
                            />
                        </button>
                    ))}
                </div>
            </div>
          </div>
          
          {/* Used Ingredients Selector */}
          {pantryItems.length > 0 && (
            <div className="bg-muted/30 p-4 rounded-2xl border-2 border-border/50">
              <label className="text-xs font-bold text-coffee uppercase tracking-wider flex items-center gap-2 mb-3">
                <Check className="w-4 h-4 text-tangerine" /> Mark ingredients used (removes from pantry)
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin pr-2">
                {pantryItems.map((item) => {
                  const isSelected = selectedIngredients.includes(item.id)
                  return (
                    <label 
                      key={item.id}
                      className={cn(
                        "cursor-pointer px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all flex items-center gap-2 select-none",
                        isSelected 
                        ? "bg-coffee text-white border-coffee shadow-sm scale-105" 
                        : "bg-white text-coffee border-border hover:border-coffee/40 hover:bg-muted/50"
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
                      {isSelected && <span className="w-1.5 h-1.5 bg-tangerine rounded-full ml-1" />}
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
              placeholder="Any notes? (e.g. Needs more salt next time)"
              className="flex-1 bg-muted/50 px-5 py-4 rounded-2xl border-2 border-transparent focus:outline-none focus:border-tangerine focus:bg-white text-coffee font-medium transition-all"
            />
            <button
              type="submit"
              className="bg-coffee text-white px-8 py-4 rounded-2xl border-2 border-border hard-shadow hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px] transition-all font-black whitespace-nowrap"
            >
              Log Meal
            </button>
          </div>
        </form>
      </div>

      {/* History List */}
      <div className="space-y-6">
        <h4 className="font-serif text-xl font-bold text-coffee flex items-center gap-2">
            <Calendar className="w-5 h-5 text-tangerine" /> Past Creations
        </h4>

        {initialHistory?.length === 0 ? (
            <div className="text-center py-12 bg-white/50 border-2 border-dashed border-border rounded-3xl text-coffee/50 font-medium">
                No meals logged yet. Get cooking!
            </div>
        ) : (
             <div className="grid gap-4 md:grid-cols-2">
             {initialHistory?.map((meal, idx) => (
               <div
                 key={meal.id}
                 className="bg-white p-6 rounded-3xl border-2 border-border shadow-sm hover:hard-shadow transition-all group animate-in fade-in slide-in-from-bottom-4"
                 style={{ animationDelay: `${idx * 50}ms` }}
               >
                 <div className="flex items-start justify-between gap-4">
                   <div className="flex-1">
                     <h3 className="font-black text-coffee text-xl mb-1 group-hover:text-tangerine transition-colors">{meal.dish_name}</h3>
                     
                     <div className="flex gap-1 mb-3 text-tangerine">
                       {[...Array(5)].map((_, i) => (
                         <Star 
                            key={i} 
                            className={cn(
                                "w-4 h-4", 
                                i < meal.rating ? "fill-tangerine text-tangerine" : "fill-muted text-muted"
                            )} 
                         />
                       ))}
                     </div>
                     
                     {meal.notes && (
                        <div className="bg-muted/50 p-3 rounded-xl border border-border/50 relative mt-2">
                            <span className="absolute -top-2 -left-1 text-2xl text-coffee/20 font-serif">"</span>
                            <p className="text-coffee-dark/70 text-sm font-medium relative z-10">{meal.notes}</p>
                        </div>
                     )}
                     
                     <div className="mt-4 flex items-center gap-1.5 text-xs text-coffee/40 font-bold uppercase tracking-wider">
                       <Calendar className="w-3.5 h-3.5" />
                       {new Date(meal.cooked_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                     </div>
                   </div>
                   
                   <form action={deleteMeal.bind(null, meal.id)}>
                     <button type="submit" className="text-coffee/20 hover:text-destructive hover:bg-red-50 p-2.5 rounded-xl transition-all">
                       <Trash2 className="w-5 h-5" />
                     </button>
                   </form>
                 </div>
               </div>
             ))}
             </div>
        )}
      </div>
    </div>
  )
}