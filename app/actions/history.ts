// app/actions/history.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const MealSchema = z.object({
  dish_name: z.string().trim().min(1, "Dish name is required").max(150),
  rating: z.coerce.number().int().min(0).max(5).default(0),
  notes: z.string().trim().max(1000).optional().default(""),
})

export async function logMeal(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // 1. Validate Input
  const rawData = {
    dish_name: formData.get("dish_name"),
    rating: formData.get("rating"),
    notes: formData.get("notes"),
  }

  const result = MealSchema.safeParse(rawData)
  if (!result.success) {
    console.error("Validation Error:", result.error.flatten())
    throw new Error("Invalid meal data")
  }

  const { dish_name, rating, notes } = result.data
  
  // Handle array input manually as it's not a simple key-value for Zod to pick up from basic object mapping
  const usedItemIds = formData.getAll("used_items") as string[]

  // 2. Log the Meal
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
    console.error("Error logging meal:", mealError)
    throw new Error("Failed to log meal")
  }

  // 3. Smart Inventory Management (Defensive Delete)
  if (usedItemIds.length > 0) {
    // SECURITY: We explicitly limit the delete to items owned by 'user.id'
    // This prevents a malicious user from sending IDs belonging to others.
    const { error: pantryError } = await supabase
      .from("pantry_items")
      .delete()
      .in("id", usedItemIds)
      .eq("user_id", user.id)

    if (pantryError) {
      console.error("Error updating pantry:", pantryError)
    }
  }

  revalidatePath("/dashboard")
}

export async function deleteMeal(mealId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("cooking_history")
    .delete()
    .eq("id", mealId)
    .eq("user_id", user.id)

  if (error) throw new Error("Failed to delete meal")

  revalidatePath("/dashboard")
}