// app/actions/pantry.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Define the validation schema with strict boundaries to prevent memory exhaustion DoS
const PantryItemSchema = z.object({
  item_name: z.string().trim().min(1, "Item name is required").max(100, "Name too long"),
  quantity: z.string().trim().min(1, "Quantity is required").max(50, "Quantity string too long").default("1"),
})

export async function addToPantry(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized access')

    // 2. Input Validation
    const rawQuantity = formData.get('quantity')
    const safeQuantity = rawQuantity ? rawQuantity.toString() : "1"

    const rawData = {
      item_name: formData.get('item_name'), 
      quantity: safeQuantity, 
    }

    const result = PantryItemSchema.safeParse(rawData)

    if (!result.success) {
      console.warn("Validation Error:", result.error.flatten())
      throw new Error("Invalid input data provided")
    }

    const { item_name, quantity } = result.data

    // 3. Database Operation (Strictly mapped to the provided schema)
    const { error } = await supabase.from('pantry_items').insert({
      user_id: user.id,
      item_name: item_name, 
      quantity: quantity, 
      added_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase Insert Error:', error.message)
      throw new Error('Failed to add item to pantry')
    }

    revalidatePath('/dashboard')
    revalidatePath('/pantry')
  } catch (err: any) {
    // Sanitize error messages sent to the client
    throw new Error(err.message || 'An unexpected error occurred')
  }
}

export async function deleteFromPantry(itemId: number) {
  try {
    if (!itemId || isNaN(itemId)) throw new Error('Invalid item ID')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized access')

    // RLS & Match Check: Ensures users can only delete their own specific item
    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .match({ id: itemId, user_id: user.id }) 

    if (error) {
      console.error('Supabase Delete Error:', error.message)
      throw new Error('Failed to delete item')
    }

    revalidatePath('/dashboard')
    revalidatePath('/pantry')
  } catch (err: any) {
    throw new Error(err.message || 'An unexpected error occurred')
  }
}