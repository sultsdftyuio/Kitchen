// app/dashboard/loading.tsx
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream p-4 sm:p-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-coffee">
        <Loader2 className="w-12 h-12 animate-spin text-tangerine" />
        <h2 className="text-xl font-serif font-bold animate-pulse">Prepping your kitchen...</h2>
      </div>
    </div>
  )
}