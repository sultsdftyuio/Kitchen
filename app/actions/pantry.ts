// app/actions/pantry.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Define the validation schema
const PantryItemSchema = z.object({
  item_name: z.string().trim().min(1, "Item name is required").max(100, "Name too long"),
  // Allow 'quantity' as a string to match the form input (e.g., "2", "500g", "1 bunch")
  quantity: z.string().trim().min(1, "Quantity is required").default("1"),
})

export async function addToPantry(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Auth Check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('You must be logged in.')

  // 2. Input Validation
  // We explicitly check for 'quantity' which is what your form sends
  const rawData = {
    item_name: formData.get('item_name'), 
    quantity: formData.get('quantity'), 
  }

  const result = PantryItemSchema.safeParse(rawData)

  if (!result.success) {
    console.error("Validation Error:", result.error.flatten())
    throw new Error("Invalid input data")
  }

  const { item_name, quantity } = result.data

  // 3. Database Operation
  // Parsing the quantity for the structured columns (optional, but good for data hygiene)
  // Simple heuristic: "2 kg" -> amount: 2, unit: "kg"
  const numericMatch = quantity.match(/^(\d+(\.\d+)?)\s*(.*)$/)
  const amount = numericMatch ? parseFloat(numericMatch[1]) : 1
  const unit = numericMatch && numericMatch[3] ? numericMatch[3].trim() : 'pcs'

  const { error } = await supabase.from('pantry_items').insert({
    user_id: user.id,
    name: item_name,
    amount: amount,
    unit: unit,
    quantity: quantity, // The display string
    category: 'pantry',
    added_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Supabase Insert Error:', error)
    throw new Error('Failed to add item')
  }

  revalidatePath('/dashboard')
  revalidatePath('/pantry')
}

export async function deleteFromPantry(itemId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('pantry_items')
    .delete()
    .match({ id: itemId, user_id: user.id }) 

  if (error) throw new Error('Failed to delete item')

  revalidatePath('/dashboard')
  revalidatePath('/pantry')
}