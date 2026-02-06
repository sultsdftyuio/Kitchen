// app/pantry/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PantryUI from './pantry-ui'

export default async function PantryPage() {
  const supabase = await createClient()

  // 1. Verify User
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. Fetch Data (Server-Side)
  // We allow the result to be null, but we handle it in the return
  const { data: pantryItems, error } = await supabase
    .from('pantry_items')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  if (error) {
    // Log the actual error to your server console so we can debug if RLS fails
    console.error('Supabase Pantry Fetch Error:', error)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading pantry: {error.message}
      </div>
    )
  }

  // 3. Render
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">KitchenOS Pantry</h1>
      <p className="text-muted-foreground mb-8">Manage your ingredients to generate recipes.</p>
      
      {/* FIX: The '?? []' operator specifically fixes the null crash. 
         If pantryItems is null, it passes an empty array.
      */}
      <PantryUI items={pantryItems ?? []} />
    </div>
  )
}