// components/faq-section.tsx
"use client"

import { useState } from "react"
import { ChevronDown, MessageCircleQuestion } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "Do I have to type in every single ingredient I own?",
    answer: "Nope! You can start by just adding the core ingredients you want to use today. Kernelcook will generate recipes based on what you have, and you can build out your digital pantry over time."
  },
  {
    question: "How does the AI Chef know what to cook?",
    answer: "Our AI engine looks at your active pantry inventory, combined with the dietary restrictions and skill level set in your profile, to generate a 100% custom, step-by-step recipe that you can actually make right now."
  },
  {
    question: "What if I have allergies or specific dietary restrictions?",
    answer: "You can easily configure your dietary preferences (like vegan, gluten-free, or nut allergies) in your Profile Settings. Our AI strictly adheres to these rules when generating your recipes so you can cook with confidence."
  },
  {
    question: "Can I save the meals I've cooked?",
    answer: "Yes! Once you finish a recipe in Cook Mode, it gets logged directly to your Cooking History. You can rate it and add personal notes to train the AI for next time."
  },
  {
    question: "Do I earn rewards for cooking?",
    answer: "Absolutely. Kernelcook features a built-in gamification system. Every meal you log earns you XP, helping you level up from a 'Microwave Master' to an 'Executive Chef' and unlock new culinary badges."
  },
  {
    question: "Is Kernelcook really free?",
    answer: "The core features—managing your pantry, basic profile settings, and standard recipe generation—are completely free. We're focused on getting you into the kitchen and actually cooking first!"
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 bg-stone-50 border-t-2 border-stone-200">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4 flex items-center justify-center gap-3">
            <MessageCircleQuestion className="w-8 h-8 text-orange-500" />
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-stone-600 font-medium">
            Everything you need to know about getting started with Kernelcook.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div 
                key={i} 
                className={cn(
                  "bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300",
                  isOpen ? "border-orange-500 shadow-md" : "border-stone-200 hover:border-orange-300"
                )}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-bold text-stone-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={cn(
                      "w-6 h-6 text-stone-400 transition-transform duration-300 shrink-0",
                      isOpen && "rotate-180 text-orange-500"
                    )} 
                  />
                </button>
                <div 
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="p-6 pt-0 text-stone-600 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}