// components/virtual-kitchen.tsx
"use client"

import { KitchenItem } from "@/app/actions/gamification"
import { Flame, Leaf, Utensils, Coffee, Thermometer, Lock, CookingPot, CircleDashed, Archive, Wind, LayoutGrid, Soup, ChefHat, Trash2, BookOpen, PenTool, Timer } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Safe Fallback for standard Lucide Icons
const iconMap: Record<string, any> = {
  Flame, Leaf, CircleDashed, Utensils, CookingPot, Thermometer, Coffee,
  Archive, Wind, LayoutGrid, Soup, ChefHat, Trash2, BookOpen, PenTool, Timer
}

// THE ULTIMATE 2D ARCHITECTURE (16 Items)
const ROOM_POSITIONS: Record<string, { top: string, left: string, size: string, bg: string, z: string }> = {
  // BIG APPLIANCES (Floor)
  'Smart Fridge': { top: '55%', left: '12%', size: 'w-24 h-36 md:w-32 md:h-48', bg: 'bg-slate-300', z: 'z-20' }, 
  'Basic Stove': { top: '65%', left: '50%', size: 'w-24 h-28 md:w-32 md:h-36', bg: 'bg-slate-800', z: 'z-20' },
  'Compost Bin': { top: '80%', left: '25%', size: 'w-12 h-16 md:w-16 md:h-20', bg: 'bg-emerald-700', z: 'z-30' },
  'Dutch Oven': { top: '80%', left: '80%', size: 'w-16 h-16 md:w-20 md:h-20', bg: 'bg-orange-600', z: 'z-30' },
  
  // ON THE STOVE
  'Carbon Steel Pan': { top: '48%', left: '46%', size: 'w-12 h-12 md:w-14 md:h-14', bg: 'bg-slate-700', z: 'z-30' }, 

  // COUNTERTOP ITEMS
  'Air Fryer': { top: '55%', left: '32%', size: 'w-14 h-14 md:w-16 md:h-16', bg: 'bg-zinc-900', z: 'z-30' }, 
  'Stand Mixer': { top: '52%', left: '65%', size: 'w-14 h-16 md:w-16 md:h-20', bg: 'bg-red-500', z: 'z-30' }, 
  'Smart Sous-Vide': { top: '58%', left: '76%', size: 'w-10 h-14 md:w-12 md:h-16', bg: 'bg-blue-600', z: 'z-30' }, 
  'Espresso Machine': { top: '52%', left: '88%', size: 'w-14 h-16 md:w-16 md:h-20', bg: 'bg-stone-800', z: 'z-30' }, 

  // WALL & SHELVES
  'Herb Garden': { top: '35%', left: '50%', size: 'w-14 h-14 md:w-16 md:h-16', bg: 'bg-green-500', z: 'z-10' }, // Window Sill
  'Spice Rack': { top: '22%', left: '25%', size: 'w-12 h-16 md:w-16 md:h-20', bg: 'bg-amber-700', z: 'z-10' }, // High Wall Left
  'Pro Chef Knife': { top: '38%', left: '25%', size: 'w-8 h-8 md:w-10 md:h-10', bg: 'bg-stone-400', z: 'z-10' }, // Magnet Strip
  'Carbon Wok': { top: '18%', left: '80%', size: 'w-14 h-14 md:w-16 md:h-16', bg: 'bg-zinc-800', z: 'z-10' }, // Hanging Top Right
  'Recipe Library': { top: '22%', left: '65%', size: 'w-12 h-12 md:w-14 md:h-14', bg: 'bg-indigo-600', z: 'z-10' }, // Shelf Right
  'Kitchen Timer': { top: '35%', left: '65%', size: 'w-8 h-8 md:w-10 md:h-10', bg: 'bg-rose-500', z: 'z-10' }, // Wall Right
  'Plating Tweezers': { top: '38%', left: '32%', size: 'w-6 h-6 md:w-8 md:h-8', bg: 'bg-slate-300', z: 'z-10' }, // Next to knife
}

const FALLBACK_KITCHEN: KitchenItem[] = [
  { name: 'Basic Stove', requiredLevel: 'Default', icon: 'Flame', unlocked: true, description: 'The foundation of every kitchen.', hint: '' }
]

export function VirtualKitchen({ items }: { items?: KitchenItem[] }) {
  const displayItems = items && items.length > 1 ? items : FALLBACK_KITCHEN
  const unlockedCount = displayItems.filter(i => i.unlocked).length
  const progress = Math.round((unlockedCount / displayItems.length) * 100) || 0

  const handleInteract = (item: KitchenItem) => {
    if (item.unlocked) {
      toast.success(`Interacting with: ${item.name}`, {
        description: item.description,
        icon: <Flame className="w-4 h-4 text-orange-500" />
      })
    } else {
      toast.error(`${item.name} is Locked`, {
        description: item.hint,
        icon: <Lock className="w-4 h-4 text-stone-500" />
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar Header */}
      <div className="space-y-2 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <div className="flex flex-col">
            <span className="font-bold text-stone-800 text-lg">Master Kitchen</span>
            <span className="text-xs font-medium text-stone-500">{unlockedCount} of {displayItems.length} Equipment Unlocked</span>
          </div>
          <span className="font-black text-orange-500 text-3xl">{progress}%</span>
        </div>
        <div className="w-full bg-stone-100 h-4 rounded-full overflow-hidden shadow-inner border border-stone-200/50 mt-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-orange-500 h-full transition-all duration-1000 ease-out relative" 
            style={{ width: `${progress}%` }} 
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>

      {/* THE 2D VISUAL ROOM */}
      <div className="relative w-full aspect-[4/3] md:aspect-video bg-[#f0f4f8] rounded-[2rem] overflow-hidden border-8 border-stone-300 shadow-2xl ring-1 ring-black/5">
        
        {/* --- ARCHITECTURE & ENVIRONMENT --- */}
        
        {/* 1. Wall Tiles (Subway pattern) */}
        <div className="absolute top-[35%] w-full h-[25%] opacity-30" 
             style={{ backgroundImage: 'linear-gradient(90deg, #94a3b8 1px, transparent 1px), linear-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 20px' }} />

        {/* 2. Window (Center Wall with glowing sunlight effect) */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-48 h-32 md:w-64 md:h-40 bg-sky-200 border-[10px] border-white shadow-[inset_0_0_30px_rgba(255,255,255,1),0_10px_30px_rgba(56,189,248,0.2)] flex overflow-hidden z-0">
            <div className="w-3 h-full bg-white absolute left-1/2 -translate-x-1/2 z-10" />
            <div className="w-full h-3 bg-white absolute top-1/2 -translate-y-1/2 z-10" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-100/80 rounded-full blur-2xl animate-pulse" />
        </div>

        {/* 3. Range Hood (Above the stove) */}
        <div className="absolute top-[0%] left-1/2 -translate-x-1/2 w-32 md:w-44 h-[15%] bg-stone-300 border-b-4 border-stone-400 z-10 rounded-b-xl shadow-lg flex flex-col items-center justify-end pb-2">
            <div className="w-full h-2 bg-stone-800/20" />
        </div>

        {/* 4. Floating Shelves (Left and Right) */}
        <div className="absolute top-[28%] left-[20%] w-[15%] h-3 bg-amber-800/90 border-b-4 border-amber-950 shadow-xl rounded-sm z-0" />
        <div className="absolute top-[28%] right-[15%] w-[25%] h-3 bg-amber-800/90 border-b-4 border-amber-950 shadow-xl rounded-sm z-0" />

        {/* 5. The Countertop (Marble effect) */}
        <div className="absolute top-[60%] w-full h-8 bg-stone-100 border-t border-b-4 border-stone-300 shadow-[0_15px_30px_rgba(0,0,0,0.15)] z-10" 
             style={{ backgroundImage: 'linear-gradient(90deg, #f5f5f4 0%, #e7e5e4 50%, #f5f5f4 100%)' }}/>
        
        {/* 6. Lower Cabinets & Floor Area */}
        <div className="absolute top-[60%] bottom-0 w-full bg-stone-800" />
        <div className="absolute top-[65%] bottom-0 w-full opacity-10 flex divide-x-4 divide-stone-900">
            {[1,2,3,4,5,6].map(i => <div key={i} className="flex-1" />)}
        </div>

        {/* 7. Kitchen Floor Rug (Center floor) */}
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[60%] h-[15%] bg-red-900/40 rounded-full blur-[2px] border-2 border-red-950/20 transform skew-x-12" />

        {/* 8. Animated Steam (Only if Stove is unlocked) */}
        {displayItems.find(i => i.name === 'Basic Stove')?.unlocked && (
            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-20 h-32 z-20 pointer-events-none flex justify-center gap-2 opacity-50">
                <div className="w-2 h-full bg-white blur-md animate-[ping_3s_infinite_ease-in-out]" />
                <div className="w-3 h-full bg-white blur-md animate-[ping_4s_infinite_ease-in-out_0.5s]" />
                <div className="w-2 h-full bg-white blur-md animate-[ping_3.5s_infinite_ease-in-out_1s]" />
            </div>
        )}
        
        {/* --- RENDER THE 16 EQUIPMENT PIECES --- */}
        {displayItems.map((item) => {
          const IconComponent = iconMap[item.icon] || Flame
          const pos = ROOM_POSITIONS[item.name] || { top: '50%', left: '50%', size: 'w-16 h-16', bg: 'bg-stone-500', z: 'z-30' }

          return (
            <div
              key={item.name}
              onClick={() => handleInteract(item)}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-2xl transition-all duration-500 group",
                pos.size, pos.z,
                item.unlocked 
                  ? `${pos.bg} shadow-2xl hover:-translate-y-[10%] hover:scale-110 cursor-pointer border border-white/10` 
                  : "bg-stone-200/40 backdrop-blur-md grayscale border-2 border-stone-400 border-dashed shadow-none cursor-pointer hover:bg-stone-200/60"
              )}
              style={{ top: pos.top, left: pos.left }}
            >
              <IconComponent className={cn(
                "w-1/2 h-1/2 transition-all duration-300",
                item.unlocked ? "text-white" : "text-stone-500/60"
              )} />

              {/* Hover Tooltip - Now shows on BOTH locked and unlocked items */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl flex flex-col items-center min-w-[140px] z-50">
                <span className="font-bold">{item.name}</span>
                <span className={cn("text-[10px] mt-0.5", item.unlocked ? "text-stone-300" : "text-orange-400 font-bold")}>
                  {item.unlocked ? item.description : `Locked: ${item.requiredLevel}`}
                </span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45" />
              </div>

              {/* Lock Overlay for Locked Items */}
              {!item.unlocked && (
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-stone-200 z-20 group-hover:scale-110 transition-transform">
                  <Lock className="w-3 h-3 text-stone-400" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}