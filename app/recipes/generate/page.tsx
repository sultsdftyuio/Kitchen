// app/recipes/generate/page.tsx
'use client'

import { useState } from "react"
import { generateRecipeAction, saveRecipeAction } from "@/app/actions/generate-recipe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, ChefHat, Check, X } from "lucide-react"
import { toast } from "sonner" // Assuming you use sonner or similar

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
      alert("Failed to generate recipe. Try again!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await saveRecipeAction(recipe)
      toast.success("Recipe saved to cookbook!")
    } catch (error) {
       // handle error
    }
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
          className="h-12 text-lg"
        />
        <Button type="submit" size="lg" disabled={isLoading} className="bg-tangerine hover:bg-orange-600">
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <ChefHat className="mr-2" />}
          Cook
        </Button>
      </form>

      {recipe && (
        <Card className="hard-shadow bg-[#FFF8F0] border-coffee/10 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-serif text-coffee mb-2">{recipe.name}</CardTitle>
                <p className="text-coffee-dark italic">{recipe.description}</p>
              </div>
              <Button onClick={handleSave} variant="outline" className="border-coffee text-coffee">
                <Save className="mr-2 h-4 w-4" /> Save Recipe
              </Button>
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
                  <li key={i} className="flex items-center justify-between bg-white/50 p-2 rounded-lg">
                    <span className="flex items-center gap-2">
                      {ing.is_in_pantry ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-rose-400" />
                      )}
                      <span className={ing.is_in_pantry ? "text-coffee" : "font-semibold text-rose-600"}>
                        {ing.name}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions Column */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-coffee">🍳 Instructions</h3>
              <ol className="space-y-4 list-decimal list-inside">
                {recipe.instructions.map((step: string, i: number) => (
                  <li key={i} className="text-coffee-dark leading-relaxed pl-2">
                    {step}
                  </li>
                ))}
              </ol>
              
              {recipe.nutrition && (
                <div className="mt-8 p-4 bg-white rounded-xl text-sm grid grid-cols-4 gap-2 text-center">
                   <div><div className="font-bold">Cal</div>{recipe.nutrition.calories}</div>
                   <div><div className="font-bold">Prot</div>{recipe.nutrition.protein}</div>
                   <div><div className="font-bold">Carb</div>{recipe.nutrition.carbs}</div>
                   <div><div className="font-bold">Fat</div>{recipe.nutrition.fat}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}