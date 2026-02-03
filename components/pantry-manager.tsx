// components/pantry-manager.tsx
"use client"

import { addPantryItem, deletePantryItem } from "@/app/actions/pantry"
import { Trash2, Plus, Search, Filter, Beef, Carrot, Milk, Wheat, Package } from "lucide-react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"

type PantryItem = {
  id: number
  item_name: string 
  quantity: string
  added_at: string
}

const CATEGORIES = [
  { id: 'produce', label: 'Produce', icon: Carrot, keywords: ['apple', 'banana', 'carrot', 'spinach', 'lettuce', 'onion', 'garlic', 'potato', 'tomato', 'fruit', 'veg'] },
  { id: 'protein', label: 'Protein', icon: Beef, keywords: ['chicken', 'beef', 'steak', 'pork', 'fish', 'tuna', 'egg', 'tofu', 'meat'] },
  { id: 'dairy', label: 'Dairy', icon: Milk, keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream'] },
  { id: 'grains', label: 'Grains', icon: Wheat, keywords: ['rice', 'pasta', 'bread', 'oats', 'flour', 'quinoa', 'cereal'] },
]

// Helper to guess category
const getCategory = (name: string) => {
  const lower = name.toLowerCase()
  return CATEGORIES.find(c => c.keywords.some(k => lower.includes(k))) || { id: 'other', label: 'Pantry', icon: Package }
}

// Helper for freshness color
const getFreshnessColor = (dateString: string) => {
  const days = (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24)
  if (days < 3) return "bg-green-500"
  if (days < 7) return "bg-yellow-500"
  return "bg-orange-500"
}

export function PantryManager({ items }: { items: PantryItem[] }) {
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState<string | 'all'>('all')
  const [isAdding, setIsAdding] = useState(false)

  // Client-side filtering and sorting
  const filteredItems = useMemo(() => {
    let result = [...items]

    if (search) {
      result = result.filter(i => 
        i.item_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filterCat !== 'all') {
      result = result.filter(i => getCategory(i.item_name).id === filterCat)
    }

    // Default Sort: Newest First
    result.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())
    
    return result
  }, [items, search, filterCat])

  return (
    <div className="space-y-6">
      
      {/* 1. INPUT ZONE: The "Stocking Station" */}
      <div className="bg-white p-1 rounded-3xl border-2 border-border hard-shadow-lg overflow-hidden">
         <div className="bg-muted/30 p-4 sm:p-6 rounded-[20px]">
            <h3 className="font-serif text-xl font-bold text-coffee mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-tangerine" /> Stock Your Kitchen
            </h3>
            
            <form 
                action={async (formData) => {
                    setIsAdding(true)
                    await addPantryItem(formData)
                    setIsAdding(false)
                    // Optional: clear inputs via ref if needed, but standard form behavior handles it nicely
                }} 
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="flex-1 relative group">
                    <input
                        name="item_name"
                        type="text"
                        placeholder="e.g. 6 Eggs, 1L Milk..."
                        required
                        className="w-full bg-white px-5 py-3.5 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine focus:ring-4 focus:ring-tangerine/10 text-coffee placeholder:text-coffee/40 transition-all font-medium"
                    />
                </div>
                <div className="w-full sm:w-32 relative">
                    <input
                        name="quantity"
                        type="text"
                        placeholder="Qty"
                        defaultValue="1"
                        className="w-full bg-white px-5 py-3.5 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine focus:ring-4 focus:ring-tangerine/10 text-coffee font-medium text-center"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isAdding}
                    className="bg-tangerine text-white px-6 py-3.5 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 active:translate-y-0 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-2 min-w-[120px]"
                >
                    {isAdding ? "Adding..." : "Add Item"}
                </button>
            </form>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
                {["Eggs 🥚", "Milk 🥛", "Bread 🍞", "Pasta 🍝", "Rice 🍚", "Chicken 🍗"].map(chip => (
                    <button
                        key={chip}
                        onClick={() => {
                            const input = document.querySelector('input[name="item_name"]') as HTMLInputElement
                            if (input) {
                                input.value = chip.split(' ')[0]
                                input.focus()
                            }
                        }}
                        className="px-3 py-1.5 bg-white border-2 border-border/50 rounded-lg text-xs font-bold text-coffee/70 hover:border-tangerine hover:text-tangerine hover:bg-orange-50 transition-all"
                    >
                        {chip}
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* 2. CONTROLS: Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-[90px] z-10 py-2 bg-cream/95 backdrop-blur-sm -mx-2 px-2">
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee/40" />
          <input 
            placeholder="Search items..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-sm font-medium"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-thin">
            <button
                onClick={() => setFilterCat('all')}
                className={cn(
                    "px-3 py-1.5 rounded-lg border-2 text-xs font-bold whitespace-nowrap transition-all",
                    filterCat === 'all' ? "bg-coffee text-white border-coffee" : "bg-white border-border text-coffee hover:border-coffee"
                )}
            >
                All Items
            </button>
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setFilterCat(cat.id)}
                    className={cn(
                        "px-3 py-1.5 rounded-lg border-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all",
                        filterCat === cat.id ? "bg-white border-tangerine text-tangerine shadow-sm" : "bg-white border-border text-coffee/60 hover:text-coffee"
                    )}
                >
                    <cat.icon className="w-3 h-3" />
                    {cat.label}
                </button>
            ))}
        </div>
      </div>

      {/* 3. INVENTORY GRID */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const CategoryIcon = getCategory(item.item_name).icon
          
          return (
            <div
              key={item.id}
              className="group bg-white p-4 rounded-2xl border-2 border-border hard-shadow hover:hard-shadow-lg transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-2">
                 <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center border-2 border-border/10 text-coffee group-hover:scale-110 transition-transform duration-300">
                    <CategoryIcon className="w-5 h-5" />
                 </div>
                 
                 <form action={deletePantryItem.bind(null, item.id)}>
                    <button
                        type="submit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-coffee/20 hover:text-destructive transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                 </form>
              </div>

              <div className="space-y-1">
                 <h4 className="font-bold text-coffee text-lg leading-tight truncate pr-2">{item.item_name}</h4>
                 <p className="text-sm font-medium text-coffee-dark/60 bg-muted inline-block px-2 py-0.5 rounded-md">
                    x {item.quantity}
                 </p>
              </div>

              {/* Freshness Bar */}
              <div className="mt-4 flex items-center gap-2">
                 <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full w-full ${getFreshnessColor(item.added_at)} opacity-50`} />
                 </div>
                 <span className="text-[10px] font-bold text-coffee/30 uppercase tracking-wider">
                    {new Date(item.added_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                 </span>
              </div>
            </div>
          )
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-border/30 rounded-3xl bg-white/50">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-coffee/30" />
            </div>
            <div>
                <p className="text-lg font-bold text-coffee">No items found</p>
                <p className="text-sm text-coffee-dark/50">Try stocking your pantry above!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}