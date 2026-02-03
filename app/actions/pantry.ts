// app/actions/pantry.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addPantryItem(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized: Please log in to add items.")
  }

  // 2. Extract Data
  const itemName = formData.get("item_name") as string
  const quantity = formData.get("quantity") as string

  // Validation
  if (!itemName || itemName.trim() === "") return

  // 3. Database Mutation
  const { error } = await supabase
    .from("pantry_items")
    .insert({
      user_id: user.id,
      item_name: itemName,
      quantity: quantity || "1",
      added_at: new Date().toISOString()
    })

  // 4. Enhanced Error Handling
  if (error) {
    console.error("Supabase Error [addPantryItem]:", error)
    
    // Check for schema cache issues (PGRST204)
    if (error.code === 'PGRST204') {
      throw new Error("Database schema mismatch. Please reload Supabase schema cache.")
    }
    
    throw new Error("Failed to add item. Check server logs.")
  }

  // 5. Refresh UI
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
    console.error("Supabase Error [deletePantryItem]:", error)
    throw new Error("Failed to delete item")
  }

  revalidatePath("/dashboard")
}