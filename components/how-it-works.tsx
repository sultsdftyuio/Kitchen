// components/how-it-works.tsx
import { Search, Sparkles, Utensils, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Scan Your Pantry",
    description: "Input what you have on hand. Our system tracks quantities and expiration dates automatically.",
    icon: <Search className="w-6 h-6 text-tangerine" />,
    preview: (
      <div className="mt-6 p-4 bg-white rounded-2xl border border-coffee/5 shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs border-b pb-2">
          <span className="font-bold text-coffee">Pantry Items</span>
          <span className="text-tangerine">+ Add</span>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-butter/20 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-tangerine/10 rounded-full animate-pulse" />
        </div>
      </div>
    )
  },
  {
    number: "02",
    title: "Generate Recipe",
    description: "AI crafts the perfect meal based on your available ingredients and dietary needs.",
    icon: <Sparkles className="w-6 h-6 text-tangerine" />,
    preview: (
      <div className="mt-6 p-4 bg-tangerine text-white rounded-2xl shadow-lg transform -rotate-2">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">AI Result</span>
        </div>
        <div className="text-sm font-serif font-bold italic">"Tuscan Garlic Pasta"</div>
        <div className="mt-2 h-1 w-full bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white w-2/3" />
        </div>
      </div>
    )
  },
  {
    number: "03",
    title: "Level Up Your Skills",
    description: "Follow step-by-step instructions and watch your culinary mastery level grow.",
    icon: <Utensils className="w-6 h-6 text-tangerine" />,
    preview: (
      <div className="mt-6 p-4 bg-coffee text-cream rounded-2xl shadow-xl border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-butter uppercase">Mastery +45 XP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">👨‍🍳</div>
          <div className="text-xs font-medium">Home Chef Status</div>
        </div>
      </div>
    )
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee mb-6">
          From pantry to plate in 3 steps.
        </h2>
        <p className="text-lg text-coffee/60 max-w-xl mx-auto">
          We’ve streamlined the cooking process so you spend less time planning and more time enjoying.
        </p>
      </div>

      <div className="relative">
        {/* Connection Line (Desktop only) */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-tangerine/20 to-transparent -translate-y-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {steps.map((step, index) => (
            <div key={index} className="group flex flex-col items-center text-center">
              {/* Step Icon & Number */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-white rounded-3xl border-2 border-tangerine/20 flex items-center justify-center shadow-xl group-hover:border-tangerine group-hover:scale-110 transition-all duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-coffee text-cream text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-serif font-bold text-coffee mb-3">
                {step.title}
              </h3>
              <p className="text-coffee/70 leading-relaxed px-4">
                {step.description}
              </p>

              {/* Interactive Mockup Element */}
              <div className="w-full max-w-[240px] transition-transform duration-500 group-hover:-translate-y-2">
                {step.preview}
              </div>

              {/* Mobile Arrow */}
              {index < steps.length - 1 && (
                <div className="md:hidden mt-8 text-tangerine/30">
                  <ArrowRight className="w-8 h-8 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}