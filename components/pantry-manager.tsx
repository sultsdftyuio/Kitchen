// components/pantry-manager.tsx
"use client"

import { addToPantry, deleteFromPantry } from "@/app/actions/pantry"
import { Trash2, Plus, Search, Check, X, Loader2, Carrot, Beef, Milk, Wheat, Package, Sparkles } from "lucide-react"
import { useState, useMemo, useTransition, useRef, useOptimistic } from "react"
import { cn } from "@/lib/utils"

type PantryItem = {
  id: number
  name: string | null 
  quantity: string
  added_at: string
}

const CATEGORIES = [
  { id: 'produce', label: 'Produce', icon: Carrot, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', keywords: ['apple', 'banana', 'carrot', 'spinach', 'lettuce', 'onion', 'garlic', 'potato', 'tomato', 'fruit', 'veg'] },
  { id: 'protein', label: 'Protein', icon: Beef, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100', keywords: ['chicken', 'beef', 'steak', 'pork', 'fish', 'tuna', 'egg', 'tofu', 'meat'] },
  { id: 'dairy', label: 'Dairy', icon: Milk, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100', keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream'] },
  { id: 'grains', label: 'Grains', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', keywords: ['rice', 'pasta', 'bread', 'oats', 'flour', 'quinoa', 'cereal'] },
]

const getCategory = (name: string | null) => {
  const safeName = (name || "").toLowerCase()
  return CATEGORIES.find(c => c.keywords.some(k => safeName.includes(k))) || { id: 'other', label: 'Pantry', icon: Package, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' }
}

const getFreshnessColor = (dateString: string) => {
  if (!dateString) return "bg-slate-200 w-full"
  const days = (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24)
  if (days < 3) return "bg-emerald-400 w-full"
  if (days < 7) return "bg-amber-400 w-2/3"
  return "bg-rose-400 w-1/3"
}

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
    return <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
  }

  if (status === 'confirm') {
    return (
      <div className="flex items-center gap-1 animate-in slide-in-from-right-2 fade-in duration-200">
        <button onClick={handleDelete} className="p-1 bg-rose-500 text-white rounded hover:bg-rose-600 shadow-sm"><Check className="w-3.5 h-3.5" /></button>
        <button onClick={() => setStatus('idle')} className="p-1 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded"><X className="w-3.5 h-3.5" /></button>
      </div>
    )
  }

  return (
    <button onClick={() => setStatus('confirm')} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all">
      <Trash2 className="w-4 h-4" />
    </button>
  )
}

export function PantryManager({ items }: { items: PantryItem[] }) {
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState<string | 'all'>('all')
  const formRef = useRef<HTMLFormElement>(null)
  
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: PantryItem) => [newItem, ...state]
  )

  const handleAdd = async (formData: FormData) => {
    const name = formData.get("item_name") as string
    const qty = formData.get("quantity") as string
    if (!name) return

    addOptimisticItem({ id: Math.random(), name: name, quantity: qty || "1", added_at: new Date().toISOString() })
    formRef.current?.reset()

    try { await addToPantry(formData) } catch (err) { console.error("Failed to add item:", err) }
  }

  const filteredItems = useMemo(() => {
    const safeItems = Array.isArray(optimisticItems) ? optimisticItems : []
    let result = [...safeItems]
    if (search) result = result.filter(i => (i.name || "").toLowerCase().includes(search.toLowerCase()))
    if (filterCat !== 'all') result = result.filter(i => getCategory(i.name).id === filterCat)
    result.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())
    return result
  }, [optimisticItems, search, filterCat])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* ADD ITEM FORM */}
      <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden relative">
         <div className="px-6 py-4 flex items-center gap-2 border-b border-slate-100 bg-slate-50/50">
          <Sparkles className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-sm text-slate-700 uppercase tracking-wider">Quick Restock</h3>
         </div>

         <div className="p-5 sm:p-6">
            <form ref={formRef} action={handleAdd} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group">
                    <input name="item_name" type="text" placeholder="Ingredient name..." required autoComplete="off"
                        className="w-full bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm"
                    />
                </div>
                <div className="w-full sm:w-28 relative">
                    <input name="quantity" type="text" placeholder="Qty" defaultValue="1"
                        className="w-full bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 text-slate-900 font-medium text-center text-sm"
                    />
                </div>
                <button type="submit" className="bg-slate-900 text-white px-6 py-3.5 rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md active:scale-[0.98] transition-all font-semibold text-sm flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add
                </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Suggestions:</span>
                {["Eggs (12)", "Milk (1L)", "Bread (Loaf)", "Pasta (500g)", "Rice (1kg)"].map(chip => (
                    <button
                        key={chip} type="button"
                        onClick={() => {
                            const input = formRef.current?.querySelector('input[name="item_name"]') as HTMLInputElement
                            const qtyInput = formRef.current?.querySelector('input[name="quantity"]') as HTMLInputElement
                            if (input && qtyInput) {
                                const parts = chip.match(/^(.*)\s\((.*)\)$/); if (parts) { input.value = parts[1]; qtyInput.value = parts[2] } else { input.value = chip }
                                input.focus()
                            }
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-500 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm transition-all"
                    >
                        + {chip}
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-[70px] z-10 py-3 bg-[#FDFDFD]/90 backdrop-blur-md -mx-2 px-2">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100 text-sm font-medium shadow-sm transition-all"
          />
        </div>
        
        <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
            <button onClick={() => setFilterCat('all')} className={cn("px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all", filterCat === 'all' ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700")}>
                All Items
            </button>
            {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setFilterCat(cat.id)} className={cn("px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all", filterCat === cat.id ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700")}>
                    <cat.icon className="w-3 h-3 opacity-70" /> {cat.label}
                </button>
            ))}
        </div>
      </div>

      {/* ITEM GRID */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item, index) => {
          const displayName = item.name || "Unknown Item"
          const category = getCategory(displayName)
          const CategoryIcon = category.icon
          
          return (
            <div key={item.id} className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all relative overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105", category.bg, category.color)}>
                      <CategoryIcon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <DeleteButton id={item.id} />
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-900 text-base leading-tight truncate">{displayName}</h4>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        Qty: {item.quantity || "1"}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        {item.added_at ? new Date(item.added_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Now'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Minimalist Freshness Indicator */}
              <div className="h-1 w-full bg-slate-50">
                 <div className={cn("h-full transition-all duration-1000 opacity-80", getFreshnessColor(item.added_at))} />
              </div>
            </div>
          )
        })}

        {filteredItems.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[24px]">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                  <Package className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Inventory is empty</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  {search ? "No ingredients match your search." : "Your pantry is looking bare. Restock by adding ingredients above."}
                </p>
            </div>
        )}
      </div>
    </div>
  )
}