// components/virtual-kitchen.tsx
import { Lock, Mic, ChefHat, Flame, LayoutDashboard, Refrigerator, CheckCircle2 } from "lucide-react"
import { KitchenItem } from "@/app/actions/gamification"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const iconMap: Record<string, any> = {
  Microwave: Mic,
  ChefHat: ChefHat,
  Flame: Flame,
  LayoutDashboard: LayoutDashboard,
  Refrigerator: Refrigerator
}

export function VirtualKitchen({ items }: { items: KitchenItem[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">My Kitchen</h3>
        <span className="text-xs bg-muted px-2 py-1 rounded-full">
          {items.filter(i => i.unlocked).length} / {items.length} Unlocked
        </span>
      </div>
      
      {/* Visual Kitchen Grid */}
      <div className="grid grid-cols-5 gap-2">
        {items.map((item, idx) => {
          const Icon = iconMap[item.icon] || ChefHat
          return (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`aspect-square rounded-lg border flex items-center justify-center relative transition-all duration-300
                    ${item.unlocked 
                      ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20' 
                      : 'bg-muted/50 border-muted-foreground/20 text-muted-foreground/30 grayscale'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    {!item.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-lg">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    {item.unlocked && (
                       <div className="absolute top-1 right-1">
                         <CheckCircle2 className="h-3 w-3 text-green-500" />
                       </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.unlocked ? "Unlocked!" : `Requires: ${item.requiredLevel}`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}