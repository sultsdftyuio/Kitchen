// components/gamification-panel.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Flame, Star, Leaf, Dices, ChefHat, Trophy } from 'lucide-react'
import { getPantryRoulette, GamificationStats } from '@/app/actions/gamification'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

const badgeIconMap: any = {
  Utensils: ChefHat,
  Flame: Flame,
  Zap: Flame,
  Star: Star,
  Moon: Star, 
  Sun: Star,
  Package: Leaf
}

export function GamificationPanel({ initialStats }: { initialStats: GamificationStats | null }) {
  const [stats, setStats] = useState<GamificationStats | null>(initialStats)
  const [rouletteItems, setRouletteItems] = useState<{ id: number, item_name: string }[]>([])
  const [loadingRoulette, setLoadingRoulette] = useState(false)

  const handlePlayRoulette = async () => {
    setLoadingRoulette(true)
    const res = await getPantryRoulette()
    
    if (res.error) {
      toast.error(res.error)
    } else if (res.challengeItems) {
      setRouletteItems(res.challengeItems)
      toast.success("Mystery Box generated!")
    }
    setLoadingRoulette(false)
  }

  // Fallback loading state
  if (!stats) return <div className="animate-pulse h-48 bg-muted rounded-xl" />

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 1. KITCHEN STREAK */}
        <Card className={`relative overflow-hidden transition-all duration-500 ${stats.streak > 0 ? 'border-orange-500/50' : ''}`}>
          {stats.streak > 0 && <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Kitchen Streak</CardTitle>
            <div className={`p-1.5 rounded-full ${stats.streak > 0 ? 'bg-orange-500/10' : 'bg-muted'}`}>
              <Flame className={`h-4 w-4 ${stats.streak > 0 ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-black tracking-tight">{stats.streak} Days</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.streak > 0 ? "🔥 You're on fire!" : "Cook today to start!"}
            </p>
          </CardContent>
        </Card>

        {/* 2. XP & LEVEL */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level {stats.level}</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-1">
              <span className="text-2xl font-bold">{stats.xp}</span>
              <span className="text-xs text-muted-foreground mb-1">/ {stats.nextLevelXp} XP</span>
            </div>
            <Progress value={stats.xpProgress} className="h-2" />
          </CardContent>
        </Card>

        {/* 3. PANTRY ROULETTE */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pantry Roulette</CardTitle>
            <Dices className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {rouletteItems.length > 0 ? (
              <div className="space-y-2">
                <ul className="text-xs list-disc pl-4 text-muted-foreground">
                  {rouletteItems.map(item => <li key={item.id}>{item.item_name}</li>)}
                </ul>
                <Button variant="ghost" size="sm" className="w-full h-6 text-xs" onClick={() => setRouletteItems([])}>Clear</Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" className="w-full" onClick={handlePlayRoulette} disabled={loadingRoulette}>
                <ChefHat className="mr-2 h-4 w-4" /> Spin
              </Button>
            )}
          </CardContent>
        </Card>

        {/* 4. ZERO WASTE */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zero Waste</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.zeroWasteScore}/100</div>
            <p className="text-xs text-muted-foreground mt-1">Efficiency Score</p>
          </CardContent>
        </Card>
      </div>

      {/* BADGES (TROPHY CASE) NOW TAKES FULL WIDTH */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap gap-4">
              {(stats.badges || []).map((badge) => {
                const Icon = badgeIconMap[badge.icon] || Star
                return (
                  <div key={badge.id} className="flex flex-col items-center text-center group cursor-help w-16">
                    <div className={`p-3 rounded-full mb-1 transition-all ${badge.earned ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500' : 'bg-muted text-muted-foreground grayscale opacity-50'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-medium leading-tight line-clamp-2">{badge.name}</span>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}