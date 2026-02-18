// app/actions/gamification.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Badge = {
  id: string
  name: string
  description: string
  icon: string // Lucide icon name
  earned: boolean
  earnedAt?: string
}

export type KitchenItem = {
  name: string
  requiredLevel: string
  icon: string
  unlocked: boolean
}

export type GamificationStats = {
  streak: number
  xp: number
  level: string
  nextLevelXp: number
  xpProgress: number
  zeroWasteScore: number
  badges: Badge[]
  kitchen: KitchenItem[]
}

const BADGE_DEFINITIONS: Omit<Badge, 'earned'>[] = [
  { id: 'first_meal', name: 'First Blood', description: 'Logged your first meal', icon: 'Utensils' },
  { id: 'streak_3', name: 'Habit Builder', description: 'Maintained a 3-day streak', icon: 'Flame' },
  { id: 'streak_7', name: 'On Fire', description: 'Maintained a 7-day streak', icon: 'Zap' },
  { id: 'critic', name: 'The Critic', description: 'Rated 5 meals perfectly (5/5)', icon: 'Star' },
  { id: 'night_owl', name: 'Night Owl', description: 'Logged a meal after 10 PM', icon: 'Moon' },
  { id: 'early_bird', name: 'Early Bird', description: 'Logged a breakfast before 8 AM', icon: 'Sun' },
  { id: 'hoarder', name: 'Prepared', description: 'Have 20+ items in pantry', icon: 'Package' },
]

export async function getGamificationStats(): Promise<GamificationStats | null> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) return null
  const userId = userData.user.id

  // 1. Fetch Data
  const [pantryRes, historyRes, badgesRes] = await Promise.all([
    supabase.from('pantry_items').select('id').eq('user_id', userId),
    supabase.from('cooking_history').select('cooked_at, rating').eq('user_id', userId).order('cooked_at', { ascending: false }),
    supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', userId)
  ])

  const pantryCount = pantryRes.data?.length || 0
  const history = historyRes.data || []
  const earnedBadgesMap = new Map(badgesRes.data?.map(b => [b.badge_id, b.earned_at]) || [])

  // 2. Calculate Streak
  let streak = 0
  if (history.length > 0) {
    const uniqueDates = Array.from(new Set(
      history.map(record => new Date(record.cooked_at).toISOString().split('T')[0])
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      streak = 1
      let currentDate = new Date(uniqueDates[0])
      for (let i = 1; i < uniqueDates.length; i++) {
        const nextDate = new Date(uniqueDates[i])
        const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays === 1) { streak++; currentDate = nextDate } else { break }
      }
    }
  }

  // 3. Calculate XP & Level
  const xpFromPantry = pantryCount * 5
  const xpFromMeals = history.length * 50
  const xpFromPerfectRatings = history.filter(meal => meal.rating === 5).length * 20
  const totalXp = xpFromPantry + xpFromMeals + xpFromPerfectRatings

  let level = "Dishwasher"
  let nextLevelXp = 200
  if (totalXp >= 2000) { level = "Executive Chef"; nextLevelXp = totalXp }
  else if (totalXp >= 1000) { level = "Sous Chef"; nextLevelXp = 2000 }
  else if (totalXp >= 500) { level = "Line Cook"; nextLevelXp = 1000 }
  else if (totalXp >= 200) { level = "Prep Cook"; nextLevelXp = 500 }

  const currentLevelBaseXp = level === "Executive Chef" ? 2000 : level === "Sous Chef" ? 1000 : level === "Line Cook" ? 500 : level === "Prep Cook" ? 200 : 0
  const xpProgress = level === "Executive Chef" ? 100 : Math.round(((totalXp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100)

  // 4. Zero Waste Score
  let zeroWasteScore = 0
  if (pantryCount > 0 || history.length > 0) {
    const ratio = history.length / Math.max(pantryCount, 1)
    zeroWasteScore = Math.min(100, Math.round((ratio / 2) * 100))
    if (zeroWasteScore < 10) zeroWasteScore = 10
  }

  // 5. Build Badges List
  const badges: Badge[] = BADGE_DEFINITIONS.map(def => ({
    ...def,
    earned: earnedBadgesMap.has(def.id),
    earnedAt: earnedBadgesMap.get(def.id) || undefined
  }))

  // 6. Build Kitchen (Meta-Game)
  // Logic: Unlocks based on Level
  const kitchen: KitchenItem[] = [
    { name: 'Basic Stove', requiredLevel: 'Dishwasher', icon: 'Microwave', unlocked: true }, // Everyone starts with this
    { name: 'Cast Iron Pan', requiredLevel: 'Prep Cook', icon: 'ChefHat', unlocked: totalXp >= 200 },
    { name: 'Gas Range', requiredLevel: 'Line Cook', icon: 'Flame', unlocked: totalXp >= 500 },
    { name: 'Marble Island', requiredLevel: 'Sous Chef', icon: 'LayoutDashboard', unlocked: totalXp >= 1000 },
    { name: 'Walk-in Fridge', requiredLevel: 'Executive Chef', icon: 'Refrigerator', unlocked: totalXp >= 2000 },
  ]

  return { streak, xp: totalXp, level, nextLevelXp, xpProgress, zeroWasteScore, badges, kitchen }
}

// --- CHECK AND AWARD NEW BADGES ---
// Call this after logging a meal or updating pantry
export async function checkAndAwardBadges() {
  const stats = await getGamificationStats()
  if (!stats) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const newBadges: string[] = []

  // Check Logic
  if (stats.xp >= 50 /* ~1 meal */) newBadges.push('first_meal')
  if (stats.streak >= 3) newBadges.push('streak_3')
  if (stats.streak >= 7) newBadges.push('streak_7')
  
  // Need to fetch specific history for detailed checks
  const { data: history } = await supabase.from('cooking_history').select('*').eq('user_id', user.id)
  const { data: pantry } = await supabase.from('pantry_items').select('*').eq('user_id', user.id)
  
  if (history) {
    if (history.filter(h => h.rating === 5).length >= 5) newBadges.push('critic')
    if (history.some(h => {
        const hour = new Date(h.cooked_at).getHours()
        return hour >= 22 || hour < 4
    })) newBadges.push('night_owl')
    if (history.some(h => {
        const hour = new Date(h.cooked_at).getHours()
        return hour >= 5 && hour < 8
    })) newBadges.push('early_bird')
  }

  if (pantry && pantry.length >= 20) newBadges.push('hoarder')

  // Insert new badges (ignoring duplicates via SQL 'ON CONFLICT' or just let it fail silently)
  for (const badgeId of newBadges) {
    const { error } = await supabase.from('user_badges').insert({
      user_id: user.id,
      badge_id: badgeId
    }).ignore() // Requires .ignore() or clean error handling if using simple insert
    
    if (!error) {
      // Could trigger a toast on next load
    }
  }
  
  revalidatePath('/dashboard')
}

// --- PANTRY ROULETTE ---
export async function getPantryRoulette() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) return { error: 'Unauthorized' }

  const { data: pantryItems } = await supabase
    .from('pantry_items')
    .select('id, item_name')
    .eq('user_id', userData.user.id)

  // Use 'name' if 'item_name' is missing based on schema
  const normalizedItems = pantryItems?.map(i => ({
      id: i.id,
      item_name: i.item_name || (i as any).name 
  })) || []

  if (normalizedItems.length < 3) {
    return { error: 'You need at least 3 items in your pantry to play Roulette!' }
  }

  for (let i = normalizedItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [normalizedItems[i], normalizedItems[j]] = [normalizedItems[j], normalizedItems[i]];
  }

  const challengeCount = 3
  const challengeItems = normalizedItems.slice(0, challengeCount)

  return { challengeItems }
}