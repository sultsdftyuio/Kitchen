// app/actions/generate-recipe.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import { redirect } from "next/navigation"

// Define the shape of our recipe strictly
const RecipeSchema = z.object({
  name: z.string().describe("The name of the dish"),
  description: z.string().describe("A mouth-watering short description"),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.string().describe("e.g. '200g' or '1 cup'"),
    is_in_pantry: z.boolean().describe("True if the user already has this ingredient based on the provided list")
  })),
  instructions: z.array(z.string()).describe("Step by step cooking instructions"),
  nutrition: z.object({
    calories: z.number().nullable(),
    protein: z.string().nullable(),
    carbs: z.string().nullable(),
    fat: z.string().nullable(),
  })
})

export async function generateRecipeAction(userPrompt: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // 1. Fetch Pantry to check for matches
  const { data: pantry } = await supabase
    .from("pantry_items")
    .select("name")
    .eq("user_id", user.id)

  const pantryList = pantry?.map(p => p.name).join(", ") || "Nothing"

  // 2. Call AI with Structured Output
  const { object: recipe } = await generateObject({
    model: openai("gpt-5-nano"), // Use a smart model for reasoning
    schema: RecipeSchema,
    prompt: `
      You are a professional chef. 
      User Request: "${userPrompt}"
      
      User's Pantry: ${pantryList}
      
      Goal: Generate a delicious recipe. 
      CRITICAL: Check the pantry list. If an ingredient is in the pantry (fuzzy match), set 'is_in_pantry' to true.
    `,
  })

  return recipe
}

export async function saveRecipeAction(recipe: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from("recipes").insert({
    user_id: user.id,
    name: recipe.name,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    nutrition: recipe.nutrition
  })

  if (error) throw new Error("Failed to save recipe")
  redirect("/dashboard")
}