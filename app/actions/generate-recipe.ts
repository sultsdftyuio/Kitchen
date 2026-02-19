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
    prep_time: z.string().describe("e.g. '15 mins'").nullable(),
    cook_time: z.string().describe("e.g. '30 mins'").nullable(),
    servings: z.number().describe("Number of servings").nullable(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).nullable()
  })
})

export async function generateRecipeAction(userPrompt: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // 1. Fetch Pantry to check for matches
  const { data: pantry } = await supabase
    .from("pantry_items")
    .select("item_name")
    .eq("user_id", user.id)

  const pantryList = pantry?.map(p => p.item_name).join(", ") || "Nothing"

  // 2. Fetch User Profile to get restrictions, equipment, and skill
  const { data: profile } = await supabase
    .from("profiles")
    .select("dietary_restrictions, skill_level, kitchen_equipment")
    .eq("id", user.id)
    .single()

  const diet = profile?.dietary_restrictions || "None specified"
  
  // Define standard kitchen equipment if the user hasn't specified anything
  const DEFAULT_EQUIPMENT = "Stovetop, Oven, Microwave, Basic Pots and Pans, Chef's Knife, Cutting Board, Mixing Bowls, Baking Sheet, Spatula"
  
  const equipment = profile?.kitchen_equipment && profile.kitchen_equipment.trim() !== "" 
    ? profile.kitchen_equipment 
    : DEFAULT_EQUIPMENT

  const skill = profile?.skill_level || "Intermediate"

  // 3. Call AI with Structured Output and strict Profile constraints
  const { object: recipe } = await generateObject({
    model: openai("gpt-5-nano"), // Kept exact model per instructions
    schema: RecipeSchema,
    prompt: `
      You are a professional chef. 
      User Request: "${userPrompt}"
      
      ---
      USER PROFILE CONSTRAINTS (YOU MUST OBEY THESE):
      - Dietary Restrictions: ${diet} (Never include ingredients that violate this constraint).
      - Available Equipment: ${equipment} (CRITICAL: Do not suggest recipes that require ANY equipment not on this list. Keep it strictly accessible based on these tools).
      - Skill Level: ${skill} (Tailor the complexity and techniques of the recipe to match this skill level).
      ---

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