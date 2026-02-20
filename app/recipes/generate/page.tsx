// app/recipes/generate/page.tsx
'use client'

import { useState } from "react"
import { generateRecipeAction, saveRecipeAction } from "@/app/actions/generate-recipe"
import { Loader2, Save, ChefHat, Check, X, Clock, Users, Flame, Download, Sparkles, Utensils } from "lucide-react"
import { toast } from "sonner" 
import { cn } from "@/lib/utils" // <--- ADDED THIS IMPORT

export default function GenerateRecipePage() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recipe, setRecipe] = useState<any>(null)
  
  // Interactive checklist state for cooking
  const [checkedSteps, setCheckedSteps] = useState<number[]>([])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setRecipe(null)
    setCheckedSteps([])
    
    try {
      const result = await generateRecipeAction(prompt)
      setRecipe(result)
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate recipe. Try again!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await saveRecipeAction(recipe)
      toast.success("Recipe saved to cookbook!")
    } catch (error) {
       toast.error("Failed to save recipe.")
    }
  }

  const toggleStep = (index: number) => {
    setCheckedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-sans pb-20">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto mt-4 sm:mt-8 mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-orange-50 rounded-2xl mb-2">
            <Sparkles className="w-8 h-8 text-tangerine" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Instant Chef</h1>
        <p className="text-slate-500 text-lg">Tell me what you're craving. I'll cross-reference your pantry and generate the perfect recipe.</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
            <Utensils className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
                placeholder="e.g. Spicy Chicken Tacos, Something with eggplant..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-tangerine focus:ring-4 focus:ring-orange-500/10 text-lg text-slate-900 placeholder:text-slate-400 transition-all shadow-sm"
            />
        </div>
        <button 
            type="submit" 
            disabled={isLoading || !prompt.trim()} 
            className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <ChefHat className="w-5 h-5" />}
          {isLoading ? 'Cooking...' : 'Generate'}
        </button>
      </form>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="max-w-5xl mx-auto mt-12 animate-pulse space-y-8">
            <div className="h-64 bg-slate-100 rounded-3xl w-full"></div>
            <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-4 space-y-4">
                    <div className="h-8 bg-slate-100 rounded-lg w-1/2"></div>
                    <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                    <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                </div>
                <div className="md:col-span-8 space-y-4">
                    <div className="h-8 bg-slate-100 rounded-lg w-1/3"></div>
                    <div className="h-24 bg-slate-100 rounded-xl w-full"></div>
                    <div className="h-24 bg-slate-100 rounded-xl w-full"></div>
                </div>
            </div>
        </div>
      )}

      {/* The Recipe Result */}
      {recipe && !isLoading && (
        <div className="max-w-5xl mx-auto mt-12 bg-white rounded-[32px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Header Section */}
          <div className="p-8 sm:p-10 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">{recipe.name}</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">{recipe.description}</p>
                
                {/* Modern Badges */}
                {recipe.nutrition && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {recipe.nutrition.prep_time && (
                      <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Clock className="w-4 h-4 text-blue-500" /> {recipe.nutrition.prep_time} Prep
                      </div>
                    )}
                    {recipe.nutrition.cook_time && (
                      <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Flame className="w-4 h-4 text-orange-500" /> {recipe.nutrition.cook_time} Cook
                      </div>
                    )}
                    {recipe.nutrition.servings && (
                      <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Users className="w-4 h-4 text-emerald-500" /> {recipe.nutrition.servings} Servings
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 shrink-0">
                <button onClick={() => toast.info("PDF Export coming soon!")} className="h-12 px-5 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
                  <Download className="h-4 w-4" /> PDF
                </button>
                <button onClick={handleSave} className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Recipe
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {/* Left Column: Ingredients */}
            <div className="lg:col-span-4 p-8 sm:p-10 bg-slate-50/30">
              <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                <div className="p-1.5 bg-tangerine/10 text-tangerine rounded-lg"><Utensils className="w-5 h-5" /></div>
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing: any, i: number) => (
                  <li key={i} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex items-center gap-3">
                      {ing.is_in_pantry ? (
                        <div className="bg-emerald-100 p-1.5 rounded-full"><Check className="h-4 w-4 text-emerald-600" /></div>
                      ) : (
                        <div className="bg-rose-100 p-1.5 rounded-full"><X className="h-4 w-4 text-rose-500" /></div>
                      )}
                      <span className={cn("font-semibold", ing.is_in_pantry ? "text-slate-900" : "text-rose-600")}>
                        {ing.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-400">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Instructions & Nutrition */}
            <div className="lg:col-span-8 p-8 sm:p-10">
              <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg"><ChefHat className="w-5 h-5" /></div>
                Instructions
              </h3>
              
              <div className="space-y-4">
                {recipe.instructions.map((step: string, i: number) => {
                  const isChecked = checkedSteps.includes(i)
                  return (
                    <div 
                        key={i} 
                        onClick={() => toggleStep(i)}
                        className={cn(
                            "group cursor-pointer flex gap-5 p-5 rounded-2xl border-2 transition-all",
                            isChecked 
                                ? "bg-slate-50 border-slate-200/60 opacity-60" 
                                : "bg-white border-slate-100 hover:border-tangerine/30 hover:shadow-sm"
                        )}
                    >
                      <div className={cn(
                          "w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                          isChecked ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-tangerine group-hover:text-white"
                      )}>
                        {isChecked ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      <p className={cn(
                          "text-base leading-relaxed pt-1 transition-all",
                          isChecked ? "text-slate-400 line-through" : "text-slate-700 font-medium"
                      )}>
                          {step}
                      </p>
                    </div>
                  )
                })}
              </div>
              
              {/* Premium Nutrition Widget */}
              {recipe.nutrition && (
                <div className="mt-10 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-tangerine/20 rounded-full mix-blend-screen filter blur-[80px]"></div>
                  <h4 className="font-bold text-lg mb-6 relative z-10 flex items-center gap-2">Nutrition Facts</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                     <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Calories</span>
                        <span className="text-3xl font-black">{recipe.nutrition.calories || '-'}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Protein</span>
                        <span className="text-3xl font-black">{recipe.nutrition.protein || '-'}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Carbs</span>
                        <span className="text-3xl font-black">{recipe.nutrition.carbs || '-'}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Fat</span>
                        <span className="text-3xl font-black">{recipe.nutrition.fat || '-'}</span>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}