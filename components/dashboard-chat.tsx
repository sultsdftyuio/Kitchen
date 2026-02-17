// components/dashboard-chat.tsx
"use client"

import { useChat } from "ai/react" 
import { ArrowUp, Sparkles, ChefHat, PlusCircle, Utensils, AlertCircle, Clock, CheckCircle2, Circle, Save, ChevronRight, Percent } from "lucide-react"
import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function DashboardChat({ 
  onLogRecipe,
  pantryCount = 0,
  activeTab = 'overview'
}: { 
  onLogRecipe: (name: string) => void 
  pantryCount?: number
  activeTab?: string
}) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    append,
    isLoading,
    error,
    reload 
  } = useChat({
    api: "/api/chat",
    onError: (err) => console.error("[UI/Chat] 🚨 Hook Error:", err),
  })

  useEffect(() => {
    if (messages?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading]) 

  const getSuggestionChips = () => {
    if (pantryCount === 0) {
      return [
        { label: "What are good pantry staples?", icon: "🛒" },
        { label: "Easy beginner meals", icon: "🍳" },
        { label: "Healthy grocery list", icon: "🥗" }
      ]
    }
    
    if (activeTab === 'pantry') {
      return [
        { label: "What can I make right now?", icon: "✨" },
        { label: "I need a quick snack", icon: "🥨" },
        { label: "Use my oldest ingredients", icon: "♻️" }
      ]
    }

    return [
      { label: "Give me a 30-min recipe", icon: "⏱️" },
      { label: "Surprise me with a recipe!", icon: "🎲" },
      { label: "High protein meal", icon: "💪" }
    ]
  }

  const handleChipClick = async (label: string) => {
    if (isLoading) return
    try {
      await append({ id: Math.random().toString(36).substring(7), role: 'user', content: label })
    } catch (e) {
      console.error("[UI/Chat] Chip send failed:", e)
    }
  }

  const handleDishSelect = (dishName: string, dishId: string) => {
    router.push(`/recipes/${dishId}/cook?name=${encodeURIComponent(dishName)}`)
  }

  const currentChips = getSuggestionChips()

  return (
    <div className="flex flex-col h-[700px] bg-white/80 backdrop-blur-2xl rounded-[24px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden relative z-10">
      
      {/* HEADER */}
      <div className="relative z-10 px-6 py-5 border-b border-slate-200/60 bg-white/50 flex flex-col items-center">
        <div className="flex items-center gap-4 w-full">
            <div className={cn(
                "relative w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center shadow-sm shrink-0",
                isLoading ? "bg-orange-50 animate-pulse" : error ? "bg-red-50" : "bg-gradient-to-br from-slate-50 to-slate-100"
            )}>
                {error ? <AlertCircle className="w-5 h-5 text-red-500" /> : <ChefHat className="w-5 h-5 text-slate-700" />}
                {isLoading && <span className="absolute top-0 right-0 w-3 h-3 bg-tangerine border-2 border-white rounded-full animate-ping"></span>}
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                  Chef AI {isLoading && <Sparkles className="w-3.5 h-3.5 text-tangerine animate-pulse" />}
                </h2>
                <p className="text-xs font-medium text-slate-500">
                    {isLoading ? "Thinking..." : error ? "Connection lost" : "Ready to cook"}
                </p>
            </div>
            <button 
                onClick={() => onLogRecipe("")}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
            >
                <PlusCircle className="w-3 h-3" /> Log Meal
            </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30 relative z-10 scrollbar-thin">
        
        {/* Empty State */}
        {(!messages || messages.length === 0) && !error && (
          <div className="mt-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex p-4 bg-white shadow-sm border border-slate-100 rounded-full mb-2">
                <Utensils className="w-6 h-6 text-slate-300" />
            </div>
            <div className="px-6">
                <p className="font-medium text-slate-700 text-[15px]">
                  {pantryCount === 0 
                    ? "Welcome to your kitchen! Let's get started." 
                    : `"What are we making with those ${pantryCount} items?"`}
                </p>
            </div>
            
            <div className="flex flex-col gap-2 px-6">
              {currentChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button" 
                  onClick={() => handleChipClick(chip.label)}
                  disabled={isLoading}
                  className="text-sm text-left bg-white px-4 py-3 rounded-xl border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all group/chip disabled:opacity-50 flex items-center"
                >
                  <span className="text-base mr-3 opacity-80 group-hover/chip:scale-110 transition-transform">{chip.icon}</span>
                  <span className="font-medium">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Message Feed */}
        {messages?.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-2 w-full`}>
             
             {(m.content || m.role === 'user') && (
                 <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-end'} gap-2 w-full`}>
                   {m.role !== 'user' && (
                       <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm mb-1 shrink-0">
                          <ChefHat className="w-3.5 h-3.5 text-slate-600" />
                       </div>
                   )}
                   {m.content && (
                       <div className={cn(
                         "max-w-[85%] px-4 py-2.5 text-[14px] shadow-sm relative leading-relaxed",
                         m.role === 'user' 
                           ? "bg-slate-900 text-white rounded-[20px] rounded-br-sm font-medium" 
                           : "bg-white text-slate-700 rounded-[20px] rounded-bl-sm border border-slate-200/60"
                       )}>
                         <div className="whitespace-pre-wrap">{m.content}</div>
                       </div>
                   )}
                 </div>
             )}

             {/* UI Tool Invocations */}
             {m.toolInvocations?.length ? (
                <div className="w-full flex justify-start pl-8 mt-1">
                  {m.toolInvocations.map((toolInvocation: any) => {
                    const { toolName, toolCallId, state } = toolInvocation;

                    if (toolName === 'suggestDishOptions') {
                      if (state !== 'result') {
                        return (
                          <div key={toolCallId} className="w-full max-w-[90%] p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3 animate-pulse shadow-sm">
                             <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                                <Sparkles className="w-4 h-4 text-slate-400" />
                             </div>
                             <div>
                                <p className="font-medium text-slate-700 text-sm">Brainstorming recipes...</p>
                                <p className="text-[11px] text-slate-400">Analyzing inventory match</p>
                             </div>
                          </div>
                        )
                      }

                      if (state === 'result') {
                        const dishes = toolInvocation.result;
                        return (
                          <div key={toolCallId} className="w-full flex flex-col gap-3 animate-in slide-in-from-bottom-2 fade-in duration-500">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Suggested Options</p>
                            <div className="grid grid-cols-1 gap-2.5 w-full max-w-[95%]">
                              {dishes.map((dish: any, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => handleDishSelect(dish.name, dish.id)}
                                  className="text-left bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 group hover:shadow-md transition-all relative flex flex-col gap-1.5"
                                >
                                  <div className="flex justify-between items-start w-full">
                                    <h4 className="font-semibold text-slate-900 text-[15px] leading-tight group-hover:text-tangerine transition-colors pr-6">
                                      {dish.name}
                                    </h4>
                                    <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 shrink-0">
                                      <Percent className="w-2.5 h-2.5" /> {dish.pantryMatch}%
                                    </div>
                                  </div>
                                  <p className="text-[13px] text-slate-500 line-clamp-2 leading-snug">
                                    {dish.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1.5 pt-2 border-t border-slate-100">
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                                      <Clock className="w-3 h-3" /> {dish.prepTime}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                                      <ChefHat className="w-3 h-3" /> {dish.difficulty}
                                    </span>
                                    <span className="ml-auto flex items-center text-[11px] font-bold text-tangerine opacity-0 group-hover:opacity-100 transition-opacity">
                                      View Recipe <ChevronRight className="w-3 h-3" />
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      }
                    }

                    if (toolName === 'generateRecipeCard') {
                      if (state !== 'result') return null; // handled similarly if needed
                      if (state === 'result') {
                        const recipe = toolInvocation.result;
                        return (
                          <div key={toolCallId} className="w-full max-w-[95%] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-500">
                            {/* Header */}
                            <div className="bg-slate-900 p-5 text-white relative">
                               <h3 className="text-lg font-semibold mb-1 relative z-10">{recipe.name}</h3>
                               <p className="text-slate-300 text-sm leading-relaxed relative z-10">{recipe.description}</p>
                               <div className="flex gap-2 mt-3 relative z-10">
                                  <span className="flex items-center gap-1.5 text-[11px] font-medium bg-white/10 px-2 py-1 rounded border border-white/5">
                                     <Clock className="w-3 h-3 text-slate-300" /> {recipe.prepTime}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-[11px] font-medium bg-white/10 px-2 py-1 rounded border border-white/5">
                                     <ChefHat className="w-3 h-3 text-slate-300" /> {recipe.difficulty}
                                  </span>
                               </div>
                            </div>

                            {/* Ingredients */}
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                 Ingredients
                              </h4>
                              <ul className="grid grid-cols-1 gap-1.5">
                                {recipe.ingredients.map((ing: any, i: number) => (
                                  <li key={i} className="flex items-center justify-between text-[13px] p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                                    <span className="flex items-center gap-2 text-slate-700 font-medium">
                                      {ing.inPantry ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                                      <span className="truncate">{ing.name}</span>
                                    </span>
                                    <span className="text-slate-500 text-xs whitespace-nowrap ml-2">{ing.amount}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Instructions */}
                            <div className="p-4 bg-white">
                              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Instructions</h4>
                              <div className="space-y-3">
                                 {recipe.instructions.map((step: string, i: number) => (
                                   <div key={i} className="flex gap-3">
                                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                      </span>
                                      <p className="text-[13px] text-slate-600 leading-relaxed">{step}</p>
                                   </div>
                                 ))}
                              </div>
                            </div>

                            {/* Action Footer */}
                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                              <button onClick={() => onLogRecipe(recipe.name)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                 <Save className="w-3.5 h-3.5" /> Save to History
                              </button>
                            </div>
                          </div>
                        )
                      }
                    }
                    return null;
                  })}
                </div>
             ) : null}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && !messages[messages.length - 1]?.toolInvocations?.length && (
            <div className="flex justify-start items-end gap-2">
               <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm mb-1 shrink-0">
                    <ChefHat className="w-3.5 h-3.5 text-slate-400" />
               </div>
               <div className="bg-white border border-slate-200 text-slate-400 rounded-[20px] rounded-bl-sm p-3 py-2 text-sm flex gap-1 shadow-sm items-center">
                 <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                 <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-200"></span>
               </div>
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 max-w-[90%] text-sm text-center shadow-sm">
                    <p className="font-medium flex items-center justify-center gap-1.5 mb-1 text-[13px]">
                        <AlertCircle className="w-3.5 h-3.5" /> Connection Error
                    </p>
                    <p className="opacity-80 text-[12px]">{error.message}</p>
                    <button onClick={() => reload()} className="mt-2 text-[11px] bg-white border border-red-200 px-3 py-1 rounded-md hover:bg-red-100 transition-colors font-medium">
                        Try Again
                    </button>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200/60 z-20">
        <form onSubmit={handleSubmit} className="relative group/input flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask Chef for ideas..."
            disabled={isLoading} 
            className="w-full bg-slate-50/50 pl-4 pr-12 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 transition-all text-sm font-medium disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 aspect-square p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30 flex items-center justify-center shadow-sm"
          >
            {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}