// app/pantry/pantry-ui.tsx
'use client'

import { useFormStatus } from 'react-dom'
import { addToPantry, deleteFromPantry } from '@/app/actions/pantry'
import { Trash2, Plus, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// Types matching your DB
type PantryItem = {
  id: number
  item_name: string
  quantity: string
  added_at: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <span className="animate-pulse">Adding...</span> : <><Plus className="h-4 w-4 mr-2" /> Add</>}
    </Button>
  )
}

export default function PantryUI({ items }: { items: PantryItem[] }) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            Add Ingredients
          </CardTitle>
          <CardDescription>What do you have in your kitchen right now?</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addToPantry} className="flex flex-col sm:flex-row gap-3">
            <Input
              name="item_name"
              placeholder="Ingredient name (e.g. Pasta)"
              required
              className="flex-1"
            />
            <Input
              name="quantity"
              placeholder="Qty (e.g. 500g)"
              className="sm:w-32"
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Current Inventory ({items.length})</h2>
        
        {items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/50">
            <p className="text-muted-foreground">Your pantry is empty.</p>
            <p className="text-sm text-muted-foreground mt-1">Add items above to get AI recommendations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="flex flex-row items-center justify-between p-4 hover:shadow-md transition-shadow">
                <div>
                  <p className="font-medium text-lg capitalize">{item.item_name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <form action={deleteFromPantry.bind(null, item.id)}>
                   <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}