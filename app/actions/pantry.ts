// app/actions/pantry.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// SECURITY: Added Anti-XSS regex and strict maximums to prevent DB overflow
const PantryItemSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Item name is required")
    .max(100, "Name too long")
    .regex(/^[^<>]+$/, "Invalid characters detected"), // Blocks HTML/Script tags
  amount: z.coerce.number()
    .min(0.1, "Amount must be greater than 0")
    .max(10000, "Amount exceeds system limits") // Prevents integer overflow attacks
    .default(1),
  unit: z.string()
    .trim()
    .max(20, "Unit string too long")
    .regex(/^[^<>]*$/, "Invalid characters detected")
    .default("pcs"),
  quantity: z.string()
    .trim()
    .max(50, "Quantity string too long")
    .regex(/^[^<>]*$/, "Invalid characters detected")
    .default("1"),
})

export async function addToPantry(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized access')

    // 2. Input Validation
    const rawData = {
      name: formData.get('item_name') || formData.get('name') || "", 
      amount: formData.get('amount') || 1,
      unit: formData.get('unit') || 'pcs',
      quantity: formData.get('quantity') || "1"
    }

    const result = PantryItemSchema.safeParse(rawData)

    if (!result.success) {
      console.warn("[SECURITY] Validation Error:", result.error.flatten())
      throw new Error("Invalid input data provided")
    }

    const { name, amount, unit, quantity } = result.data

    // 3. Database Operation
    const { error } = await supabase.from('pantry_items').insert({
      user_id: user.id,
      name: name,         
      amount: amount,     
      unit: unit,         
      quantity: quantity, 
      added_at: new Date().toISOString(),
    })

    if (error) {
      console.error('[DB] Supabase Insert Error:', error)
      // SECURITY: Do not leak error.message to frontend
      throw new Error('Failed to add item to pantry')
    }

    revalidatePath('/dashboard')
    revalidatePath('/pantry')
  } catch (err: any) {
    // Only pass through safe, manually thrown errors. Hide system errors.
    const message = err.message === 'Unauthorized access' || err.message === 'Invalid input data provided' 
      ? err.message 
      : 'An unexpected error occurred'
    throw new Error(message)
  }
}

export async function deleteFromPantry(itemId: number) {
  try {
    if (!itemId || isNaN(itemId)) throw new Error('Invalid item ID')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized access')

    // SECURITY: .match ensures IDOR protection (user can only delete their own ID)
    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .match({ id: itemId, user_id: user.id }) 

    if (error) {
      console.error('[DB] Supabase Delete Error:', error)
      throw new Error('Failed to delete item')
    }

    revalidatePath('/dashboard')
    revalidatePath('/pantry')
  } catch (err: any) {
    const message = err.message === 'Unauthorized access' || err.message === 'Invalid item ID' 
      ? err.message 
      : 'An unexpected error occurred'
    throw new Error(message)
  }
}