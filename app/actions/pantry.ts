// app/actions/pantry.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addToPantry(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Check Auth securely on the server
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be logged in to add items.')
  }

  // Robust Input handling: trim whitespace
  const rawName = formData.get('item_name') as string
  const itemName = rawName?.trim()
  const quantity = (formData.get('quantity') as string)?.trim()

  if (!itemName) return

  // 2. Insert Data
  const { error } = await supabase.from('pantry_items').insert({
    user_id: user.id,
    item_name: itemName,
    quantity: quantity || '1', 
    added_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Supabase Error:', error)
    throw new Error('Failed to add item to pantry')
  }

  // 3. Refresh the page data immediately
  revalidatePath('/pantry')
  revalidatePath('/dashboard') // Also refresh dashboard
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

  revalidatePath('/pantry')
  revalidatePath('/dashboard')
}