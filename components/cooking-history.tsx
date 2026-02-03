// components/cooking-history.tsx
"use client"

import { logMeal, deleteMeal } from "@/app/actions/history"
import { Trash2, Star, ChefHat, Calendar, Check, PenTool } from "lucide-react"
import { useState, useEffect } from "react"

// Types... (Same as before)
type HistoryItem = {
  id: number
  dish_name: string
  rating: number
  notes: string | null
  cooked_at: string
}

type PantryItem = {
  id: number
  item_name: string // changed name to item_name to match DB
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
  
  // Create a key to force re-render the input when prefill changes, 
  // or just use defaultValue with a controlled component.
  // Simple approach: Controlled input for dish name.
  const [dishName, setDishName] = useState(prefillDishName || "")

  useEffect(() => {
    if (prefillDishName) setDishName(prefillDishName)
  }, [prefillDishName])

  const toggleIngredient = (id: number) => {
    setSelectedIngredients(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Log Meal Form */}
      <div className="bg-white p-6 rounded-3xl border-2 border-border hard-shadow-lg ring-4 ring-cream">
        <div className="flex items-center gap-2 mb-4 text-coffee">
           <PenTool className="w-5 h-5" />
           <h3 className="font-bold">Log a new meal</h3>
        </div>
        
        <form 
          action={async (formData) => {
            await logMeal(formData)
            setSelectedIngredients([]) 
            setDishName("") 
          }} 
          className="flex flex-col gap-4"
        >
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <input
              name="dish_name"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              type="text"
              placeholder="What did you cook?"
              required
              className="flex-1 bg-muted px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee font-medium"
            />
            <select
              name="rating"
              className="w-full sm:w-32 bg-muted px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee appearance-none"
            >
              <option value="5">5 ★</option>
              <option value="4">4 ★</option>
              <option value="3">3 ★</option>
              <option value="2">2 ★</option>
              <option value="1">1 ★</option>
            </select>
          </div>
          
          {/* Used Ingredients Selector */}
          {pantryItems.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-coffee uppercase tracking-wider">
                Mark ingredients used (removes from pantry):
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto py-1 scrollbar-thin">
                {pantryItems.map((item) => {
                  const isSelected = selectedIngredients.includes(item.id)
                  return (
                    <label 
                      key={item.id}
                      className={`
                        cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all flex items-center gap-2 select-none
                        ${isSelected 
                          ? 'bg-coffee text-white border-coffee' 
                          : 'bg-white text-coffee border-border hover:border-coffee/50'}
                      `}
                    >
                      <input 
                        type="checkbox" 
                        name="used_items" 
                        value={item.id} 
                        checked={isSelected}
                        onChange={() => toggleIngredient(item.id)}
                        className="hidden" 
                      />
                      {isSelected && <Check className="w-3 h-3" />}
                      {item.item_name}
                    </label>
                  )
                })}
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <input
              name="notes"
              type="text"
              placeholder="Notes (optional)"
              className="flex-1 bg-muted px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee"
            />
            <button
              type="submit"
              className="bg-coffee text-white px-6 py-3 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 hover:shadow-none transition-all font-medium whitespace-nowrap"
            >
              Log Meal
            </button>
          </div>
        </form>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {initialHistory?.map((meal) => (
          <div
            key={meal.id}
            className="bg-white p-5 rounded-2xl border-2 border-border hard-shadow group"
          >
             {/* ... Same list rendering as before ... */}
             <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-coffee text-lg">{meal.dish_name}</h3>
                  <div className="flex text-tangerine">
                    {[...Array(meal.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                {meal.notes && (
                  <p className="text-coffee-dark/80 italic text-sm mb-2">"{meal.notes}"</p>
                )}
                <div className="flex items-center gap-1 text-xs text-coffee-dark/40 font-medium">
                  <Calendar className="w-3 h-3" />
                  {new Date(meal.cooked_at).toLocaleDateString()}
                </div>
              </div>
              
              <form action={deleteMeal.bind(null, meal.id)}>
                <button type="submit" className="text-coffee-dark/20 hover:text-destructive transition-colors p-2">
                  <Trash2 className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}