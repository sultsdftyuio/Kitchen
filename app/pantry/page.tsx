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

  // 2. Fetch Data (Filtered)
  const { data: pantryItems, error } = await supabase
    .from('pantry_items')
    .select('*')
    .eq('user_id', user.id)
    .not("name", "is", null) // FIX: Changed from item_name to name
    .neq("name", "")         // FIX: Changed from item_name to name
    .order('added_at', { ascending: false })

  if (error) {
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
      <h1 className="text-3xl font-bold mb-2">kernelcook Pantry</h1>
      <p className="text-muted-foreground mb-8">Manage your ingredients to generate recipes.</p>
      
      <PantryUI items={pantryItems ?? []} />
    </div>
  )
}