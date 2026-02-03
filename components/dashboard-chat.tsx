// components/dashboard-chat.tsx
"use client"

import { useChat } from "@ai-sdk/react"
import { ArrowUp, Sparkles, ChefHat } from "lucide-react"
import { useRef, useEffect } from "react"

export function DashboardChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom only if messages exist
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl border-2 border-border hard-shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-cream p-4 border-b-2 border-border flex items-center gap-3">
        <div className="bg-tangerine p-2 rounded-xl text-white border-2 border-border hard-shadow-sm">
          <ChefHat className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-coffee">Chef AI</h2>
          <p className="text-xs text-coffee-dark/60">Ready to cook!</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 scrollbar-thin scrollbar-thumb-coffee/20">
        {messages.length === 0 && (
          <div className="text-center py-10 text-coffee-dark/50 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-tangerine/50" />
            <p>What are we cooking today?</p>
            <p className="text-xs">I can see your pantry items!</p>
          </div>
        )}
        
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
               m.role === 'user' 
                 ? 'bg-tangerine text-white rounded-br-none hard-shadow-sm' 
                 : 'bg-white border-2 border-border text-coffee rounded-bl-none hard-shadow-sm'
             }`}>
               <p className="whitespace-pre-wrap">{m.content}</p>
             </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-border text-coffee rounded-2xl rounded-bl-none p-3 text-sm flex gap-1 hard-shadow-sm">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t-2 border-border">
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask for a recipe..."
            className="w-full bg-muted pl-4 pr-12 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-tangerine text-white rounded-lg border-2 border-border hover:translate-y-0.5 transition-transform disabled:opacity-50"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}