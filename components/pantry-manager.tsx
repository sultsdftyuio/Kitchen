// components/pantry-manager.tsx
"use client"

import { addToPantry, deleteFromPantry } from "@/app/actions/pantry"
import { Trash2, Plus, Search, Check, X, Loader2, Carrot, Beef, Milk, Wheat, Package, Sparkles, Clock, AlertTriangle, Coffee, Cookie, Droplets, Leaf } from "lucide-react"
import { useState, useMemo, useTransition, useRef, useOptimistic } from "react"
import { cn } from "@/lib/utils"

type PantryItem = {
  id: number
  name: string | null 
  quantity: string
  added_at: string
}

// Expanded Categories with more specific icons
const CATEGORIES = [
  { id: 'produce', label: 'Produce', icon: Carrot, color: 'text-emerald-600', bg: 'bg-emerald-100/50 border-emerald-200', keywords: ['apple', 'banana', 'carrot', 'spinach', 'lettuce', 'onion', 'garlic', 'potato', 'tomato', 'fruit', 'veg', 'lemon', 'lime'] },
  { id: 'protein', label: 'Protein', icon: Beef, color: 'text-rose-600', bg: 'bg-rose-100/50 border-rose-200', keywords: ['chicken', 'beef', 'steak', 'pork', 'fish', 'tuna', 'egg', 'tofu', 'meat', 'salmon', 'shrimp'] },
  { id: 'dairy', label: 'Dairy', icon: Milk, color: 'text-sky-600', bg: 'bg-sky-100/50 border-sky-200', keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'parmesan'] },
  { id: 'grains', label: 'Grains', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-100/50 border-amber-200', keywords: ['rice', 'pasta', 'bread', 'oats', 'flour', 'quinoa', 'cereal', 'noodle'] },
  { id: 'spices', label: 'Herbs & Spices', icon: Leaf, color: 'text-teal-600', bg: 'bg-teal-100/50 border-teal-200', keywords: ['salt', 'pepper', 'cinnamon', 'basil', 'oregano', 'cumin', 'paprika', 'spice', 'herb', 'parsley', 'cilantro'] },
  { id: 'condiments', label: 'Oils & Sauces', icon: Droplets, color: 'text-indigo-600', bg: 'bg-indigo-100/50 border-indigo-200', keywords: ['oil', 'vinegar', 'sauce', 'ketchup', 'mustard', 'mayo', 'soy sauce', 'dressing', 'syrup'] },
  { id: 'snacks', label: 'Snacks', icon: Cookie, color: 'text-orange-600', bg: 'bg-orange-100/50 border-orange-200', keywords: ['chip', 'cookie', 'cracker', 'chocolate', 'candy', 'snack', 'popcorn'] },
  { id: 'beverages', label: 'Beverages', icon: Coffee, color: 'text-stone-600', bg: 'bg-stone-100/50 border-stone-200', keywords: ['coffee', 'tea', 'juice', 'soda', 'water', 'wine', 'beer', 'drink'] },
]

const getCategory = (name: string | null) => {
  const safeName = (name || "").toLowerCase()
  return CATEGORIES.find(c => c.keywords.some(k => safeName.includes(k))) || { id: 'other', label: 'Pantry', icon: Package, color: 'text-slate-600', bg: 'bg-slate-100/50 border-slate-200' }
}

// Improved Freshness Logic with Badges instead of bars
const getFreshnessStatus = (dateString: string) => {
  if (!dateString) return { label: 'Fresh', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', Icon: Sparkles }
  const days = (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24)
  if (days < 3) return { label: 'Fresh', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', Icon: Sparkles }
  if (days < 7) return { label: 'Use Soon', color: 'bg-amber-50 text-amber-700 border-amber-200/60', Icon: Clock }
  return { label: 'Expiring', color: 'bg-rose-50 text-rose-700 border-rose-200/60', Icon: AlertTriangle }
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
    return <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
  }

  if (status === 'confirm') {
    return (
      <div className="flex items-center gap-1 animate-in zoom-in-95 duration-200 bg-white p-1 rounded-lg border border-slate-200 shadow-sm absolute right-2 top-2 z-10">
        <button onClick={handleDelete} className="p-1.5 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"><Check className="w-3.5 h-3.5" /></button>
        <button onClick={() => setStatus('idle')} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"><X className="w-3.5 h-3.5" /></button>
      </div>
    )
  }

  return (
    <button onClick={() => setStatus('confirm')} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus:opacity-100">
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
      
      {/* QUICK RESTOCK CARD */}
      <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden relative">
         <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-tangerine" />
            <h3 className="font-semibold text-sm text-slate-800 uppercase tracking-wider">Quick Restock</h3>
          </div>
          <span className="text-xs font-medium text-slate-400">{optimisticItems.length} items total</span>
         </div>

         <div className="p-5 sm:p-6">
            <form ref={formRef} action={handleAdd} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-tangerine transition-colors" />
                    <input name="item_name" type="text" placeholder="What did you buy? (e.g., Organic Eggs)" required autoComplete="off"
                        className="w-full bg-slate-50 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-tangerine/50 focus:ring-4 focus:ring-orange-500/10 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm"
                    />
                </div>
                <div className="w-full sm:w-32 relative">
                    <input name="quantity" type="text" placeholder="Qty (e.g. 1L)" defaultValue="1"
                        className="w-full bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-tangerine/50 focus:ring-4 focus:ring-orange-500/10 text-slate-900 font-medium text-center text-sm"
                    />
                </div>
                <button type="submit" className="bg-slate-900 text-white px-6 py-3.5 rounded-xl shadow-md hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] transition-all font-semibold text-sm flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 mt-5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Frequent:</span>
                {["Eggs (12)", "Milk (1L)", "Bread (Loaf)", "Chicken (500g)", "Olive Oil (1Btl)", "Salt (1Box)"].map(chip => (
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
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 hover:border-tangerine/50 hover:text-tangerine hover:shadow-sm hover:bg-orange-50/50 transition-all flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> {chip}
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* STICKY GLASSMORPHISM FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-[64px] z-30 py-4 bg-[#FDFDFD]/80 backdrop-blur-xl border-b border-slate-200/50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search your inventory..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100 text-sm font-medium shadow-sm transition-all"
          />
        </div>
        
        <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
            <button onClick={() => setFilterCat('all')} className={cn("px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all", filterCat === 'all' ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-800")}>
                All Items
            </button>
            {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setFilterCat(cat.id)} className={cn("px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all", filterCat === cat.id ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-800")}>
                    <cat.icon className={cn("w-3.5 h-3.5", filterCat === cat.id ? cat.color : "opacity-60")} /> {cat.label}
                </button>
            ))}
        </div>
      </div>

      {/* PREMIUM ITEM GRID */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredItems.map((item) => {
          const displayName = item.name || "Unknown Item"
          const category = getCategory(displayName)
          const CategoryIcon = category.icon
          const status = getFreshnessStatus(item.added_at)
          
          return (
            <div key={item.id} className="group bg-white rounded-[20px] border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all relative overflow-hidden flex flex-col">
              
              <DeleteButton id={item.id} />

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 shrink-0 shadow-sm", category.bg, category.color)}>
                      <CategoryIcon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h4 className="font-bold text-slate-900 text-base leading-tight truncate pr-6">{displayName}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-1">{category.label}</p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Quantity</span>
                    <span className="text-sm font-semibold text-slate-800">{item.quantity || "1"}</span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", status.color)}>
                    <status.Icon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredItems.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-200 rounded-[32px] shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No ingredients found</h3>
                <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                  {search 
                    ? `We couldn't find anything matching "${search}". Try adjusting your filters.` 
                    : "Your pantry is looking bare. Use the Quick Restock above to start building your inventory."}
                </p>
            </div>
        )}
      </div>
    </div>
  )
}