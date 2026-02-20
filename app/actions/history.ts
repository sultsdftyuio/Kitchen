// app/actions/history.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { checkAndAwardBadges } from "./gamification"

export async function logMeal(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const dish_name = formData.get("dish_name")?.toString()
  const rating = parseInt(formData.get("rating")?.toString() || "5")
  const notes = formData.get("notes")?.toString() || ""
  
  // Get all checked ingredients to remove from pantry
  const usedItems = formData.getAll("used_items")

  if (!dish_name) throw new Error("Dish name is required")

  // 1. Insert the meal into cooking_history
  const { error: historyError } = await supabase
    .from("cooking_history")
    .insert({
      user_id: user.id,
      dish_name,
      rating,
      notes,
      cooked_at: new Date().toISOString()
    })

  if (historyError) {
    console.error("Error logging meal:", historyError)
    throw new Error("Failed to log meal")
  }

  // 2. If they checked off ingredients they used, delete them from the pantry
  if (usedItems.length > 0) {
    const { error: pantryError } = await supabase
      .from("pantry_items")
      .delete()
      .in('id', usedItems)
      
    if (pantryError) {
      console.error("Error removing used items from pantry:", pantryError)
    }
  }

  // 3. Trigger Gamification Badges (from our previous updates!)
  await checkAndAwardBadges()

  revalidatePath("/dashboard")
}

export async function deleteMeal(id: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("cooking_history")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting meal:", error)
    throw new Error("Failed to delete meal")
  }

  revalidatePath("/dashboard")
}