// app/actions/history.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { checkAndAwardBadges } from "./gamification" // IMPORT THIS

const MealSchema = z.object({
  dish_name: z.string().trim().min(1).max(150),
  rating: z.coerce.number().int().min(0).max(5).default(0),
  notes: z.string().trim().max(1000).optional().default(""),
})

export async function logCookingHistoryAction(dishName: string, rating: number = 5, notes: string = "") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await supabase.from("cooking_history").insert({
    user_id: user.id,
    dish_name: dishName,
    rating, 
    notes,
    cooked_at: new Date().toISOString()
  })

  await checkAndAwardBadges() // TRIGGER GAMIFICATION
  revalidatePath("/dashboard")
  return { success: true }
}

export async function logMeal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const rawData = {
    dish_name: formData.get("dish_name"),
    rating: formData.get("rating"),
    notes: formData.get("notes"),
  }

  const result = MealSchema.safeParse(rawData)
  if (!result.success) throw new Error("Invalid data")
  
  const { dish_name, rating, notes } = result.data

  // Handle deletions
  const rawUsedIds = formData.getAll("used_items") as string[]
  const safeUsedIds = rawUsedIds.slice(0, 50).map(id => parseInt(id)).filter(id => !isNaN(id))

  await supabase.from("cooking_history").insert({
    user_id: user.id,
    dish_name, rating, notes, cooked_at: new Date().toISOString()
  })

  if (safeUsedIds.length > 0) {
    await supabase.from("pantry_items").delete().in("id", safeUsedIds).eq("user_id", user.id)
  }

  await checkAndAwardBadges() // TRIGGER GAMIFICATION
  revalidatePath("/dashboard")
}

export async function deleteMeal(mealId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await supabase.from("cooking_history").delete().eq("id", mealId).eq("user_id", user.id)
  revalidatePath("/dashboard")
}