// components/pantry-manager.tsx
"use client"

import { addPantryItem, deletePantryItem } from "@/app/actions/pantry"
import { Trash2, Plus, Search, ArrowUpDown, Clock, AlertCircle } from "lucide-react"
import { useState, useMemo } from "react"

type PantryItem = {
  id: number
  item_name: string // Note: Database column is item_name, though insert action might use 'name'. Adjust based on your DB.
  quantity: string
  added_at: string
}

const QUICK_ADD_ITEMS = ["Eggs 🥚", "Milk 🥛", "Onions 🧅", "Garlic 🧄", "Rice 🍚", "Pasta 🍝"]

export function PantryManager({ items }: { items: PantryItem[] }) {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alpha">("newest")
  const [itemName, setItemName] = useState("") // Controlled input for Quick Add

  // Client-side filtering and sorting
  const filteredItems = useMemo(() => {
    let result = [...items]

    if (search) {
      result = result.filter(i => 
        i.item_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.added_at).getTime() - new Date(b.added_at).getTime())
        break
      case "alpha":
        result.sort((a, b) => a.item_name.localeCompare(b.item_name))
        break
    }
    return result
  }, [items, search, sortBy])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-coffee-dark/40" />
          <input 
            placeholder="Search pantry..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee"
          />
        </div>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-white px-4 py-2.5 rounded-xl border-2 border-border text-coffee font-medium focus:border-tangerine outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest (Use Me!)</option>
          <option value="alpha">A-Z</option>
        </select>
      </div>

      {/* Add Item Form with Quick Chips */}
      <div className="bg-white p-6 rounded-3xl border-2 border-border hard-shadow-lg space-y-4">
        <form action={async (formData) => {
            await addPantryItem(formData)
            setItemName("") // Clear input
        }} className="flex gap-3">
          <input
            name="item_name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            type="text"
            placeholder="Add new item..."
            required
            className="flex-1 bg-muted px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee"
          />
          <input
            name="quantity"
            type="text"
            placeholder="Qty"
            defaultValue="1"
            className="w-20 bg-muted px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee"
          />
          <button
            type="submit"
            className="bg-tangerine text-white p-3 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 hover:shadow-none transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>
        
        {/* Quick Chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD_ITEMS.map(item => (
            <button
              key={item}
              onClick={() => setItemName(item)}
              className="px-3 py-1 bg-cream border border-border rounded-full text-xs font-bold text-coffee/70 hover:bg-tangerine hover:text-white transition-colors"
            >
              + {item}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl border-2 border-border hard-shadow flex items-center justify-between group hover:border-tangerine/50 transition-colors"
          >
            <div>
              <h3 className="font-bold text-coffee text-lg">{item.item_name}</h3>
              <div className="flex items-center gap-2 text-coffee-dark/60 text-xs mt-1">
                <span className="bg-muted px-2 py-0.5 rounded-md">Qty: {item.quantity}</span>
                {sortBy === 'oldest' && (
                   <span className="flex items-center gap-1 text-tangerine">
                     <Clock className="w-3 h-3" /> Old
                   </span>
                )}
              </div>
            </div>
            
            <form action={deletePantryItem.bind(null, item.id)}>
              <button
                type="submit"
                className="text-coffee-dark/40 hover:text-destructive transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </form>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-coffee-dark/50">
            <p>Your pantry is empty. Use the quick add buttons!</p>
          </div>
        )}
      </div>
    </div>
  )
}