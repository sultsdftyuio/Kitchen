// components/pantry-manager.tsx
"use client"

import { addPantryItem, deletePantryItem } from "@/app/actions/pantry"
import { Trash2, Plus, Search, Check, X, Loader2, Carrot, Beef, Milk, Wheat, Package } from "lucide-react"
import { useState, useMemo, useTransition } from "react"
import { cn } from "@/lib/utils"

// --- Types ---
type PantryItem = {
  id: number
  item_name: string | null 
  quantity: string
  added_at: string
}

// --- Constants & Helpers ---
const CATEGORIES = [
  { id: 'produce', label: 'Produce', icon: Carrot, keywords: ['apple', 'banana', 'carrot', 'spinach', 'lettuce', 'onion', 'garlic', 'potato', 'tomato', 'fruit', 'veg'] },
  { id: 'protein', label: 'Protein', icon: Beef, keywords: ['chicken', 'beef', 'steak', 'pork', 'fish', 'tuna', 'egg', 'tofu', 'meat'] },
  { id: 'dairy', label: 'Dairy', icon: Milk, keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream'] },
  { id: 'grains', label: 'Grains', icon: Wheat, keywords: ['rice', 'pasta', 'bread', 'oats', 'flour', 'quinoa', 'cereal'] },
]

const getCategory = (name: string | null) => {
  const safeName = (name || "").toLowerCase()
  return CATEGORIES.find(c => c.keywords.some(k => safeName.includes(k))) || { id: 'other', label: 'Pantry', icon: Package }
}

const getFreshnessColor = (dateString: string) => {
  if (!dateString) return "bg-gray-300"
  const days = (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24)
  if (days < 3) return "bg-green-500"
  if (days < 7) return "bg-yellow-500"
  return "bg-orange-500"
}

// --- Components ---

// 1. Interactive Delete Button Component
function DeleteButton({ id }: { id: number }) {
  const [status, setStatus] = useState<'idle' | 'confirm' | 'deleting'>('idle')
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    setStatus('deleting')
    startTransition(async () => {
      await deletePantryItem(id)
      // Note: Component will likely unmount before this finishes, which is fine.
    })
  }

  if (status === 'deleting' || isPending) {
    return (
      <div className="p-2 text-coffee/40 animate-spin">
        <Loader2 className="w-5 h-5" />
      </div>
    )
  }

  if (status === 'confirm') {
    return (
      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg animate-in slide-in-from-right-2 duration-200">
        <button 
          onClick={handleDelete}
          className="p-1.5 bg-destructive text-white rounded-md hover:bg-destructive/90 shadow-sm"
          title="Confirm Delete"
        >
          <Check className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setStatus('idle')}
          className="p-1.5 bg-white text-coffee border border-border rounded-md hover:bg-gray-50"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setStatus('confirm')}
      className="p-2 text-coffee/20 hover:text-destructive hover:bg-red-50 rounded-lg transition-colors"
      title="Delete Item"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )
}

// 2. Main Manager Component
export function PantryManager({ items }: { items: PantryItem[] }) {
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState<string | 'all'>('all')
  const [isAdding, setIsAdding] = useState(false)

  // Robust Filtering (Crash-Proof)
  const filteredItems = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : []
    
    let result = [...safeItems]

    if (search) {
      result = result.filter(i => 
        (i.item_name || "").toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filterCat !== 'all') {
      result = result.filter(i => getCategory(i.item_name).id === filterCat)
    }

    result.sort((a, b) => {
        const dateA = a.added_at ? new Date(a.added_at).getTime() : 0
        const dateB = b.added_at ? new Date(b.added_at).getTime() : 0
        return dateB - dateA
    })
    
    return result
  }, [items, search, filterCat])

  return (
    <div className="space-y-6">
      
      {/* ADD ITEM FORM */}
      <div className="bg-white p-1 rounded-3xl border-2 border-border hard-shadow-lg overflow-hidden">
         <div className="bg-muted/30 p-4 sm:p-6 rounded-[20px]">
            <h3 className="font-serif text-xl font-bold text-coffee mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-tangerine" /> Stock Your Kitchen
            </h3>
            
            <form 
                action={async (formData) => {
                    setIsAdding(true)
                    try {
                        await addPantryItem(formData)
                        // Reset form manually if needed, or let Next.js handle it
                        const form = document.getElementById("add-form") as HTMLFormElement
                        form?.reset()
                    } catch (e) {
                        console.error(e)
                    } finally {
                        setIsAdding(false)
                    }
                }}
                id="add-form"
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
                    {isAdding ? <Loader2 className="w-5 h-5 animate-spin"/> : "Add Item"}
                </button>
            </form>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
                {["Eggs 🥚", "Milk 🥛", "Bread 🍞", "Pasta 🍝", "Rice 🍚", "Chicken 🍗"].map(chip => (
                    <button
                        key={chip}
                        type="button"
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

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-[90px] z-10 py-2 bg-cream/95 backdrop-blur-sm -mx-2 px-2">
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee/40" />
          <input 
            placeholder="Search pantry..." 
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
                All
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

      {/* ITEM GRID */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const displayName = item.item_name || "Unknown Item"
          const CategoryIcon = getCategory(displayName).icon
          
          return (
            <div
              key={item.id}
              className="group bg-white p-4 rounded-2xl border-2 border-border hard-shadow hover:hard-shadow-lg transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-2">
                 <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center border-2 border-border/10 text-coffee group-hover:scale-110 transition-transform duration-300">
                    <CategoryIcon className="w-5 h-5" />
                 </div>
                 
                 {/* Better Delete UI */}
                 <DeleteButton id={item.id} />
              </div>

              <div className="space-y-1">
                 <h4 className="font-bold text-coffee text-lg leading-tight truncate pr-2">
                   {displayName}
                 </h4>
                 <p className="text-sm font-medium text-coffee-dark/60 bg-muted inline-block px-2 py-0.5 rounded-md">
                    x {item.quantity || "1"}
                 </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                 <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full w-full ${getFreshnessColor(item.added_at)} opacity-50`} />
                 </div>
                 <span className="text-[10px] font-bold text-coffee/30 uppercase tracking-wider">
                    {item.added_at ? new Date(item.added_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                 </span>
              </div>
            </div>
          )
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center space-y-4 border-2 border-dashed border-border/30 rounded-3xl bg-white/50">
            <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-coffee/30" />
            </div>
            <p className="text-coffee-dark/50 font-medium">No items found.</p>
          </div>
        )}
      </div>
    </div>
  )
}