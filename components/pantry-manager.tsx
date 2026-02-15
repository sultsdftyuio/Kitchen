// components/pantry-manager.tsx
"use client"

import { addToPantry, deleteFromPantry } from "@/app/actions/pantry"
import { Trash2, Plus, Search, Check, X, Loader2, Carrot, Beef, Milk, Wheat, Package, Sparkles } from "lucide-react"
import { useState, useMemo, useTransition, useRef, useOptimistic } from "react"
import { cn } from "@/lib/utils"

// --- Types (Left exactly as original) ---
type PantryItem = {
  id: number
  name: string | null 
  quantity: string
  added_at: string
}

// --- Constants ---
const CATEGORIES = [
  { id: 'produce', label: 'Produce', icon: Carrot, color: 'text-green-600', bg: 'bg-green-100', keywords: ['apple', 'banana', 'carrot', 'spinach', 'lettuce', 'onion', 'garlic', 'potato', 'tomato', 'fruit', 'veg'] },
  { id: 'protein', label: 'Protein', icon: Beef, color: 'text-red-500', bg: 'bg-red-100', keywords: ['chicken', 'beef', 'steak', 'pork', 'fish', 'tuna', 'egg', 'tofu', 'meat'] },
  { id: 'dairy', label: 'Dairy', icon: Milk, color: 'text-blue-500', bg: 'bg-blue-100', keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream'] },
  { id: 'grains', label: 'Grains', icon: Wheat, color: 'text-yellow-600', bg: 'bg-yellow-100', keywords: ['rice', 'pasta', 'bread', 'oats', 'flour', 'quinoa', 'cereal'] },
]

const getCategory = (name: string | null) => {
  const safeName = (name || "").toLowerCase()
  return CATEGORIES.find(c => c.keywords.some(k => safeName.includes(k))) || { id: 'other', label: 'Pantry', icon: Package, color: 'text-coffee', bg: 'bg-muted' }
}

const getFreshnessColor = (dateString: string) => {
  if (!dateString) return "bg-gray-300 w-full"
  const days = (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24)
  if (days < 3) return "bg-green-400 w-full"
  if (days < 7) return "bg-yellow-400 w-2/3"
  return "bg-orange-400 w-1/3"
}

// --- Components ---
function DeleteButton({ id }: { id: number }) {
  const [status, setStatus] = useState<'idle' | 'confirm' | 'deleting'>('idle')
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    setStatus('deleting')
    startTransition(async () => {
      try {
        await deleteFromPantry(id)
      } catch (e) {
        setStatus('idle')
      }
    })
  }

  if (status === 'deleting' || isPending) {
    return <Loader2 className="w-5 h-5 text-coffee/20 animate-spin p-1" />
  }

  if (status === 'confirm') {
    return (
      <div className="flex items-center gap-1 animate-in slide-in-from-right-2 fade-in duration-200">
        <button 
          onClick={handleDelete}
          className="p-1.5 bg-destructive text-white rounded-md hover:bg-destructive/90 shadow-sm"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => setStatus('idle')}
          className="p-1.5 bg-muted text-coffee hover:bg-muted/80 rounded-md"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setStatus('confirm')}
      className="p-1.5 text-coffee/30 hover:text-destructive hover:bg-red-50 rounded-lg transition-all"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}

export function PantryManager({ items }: { items: PantryItem[] }) {
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState<string | 'all'>('all')
  const formRef = useRef<HTMLFormElement>(null)
  
  // Data Logic untouched
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: PantryItem) => [newItem, ...state]
  )

  const handleAdd = async (formData: FormData) => {
    const name = formData.get("item_name") as string
    const qty = formData.get("quantity") as string
    
    if (!name) return

    addOptimisticItem({
        id: Math.random(),
        name: name,
        quantity: qty || "1",
        added_at: new Date().toISOString()
    })
    
    formRef.current?.reset()

    try {
        await addToPantry(formData)
    } catch (err) {
        console.error("Failed to add item:", err)
    }
  }

  const filteredItems = useMemo(() => {
    const safeItems = Array.isArray(optimisticItems) ? optimisticItems : []
    let result = [...safeItems]

    if (search) {
      result = result.filter(i => 
        (i.name || "").toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filterCat !== 'all') {
      result = result.filter(i => getCategory(i.name).id === filterCat)
    }

    result.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())
    
    return result
  }, [optimisticItems, search, filterCat])

  return (
    <div className="space-y-8">
      
      {/* ADD ITEM FORM */}
      <div className="bg-white rounded-3xl border-2 border-border hard-shadow flex flex-col overflow-hidden z-20 relative">
         <div className="bg-coffee px-6 py-4 flex items-center gap-2 text-white border-b-2 border-border">
          <Sparkles className="w-5 h-5 text-tangerine fill-tangerine" />
          <h3 className="font-serif text-xl font-bold">Quick Restock</h3>
         </div>

         <div className="p-5 sm:p-6 bg-cream/30">
            <form 
                ref={formRef}
                action={handleAdd}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="flex-1 relative group">
                    <input
                        name="item_name"
                        type="text"
                        placeholder="Ingredient name..."
                        required
                        autoComplete="off"
                        className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-border focus:outline-none focus:border-tangerine focus:ring-4 focus:ring-tangerine/10 text-coffee placeholder:text-coffee/40 transition-all font-bold text-lg"
                    />
                </div>
                <div className="w-full sm:w-32 relative">
                    <input
                        name="quantity"
                        type="text"
                        placeholder="Qty"
                        defaultValue="1"
                        className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-border focus:outline-none focus:border-tangerine focus:ring-4 focus:ring-tangerine/10 text-coffee font-bold text-center text-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-tangerine text-white px-8 py-4 rounded-2xl border-2 border-border hard-shadow hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px] transition-all font-black text-lg flex items-center justify-center gap-2"
                >
                    <Plus className="w-6 h-6" /> Add
                </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-5">
                <span className="text-xs font-bold text-coffee/40 uppercase tracking-wider py-1.5 mr-2">Suggestions:</span>
                {["Eggs (12)", "Milk (1L)", "Bread (Loaf)", "Pasta (500g)", "Rice (1kg)"].map(chip => (
                    <button
                        key={chip}
                        type="button"
                        onClick={() => {
                            const input = formRef.current?.querySelector('input[name="item_name"]') as HTMLInputElement
                            const qtyInput = formRef.current?.querySelector('input[name="quantity"]') as HTMLInputElement
                            if (input && qtyInput) {
                                const parts = chip.match(/^(.*)\s\((.*)\)$/)
                                if (parts) {
                                    input.value = parts[1]
                                    qtyInput.value = parts[2]
                                } else {
                                    input.value = chip
                                }
                                input.focus()
                            }
                        }}
                        className="px-3 py-1.5 bg-white border-2 border-border/50 rounded-xl text-xs font-bold text-coffee/70 hover:border-tangerine hover:text-tangerine hover:bg-orange-50 transition-all hard-shadow-sm hover:translate-y-[1px] hover:shadow-none"
                    >
                        + {chip}
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-[80px] z-10 py-2 bg-cream/95 backdrop-blur-sm -mx-2 px-2 transition-all">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee/40" />
          <input 
            placeholder="Search pantry..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-11 pr-4 py-2.5 rounded-xl border-2 border-border/50 focus:outline-none focus:border-tangerine text-sm font-medium shadow-sm"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
                onClick={() => setFilterCat('all')}
                className={cn(
                    "px-4 py-2 rounded-xl border-2 text-xs font-bold whitespace-nowrap transition-all",
                    filterCat === 'all' ? "bg-coffee text-white border-coffee hard-shadow-sm" : "bg-white border-border/50 text-coffee hover:border-coffee"
                )}
            >
                All Items
            </button>
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setFilterCat(cat.id)}
                    className={cn(
                        "px-4 py-2 rounded-xl border-2 text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all",
                        filterCat === cat.id ? "bg-white border-tangerine text-tangerine hard-shadow-sm" : "bg-white border-border/50 text-coffee/60 hover:text-coffee hover:border-border"
                    )}
                >
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.label}
                </button>
            ))}
        </div>
      </div>

      {/* ITEM GRID WITH ANIMATIONS */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => {
          const displayName = item.name || "Unknown Item"
          const category = getCategory(displayName)
          const CategoryIcon = category.icon
          
          return (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border-2 border-border shadow-sm hover:hard-shadow transition-all relative overflow-hidden animate-in fade-in zoom-in-95 duration-300 fill-mode-backwards flex flex-col"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border-2 border-border/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3", category.bg, category.color)}>
                      <CategoryIcon className="w-6 h-6" />
                  </div>
                  <DeleteButton id={item.id} />
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-coffee text-lg leading-tight truncate">
                    {displayName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-tangerine bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                        x {item.quantity || "1"}
                    </span>
                    <span className="text-[10px] font-bold text-coffee/40 uppercase tracking-wider">
                        Added {item.added_at ? new Date(item.added_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Now'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Freshness Indicator */}
              <div className="h-1.5 w-full bg-muted mt-auto">
                 <div className={cn("h-full transition-all duration-1000", getFreshnessColor(item.added_at))} />
              </div>
            </div>
          )
        })}

        {filteredItems.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/50 border-2 border-dashed border-border rounded-3xl">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-coffee/20" />
                </div>
                <h3 className="text-xl font-bold text-coffee mb-2">Pantry is empty</h3>
                <p className="text-coffee/50 max-w-sm">
                  {search ? "No ingredients match your search." : "Time to go shopping! Add some ingredients above to get started."}
                </p>
            </div>
        )}
      </div>
    </div>
  )
}