// components/profile-settings.tsx
"use client"

import { useState } from "react"
import { updateProfile } from "@/app/actions/profile"
import { Settings, X, Save, ChefHat } from "lucide-react"

type Profile = {
  dietary_restrictions: string | null
  skill_level: string | null
}

export function ProfileSettings({ initialProfile }: { initialProfile: Profile | null }) {
  const [isOpen, setIsOpen] = useState(false)

  // Optimistic UI state
  const [restrictions, setRestrictions] = useState(initialProfile?.dietary_restrictions || "")
  const [skill, setSkill] = useState(initialProfile?.skill_level || "Intermediate")

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white p-2 sm:p-3 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 hover:shadow-none transition-all text-coffee"
        title="Chef Settings"
      >
        <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee/20 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Modal Content */}
          <div className="bg-cream w-full max-w-md rounded-3xl border-2 border-border hard-shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-forest p-6 flex items-center justify-between border-b-2 border-border">
              <div className="flex items-center gap-3">
                <div className="bg-tangerine p-2 rounded-lg text-white">
                  <ChefHat className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-cream">Chef Settings</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-cream/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form 
              action={async (formData) => {
                await updateProfile(formData)
                setIsOpen(false)
              }} 
              className="p-6 space-y-6"
            >
              
              {/* Skill Level */}
              <div className="space-y-2">
                <label className="font-bold text-coffee text-sm uppercase tracking-wider">Cooking Skill Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Pro'].map((level) => (
                    <label 
                      key={level}
                      className={`
                        cursor-pointer text-center py-2 rounded-xl border-2 transition-all font-medium text-sm
                        ${skill === level 
                          ? 'bg-tangerine border-coffee text-white hard-shadow-sm' 
                          : 'bg-white border-border text-coffee hover:bg-mutedYB'}
                      `}
                    >
                      <input 
                        type="radio" 
                        name="skill_level" 
                        value={level}
                        checked={skill === level}
                        onChange={() => setSkill(level)}
                        className="hidden" 
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-2">
                <label className="font-bold text-coffee text-sm uppercase tracking-wider">Dietary Restrictions</label>
                <textarea
                  name="dietary_restrictions"
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  placeholder="e.g. Vegan, Gluten Free, Nut Allergy..."
                  className="w-full h-24 bg-white px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-tangerine text-coffee resize-none"
                />
                <p className="text-xs text-coffee-dark/50">
                  The AI Chef will filter recipes based on this.
                </p>
              </div>

              {/* Footer */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-coffee text-white py-3 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 hover:shadow-none transition-all font-bold flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Preferences
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}