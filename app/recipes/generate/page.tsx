// app/recipes/generate/page.tsx
'use client'

import { useState } from "react"
import { generateRecipeAction, saveRecipeAction } from "@/app/actions/generate-recipe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, ChefHat, Check, X, Clock, Users, Flame, Download } from "lucide-react"
import { toast } from "sonner" 

export default function GenerateRecipePage() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recipe, setRecipe] = useState<any>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setRecipe(null)
    
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

  const handleExportPDF = () => {
    // Placeholder for PDF export tool
    toast.success("Exporting to PDF... (Feature coming soon)")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-coffee">Instant Chef</h1>
        <p className="text-coffee-dark">Tell me what you're craving. I'll check your pantry.</p>
      </div>

      <form onSubmit={handleGenerate} className="flex gap-4">
        <Input 
          placeholder="e.g. Spicy Chicken Tacos, Something with eggplant..." 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-12 text-lg bg-white"
        />
        <Button type="submit" size="lg" disabled={isLoading || !prompt.trim()} className="bg-tangerine hover:bg-orange-600">
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <ChefHat className="mr-2" />}
          Cook
        </Button>
      </form>

      {recipe && (
        <Card className="hard-shadow bg-[#FFF8F0] border-coffee/10 animate-in fade-in slide-in-from-bottom-4 overflow-hidden">
          {/* Hero Image Placeholder - cookAIfood style */}
          <div className="w-full h-64 bg-coffee/5 flex items-center justify-center border-b border-coffee/10 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F0] to-transparent opacity-60" />
            <span className="text-coffee/40 font-medium flex items-center gap-2">
              <ChefHat className="w-6 h-6" />
              AI Image Generation Placeholder
            </span>
          </div>

          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <CardTitle className="text-3xl font-serif text-coffee mb-2">{recipe.name}</CardTitle>
                <p className="text-coffee-dark italic">{recipe.description}</p>
                
                {/* cookAIfood style Metadata Badges */}
                {recipe.nutrition && (
                  <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-coffee-dark">
                    {recipe.nutrition.prep_time && (
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Prep: {recipe.nutrition.prep_time}</span>
                    )}
                    {recipe.nutrition.cook_time && (
                      <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> Cook: {recipe.nutrition.cook_time}</span>
                    )}
                    {recipe.nutrition.servings && (
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Serves: {recipe.nutrition.servings}</span>
                    )}
                    {recipe.nutrition.difficulty && (
                      <span className="flex items-center gap-1"><ChefHat className="w-4 h-4" /> {recipe.nutrition.difficulty}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExportPDF} variant="outline" className="border-coffee text-coffee bg-white hover:bg-white/80">
                  <Download className="mr-2 h-4 w-4" /> PDF
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            {/* Ingredients Column */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl flex items-center text-coffee">
                🛒 Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing: any, i: number) => (
                  <li key={i} className="flex items-center justify-between bg-white/60 p-3 rounded-lg border border-coffee/5">
                    <span className="flex items-center gap-3">
                      {ing.is_in_pantry ? (
                        <div className="bg-green-100 p-1 rounded-full"><Check className="h-4 w-4 text-green-600" /></div>
                      ) : (
                        <div className="bg-rose-100 p-1 rounded-full"><X className="h-4 w-4 text-rose-500" /></div>
                      )}
                      <span className={ing.is_in_pantry ? "text-coffee font-medium" : "font-semibold text-rose-600"}>
                        {ing.name}
                      </span>
                    </span>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions Column */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-coffee">🍳 Instructions</h3>
              <ol className="space-y-4 list-none counter-reset-step">
                {recipe.instructions.map((step: string, i: number) => (
                  <li key={i} className="text-coffee-dark leading-relaxed flex gap-4 bg-white/40 p-4 rounded-xl border border-coffee/5">
                    <span className="flex-shrink-0 w-8 h-8 bg-tangerine/20 text-tangerine font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
              
              {/* Detailed Nutrition Grid */}
              {recipe.nutrition && (
                <div className="mt-8 p-6 bg-white border border-coffee/10 rounded-xl">
                  <h4 className="font-bold text-coffee mb-4">Nutrition Facts</h4>
                  <div className="grid grid-cols-4 gap-4 text-center divide-x divide-coffee/10">
                     <div className="flex flex-col"><span className="text-xs text-coffee-dark uppercase tracking-wider mb-1">Calories</span><span className="font-bold text-lg text-coffee">{recipe.nutrition.calories || '-'}</span></div>
                     <div className="flex flex-col"><span className="text-xs text-coffee-dark uppercase tracking-wider mb-1">Protein</span><span className="font-bold text-lg text-coffee">{recipe.nutrition.protein || '-'}</span></div>
                     <div className="flex flex-col"><span className="text-xs text-coffee-dark uppercase tracking-wider mb-1">Carbs</span><span className="font-bold text-lg text-coffee">{recipe.nutrition.carbs || '-'}</span></div>
                     <div className="flex flex-col"><span className="text-xs text-coffee-dark uppercase tracking-wider mb-1">Fat</span><span className="font-bold text-lg text-coffee">{recipe.nutrition.fat || '-'}</span></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}