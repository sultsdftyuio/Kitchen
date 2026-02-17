// app/actions/gamification.ts
'use server'

import { createClient } from '@/utils/supabase/server'

export type GamificationStats = {
  streak: number;
  xp: number;
  level: string;
  nextLevelXp: number;
  xpProgress: number;
  zeroWasteScore: number;
}

export async function getGamificationStats(): Promise<GamificationStats | null> {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    return null
  }

  const userId = userData.user.id

  // 1. Fetch data needed for calculations
  const { data: pantryItems } = await supabase
    .from('pantry_items')
    .select('id')
    .eq('user_id', userId)

  const { data: cookingHistory } = await supabase
    .from('cooking_history')
    .select('cooked_at, rating')
    .eq('user_id', userId)
    .order('cooked_at', { ascending: false })

  const pantryCount = pantryItems?.length || 0
  const history = cookingHistory || []

  // --- FEATURE 1: KITCHEN STREAK ---
  let streak = 0
  if (history.length > 0) {
    // Normalize dates to YYYY-MM-DD to ignore time of day
    const uniqueDates = Array.from(new Set(
      history.map(record => new Date(record.cooked_at).toISOString().split('T')[0])
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // If the most recent cook wasn't today or yesterday, streak is broken
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      streak = 1
      let currentDate = new Date(uniqueDates[0])

      for (let i = 1; i < uniqueDates.length; i++) {
        const nextDate = new Date(uniqueDates[i])
        const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          streak++
          currentDate = nextDate
        } else {
          break
        }
      }
    }
  }

  // --- FEATURE 2: SKILL-BASED LEVELING (XP) ---
  const xpFromPantry = pantryCount * 5
  const xpFromMeals = history.length * 50
  const xpFromPerfectRatings = history.filter(meal => meal.rating === 5).length * 20
  
  const totalXp = xpFromPantry + xpFromMeals + xpFromPerfectRatings

  // Determine Level
  let level = "Dishwasher"
  let nextLevelXp = 200

  if (totalXp >= 2000) {
    level = "Executive Chef"
    nextLevelXp = totalXp // Max level
  } else if (totalXp >= 1000) {
    level = "Sous Chef"
    nextLevelXp = 2000
  } else if (totalXp >= 500) {
    level = "Line Cook"
    nextLevelXp = 1000
  } else if (totalXp >= 200) {
    level = "Prep Cook"
    nextLevelXp = 500
  }

  const currentLevelBaseXp = level === "Executive Chef" ? 2000 : 
                             level === "Sous Chef" ? 1000 : 
                             level === "Line Cook" ? 500 : 
                             level === "Prep Cook" ? 200 : 0;

  const xpProgress = level === "Executive Chef" 
    ? 100 
    : Math.round(((totalXp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100)

  // --- FEATURE 5: ZERO WASTE SCORE ---
  // MVP logic: A healthy ratio of meals cooked vs ingredients currently hoarded.
  // We want to encourage high meal output and lean pantries.
  let zeroWasteScore = 0
  if (pantryCount > 0 || history.length > 0) {
    const ratio = history.length / Math.max(pantryCount, 1)
    // Formula: Cap at 100. If you cook 2 meals for every 1 item in your pantry, you get 100%.
    zeroWasteScore = Math.min(100, Math.round((ratio / 2) * 100))
    // Give a baseline of 10 for trying
    if (zeroWasteScore < 10) zeroWasteScore = 10 
  }

  return {
    streak,
    xp: totalXp,
    level,
    nextLevelXp,
    xpProgress,
    zeroWasteScore
  }
}

// --- FEATURE 3: PANTRY ROULETTE ---
export async function getPantryRoulette() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    return { error: 'Unauthorized' }
  }

  const { data: pantryItems } = await supabase
    .from('pantry_items')
    .select('id, item_name')
    .eq('user_id', userData.user.id)

  if (!pantryItems || pantryItems.length < 3) {
    return { error: 'You need at least 3 items in your pantry to play Roulette!' }
  }

  // Shuffle array (Fisher-Yates algorithm)
  for (let i = pantryItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pantryItems[i], pantryItems[j]] = [pantryItems[j], pantryItems[i]];
  }

  // Pick top 3 to 4 items randomly
  const challengeCount = Math.floor(Math.random() * 2) + 3 // Returns 3 or 4
  const challengeItems = pantryItems.slice(0, challengeCount)

  return { challengeItems }
}