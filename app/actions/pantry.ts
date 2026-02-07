// app/actions/pantry.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Define the validation schema
const PantryItemSchema = z.object({
  item_name: z.string().trim().min(1, "Item name is required").max(100, "Name too long"),
  amount: z.coerce.number().positive("Amount must be positive").default(1),
  unit: z.string().trim().default('pcs'),
})

export async function addToPantry(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Auth Check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('You must be logged in.')

  // 2. Input Validation
  const rawData = {
    item_name: formData.get('item_name'), // Input name from the UI form
    amount: formData.get('amount'),
    unit: formData.get('unit'),
  }

  const result = PantryItemSchema.safeParse(rawData)

  if (!result.success) {
    console.error("Validation Error:", result.error.flatten())
    throw new Error("Invalid input data")
  }

  const { item_name, amount, unit } = result.data

  // 3. Database Operation
  // FIXED: Insert into 'name' column using 'item_name' from form
  const { error } = await supabase.from('pantry_items').insert({
    user_id: user.id,
    name: item_name,               // DB Column: name
    amount: amount,                // DB Column: amount
    unit: unit,                    // DB Column: unit
    quantity: `${amount} ${unit}`, // Legacy/Display column
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