// components/pantry-manager.tsx
"use client"

import { addToPantry, deleteFromPantry } from "@/app/actions/pantry"
import { Trash2, Plus, Search, Check, X, Loader2, Carrot, Beef, Milk, Wheat, Package, Sparkles } from "lucide-react"
import { useState, useMemo, useTransition, useRef, useOptimistic } from "react"
import { cn } from "@/lib/utils"

// --- Types ---
type PantryItem = {
  id: number
  name: string | null // FIXED: Matches DB column 'name'
  quantity: string
  added_at: string
}

// --- Constants ---
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
          <Check className="w-3 h-3" />
        </button>
        <button 
          onClick={() => setStatus('idle')}
          className="p-1.5 bg-muted text-coffee hover:bg-muted/80 rounded-md"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setStatus('confirm')}
      className="p-2 text-coffee/20 hover:text-destructive hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}

export function PantryManager({ items }: { items: PantryItem[] }) {
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState<string | 'all'>('all')
  const formRef = useRef<HTMLFormElement>(null)
  
  // OPTIMISTIC UI: Show items immediately before server confirms
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: PantryItem) => [newItem, ...state]
  )

  const handleAdd = async (formData: FormData) => {
    const name = formData.get("item_name") as string
    const qty = formData.get("quantity") as string
    
    if (!name) return

    // 1. Instantly update UI
    addOptimisticItem({
        id: Math.random(), // Temp ID
        name: name,
        quantity: qty || "1",
        added_at: new Date().toISOString()
    })
    
    // 2. Reset form immediately
    formRef.current?.reset()

    // 3. Send to server
    await addToPantry(formData)
  }

  // Robust Filtering on Optimistic Data
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

    // Sort by Date (Newest First)
    result.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())
    
    return result
  }, [optimisticItems, search, filterCat])

  return (
    <div className="space-y-6">
      
      {/* ADD ITEM FORM */}
      <div className="bg-white p-1 rounded-3xl border-2 border-border hard-shadow-lg overflow-hidden relative z-20">
         <div className="bg-muted/30 p-4 sm:p-6 rounded-[20px]">
            <h3 className="font-serif text-xl font-bold text-coffee mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-tangerine fill-tangerine" /> Quick Add
            </h3>
            
            <form 
                ref={formRef}
                action={handleAdd}
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="flex-1 relative group">
                    <input
                        name="item_name"
                        type="text"
                        placeholder="Ingredient name..."
                        required
                        autoComplete="off"
                        className="w-full bg-white px-5 py-3.5 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine focus:ring-4 focus:ring-tangerine/10 text-coffee placeholder:text-coffee/40 transition-all font-medium"
                    />
                </div>
                <div className="w-full sm:w-28 relative">
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
                    className="bg-tangerine text-white px-6 py-3.5 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 active:translate-y-0 transition-all font-bold flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add
                </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-4">
                {["Eggs 🥚", "Milk 🥛", "Bread 🍞", "Pasta 🍝", "Rice 🍚"].map(chip => (
                    <button
                        key={chip}
                        type="button"
                        onClick={() => {
                            const input = formRef.current?.querySelector('input[name="item_name"]') as HTMLInputElement
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
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-[80px] z-10 py-2 bg-cream/95 backdrop-blur-sm -mx-2 px-2 transition-all">
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

      {/* ITEM GRID WITH ANIMATIONS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {filteredItems.map((item, index) => {
          const displayName = item.name || "Unknown Item"
          const CategoryIcon = getCategory(displayName).icon
          
          return (
            <div
              key={item.id}
              className="group bg-white p-4 rounded-2xl border-2 border-border hard-shadow hover:hard-shadow-lg transition-all relative overflow-hidden animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-2 fill-mode-backwards"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-2">
                 <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center border-2 border-border/10 text-coffee group-hover:scale-110 transition-transform duration-300">
                    <CategoryIcon className="w-5 h-5" />
                 </div>
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
                    {item.added_at ? new Date(item.added_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Now'}
                 </span>
              </div>
            </div>
          )
        })}

        {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-coffee/40 italic">
                No items found. Time to go shopping? 🛒
            </div>
        )}
      </div>
    </div>
  )
}