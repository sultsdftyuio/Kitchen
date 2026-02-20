// components/virtual-kitchen.tsx
"use client"

import { useState, useEffect } from "react"
import { Flame, Coffee, Utensils, Knife, Leaf, Wind } from "lucide-react"
import { cn } from "@/lib/utils"

// We map the string items from your database to visual placements
export function VirtualKitchen({ items = [] }: { items?: any[] }) {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'night'>('morning')
  const [isHoveringStove, setIsHoveringStove] = useState(false)
  const [mixerSpin, setMixerSpin] = useState(false)

  // Real-time lighting
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 16) setTimeOfDay('morning')
    else if (hour >= 16 && hour < 19) setTimeOfDay('afternoon')
    else setTimeOfDay('night')
  }, [])

  // Safely check if an item is unlocked (mocking progression if empty)
  const hasItem = (name: string) => {
    if (items.length === 0) return true // Show all for preview purposes if no items passed
    return items.some(i => (typeof i === 'string' ? i : i.name)?.toLowerCase().includes(name.toLowerCase()))
  }

  // Lighting Overlays
  const lighting = {
    morning: "bg-blue-500/5 mix-blend-overlay",
    afternoon: "bg-orange-500/20 mix-blend-color-burn",
    night: "bg-indigo-900/60 mix-blend-multiply"
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] bg-[#F8F9FA] rounded-[32px] overflow-hidden border-4 border-slate-100 shadow-inner group transition-colors duration-1000 select-none">
      
      {/* 1. THE WALL (Subway Tile Backsplash) */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: '40px 20px'
        }}
      />

      {/* 2. THE FLOATING SHELF */}
      <div className="absolute top-[35%] left-[10%] right-[10%] h-4 bg-amber-800 rounded-full shadow-[0_20px_20px_rgba(0,0,0,0.1)] border-b-4 border-amber-900 z-10 flex items-end px-8 gap-6">
        
        {/* Item: Potted Plant (Streak Visualizer) */}
        {hasItem('plant') && (
          <div className="relative -mb-1 w-12 h-16 flex flex-col items-center justify-end hover:scale-110 transition-transform origin-bottom cursor-pointer drop-shadow-lg">
            {/* Leaves */}
            <div className="absolute top-0 flex gap-1 text-emerald-500 animate-pulse">
                <Leaf className="w-5 h-5 -rotate-45" fill="currentColor" />
                <Leaf className="w-6 h-6 z-10" fill="currentColor" />
                <Leaf className="w-5 h-5 rotate-45" fill="currentColor" />
            </div>
            {/* Pot */}
            <div className="w-8 h-8 bg-orange-400 rounded-b-lg border-t-4 border-orange-500 z-20"></div>
          </div>
        )}

        {/* Item: Spice Jars */}
        <div className="flex gap-1.5 -mb-1 ml-auto">
            {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-8 bg-rose-200 rounded-t-sm border-b-2 border-rose-300 relative drop-shadow-md hover:-translate-y-1 transition-transform">
                    <div className="absolute -top-1.5 left-0.5 right-0.5 h-1.5 bg-amber-700 rounded-t-sm"></div>
                </div>
            ))}
        </div>
      </div>

      {/* 3. THE COUNTERTOP (Butcher Block) */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-amber-600 border-t-[12px] border-amber-500 shadow-[0_-20px_40px_rgba(0,0,0,0.15)] z-20 flex items-end px-12 justify-between">
        
        {/* Item: Stand Mixer */}
        {hasItem('mixer') && (
          <div 
            onClick={() => setMixerSpin(true)}
            onAnimationEnd={() => setMixerSpin(false)}
            className="relative -mb-4 w-24 h-32 cursor-pointer group/mixer drop-shadow-2xl hover:scale-105 transition-transform origin-bottom"
          >
            {/* Base */}
            <div className="absolute bottom-4 w-20 h-6 bg-red-600 rounded-t-xl rounded-b-md left-2 z-10 border-b-4 border-red-800"></div>
            {/* Stand */}
            <div className="absolute bottom-10 w-6 h-20 bg-red-500 right-2 z-0 rounded-t-xl"></div>
            {/* Top Head */}
            <div className={cn("absolute top-2 w-24 h-10 bg-red-500 rounded-full z-20 transition-transform origin-right shadow-inner", mixerSpin && "animate-bounce")}></div>
            {/* Bowl */}
            <div className="absolute bottom-10 w-14 h-12 bg-slate-300 rounded-b-3xl left-2 z-30 shadow-inner border-t-2 border-slate-200 flex items-center justify-center">
               <Wind className={cn("w-6 h-6 text-slate-400 opacity-0 transition-opacity", mixerSpin && "opacity-100 animate-spin")} />
            </div>
          </div>
        )}

        {/* Item: Cutting Board & Knife */}
        <div className="relative -mb-6 w-32 h-10 flex items-center justify-center z-20 drop-shadow-xl hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="absolute bottom-6 w-full h-4 bg-amber-200 rounded-sm border-b-4 border-amber-300 shadow-lg"></div>
            {hasItem('knife') && (
                <div className="absolute bottom-7 left-4 w-16 h-3 bg-slate-300 rounded-r-full border-b-2 border-slate-400 rotate-[-5deg] z-30">
                    <div className="absolute -left-4 top-0 w-5 h-3 bg-slate-800 rounded-l-sm"></div>
                </div>
            )}
        </div>

        {/* Item: The Smart Stove */}
        {hasItem('stove') && (
            <div 
                onMouseEnter={() => setIsHoveringStove(true)}
                onMouseLeave={() => setIsHoveringStove(false)}
                className="relative -mb-2 w-36 h-24 bg-slate-800 rounded-t-2xl border-t-8 border-slate-700 z-20 flex flex-col items-center drop-shadow-2xl transition-transform hover:scale-[1.02]"
            >
                {/* Burner Grates */}
                <div className="w-full h-4 bg-slate-900 rounded-t-xl flex justify-around px-4">
                    <div className="w-10 h-2 bg-slate-700 rounded-b-lg mt-1 relative">
                        {isHoveringStove && <Flame className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-orange-500 fill-orange-500 animate-pulse" />}
                    </div>
                    <div className="w-10 h-2 bg-slate-700 rounded-b-lg mt-1 relative">
                        {isHoveringStove && <Flame className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse delay-75" />}
                    </div>
                </div>
                {/* Stove Front / Knobs */}
                <div className="flex gap-4 mt-4">
                    <div className={cn("w-4 h-4 rounded-full transition-all duration-300", isHoveringStove ? "bg-orange-500 shadow-[0_0_10px_#f97316]" : "bg-slate-600")}></div>
                    <div className="w-4 h-4 rounded-full bg-slate-600"></div>
                    <div className="w-4 h-4 rounded-full bg-slate-600"></div>
                </div>
                {/* Digital Clock */}
                <div className="mt-4 px-3 py-1 bg-black rounded border border-slate-700">
                    <span className="text-[10px] text-red-500 font-mono tracking-widest">{timeOfDay === 'night' ? '21:00' : '10:30'}</span>
                </div>
            </div>
        )}
      </div>

      {/* 4. REAL-TIME LIGHTING OVERLAY */}
      <div className={cn("absolute inset-0 pointer-events-none transition-colors duration-1000 z-50", lighting[timeOfDay])}></div>
      
      {/* Dynamic Sun/Moon Light Ray */}
      {timeOfDay !== 'night' && (
         <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/20 blur-3xl rounded-full pointer-events-none z-40 transform -rotate-45 mix-blend-overlay"></div>
      )}
      {timeOfDay === 'night' && (
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-amber-500/10 blur-2xl pointer-events-none z-40"></div>
      )}
      
    </div>
  )
}