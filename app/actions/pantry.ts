// app/actions/pantry.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addPantryItem(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Authenticate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  // 2. Extract Data
  const itemName = formData.get("item_name") as string
  const quantity = formData.get("quantity") as string

  if (!itemName) return

  // 3. Insert into DB (Using correct 'item_name' column)
  const { error } = await supabase
    .from("pantry_items")
    .insert({
      user_id: user.id,
      item_name: itemName, // Correct column name based on schema
      quantity: quantity || "1",
      added_at: new Date().toISOString()
    })

  if (error) {
    console.error("Error adding pantry item:", error)
    throw new Error("Failed to add item")
  }

  // 4. Refresh UI
  revalidatePath("/dashboard")
}

export async function deletePantryItem(itemId: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("pantry_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting pantry item:", error)
    throw new Error("Failed to delete item")
  }

  revalidatePath("/dashboard")
}