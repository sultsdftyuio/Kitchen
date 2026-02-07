// components/dashboard-chat.tsx
"use client"

import { useChat } from "@ai-sdk/react"
import { ArrowUp, Sparkles, ChefHat, PlusCircle, Utensils, AlertCircle, Terminal } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const PROMPT_CHIPS = [
  { label: "What can I cook?", icon: "🍳" },
  { label: "15-min recipe", icon: "⏱️" },
  { label: "Use my eggs", icon: "🥚" },
  { label: "Something healthy", icon: "🥗" }
]

export function DashboardChat({ 
  onLogRecipe 
}: { 
  onLogRecipe: (name: string) => void 
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // 1. Initialize Hook without casting to 'any' initially to catch type errors
  const chatHook = useChat({
    api: "/api/chat",
    onError: (err) => console.error("[UI/Chat] 🚨 Hook Error:", err),
    onFinish: (msg) => console.log("[UI/Chat] ✅ Stream Finished", msg),
    onResponse: (res) => console.log("[UI/Chat] 📡 Response:", res.status)
  })

  // 2. Destructure with safety checks
  const { 
    messages, 
    input,
    setInput,
    append, 
    handleSubmit,
    reload, 
    status, 
    error, 
  } = chatHook

  const isLoading = status === 'submitted' || status === 'streaming'

  // 3. DEBUG: Inspect the hook immediately
  useEffect(() => {
    console.group("[UI/Chat] Hook Inspection")
    console.log("Keys available:", Object.keys(chatHook))
    console.log("Has append?", typeof append === 'function')
    console.log("Has handleSubmit?", typeof handleSubmit === 'function')
    console.groupEnd()
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (messages?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, status]) 

  // 4. Enhanced Send Function
  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    console.log(`[UI/Chat] 🚀 Attempting to send: "${content}"`)

    // Strategy A: Try 'append' (Direct Message Injection)
    if (typeof append === 'function') {
      try {
        console.log("[UI/Chat] 👉 Using 'append' strategy")
        await append({ role: 'user', content })
        return
      } catch (e) {
        console.error("[UI/Chat] ❌ 'append' failed:", e)
      }
    } 

    // Strategy B: Try 'handleSubmit' (Form Simulation)
    // This requires setting the input state first, then firing the event
    if (typeof setInput === 'function' && typeof handleSubmit === 'function') {
      console.log("[UI/Chat] 👉 Using 'handleSubmit' fallback strategy")
      setInput(content)
      // We need to yield to render cycle so 'input' updates before submitting
      setTimeout(() => {
        // Create a fake form event
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent
        handleSubmit(fakeEvent)
      }, 10)
      return
    }

    console.error("[UI/Chat] 💀 ALL SEND STRATEGIES FAILED. Hook is broken.")
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Log what we are trying to do
    console.log("[UI/Chat] 📝 Manual Form Submit triggered")
    
    if (typeof handleSubmit === 'function') {
        handleSubmit(e)
    } else {
        console.error("[UI/Chat] ❌ handleSubmit is missing!")
        // Attempt fallback to append if input is set
        if (input && typeof append === 'function') {
            append({ role: 'user', content: input })
            setInput('')
        }
    }
  }

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-3xl border-2 border-border hard-shadow-lg overflow-hidden relative group z-10">
      
      {/* HEADER */}
      <div className="relative z-10 p-6 pb-2 border-b-2 border-border/10">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className={cn(
                "relative w-20 h-20 bg-cream rounded-full border-2 border-border flex items-center justify-center shadow-md",
                isLoading ? "animate-bounce" : error ? "animate-none bg-red-100 border-red-300" : "animate-float"
            )}>
                <div className={cn(
                  "absolute -top-2 -right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-border transform rotate-12",
                  error ? "bg-red-500" : "bg-tangerine"
                )}>
                    {isLoading ? "Cooking..." : error ? "Error!" : "Ready!"}
                </div>
                {error ? <AlertCircle className="w-10 h-10 text-red-500" /> : <ChefHat className="w-10 h-10 text-coffee" />}
            </div>
            <div>
                <h2 className="font-serif text-2xl font-bold text-coffee">Chef AI</h2>
                <p className="text-xs font-medium text-coffee-dark/60 uppercase tracking-wider">
                    {isLoading ? "Chopping & Sautéing..." : error ? "Kitchen Fire!" : "Waiting for orders"}
                </p>
            </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white/50 relative z-10 scrollbar-thin">
        
        {/* DEBUG INFO PANEL (Remove in production) */}
        <div className="bg-slate-100 border border-slate-300 p-2 rounded text-[10px] text-slate-600 font-mono mb-4">
            <p className="font-bold flex gap-2 items-center"><Terminal className="w-3 h-3"/> Debug Status:</p>
            <p>Msg Count: {messages?.length || 0}</p>
            <p>Append: {typeof append === 'function' ? '✅' : '❌'}</p>
            <p>Submit: {typeof handleSubmit === 'function' ? '✅' : '❌'}</p>
            <p>Status: {status}</p>
        </div>

        {(!messages || messages.length === 0) && !error && (
          <div className="mt-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="inline-block p-4 bg-muted/30 rounded-full mb-2">
                <Utensils className="w-8 h-8 text-coffee/40" />
            </div>
            <div className="px-6">
                <p className="font-medium text-coffee text-lg">"What ingredients are we working with today?"</p>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button" 
                  onClick={() => sendMessage(chip.label)}
                  disabled={isLoading}
                  className="text-xs text-left bg-white p-3 rounded-xl border-2 border-border/50 text-coffee hover:border-tangerine hover:shadow-sm transition-all group/chip disabled:opacity-50"
                >
                  <span className="text-lg mr-2 group-hover/chip:scale-110 inline-block transition-transform">{chip.icon}</span>
                  <span className="font-bold">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages?.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}>
             {m.role !== 'user' && (
                 <div className="w-6 h-6 rounded-full bg-tangerine/20 flex items-center justify-center border border-tangerine/50 mb-1 shrink-0">
                    <ChefHat className="w-3 h-3 text-tangerine" />
                 </div>
             )}
             <div className={cn(
               "max-w-[85%] p-4 text-sm shadow-sm relative",
               m.role === 'user' 
                 ? "bg-coffee text-white rounded-2xl rounded-br-none border-2 border-transparent" 
                 : "bg-cream text-coffee rounded-2xl rounded-bl-none border-2 border-border"
             )}>
               <div className="whitespace-pre-wrap leading-relaxed">
                 {m.content}
               </div>
             </div>
          </div>
        ))}

        {isLoading && (
            <div className="flex justify-start items-end gap-2">
               <div className="w-6 h-6 rounded-full bg-tangerine/20 flex items-center justify-center border border-tangerine/50 mb-1 shrink-0">
                    <ChefHat className="w-3 h-3 text-tangerine" />
               </div>
               <div className="bg-cream border-2 border-border text-coffee rounded-2xl rounded-bl-none p-4 py-3 text-sm flex gap-1.5 shadow-sm items-center">
                 <span className="w-2 h-2 bg-coffee/40 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-coffee/40 rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-coffee/40 rounded-full animate-bounce delay-200"></span>
               </div>
            </div>
        )}

        {error && (
            <div className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 max-w-[90%] text-sm text-center shadow-sm">
                    <p className="font-bold flex items-center justify-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4" /> 
                        Oops, something burned.
                    </p>
                    <p className="opacity-90">{error.message}</p>
                    <div className="text-xs mt-2 p-2 bg-white border border-red-100 rounded text-left overflow-auto max-h-20">
                        {JSON.stringify(error)}
                    </div>
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

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t-2 border-border z-20">
        <form onSubmit={handleFormSubmit} className="relative group/input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Chef..."
            disabled={isLoading} 
            className="w-full bg-muted/50 pl-4 pr-12 py-4 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine focus:ring-2 focus:ring-tangerine/20 text-coffee placeholder:text-coffee/40 transition-all font-medium disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-tangerine text-white rounded-lg border-2 border-border hover:translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
          >
            {isLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-6 h-6" />}
          </button>
        </form>
      </div>
    </div>
  )
}