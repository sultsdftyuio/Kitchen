// components/cook-mode.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Circle, Clock, ChefHat, Flame, ArrowLeft, Utensils, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { logCookingHistoryAction } from "@/app/actions/history"

// Expected structure from our AI generation action
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
  // Track which ingredients the user has prepped/pulled out
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [isLogging, setIsLogging] = useState(false)

  const toggleIngredient = (index: number) => {
    const newSet = new Set(checkedIngredients)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setCheckedIngredients(newSet)
  }

  const handleFinish = async () => {
    setIsLogging(true)
    try {
      // Log as a 5-star meal by default for MVP. 
      // Later, we can add a modal to ask the user for an actual rating (1-5) and notes.
      await logCookingHistoryAction(recipe.name, 5, "Cooked via Immersive Cook Mode!")
    } catch (e) {
      console.error("[UI/CookMode] Failed to log meal:", e)
      setIsLogging(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
      
      {/* Top Navigation */}
      <button 
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-neutral-500 hover:text-orange-500 font-bold text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Kitchen
      </button>

      {/* Hero Header Card */}
      <div className="bg-stone-900 text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden mb-8 border-4 border-stone-200 shadow-xl">
        {/* Decorative blur blob */}
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

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Interactive Ingredients List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-8">
            <h3 className="text-2xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-3">
              <ChefHat className="w-6 h-6 text-orange-500" /> Ingredients
            </h3>
            
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-4 shadow-sm">
              <div className="space-y-2">
                {recipe.ingredients.map((ing, i) => {
                  const isChecked = checkedIngredients.has(i)
                  return (
                    <button
                      key={i}
                      onClick={() => toggleIngredient(i)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group",
                        isChecked 
                          ? "bg-stone-100 border-stone-200 opacity-60" 
                          : "bg-white border-transparent hover:border-orange-200 hover:bg-stone-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {isChecked ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                        ) : (
                          <Circle className="w-6 h-6 text-stone-300 group-hover:text-orange-400 shrink-0 transition-colors" />
                        )}
                        <span className={cn(
                          "font-bold text-stone-800",
                          isChecked && "line-through"
                        )}>
                          {ing.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Show "In Pantry" pill only if they haven't checked it off yet */}
                        {ing.is_in_pantry && !isChecked && (
                          <span className="text-[10px] uppercase font-black tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            In Pantry
                          </span>
                        )}
                        <span className="text-sm font-black text-stone-500 whitespace-nowrap">
                          {ing.amount}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Instructions */}
        <div className="lg:col-span-8">
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
                Finished cooking? Log this meal to train your AI profile.
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
              {isLogging ? "Logging to Database..." : "Finish & Log Meal"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}