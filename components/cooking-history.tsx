// components/cooking-history.tsx
"use client"

import { logMeal, deleteMeal } from "@/app/actions/history"
import { Trash2, Star, ChefHat, Calendar, Check } from "lucide-react"
import { useState } from "react"

type HistoryItem = {
  id: number
  dish_name: string
  rating: number
  notes: string | null
  cooked_at: string
}

type PantryItem = {
  id: number
  name: string
  quantity: string
}

export function CookingHistory({ 
  initialHistory,
  pantryItems 
}: { 
  initialHistory: HistoryItem[],
  pantryItems: PantryItem[]
}) {
  // State for the multi-select
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([])

  const toggleIngredient = (id: number) => {
    setSelectedIngredients(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-tangerine rounded-lg text-white">
          <ChefHat className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-coffee">
          Cooking <span className="text-tangerine">History</span>
        </h2>
      </div>

      {/* Log Meal Form */}
      <div className="bg-white p-6 rounded-3xl border-2 border-border hard-shadow-lg">
        <h3 className="font-bold text-coffee mb-4">Log a new meal</h3>
        <form 
          action={async (formData) => {
            await logMeal(formData)
            setSelectedIngredients([]) // Reset selection after submit
          }} 
          className="flex flex-col gap-4"
        >
          {/* Main Inputs */}
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <input
              name="dish_name"
              type="text"
              placeholder="What did you cook?"
              required
              className="flex-1 bg-muted px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee"
            />
            <select
              name="rating"
              className="w-full sm:w-32 bg-muted px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee appearance-none"
            >
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>
          </div>
          
          {/* Used Ingredients Selector */}
          {pantryItems.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-coffee uppercase tracking-wider">
                Did you use any pantry items? (They will be removed)
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto py-1">
                {pantryItems.map((item) => {
                  const isSelected = selectedIngredients.includes(item.id)
                  return (
                    <label 
                      key={item.id}
                      className={`
                        cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all flex items-center gap-2
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
                      {item.name}
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
                <button
                  type="submit"
                  className="text-coffee-dark/20 hover:text-destructive transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        ))}

        {(!initialHistory || initialHistory.length === 0) && (
          <div className="text-center py-8 text-coffee-dark/50 border-2 border-dashed border-border rounded-2xl">
            <p>No meals logged yet. Get cooking!</p>
          </div>
        )}
      </div>
    </div>
  )
}