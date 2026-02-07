// app/actions/profile.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ProfileSchema = z.object({
  dietary_restrictions: z.string().trim().max(500).optional(),
  skill_level: z.string().trim().max(50).optional(),
  kitchen_equipment: z.string().trim().max(1000).optional(),
})

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // FIX: Safely extract values. formData.get() returns 'File | string | null'.
  // Using ?.toString() ensures we pass 'string | undefined' to Zod.
  // Passing 'null' to z.string() causes validation to fail.
  const rawData = {
    dietary_restrictions: formData.get("dietary_restrictions")?.toString(),
    skill_level: formData.get("skill_level")?.toString(),
    kitchen_equipment: formData.get("kitchen_equipment")?.toString(),
  }

  const result = ProfileSchema.safeParse(rawData)

  if (!result.success) {
    console.error("Profile validation failed:", result.error.flatten())
    throw new Error("Invalid profile data")
  }

  const { dietary_restrictions, skill_level, kitchen_equipment } = result.data

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id, // FORCE the user ID from the session.
      dietary_restrictions: dietary_restrictions || "",
      skill_level: skill_level || "Beginner",
      kitchen_equipment: kitchen_equipment || "",
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error("Error updating profile:", error)
    throw new Error("Failed to update profile")
  }

  revalidatePath("/dashboard")
}