// components/quick-add-modal.tsx
"use client"

import { useState } from "react"
import { addToPantry } from "@/app/actions/pantry"
import { logMeal } from "@/app/actions/history"
import { toast } from "sonner" 
import { X, Package, UtensilsCrossed, Loader2 } from "lucide-react"

export function QuickAddModal({ 
  isOpen, 
  onClose, 
  defaultTab = 'ingredient' 
}: { 
  isOpen: boolean, 
  onClose: () => void,
  defaultTab?: 'ingredient' | 'meal'
}) {
  // 1. ALL HOOKS MUST BE AT THE TOP LEVEL
  const [activeTab, setActiveTab] = useState<'ingredient' | 'meal'>(defaultTab)
  const [isLoading, setIsLoading] = useState(false)

  // Ingredient Form State
  const [itemName, setItemName] = useState("")
  const [amount, setAmount] = useState("1")

  // Meal Form State
  const [dishName, setDishName] = useState("")
  const [rating, setRating] = useState(5)
  const [notes, setNotes] = useState("")

  // 2. EARLY RETURN GOES *AFTER* ALL HOOKS
  if (!isOpen) return null

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName.trim()) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append("item_name", itemName)
    formData.append("quantity", amount)

    try {
      await addToPantry(formData)
      toast.success("Added!", { description: `${amount}x ${itemName} added to pantry.` }) 
      setItemName("")
      setAmount("1")
      onClose()
    } catch (err: any) {
      toast.error("Error", { description: err.message || "Failed to add ingredient" }) 
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dishName.trim()) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append("dish_name", dishName)
    formData.append("rating", rating.toString())
    formData.append("notes", notes)

    try {
      await logMeal(formData)
      toast.success("Logged!", { description: `${dishName} added to history.` }) 
      setDishName("")
      setRating(5)
      setNotes("")
      onClose()
    } catch (err: any) {
      toast.error("Error", { description: err.message || "Failed to log meal" }) 
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md border-2 border-border hard-shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-coffee p-4 flex justify-between items-center border-b-2 border-border">
          <h2 className="text-white font-black text-xl">Quick Add</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-border">
          <button 
            type="button"
            onClick={() => setActiveTab('ingredient')}
            className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'ingredient' ? 'bg-butter text-coffee' : 'bg-muted/30 text-coffee/50 hover:bg-muted/50'}`}
          >
            <Package className="w-4 h-4" /> Ingredient
          </button>
          <div className="w-0.5 bg-border"></div>
          <button 
            type="button"
            onClick={() => setActiveTab('meal')}
            className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'meal' ? 'bg-lavender text-coffee' : 'bg-muted/30 text-coffee/50 hover:bg-muted/50'}`}
          >
            <UtensilsCrossed className="w-4 h-4" /> Cooked Meal
          </button>
        </div>

        {/* Form Area */}
        <div className="p-6">
          {activeTab === 'ingredient' ? (
            <form onSubmit={handleAddIngredient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee uppercase tracking-wider">Item Name</label>
                <input 
                  autoFocus
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Olive Oil" 
                  className="w-full bg-muted/30 border-2 border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-tangerine font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee uppercase tracking-wider">Quantity/Amount</label>
                <input 
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1 bottle, 500g" 
                  className="w-full bg-muted/30 border-2 border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-tangerine font-medium"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-tangerine text-white py-3 rounded-xl font-black border-2 border-black hard-shadow-hover mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add to Pantry"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogMeal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee uppercase tracking-wider">Dish Name</label>
                <input 
                  autoFocus
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Spicy Garlic Pasta" 
                  className="w-full bg-muted/30 border-2 border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-tangerine font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee uppercase tracking-wider">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`flex-1 py-2 rounded-lg border-2 font-bold transition-all ${rating === num ? 'bg-yellow-400 border-black text-black hard-shadow-sm' : 'bg-muted/30 border-transparent text-coffee/50 hover:bg-muted'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee uppercase tracking-wider">Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Needs more salt next time." 
                  className="w-full bg-muted/30 border-2 border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-tangerine font-medium resize-none"
                  rows={2}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-coffee text-white py-3 rounded-xl font-black border-2 border-black hard-shadow-hover mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log Meal"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}