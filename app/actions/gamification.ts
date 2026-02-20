// app/actions/gamification.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Badge = {
  id: string
  name: string
  description: string
  icon: string 
  earned: boolean
  earnedAt?: string
}

export type KitchenItem = {
  name: string
  requiredLevel: string
  icon: string
  unlocked: boolean
  description: string
  hint: string
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

export async function getGamificationStats(passedUserId?: string): Promise<GamificationStats | null> {
  const supabase = await createClient()
  
  // CTO Fix: Use passed ID to prevent Server Component cookie-loss bugs
  let userId = passedUserId
  if (!userId) {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return null
    userId = userData.user.id
  }

  // 1. Fetch Data
  const [pantryRes, historyRes, badgesRes] = await Promise.all([
    supabase.from('pantry_items').select('id').eq('user_id', userId),
    supabase.from('cooking_history').select('cooked_at, rating').eq('user_id', userId).order('cooked_at', { ascending: false }),
    supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', userId)
  ])

  const pantryCount = pantryRes.data?.length || 0
  const history = historyRes.data || []
  const earnedBadgesMap = new Map(badgesRes.data?.map(b => [b.badge_id, b.earned_at]) || [])

  // Metrics
  const perfectMealsCount = history.filter(meal => meal.rating === 5).length

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
  const xpFromPerfectRatings = perfectMealsCount * 20
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

  // 6. THE ULTIMATE KITCHEN (16 Items)
  const kitchen: KitchenItem[] = [
    { name: 'Basic Stove', requiredLevel: 'Default', icon: 'Flame', unlocked: true, description: 'The foundation of every kitchen.', hint: 'Everyone starts here.' }, 
    { name: 'Smart Fridge', requiredLevel: '10 Pantry Items', icon: 'Archive', unlocked: pantryCount >= 10, description: 'Massive storage for your ingredients.', hint: 'Stock up your pantry.' },
    { name: 'Herb Garden', requiredLevel: '3-Day Streak', icon: 'Leaf', unlocked: streak >= 3, description: 'Fresh basil, thyme, and rosemary.', hint: 'Cook 3 days in a row.' },
    { name: 'Carbon Steel Pan', requiredLevel: 'Prep Cook', icon: 'CircleDashed', unlocked: totalXp >= 200, description: 'Achieve the perfect restaurant sear.', hint: 'Earn 200 XP.' },
    { name: 'Pro Chef Knife', requiredLevel: 'Line Cook', icon: 'Utensils', unlocked: totalXp >= 500, description: 'Glides through tomatoes like butter.', hint: 'Reach Line Cook level.' },
    { name: 'Spice Rack', requiredLevel: '20 Pantry Items', icon: 'LayoutGrid', unlocked: pantryCount >= 20, description: 'Welcome to flavor town.', hint: 'Hoard 20 items in your pantry.' },
    { name: 'Air Fryer', requiredLevel: 'Zero Waste > 50', icon: 'Wind', unlocked: zeroWasteScore >= 50, description: 'Crispy leftovers, zero guilt.', hint: 'Cook efficiently to raise Zero Waste score.' },
    { name: 'Carbon Wok', requiredLevel: '7-Day Streak', icon: 'Soup', unlocked: streak >= 7, description: 'Wok hei achieved. Perfect stir-fry.', hint: 'Cook 7 days in a row.' },
    { name: 'Dutch Oven', requiredLevel: 'Sous Chef', icon: 'CookingPot', unlocked: totalXp >= 1000, description: 'The absolute master of slow braises.', hint: 'Reach Sous Chef level.' },
    { name: 'Stand Mixer', requiredLevel: '10 Meals Cooked', icon: 'ChefHat', unlocked: history.length >= 10, description: 'Baking and doughs made effortless.', hint: 'Log 10 total meals.' },
    { name: 'Smart Sous-Vide', requiredLevel: 'Zero Waste > 80', icon: 'Thermometer', unlocked: zeroWasteScore >= 80, description: 'Precision temperature control.', hint: 'Master the Zero Waste lifestyle.' },
    { name: 'Espresso Machine', requiredLevel: 'Executive Chef', icon: 'Coffee', unlocked: totalXp >= 2000, description: 'Liquid energy for the head chef.', hint: 'Reach the maximum level.' },
    { name: 'Compost Bin', requiredLevel: 'Zero Waste > 30', icon: 'Trash2', unlocked: zeroWasteScore >= 30, description: 'Giving back to the earth.', hint: 'Stop wasting food.' },
    { name: 'Recipe Library', requiredLevel: '5 Meals Cooked', icon: 'BookOpen', unlocked: history.length >= 5, description: 'Your culinary knowledge expands.', hint: 'Log 5 total meals.' },
    { name: 'Plating Tweezers', requiredLevel: '5 Perfect Meals', icon: 'PenTool', unlocked: perfectMealsCount >= 5, description: 'For Michelin-star precision plating.', hint: 'Rate 5 of your meals 5-stars.' },
    { name: 'Kitchen Timer', requiredLevel: '1 Meal Cooked', icon: 'Timer', unlocked: history.length >= 1, description: 'Timing is everything.', hint: 'Log your first meal.' },
  ]

  return { streak, xp: totalXp, level, nextLevelXp, xpProgress, zeroWasteScore, badges, kitchen }
}

export async function checkAndAwardBadges() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  const stats = await getGamificationStats(user.id)
  if (!stats) return

  const newBadges: string[] = []

  if (stats.xp >= 50) newBadges.push('first_meal')
  if (stats.streak >= 3) newBadges.push('streak_3')
  if (stats.streak >= 7) newBadges.push('streak_7')
  
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

  for (const badgeId of newBadges) {
    await supabase.from('user_badges').upsert(
      { user_id: user.id, badge_id: badgeId },
      { onConflict: 'user_id, badge_id', ignoreDuplicates: true }
    )
  }
  
  revalidatePath('/dashboard')
}

export async function getPantryRoulette() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) return { error: 'Unauthorized' }

  const { data: pantryItems } = await supabase
    .from('pantry_items')
    .select('id, item_name')
    .eq('user_id', userData.user.id)

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

  const challengeItems = normalizedItems.slice(0, 3)

  return { challengeItems }
}