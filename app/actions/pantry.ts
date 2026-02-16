// app/actions/pantry.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// FIX: Updated schema to match the new database columns
const PantryItemSchema = z.object({
  name: z.string().trim().min(1, "Item name is required").max(100, "Name too long"),
  amount: z.coerce.number().min(0.1, "Amount must be greater than 0").default(1),
  unit: z.string().trim().max(20, "Unit string too long").default("pcs"),
  quantity: z.string().trim().max(50, "Quantity string too long").default("1"),
})

export async function addToPantry(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized access')

    // 2. Input Validation
    // Support both older components sending 'quantity' and newer components sending 'amount/unit'
    const rawData = {
      name: formData.get('item_name') || formData.get('name'), 
      amount: formData.get('amount') || 1,
      unit: formData.get('unit') || 'pcs',
      quantity: formData.get('quantity') || "1"
    }

    const result = PantryItemSchema.safeParse(rawData)

    if (!result.success) {
      console.warn("Validation Error:", result.error.flatten())
      throw new Error("Invalid input data provided")
    }

    const { name, amount, unit, quantity } = result.data

    // 3. Database Operation (Strictly mapped to the NEW schema)
    const { error } = await supabase.from('pantry_items').insert({
      user_id: user.id,
      name: name,         // FIX: Mapped to 'name' instead of 'item_name'
      amount: amount,     // FIX: Added amount
      unit: unit,         // FIX: Added unit
      quantity: quantity, // Fallback for legacy components
      added_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase Insert Error:', error.message)
      throw new Error('Failed to add item to pantry')
    }

    revalidatePath('/dashboard')
    revalidatePath('/pantry')
  } catch (err: any) {
    throw new Error(err.message || 'An unexpected error occurred')
  }
}

export async function deleteFromPantry(itemId: number) {
  try {
    if (!itemId || isNaN(itemId)) throw new Error('Invalid item ID')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized access')

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