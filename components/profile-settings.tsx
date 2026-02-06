// components/profile-settings.tsx
"use client"

import { useState } from "react"
import { updateProfile } from "@/app/actions/profile"
import { Settings, X, Save, ChefHat, Wrench } from "lucide-react"

type Profile = {
  dietary_restrictions: string | null
  skill_level: string | null
  kitchen_equipment: string | null
}

export function ProfileSettings({ initialProfile }: { initialProfile: Profile | null }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const [restrictions, setRestrictions] = useState(initialProfile?.dietary_restrictions || "")
  const [equipment, setEquipment] = useState(initialProfile?.kitchen_equipment || "")
  const [skill, setSkill] = useState(initialProfile?.skill_level || "Intermediate")

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white p-2 sm:p-3 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 hover:shadow-none transition-all text-coffee"
      >
        <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-cream w-full max-w-lg rounded-3xl border-2 border-border hard-shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-forest p-6 flex items-center justify-between border-b-2 border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-tangerine p-2 rounded-lg text-white">
                  <ChefHat className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-cream">KitchenOS Config</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-cream/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <form 
                action={async (formData) => {
                  await updateProfile(formData)
                  setIsOpen(false)
                }} 
                className="space-y-6"
              >
                {/* Skill Level */}
                <div className="space-y-2">
                  <label className="font-bold text-coffee text-sm uppercase tracking-wider">Skill Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Pro'].map((level) => (
                      <label key={level} className={`cursor-pointer text-center py-2 rounded-xl border-2 transition-all font-medium text-xs sm:text-sm ${skill === level ? 'bg-tangerine border-coffee text-white' : 'bg-white border-border text-coffee hover:bg-muted'}`}>
                        <input type="radio" name="skill_level" value={level} checked={skill === level} onChange={() => setSkill(level)} className="hidden" />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div className="space-y-2">
                  <label className="font-bold text-coffee text-sm uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> Equipment
                  </label>
                  <textarea
                    name="kitchen_equipment"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="e.g. Air Fryer, Blender, Cast Iron Skillet..."
                    className="w-full h-20 bg-white px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee text-sm resize-none"
                  />
                </div>

                {/* Dietary Restrictions */}
                <div className="space-y-2">
                  <label className="font-bold text-coffee text-sm uppercase tracking-wider">Dietary Restrictions</label>
                  <textarea
                    name="dietary_restrictions"
                    value={restrictions}
                    onChange={(e) => setRestrictions(e.target.value)}
                    placeholder="e.g. Vegan, No Nuts, Keto..."
                    className="w-full h-20 bg-white px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-coffee text-white py-4 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 hover:shadow-none transition-all font-bold flex items-center justify-center gap-2 mt-4"
                >
                  <Save className="w-5 h-5" />
                  Save Preferences
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}