// components/profile-settings.tsx
"use client"

import { useState, useTransition, useEffect } from "react"
import { updateProfile } from "@/app/actions/profile"
import { Settings, X, Save, ChefHat, Wrench, Sparkles, WheatOff, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

type Profile = {
  dietary_restrictions: string | null
  skill_level: string | null
  kitchen_equipment: string | null
}

const COMMON_DIETS = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Halal", "Kosher", "Nut Allergy", "Shellfish Allergy"]
const COMMON_EQUIPMENT = ["Air Fryer", "Slow Cooker", "Blender", "Food Processor", "Cast Iron Skillet", "Dutch Oven", "Stand Mixer", "Sous Vide", "Rice Cooker"]

const SKILL_LEVELS = [
  { id: "Beginner", label: "Apprentice", desc: "Still learning the basics", icon: "🍳" },
  { id: "Intermediate", label: "Line Cook", desc: "Comfortable with most recipes", icon: "🔪" },
  { id: "Pro", label: "Executive Chef", desc: "Can cook blindfolded", icon: "👨‍🍳" }
]

export function ProfileSettings({ initialProfile }: { initialProfile: Profile | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  // Parse initial comma-separated strings into arrays
  const [diets, setDiets] = useState<string[]>([])
  const [equipment, setEquipment] = useState<string[]>([])
  const [skill, setSkill] = useState(initialProfile?.skill_level || "Intermediate")

  // Custom input states
  const [customDiet, setCustomDiet] = useState("")
  const [customEq, setCustomEq] = useState("")

  useEffect(() => {
    if (initialProfile?.dietary_restrictions) {
      setDiets(initialProfile.dietary_restrictions.split(", ").filter(Boolean))
    }
    if (initialProfile?.kitchen_equipment) {
      setEquipment(initialProfile.kitchen_equipment.split(", ").filter(Boolean))
    }
  }, [initialProfile])

  const toggleItem = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const handleAddCustom = (value: string, setter: (val: string) => void, list: string[], setList: (val: string[]) => void) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()])
    }
    setter("")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.set("skill_level", skill)
    formData.set("dietary_restrictions", diets.join(", "))
    formData.set("kitchen_equipment", equipment.join(", "))

    startTransition(async () => {
      try {
        await updateProfile(formData)
        toast.success("AI Cooking Preferences updated!")
        setIsOpen(false)
      } catch (error) {
        toast.error("Failed to save preferences.")
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        title="AI Cooking Preferences"
      >
        <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
            
            {/* Header */}
            <div className="bg-slate-50 px-6 py-5 flex items-center justify-between border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 text-lg">AI Cooking Profile</h2>
                  <p className="text-xs text-slate-500">Tune the AI to your kitchen and lifestyle.</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Dietary Restrictions */}
                <div className="space-y-3">
                  <label className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <WheatOff className="w-4 h-4 text-tangerine" /> Dietary Needs & Allergies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_DIETS.map((diet) => {
                      const isSelected = diets.includes(diet)
                      return (
                        <button
                          key={diet}
                          type="button"
                          onClick={() => toggleItem(diet, diets, setDiets)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            isSelected 
                              ? 'bg-tangerine text-white border-tangerine shadow-md shadow-orange-500/20' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {diet}
                        </button>
                      )
                    })}
                    {diets.filter(d => !COMMON_DIETS.includes(d)).map(custom => (
                      <button
                        key={custom}
                        type="button"
                        onClick={() => toggleItem(custom, diets, setDiets)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border bg-tangerine text-white border-tangerine shadow-md flex items-center gap-1"
                      >
                        {custom} <X className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="text" 
                      value={customDiet}
                      onChange={(e) => setCustomDiet(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(customDiet, setCustomDiet, diets, setDiets); } }}
                      placeholder="Add other restriction..." 
                      className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-tangerine/50 flex-1"
                    />
                    <button type="button" onClick={() => handleAddCustom(customDiet, setCustomDiet, diets, setDiets)} className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100"></div>

                {/* Equipment Arsenal */}
                <div className="space-y-3">
                  <label className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-500" /> Kitchen Arsenal
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Select the tools you own so the AI doesn't suggest recipes you can't cook.</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_EQUIPMENT.map((eq) => {
                      const isSelected = equipment.includes(eq)
                      return (
                        <button
                          key={eq}
                          type="button"
                          onClick={() => toggleItem(eq, equipment, setEquipment)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            isSelected 
                              ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {eq}
                        </button>
                      )
                    })}
                    {equipment.filter(e => !COMMON_EQUIPMENT.includes(e)).map(custom => (
                      <button
                        key={custom}
                        type="button"
                        onClick={() => toggleItem(custom, equipment, setEquipment)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border bg-blue-500 text-white border-blue-500 shadow-md flex items-center gap-1"
                      >
                        {custom} <X className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="text" 
                      value={customEq}
                      onChange={(e) => setCustomEq(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(customEq, setCustomEq, equipment, setEquipment); } }}
                      placeholder="Add other equipment..." 
                      className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex-1"
                    />
                    <button type="button" onClick={() => handleAddCustom(customEq, setCustomEq, equipment, setEquipment)} className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100"></div>

                {/* Skill Level Cards */}
                <div className="space-y-3">
                  <label className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-emerald-500" /> Cooking Skill Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SKILL_LEVELS.map((lvl) => {
                      const isSelected = skill === lvl.id
                      return (
                        <div 
                          key={lvl.id} 
                          onClick={() => setSkill(lvl.id)}
                          className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                              : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-2xl mb-2">{lvl.icon}</div>
                          <h4 className={`text-sm font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-700'}`}>{lvl.label}</h4>
                          <p className={`text-xs mt-1 ${isSelected ? 'text-emerald-600/80' : 'text-slate-500'}`}>{lvl.desc}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="bg-white px-6 py-4 border-t border-slate-200 shrink-0">
                <button
                  type="submit"
                  form="profile-form"
                  disabled={isPending}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl shadow-md hover:bg-slate-800 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Saving Preferences...</>
                  ) : (
                    <><Save className="w-5 h-5" /> Save AI Profile</>
                  )}
                </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}