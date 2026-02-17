// app/actions/history.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// SECURITY: Added Anti-XSS validation
const MealSchema = z.object({
  dish_name: z.string()
    .trim()
    .min(1, "Dish name is required")
    .max(150, "Dish name too long")
    .regex(/^[^<>]+$/, "Invalid characters detected"),
  rating: z.coerce.number().int().min(0).max(5).default(0),
  notes: z.string()
    .trim()
    .max(1000, "Notes are too long")
    .regex(/^[^<>]*$/, "Invalid characters detected")
    .optional()
    .default(""),
})

// Validation for AI string input
const SafeDishNameSchema = z.string().trim().min(1).max(150).regex(/^[^<>]+$/)

// 1. AUTOMATIC LOGGING (Called by the AI "Finish Cooking" button)
export async function logCookingHistoryAction(
  dishName: string, 
  rating: number = 5, 
  notes: string = "Cooked seamlessly with Kernelcook Auto-Chef."
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized access")

  // SECURITY: Validate AI output just in case of hallucinated bad strings
  const parseResult = SafeDishNameSchema.safeParse(dishName)
  if (!parseResult.success) {
    throw new Error("Invalid dish name generated")
  }

  const { error } = await supabase.from("cooking_history").insert({
    user_id: user.id,
    dish_name: parseResult.data,
    rating, 
    notes,
    cooked_at: new Date().toISOString()
  })

  if (error) {
    console.error("[DB] Database error:", error)
    throw new Error("Failed to log cooking history")
  }

  revalidatePath("/dashboard")
  return { success: true }
}

// 2. MANUAL LOGGING (Called by the Dashboard form)
export async function logMeal(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error("Unauthorized access")

    const rawData = {
      dish_name: formData.get("dish_name") || "",
      rating: formData.get("rating"),
      notes: formData.get("notes") || "",
    }

    const result = MealSchema.safeParse(rawData)
    if (!result.success) {
      console.warn("[SECURITY] Validation Error:", result.error.flatten())
      throw new Error("Invalid meal data provided")
    }

    const { dish_name, rating, notes } = result.data
    
    const rawUsedItemIds = formData.getAll("used_items") as string[]
    
    // SECURITY: Cap the maximum deletions to 50 to prevent DB DoS attacks
    const safeUsedItemIds = rawUsedItemIds
      .slice(0, 50) 
      .map(id => parseInt(id, 10))
      .filter(id => !isNaN(id))

    const { error: mealError } = await supabase
      .from("cooking_history")
      .insert({
        user_id: user.id,
        dish_name,
        rating,
        notes,
        cooked_at: new Date().toISOString()
      })

    if (mealError) {
      console.error("[DB] Error logging meal:", mealError)
      throw new Error("Failed to log meal")
    }

    if (safeUsedItemIds.length > 0) {
      const { error: pantryError } = await supabase
        .from("pantry_items")
        .delete()
        .in("id", safeUsedItemIds)
        .eq("user_id", user.id) // SECURITY: IDOR protection

      if (pantryError) {
        console.error("[DB] Error updating pantry:", pantryError)
      }
    }

    revalidatePath("/dashboard")
  } catch (err: any) {
    const message = err.message === 'Unauthorized access' || err.message === 'Invalid meal data provided' 
      ? err.message 
      : 'An unexpected error occurred'
    throw new Error(message)
  }
}

// 3. DELETE LOG (Called by the Trash icon in Dashboard)
export async function deleteMeal(mealId: number) {
  try {
    if (!mealId || isNaN(mealId)) throw new Error("Invalid meal ID")

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error("Unauthorized access")

    const { error } = await supabase
      .from("cooking_history")
      .delete()
      .eq("id", mealId)
      .eq("user_id", user.id) // SECURITY: IDOR protection

    if (error) {
      console.error('[DB] Supabase Delete Error:', error)
      throw new Error("Failed to delete meal")
    }

    revalidatePath("/dashboard")
  } catch (err: any) {
    const message = err.message === 'Unauthorized access' || err.message === 'Invalid meal ID' 
      ? err.message 
      : 'An unexpected error occurred'
    throw new Error(message)
  }
}