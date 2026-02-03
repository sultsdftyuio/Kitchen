// app/actions/history.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function logMeal(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const dishName = formData.get("dish_name") as string
  const rating = formData.get("rating") as string
  const notes = formData.get("notes") as string
  
  // Parse selected ingredients (sent as multiple input fields with same name)
  const usedItemIds = formData.getAll("used_items") as string[]

  if (!dishName) return

  // 1. Log the Meal
  const { error: mealError } = await supabase
    .from("cooking_history")
    .insert({
      user_id: user.id,
      dish_name: dishName,
      rating: parseInt(rating) || 0,
      notes: notes || "",
      cooked_at: new Date().toISOString()
    })

  if (mealError) {
    console.error("Error logging meal:", mealError)
    throw new Error("Failed to log meal")
  }

  // 2. Delete Used Ingredients (The "Smart" Part)
  if (usedItemIds.length > 0) {
    const { error: pantryError } = await supabase
      .from("pantry_items")
      .delete()
      .in("id", usedItemIds)
      .eq("user_id", user.id) // Extra safety check

    if (pantryError) {
      console.error("Error updating pantry:", pantryError)
      // We don't throw here, because the meal was successfully logged.
      // We just log the error.
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

  if (error) {
    console.error("Error deleting meal:", error)
    throw new Error("Failed to delete meal")
  }

  revalidatePath("/dashboard")
}