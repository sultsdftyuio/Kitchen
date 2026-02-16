// app/recipes/[id]/cook/page.tsx
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { CookMode } from "@/components/cook-mode"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CookPage({ params }: PageProps) {
  // Await params in Next.js 15
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !recipe) {
    return notFound()
  }

  // Ensure instructions is an array of strings (Handle potential JSON/Text discrepancies)
  let instructions: string[] = []
  if (Array.isArray(recipe.instructions)) {
    instructions = recipe.instructions
  } else if (typeof recipe.instructions === 'string') {
    try {
      instructions = JSON.parse(recipe.instructions)
    } catch (e) {
      instructions = [recipe.instructions]
    }
  }

  // Sanitize data for the client component
  const cleanRecipe = {
    name: recipe.name,
    ingredients: recipe.ingredients,
    instructions,
    nutrition: recipe.nutrition || {}
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-4 md:p-8">
      <CookMode recipe={cleanRecipe} />
    </div>
  )
}