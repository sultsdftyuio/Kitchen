// app/pantry/pantry-ui.tsx
'use client'

import { useFormStatus } from 'react-dom'
import { addToPantry, deleteFromPantry } from '@/app/actions/pantry'
import { Trash2, Plus, ChefHat, ScanBarcode, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// Updated Type
type PantryItem = {
  id: number
  name: string // standardized to 'name'
  amount: number
  unit: string
  added_at: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <span className="animate-pulse">Adding...</span> : <><Plus className="h-4 w-4 mr-2" /> Add Item</>}
    </Button>
  )
}

export default function PantryUI({ items }: { items: PantryItem[] }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Input Section */}
      <Card className="border-2 border-border hard-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2 text-coffee">
                    <ChefHat className="h-6 w-6 text-tangerine" />
                    Kitchen Inventory
                </CardTitle>
                <CardDescription>Update your stock for accurate AI recipes.</CardDescription>
            </div>
            
            {/* MVP Barcode Scanner Trigger */}
            <Button variant="outline" className="gap-2 border-2 border-dashed hidden sm:flex" title="Coming Soon: Barcode Scan">
                <ScanBarcode className="w-4 h-4" /> Scan Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form action={addToPantry} className="flex flex-col sm:flex-row gap-3 items-end">
            
            {/* Name Input */}
            <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-bold text-coffee uppercase tracking-wide">Item Name</label>
                <Input
                name="item_name"
                placeholder="e.g. Jasmine Rice"
                required
                className="border-2 border-border focus:border-tangerine"
                />
            </div>

            {/* Amount Input */}
            <div className="w-full sm:w-24 space-y-1">
                <label className="text-xs font-bold text-coffee uppercase tracking-wide">Amount</label>
                <Input
                name="amount"
                type="number"
                step="0.1"
                placeholder="1"
                defaultValue="1"
                className="border-2 border-border focus:border-tangerine"
                />
            </div>

            {/* Unit Selector */}
            <div className="w-full sm:w-32 space-y-1">
                <label className="text-xs font-bold text-coffee uppercase tracking-wide">Unit</label>
                <Select name="unit" defaultValue="pcs">
                    <SelectTrigger className="border-2 border-border focus:border-tangerine">
                        <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="kg">Kilos (kg)</SelectItem>
                        <SelectItem value="ml">Milliliters (ml)</SelectItem>
                        <SelectItem value="L">Liters (L)</SelectItem>
                        <SelectItem value="cup">Cups</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-coffee flex items-center gap-2">
            Pantry Shelves <span className="bg-muted px-2 py-0.5 rounded-full text-sm">{items.length} items</span>
        </h2>
        
        {items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
            <Scale className="w-12 h-12 text-coffee/20 mx-auto mb-3" />
            <p className="text-coffee/60">Your pantry is empty.</p>
            <p className="text-sm text-coffee/40 mt-1">Add ingredients to start cooking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group bg-white flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-tangerine transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-lg">
                        {/* Simple emoji mapping based on first char could go here */}
                        🥗
                    </div>
                    <div>
                        <p className="font-bold text-coffee capitalize leading-none">{item.name}</p>
                        <p className="text-sm text-coffee/60 font-medium mt-1">
                            {item.amount} <span className="text-xs uppercase">{item.unit}</span>
                        </p>
                    </div>
                </div>
                <form action={deleteFromPantry.bind(null, item.id)}>
                   <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}