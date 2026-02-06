// app/actions/pantry.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addToPantry(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Check Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be logged in to add items.')
  }

  // 2. Validate Input
  // We keep the form input name as 'item_name' for the UI, but map it to DB column 'name'
  const rawName = formData.get('item_name') as string
  const itemName = rawName?.trim()
  const quantity = (formData.get('quantity') as string)?.trim()

  if (!itemName) return

  // 3. Insert Data (Fixed: Uses 'name' column)
  const { error } = await supabase.from('pantry_items').insert({
    user_id: user.id,
    name: itemName,         // FIXED: Was 'item_name'
    quantity: quantity || '1', 
    added_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Supabase Insert Error:', error)
    throw new Error('Failed to add item to pantry')
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

  if (error) {
    console.error('Delete Error:', error)
    throw new Error('Failed to delete item')
  }

  revalidatePath('/dashboard')
  revalidatePath('/pantry')
}