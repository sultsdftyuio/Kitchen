// app/actions/profile.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const dietaryRestrictions = formData.get("dietary_restrictions") as string
  const skillLevel = formData.get("skill_level") as string

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id, // matches auth.users.id
      dietary_restrictions: dietaryRestrictions,
      skill_level: skillLevel,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error("Error updating profile:", error)
    throw new Error("Failed to update profile")
  }

  revalidatePath("/dashboard")
}