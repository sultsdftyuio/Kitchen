// app/recipes/[id]/cook/page.tsx
import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { generateRecipeAction } from "@/app/actions/generate-recipe"
import { CookMode } from "@/components/cook-mode"
import { ChefHat, Loader2 } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ name?: string }>
}

export default async function CookPage({ params, searchParams }: PageProps) {
  // Next.js 15 requires awaiting params and searchParams
  const { id } = await params
  const { name } = await searchParams
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const dishName = name || id.replace(/-/g, ' ')

  return (
    <div className="min-h-screen bg-cream selection:bg-tangerine/30">
      {/* Suspense boundary: Instantly loads the RecipeLoader.
        Once RecipeFetcher resolves (AI finishes), it swaps to CookMode.
      */}
      <Suspense fallback={<RecipeLoader dishName={dishName} />}>
        <RecipeFetcher dishName={dishName} />
      </Suspense>
    </div>
  )
}

// Background Data Fetcher Component
async function RecipeFetcher({ dishName }: { dishName: string }) {
  // Using the server action you provided to generate the exact steps
  const recipe = await generateRecipeAction(`Please generate a structured, highly detailed recipe for: ${dishName}`)
  
  return <CookMode recipe={recipe} />
}

// Gorgeous Loading State
function RecipeLoader({ dishName }: { dishName: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-in fade-in duration-1000 px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-tangerine/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative w-32 h-32 bg-white rounded-full border-4 border-border flex items-center justify-center hard-shadow">
          <ChefHat className="w-16 h-16 text-tangerine animate-bounce" />
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee">
          Drafting your recipe for <br/> 
          <span className="text-tangerine">{dishName}</span>
        </h2>
        <div className="flex items-center justify-center gap-2 text-coffee/60 font-medium bg-white/50 px-4 py-2 rounded-full border border-border/50">
          <Loader2 className="w-4 h-4 animate-spin" /> 
          Cross-referencing your pantry & dietary profile...
        </div>
      </div>
    </div>
  )
}