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
  
  // Get all IDs of items used
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

  // 2. Smart Inventory Management
  if (usedItemIds.length > 0) {
    // For the MVP, checking the box means "I used this up."
    // FUTURE UPGRADE: Check formData.get(`amount_used_${id}`) to deduct instead of delete.
    
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