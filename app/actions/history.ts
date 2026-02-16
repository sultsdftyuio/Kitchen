// app/actions/history.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Strict boundaries applied for manual form logging
const MealSchema = z.object({
  dish_name: z.string().trim().min(1, "Dish name is required").max(150, "Dish name too long"),
  rating: z.coerce.number().int().min(0).max(5).default(0),
  notes: z.string().trim().max(1000, "Notes are too long").optional().default(""),
})

// 1. AUTOMATIC LOGGING (Called by the AI "Finish Cooking" button)
export async function logCookingHistoryAction(dishName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized access")

  const { error } = await supabase.from("cooking_history").insert({
    user_id: user.id,
    dish_name: dishName,
    rating: 5, // Auto-rate 5 stars for completing an AI recipe!
    notes: "Cooked seamlessly with KitchenOS Auto-Chef.",
    cooked_at: new Date().toISOString()
  })

  if (error) {
    console.error("Database error:", error.message)
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
      dish_name: formData.get("dish_name"),
      rating: formData.get("rating"),
      notes: formData.get("notes"),
    }

    const result = MealSchema.safeParse(rawData)
    if (!result.success) {
      console.warn("Validation Error:", result.error.flatten())
      throw new Error("Invalid meal data provided")
    }

    const { dish_name, rating, notes } = result.data
    
    const rawUsedItemIds = formData.getAll("used_items") as string[]
    const safeUsedItemIds = rawUsedItemIds
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
      console.error("Error logging meal:", mealError.message)
      throw new Error("Failed to log meal")
    }

    if (safeUsedItemIds.length > 0) {
      const { error: pantryError } = await supabase
        .from("pantry_items")
        .delete()
        .in("id", safeUsedItemIds)
        .eq("user_id", user.id)

      if (pantryError) {
        console.error("Error updating pantry:", pantryError.message)
      }
    }

    revalidatePath("/dashboard")
  } catch (err: any) {
    throw new Error(err.message || 'An unexpected error occurred')
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
      .eq("user_id", user.id)

    if (error) {
      console.error('Supabase Delete Error:', error.message)
      throw new Error("Failed to delete meal")
    }

    revalidatePath("/dashboard")
  } catch (err: any) {
    throw new Error(err.message || 'An unexpected error occurred')
  }
}