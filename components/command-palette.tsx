// components/command-palette.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, Package, UtensilsCrossed, ArrowRight, X } from "lucide-react"

export function CommandPalette({
  pantryItems,
  history,
  onNavigate
}: {
  pantryItems: any[]
  history: any[]
  onNavigate: (tab: 'pantry' | 'history') => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!isOpen) return null

  const filteredPantry = pantryItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 3)

  const filteredHistory = history.filter(item => 
    item.dish_name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 3)

  const handleSelect = (tab: 'pantry' | 'history') => {
    onNavigate(tab)
    setIsOpen(false)
    setSearch("")
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl border-2 border-border hard-shadow-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b-2 border-border bg-cream/30">
          <Search className="w-5 h-5 text-coffee/50 mr-3" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ingredients, past meals... (Press Esc to close)"
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-coffee font-medium placeholder:text-coffee/40"
            onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          />
          <button onClick={() => setIsOpen(false)} className="bg-muted p-1 rounded-md text-coffee/50 hover:text-coffee border border-border/20">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
          {search.trim() === "" ? (
            <div className="p-8 text-center text-coffee/50 font-medium text-sm">
              Start typing to search your kernelcook.
            </div>
          ) : (
            <div className="space-y-4 p-2">
              {/* Pantry Results */}
              {filteredPantry.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase text-coffee/40 tracking-wider mb-2 px-2">In Pantry</h4>
                  {filteredPantry.map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => handleSelect('pantry')}
                      className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-butter/50 group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-butter p-2 rounded-lg border border-border/10"><Package className="w-4 h-4 text-coffee" /></div>
                        <span className="font-bold text-coffee capitalize">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-coffee/50 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* History Results */}
              {filteredHistory.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase text-coffee/40 tracking-wider mb-2 px-2">Cooking History</h4>
                  {filteredHistory.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => handleSelect('history')}
                      className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-lavender/50 group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-lavender p-2 rounded-lg border border-border/10"><UtensilsCrossed className="w-4 h-4 text-coffee" /></div>
                        <span className="font-bold text-coffee capitalize">{item.dish_name}</span>
                      </div>
                      <span className="text-xs font-bold text-coffee/50 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {filteredPantry.length === 0 && filteredHistory.length === 0 && (
                <div className="p-8 text-center text-coffee/50 font-medium text-sm">
                  No results found for "{search}".
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-muted/30 p-3 border-t border-border/10 flex justify-between items-center text-[10px] font-bold text-coffee/40 uppercase">
          <span>Kerenlcook Global Search</span>
          <span className="flex items-center gap-1">Press <kbd className="bg-white px-1.5 py-0.5 rounded border border-border/20 font-mono">esc</kbd> to close</span>
        </div>
      </div>
    </div>
  )
}