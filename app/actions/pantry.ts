// app/actions/pantry.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addToPantry(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('You must be logged in.')

  // Validate Input
  const rawName = formData.get('item_name') as string
  const itemName = rawName?.trim()
  
  // New: Parse Amount and Unit
  const rawAmount = formData.get('amount') as string
  const unit = (formData.get('unit') as string) || 'pcs'
  const amount = parseFloat(rawAmount) || 1

  if (!itemName) return

  // Insert with new Schema
  const { error } = await supabase.from('pantry_items').insert({
    user_id: user.id,
    name: itemName,
    amount: amount,
    unit: unit,
    quantity: `${amount} ${unit}`, // Keep legacy column synced just in case
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