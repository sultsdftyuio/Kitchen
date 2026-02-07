// components/dashboard-chat.tsx
"use client"

import { useChat } from "@ai-sdk/react"
import { ArrowUp, Sparkles, ChefHat, PlusCircle, Utensils, AlertCircle, Terminal } from "lucide-react"
import { useRef, useEffect, useState, Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"
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
  
  // 1. Initialize Hook with defensive handling
  const chatHook = useChat({
    api: "/api/chat",
    onError: (err: any) => console.error("[UI/Chat] 🚨 Hook Error:", err),
    onFinish: (msg: any) => console.log("[UI/Chat] ✅ Stream Finished", msg),
    onResponse: (res: any) => console.log("[UI/Chat] 📡 Response Status:", res.status)
  } as any) as any

  // 2. Destructure with Defaults
  const { 
    messages = [], 
    input,          // Might be undefined
    setInput,       // Might be undefined
    append, 
    handleSubmit,
    reload, 
    status = 'idle', 
    error, 
  } = chatHook

  // 3. Robust Input State Management
  // We use local state to ensure the UI never crashes or freezes, 
  // even if 'useChat' fails to provide 'input' or 'setInput'.
  const [localInput, setLocalInput] = useState("")
  
  // The actual value to display in the input box
  const displayInput = typeof input === 'string' ? input : localInput

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value
    
    // Always update local state so the user sees what they type
    setLocalInput(newVal)
    
    // Safely attempt to update the hook's state
    if (typeof setInput === 'function') {
      try {
        setInput(newVal)
      } catch (err) {
        console.warn("[UI/Chat] setInput failed, using local state only")
      }
    }
  }

  const isLoading = status === 'submitted' || status === 'streaming'

  // Auto-scroll
  useEffect(() => {
    if (messages?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, status]) 

  // 4. Enhanced Send Function
  const sendMessage = async (content: string) => {
    if (!content || !content.trim()) return
    if (isLoading) return

    console.log(`[UI/Chat] 🚀 Attempting to send: "${content}"`)

    // Strategy A: Try 'append'
    if (typeof append === 'function') {
      try {
        await append({ role: 'user', content })
        // Clear local input after successful send if manual
        setLocalInput("") 
        return
      } catch (e) {
        console.error("[UI/Chat] ❌ Strategy A failed:", e)
      }
    } 

    // Strategy B: Try 'handleSubmit' fallback
    if (typeof setInput === 'function' && typeof handleSubmit === 'function') {
      setInput(content)
      setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent
        handleSubmit(fakeEvent)
      }, 10)
      return
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Use displayInput (the safe value)
    if (!displayInput.trim()) return
    
    if (typeof handleSubmit === 'function') {
        handleSubmit(e)
        // Hook usually clears its own input, but we clear local just in case
        setLocalInput("") 
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

        <div className="flex justify-center mt-4 pb-2">
            <button 
                onClick={() => onLogRecipe("")}
                className="text-xs font-bold text-coffee/70 hover:text-tangerine hover:bg-white flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-border transition-all"
            >
                <PlusCircle className="w-3.5 h-3.5" /> 
                Log a Meal Manually
            </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white/50 relative z-10 scrollbar-thin">
        
        {(!messages || messages.length === 0) && !error && (
          <div className="mt-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="inline-block p-4 bg-muted/30 rounded-full mb-2">
                <Utensils className="w-8 h-8 text-coffee/40" />
            </div>
            <div className="px-6">
                <p className="font-medium text-coffee text-lg">"What ingredients are we working with today?"</p>
                <p className="text-sm text-coffee-dark/50 mt-1">I can see your pantry. Ask me anything!</p>
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
        
        {messages?.map((m: { id: Key | null | undefined; role: string; content: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
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
            value={displayInput}
            onChange={handleInputChange}
            placeholder="Ask Chef..."
            disabled={isLoading} 
            className="w-full bg-muted/50 pl-4 pr-12 py-4 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine focus:ring-2 focus:ring-tangerine/20 text-coffee placeholder:text-coffee/40 transition-all font-medium disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !displayInput.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-tangerine text-white rounded-lg border-2 border-border hover:translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
          >
            {isLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-6 h-6" />}
          </button>
        </form>
      </div>
    </div>
  )
}