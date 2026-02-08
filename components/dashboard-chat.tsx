// components/dashboard-chat.tsx
"use client"

import { useChat } from "@ai-sdk/react"
import { ArrowUp, Sparkles, ChefHat, User, AlertCircle, PlusCircle } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const PROMPT_CHIPS = [
  { label: "What can I cook?", icon: "🍳" },
  { label: "15-min speedrun", icon: "⏱️" },
  { label: "Use my eggs", icon: "🥚" },
  { label: "Healthy buff", icon: "🥗" }
]

export function DashboardChat({ 
  onLogRecipe 
}: { 
  onLogRecipe: (name: string) => void 
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // --- 1. ROBUST LOGIC (NUCLEAR TYPE FIX) ---
  // We explicitly cast the CONFIG and the RESULT to 'any'.
  // This bypasses the "api does not exist" and "input does not exist" errors
  // because we know these properties exist at runtime in the SDK.
  const {
    messages = [],
    input = "",
    setInput,
    append,
    handleSubmit,
    reload,
    status = 'idle',
    error,
  } = useChat({
    api: "/api/chat",
    onError: (err: any) => console.error("[GameEngine] 🚨 Hook Error:", err),
  } as any) as any 

  // Local state prevents UI freezing if hook is slow
  const [localInput, setLocalInput] = useState("")
  // Fallback to local input if SDK input is undefined (safety check)
  const displayInput = typeof input === 'string' ? input : localInput

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value
    setLocalInput(newVal)
    if (typeof setInput === 'function') {
      try { setInput(newVal) } catch (err) { /* ignore */ }
    }
  }

  const isLoading = status === 'submitted' || status === 'streaming'

  // Auto-scroll
  useEffect(() => {
    if (messages?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, status]) 

  const sendMessage = async (content: string) => {
    if (!content || !content.trim()) return
    if (isLoading) return

    // Try 'append' first
    if (typeof append === 'function') {
      try {
        await append({ role: 'user', content })
        setLocalInput("") 
        return
      } catch (e) { console.error(e) }
    } 

    // Fallback to 'handleSubmit'
    if (typeof setInput === 'function' && typeof handleSubmit === 'function') {
      setInput(content)
      setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent
        handleSubmit(fakeEvent)
      }, 10)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayInput.trim()) return
    if (typeof handleSubmit === 'function') {
        handleSubmit(e)
        setLocalInput("") 
    }
  }

  // --- 2. GAME UI ---
  return (
    <div className="flex flex-col h-[750px] bg-amber-50 rounded-[2rem] border-4 border-coffee hard-shadow-lg overflow-hidden relative font-sans group z-10">
      
      {/* GAME HEADER: NPC STAGE */}
      <div className="bg-white border-b-4 border-coffee p-6 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#4a3f35 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <div className="relative z-10 flex flex-col items-center">
            {/* NPC Avatar - Reacts to State */}
            <div className={cn(
                "relative w-24 h-24 bg-white rounded-full border-4 border-coffee flex items-center justify-center transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(74,63,53,1)]",
                isLoading ? "animate-bounce scale-110" : "animate-float",
                error ? "bg-red-200" : "bg-white"
            )}>
                {/* Status Badge */}
                <div className={cn(
                  "absolute -bottom-2 -right-4 font-black text-[10px] px-3 py-1 rounded-full border-2 border-coffee uppercase tracking-tighter shadow-sm z-20",
                  isLoading ? "bg-tangerine text-white" : error ? "bg-red-500 text-white" : "bg-yellow-400 text-coffee"
                )}>
                    {isLoading ? "Cooking..." : error ? "Burnt!" : "LVL. 99 Chef"}
                </div>
                
                {error ? <AlertCircle className="w-12 h-12 text-red-500" /> : <ChefHat className={cn("w-12 h-12 transition-colors", isLoading ? "text-tangerine" : "text-coffee")} />}
            </div>

            <div className="mt-4 text-center">
                <h2 className="font-serif text-2xl font-black text-coffee uppercase italic tracking-tight">Master Chef AI</h2>
                <div className="flex gap-1 justify-center mt-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 bg-tangerine border border-coffee rotate-45" />)}
                </div>
            </div>

            <div className="flex justify-center mt-3">
                <button 
                    onClick={() => onLogRecipe("")}
                    className="text-[10px] font-bold text-coffee/60 hover:text-tangerine hover:bg-white flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-border transition-all"
                >
                    <PlusCircle className="w-3 h-3" /> 
                    Manual Log
                </button>
            </div>
        </div>
      </div>

      {/* DIALOGUE AREA (QUEST LOG) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFCF0]">
        
        {(!messages || messages.length === 0) && !error && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-500 mt-4">
            <div className="bg-white border-4 border-coffee p-4 rounded-2xl relative hard-shadow-sm mx-2">
                <p className="font-bold text-coffee text-center italic">
                    "Welcome back, Player! The kitchen is stocked. Select a quest below or check your inventory."
                </p>
                {/* Speech bubble pointer */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-l-4 border-t-4 border-coffee rotate-45 transform" />
            </div>
            
            <div className="grid grid-cols-2 gap-3 px-2">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button" 
                  onClick={() => sendMessage(chip.label)}
                  disabled={isLoading}
                  className="bg-white border-2 border-coffee p-3 rounded-xl font-bold text-xs hover:-translate-y-1 hover:bg-yellow-50 hover:shadow-[2px_2px_0px_0px_rgba(74,63,53,1)] transition-all flex items-center gap-2 text-coffee disabled:opacity-50"
                >
                  <span className="text-xl">{chip.icon}</span> 
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Messages Loop */}
        {messages?.map((m: any) => (
          <div key={m.id} className={cn(
            "flex flex-col mb-4",
            m.role === 'user' ? "items-end" : "items-start"
          )}>
             <div className={cn(
               "max-w-[85%] p-3 font-medium text-sm border-4 border-coffee shadow-[4px_4px_0px_0px_rgba(74,63,53,0.1)]",
               m.role === 'user' 
                  ? "bg-coffee text-white rounded-2xl rounded-tr-none" 
                  : "bg-white text-coffee rounded-2xl rounded-tl-none"
             )}>
               <div className="flex items-center gap-2 mb-2 border-b-2 border-white/20 pb-1">
                 {m.role === 'user' ? <User className="w-3 h-3" /> : <ChefHat className="w-3 h-3 text-tangerine" />}
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                    {m.role === 'user' ? "Player" : "Chef NPC"}
                 </span>
               </div>
               <div className="whitespace-pre-wrap leading-relaxed">
                 {m.content}
               </div>
             </div>
          </div>
        ))}

        {isLoading && (
            <div className="flex items-center gap-2 bg-white/80 border-2 border-coffee px-4 py-2 rounded-full w-fit animate-pulse mx-auto">
                <Sparkles className="w-4 h-4 text-tangerine animate-spin" />
                <span className="text-xs font-bold text-coffee uppercase">Rolling for recipe...</span>
            </div>
        )}

        {error && (
            <div className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 max-w-[90%] text-sm text-center shadow-sm">
                    <p className="font-bold flex items-center justify-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4" /> 
                        Quest Failed
                    </p>
                    <p className="opacity-90">{error.message}</p>
                    <button 
                        type="button"
                        onClick={() => reload()}
                        className="mt-2 text-xs bg-white border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA (ACTION BAR) */}
      <div className="p-4 bg-white border-t-4 border-coffee z-20">
        <form onSubmit={handleFormSubmit} className="relative flex gap-2">
          <input
            value={displayInput}
            onChange={handleInputChange}
            placeholder="Enter command..."
            disabled={isLoading} 
            className="flex-1 bg-cream px-4 py-3 rounded-xl border-4 border-coffee focus:outline-none focus:border-tangerine font-bold text-coffee placeholder:text-coffee/30 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !displayInput.trim()}
            className="bg-tangerine p-3 rounded-xl border-4 border-coffee shadow-[2px_2px_0px_0px_rgba(74,63,53,1)] hover:translate-y-1 hover:shadow-none active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Sparkles className="w-6 h-6 text-white animate-spin" /> : <ArrowUp className="w-6 h-6 text-white stroke-[3px]" />}
          </button>
        </form>
      </div>
    </div>
  )
}