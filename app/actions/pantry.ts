// app/actions/pantry.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addPantryItem(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // 1. Sanitize Input
  const rawName = formData.get("item_name") as string
  const rawQty = formData.get("quantity") as string
  
  const itemName = rawName?.trim()
  const quantity = rawQty?.trim() || "1"

  // 2. Validation
  if (!itemName) return 

  // 3. Database Insert
  // FIX: Using 'name' instead of 'item_name' to match your DB schema
  const { error } = await supabase
    .from("pantry_items")
    .insert({
      user_id: user.id,
      name: itemName, 
      quantity: quantity,
      added_at: new Date().toISOString()
    })

  if (error) {
    console.error("Error adding item:", error)
    throw new Error("Failed to add item")
  }

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
    console.error("Error deleting item:", error)
    throw new Error("Failed to delete item")
  }

  revalidatePath("/dashboard")
}