// components/virtual-kitchen.tsx
"use client"

import { KitchenItem } from "@/app/actions/gamification"
import { Flame, Leaf, Utensils, Coffee, Thermometer, Lock, CookingPot, CircleDashed } from "lucide-react"
import { cn } from "@/lib/utils"

// Dynamic icon mapping based on strings from the database
const iconMap: Record<string, any> = {
  Flame,
  Leaf,
  CircleDashed, // Used for Pan
  Utensils,     // Used for Knife
  CookingPot,   // Used for Dutch Oven
  Thermometer,  // Used for Sous-Vide
  Coffee        // Used for Espresso Machine
}

export function VirtualKitchen({ items }: { items: KitchenItem[] }) {
  // Calculate completion percentage
  const unlockedCount = items.filter(i => i.unlocked).length
  const totalCount = items.length
  const progress = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-stone-600">Equipment Unlocked</span>
        <span className="font-bold text-orange-500">{progress}%</span>
      </div>
      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-orange-500 h-full transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
        {items.map((item, index) => {
          const IconComponent = iconMap[item.icon] || Flame

          return (
            <div
              key={index}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 text-center group h-32",
                item.unlocked
                  ? "bg-white border-orange-200 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-orange-400 cursor-pointer"
                  : "bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed"
              )}
            >
              {/* The Icon */}
              <div className={cn(
                "p-3 rounded-full mb-2 transition-colors",
                item.unlocked 
                  ? "bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white shadow-inner" 
                  : "bg-stone-200 text-stone-400 grayscale"
              )}>
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Item Details */}
              <span className={cn(
                "text-xs font-bold leading-tight",
                item.unlocked ? "text-stone-800" : "text-stone-400"
              )}>
                {item.name}
              </span>

              {/* Hover Tooltip / Description for unlocked items */}
              {item.unlocked && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 shadow-lg">
                  {item.description}
                </div>
              )}

              {/* Locked State Overlay */}
              {!item.unlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100/80 rounded-2xl backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock className="w-5 h-5 text-stone-500 mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-stone-500 text-center px-1">
                    Unlocks at<br/>{item.requiredLevel}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}