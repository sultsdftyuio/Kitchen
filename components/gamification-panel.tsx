// components/gamification-panel.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Flame, Star, Leaf, Dices, ChefHat } from 'lucide-react'
import { getGamificationStats, getPantryRoulette, GamificationStats } from '@/app/actions/gamification'
import { toast } from 'sonner'

export function GamificationPanel() {
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [rouletteItems, setRouletteItems] = useState<{ id: number, item_name: string }[]>([])
  const [loadingRoulette, setLoadingRoulette] = useState(false)

  useEffect(() => {
    async function loadStats() {
      const data = await getGamificationStats()
      if (data) setStats(data)
    }
    loadStats()
  }, [])

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

  if (!stats) return null // Or a loading skeleton

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. KITCHEN STREAK */}
      <Card className={`relative overflow-hidden transition-all duration-500 ${stats.streak > 0 ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : ''}`}>
        {/* Ambient glow effect when active */}
        {stats.streak > 0 && (
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        )}
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium">Kitchen Streak</CardTitle>
          <div className={`p-1.5 rounded-full ${stats.streak > 0 ? 'bg-orange-500/10' : 'bg-muted'}`}>
            <Flame 
              className={`h-4 w-4 transition-all duration-500 ${
                stats.streak > 0 
                  ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse' 
                  : 'text-muted-foreground'
              }`} 
            />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className={`text-2xl font-black tracking-tight ${
            stats.streak > 0 
              ? 'bg-gradient-to-br from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent drop-shadow-sm' 
              : 'text-foreground'
          }`}>
            {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            {stats.streak > 0 ? "🔥 You're on fire! Keep cooking." : "Cook a meal today to start your streak!"}
          </p>
        </CardContent>
      </Card>

      {/* 2. SKILL LEVEL (XP) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chef Level</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.level}</div>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={stats.xpProgress} className="h-2" />
            <span className="text-xs text-muted-foreground min-w-[3rem]">
              {stats.xp} XP
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 5. ZERO WASTE SCORE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Zero Waste Score</CardTitle>
          <Leaf className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.zeroWasteScore}/100</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.zeroWasteScore >= 80 ? "Excellent inventory turnover!" : "Try cooking more of what you own."}
          </p>
        </CardContent>
      </Card>

      {/* 3. PANTRY ROULETTE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pantry Roulette</CardTitle>
          <Dices className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center">
          {rouletteItems.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold leading-tight text-purple-600 dark:text-purple-400">
                Cook a meal using these:
              </p>
              <ul className="text-xs text-muted-foreground list-disc pl-4">
                {rouletteItems.map(item => (
                  <li key={item.id}>{item.item_name}</li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setRouletteItems([])}>
                Clear
              </Button>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                Need a challenge? Spin for a random recipe constraint.
              </p>
              <Button size="sm" onClick={handlePlayRoulette} disabled={loadingRoulette}>
                <ChefHat className="mr-2 h-4 w-4" /> Spin the Wheel
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}