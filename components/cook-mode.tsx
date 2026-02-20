// components/cook-mode.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  CheckCircle2, Circle, Clock, ChefHat, Flame, ArrowLeft, 
  Utensils, Award, Play, Pause, RotateCcw, ArrowRight, LifeBuoy, X, Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logCookingHistoryAction } from "@/app/actions/history"

interface RecipeProps {
  name: string
  description: string
  ingredients: {
    name: string
    amount: string
    is_in_pantry: boolean
  }[]
  instructions: string[]
  nutrition: {
    prep_time?: string | null
    cook_time?: string | null
    servings?: number | null
  }
}

export function CookMode({ recipe }: { recipe: RecipeProps }) {
  const router = useRouter()
  
  // Phase Management
  const [activePhase, setActivePhase] = useState<'prep' | 'cook'>('prep')
  
  // Ingredient Tracking
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [isLogging, setIsLogging] = useState(false)

  // Smart Timer State
  const [timerTime, setTimerTime] = useState<number>(0)
  const [timerInput, setTimerInput] = useState<string>("10")
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // AI Sous-Chef Chat State
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
    { role: 'assistant', content: "Chef, I'm right here. What's the emergency?" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isTyping])

  // Timer Countdown Logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timerTime > 0) {
      interval = setInterval(() => {
        setTimerTime((prev) => prev - 1)
      }, 1000)
    } else if (timerTime === 0) {
      setIsTimerRunning(false)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timerTime])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    if (timerTime === 0) {
      const mins = parseInt(timerInput) || 1
      setTimerTime(mins * 60)
    }
    setIsTimerRunning(true)
  }

  const toggleIngredient = (index: number) => {
    const newSet = new Set(checkedIngredients)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setCheckedIngredients(newSet)
  }

  const areAllIngredientsPrepped = checkedIngredients.size === recipe.ingredients.length

  const handleFinish = async () => {
    setIsLogging(true)
    try {
      const usedIngredients = recipe.ingredients
        .filter((ing, idx) => checkedIngredients.has(idx) && ing.is_in_pantry)
        .map(ing => ing.name)

      await logCookingHistoryAction(
        recipe.name, 
        5, 
        "Cooked via Immersive Cook Mode!", 
        usedIngredients
      )
      
      router.push("/dashboard")
    } catch (e) {
      console.error("[UI/CookMode] Failed to log meal:", e)
      setIsLogging(false)
    }
  }

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isTyping) return

    const userMessage = chatInput.trim()
    setChatInput("")
    
    // Add user message to UI immediately
    const newMessages = [...chatMessages, { role: 'user' as const, content: userMessage }]
    setChatMessages(newMessages)
    setIsTyping(true)

    try {
      const response = await fetch('/api/sous-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          // Pass the silent context so the AI knows what we are cooking
          recipeContext: {
            name: recipe.name,
            instructions: recipe.instructions
          }
        })
      })

      if (!response.ok) throw new Error("API Error")
      
      // Handle the streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      setChatMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      let done = false
      while (!done && reader) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        
        // Vercel AI SDK formats stream text with "0:" prefixes, we clean it simply for MVP
        // If you use standard streamText, it uses text data protocol. 
        // We will do a basic string append, stripping the protocol tokens if they appear.
        const cleanChunk = chunkValue.replace(/^0:|"|\\n/gm, (match) => {
           if (match === '\\n') return '\n';
           if (match === '"') return '';
           if (match === '0:') return '';
           return match;
        });

        setChatMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1].content += cleanChunk
          return updated
        })
      }
    } catch (error) {
      console.error("Chat error:", error)
      setChatMessages((prev) => [...prev, { role: 'assistant', content: "Sorry chef, I'm having trouble connecting to the network right now." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 animate-in slide-in-from-bottom-4 fade-in duration-700 relative">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-neutral-500 hover:text-orange-500 font-bold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Kitchen
        </button>

        {/* Phase Indicator */}
        <div className="flex items-center gap-2 bg-stone-200 p-1 rounded-full border-2 border-stone-300">
          <div className={cn(
            "px-4 py-1.5 rounded-full text-sm font-bold transition-colors",
            activePhase === 'prep' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
          )}>
            1. Prep Station
          </div>
          <div className={cn(
            "px-4 py-1.5 rounded-full text-sm font-bold transition-colors",
            activePhase === 'cook' ? "bg-orange-500 text-white shadow-sm" : "text-stone-500"
          )}>
            2. Cook
          </div>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-stone-900 text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden mb-8 border-4 border-stone-200 shadow-xl">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/30 rounded-full blur-3xl" />
        
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 relative z-10">{recipe.name}</h1>
        <p className="text-lg text-stone-300 max-w-2xl leading-relaxed relative z-10 mb-8">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
            <Clock className="w-5 h-5 text-orange-400" />
            <span className="font-bold">{recipe.nutrition?.prep_time || "10 mins"}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="font-bold">{recipe.nutrition?.cook_time || "20 mins"}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
            <Utensils className="w-5 h-5 text-orange-400" />
            <span className="font-bold">{recipe.nutrition?.servings || 2} Servings</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activePhase === 'prep' ? (
        /* ==============================
           PHASE 1: MISE EN PLACE (PREP)
           ============================== */
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-8 mb-8 text-center">
            <ChefHat className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Mise en Place</h2>
            <p className="text-stone-600 max-w-xl mx-auto font-medium text-lg">
              A good chef never scrambles for ingredients while the pan is hot. Gather, measure, and chop everything below before you begin.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {recipe.ingredients.map((ing, i) => {
              const isChecked = checkedIngredients.has(i)
              return (
                <button
                  key={i}
                  onClick={() => toggleIngredient(i)}
                  className={cn(
                    "w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left group shadow-sm",
                    isChecked 
                      ? "bg-stone-100 border-stone-200 opacity-60" 
                      : "bg-white border-stone-200 hover:border-orange-400 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {isChecked ? (
                      <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-8 h-8 text-stone-300 group-hover:text-orange-400 shrink-0 transition-colors" />
                    )}
                    <span className={cn(
                      "text-xl font-bold text-stone-800",
                      isChecked && "line-through text-stone-500"
                    )}>
                      {ing.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {ing.is_in_pantry && !isChecked && (
                      <span className="text-xs uppercase font-black tracking-wider bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                        In Pantry
                      </span>
                    )}
                    <span className="text-lg font-black text-stone-600 whitespace-nowrap bg-stone-100 px-4 py-2 rounded-xl">
                      {ing.amount}
                    </span>
                  </div>
                </button>
              )
            })}

            <div className="pt-8 flex justify-center">
              <button
                onClick={() => setActivePhase('cook')}
                className={cn(
                  "flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-xl border-2 shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] transition-all",
                  areAllIngredientsPrepped 
                    ? "bg-orange-500 border-stone-900 text-stone-900 hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]" 
                    : "bg-stone-200 border-stone-300 text-stone-500 hover:bg-stone-300 shadow-none"
                )}
              >
                {areAllIngredientsPrepped ? "Station Prepped! Start Cooking" : "Skip Prep (Not Recommended)"}
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ==============================
           PHASE 2: ACTIVE COOK MODE
           ============================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in fade-in slide-in-from-right-8 duration-500 relative">
          
          {/* Left Column: Compact Reference Ingredients */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-8">
              <h3 className="text-2xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-3">
                <ChefHat className="w-6 h-6 text-orange-500" /> Reference
              </h3>
              
              <div className="bg-white rounded-3xl border-2 border-stone-200 p-4 shadow-sm">
                <div className="space-y-1">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors">
                      <span className="font-bold text-stone-700">{ing.name}</span>
                      <span className="text-sm font-black text-stone-500">{ing.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Timer & Step-by-Step Instructions */}
          <div className="lg:col-span-8 pb-32">
            
            {/* Smart Timer Widget */}
            <div className="bg-stone-900 text-white p-6 rounded-3xl border-4 border-stone-800 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500/20 p-4 rounded-2xl">
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold">Smart Timer</h4>
                  <p className="text-stone-400 text-sm">Keep track of your active steps.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-black/50 p-2 rounded-2xl border border-white/10">
                {!isTimerRunning && timerTime === 0 ? (
                  <div className="flex items-center px-4">
                    <input 
                      type="number" 
                      value={timerInput}
                      onChange={(e) => setTimerInput(e.target.value)}
                      className="bg-transparent text-3xl font-black w-16 text-center focus:outline-none text-orange-400 placeholder:text-orange-400/50"
                      min="1"
                    />
                    <span className="text-stone-400 font-bold ml-2">min</span>
                  </div>
                ) : (
                  <div className="px-6 text-3xl font-black text-orange-400 tracking-wider font-mono">
                    {formatTime(timerTime)}
                  </div>
                )}
                
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                  <button 
                    onClick={() => isTimerRunning ? setIsTimerRunning(false) : startTimer()}
                    className="p-3 bg-white/10 hover:bg-orange-500 rounded-xl transition-colors"
                  >
                    {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>
                  <button 
                    onClick={() => { setIsTimerRunning(false); setTimerTime(0); }}
                    className="p-3 bg-white/10 hover:bg-red-500 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-500" /> Instructions
            </h3>
            
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div 
                  key={i} 
                  className="bg-white p-8 rounded-3xl border-2 border-stone-200 shadow-sm relative group hover:-translate-y-1 transition-transform"
                >
                  <div className="absolute -left-4 -top-4 w-12 h-12 bg-orange-500 text-white rounded-full border-4 border-white flex items-center justify-center font-black text-xl shadow-sm">
                    {i + 1}
                  </div>
                  <p className="text-lg md:text-xl text-stone-700 leading-relaxed font-medium pl-4">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Footer: Log Meal */}
            <div className="mt-12 bg-stone-50 border-2 border-stone-200 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm">
              <div>
                <h4 className="font-serif text-xl font-bold text-stone-800 flex items-center gap-2 justify-center sm:justify-start">
                  <Award className="w-6 h-6 text-orange-500" /> Bon Appétit!
                </h4>
                <p className="text-stone-600 font-medium mt-1">
                  Finished cooking? Log this meal to auto-update your pantry.
                </p>
              </div>
              
              <button
                onClick={handleFinish}
                disabled={isLogging}
                className="bg-stone-900 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-lg border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-none transition-all w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-stone-900 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
              >
                {isLogging ? (
                  <Clock className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                {isLogging ? "Updating Pantry..." : "Finish & Log Meal"}
              </button>
            </div>
          </div>

          {/* Floating AI Panic Button & Chat UI */}
          <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            
            {/* Chat Window */}
            {isChatOpen && (
              <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white border-2 border-stone-300 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(28,25,23,0.1)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in">
                {/* Header */}
                <div className="bg-red-500 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5" />
                    <span className="font-bold">AI Sous-Chef</span>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="hover:bg-red-600 p-1 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={cn(
                      "max-w-[85%] p-3 rounded-2xl text-sm font-medium",
                      msg.role === 'user' 
                        ? "bg-stone-900 text-white ml-auto rounded-br-none" 
                        : "bg-white border-2 border-stone-200 text-stone-800 rounded-bl-none shadow-sm"
                    )}>
                      {msg.content}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="bg-white border-2 border-stone-200 text-stone-400 p-3 rounded-2xl rounded-bl-none w-16 flex justify-center space-x-1 shadow-sm">
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-200" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendChat} className="p-4 bg-white border-t-2 border-stone-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="My sauce broke! Help!"
                      className="w-full bg-stone-100 border-2 border-stone-200 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-red-400 focus:bg-white transition-all text-sm font-medium"
                      disabled={isTyping}
                    />
                    <button 
                      type="submit" 
                      disabled={!chatInput.trim() || isTyping}
                      className="absolute right-2 top-2 bg-red-500 hover:bg-red-600 disabled:bg-stone-300 text-white p-1.5 rounded-full transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* The Floating Toggle Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-xl transition-all hover:scale-110",
                isChatOpen 
                  ? "bg-stone-900 border-stone-800 text-white" 
                  : "bg-red-500 border-red-600 text-white animate-pulse"
              )}
            >
              {isChatOpen ? <X className="w-8 h-8" /> : <LifeBuoy className="w-8 h-8" />}
            </button>
          </div>

        </div>
      )}
    </div>
  )
}