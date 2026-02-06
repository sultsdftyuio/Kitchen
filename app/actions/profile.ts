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

  const rawData = {
    dietary_restrictions: formData.get("dietary_restrictions"),
    skill_level: formData.get("skill_level"),
    kitchen_equipment: formData.get("kitchen_equipment"),
  }

  const result = ProfileSchema.safeParse(rawData)

  if (!result.success) {
    throw new Error("Invalid profile data")
  }

  // Safe to insert
  const { dietary_restrictions, skill_level, kitchen_equipment } = result.data

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id, // FORCE the user ID from the session. Never trust the client for IDs.
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