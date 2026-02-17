// components/features-bento.tsx
import { Apple, Brain, Flame, UtensilsCrossed, Sparkles } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FeaturesBento() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee tracking-tight">
          Everything your kitchen needs.
        </h2>
        <p className="text-lg md:text-xl text-coffee/70 max-w-2xl mx-auto leading-relaxed">
          We combined inventory management with state-of-the-art AI coaching so you never have to ask "What's for dinner?" again.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
        {/* Large Feature 1: AI Recipes */}
        <Card className="md:col-span-2 bg-gradient-to-br from-butter/60 via-cream to-cream border-tangerine/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group">
          <div className="absolute top-4 right-4 bg-tangerine/10 text-tangerine text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-tangerine/20">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </div>
          <CardHeader className="h-full flex flex-col justify-end pb-8">
            <div className="bg-white p-3.5 rounded-2xl w-fit mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 relative">
              <div className="absolute inset-0 bg-tangerine/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Brain className="w-8 h-8 text-tangerine relative z-10" />
            </div>
            <CardTitle className="text-3xl font-serif text-coffee mb-2">AI Recipe Generation</CardTitle>
            <CardDescription className="text-coffee/80 text-base md:text-lg max-w-lg leading-relaxed">
              Tell kernelcook what's in your pantry, your dietary restrictions, and your skill level. Get a personalized, step-by-step recipe in seconds.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Small Feature 1: Pantry */}
        <Card className="bg-coffee text-cream border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          {/* Decorative background icon */}
          <div className="absolute -bottom-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none">
             <Apple className="w-48 h-48" />
          </div>
          <CardHeader className="relative z-10 h-full flex flex-col justify-between">
            <div className="bg-white/10 p-3.5 rounded-2xl w-fit backdrop-blur-md border border-white/5 group-hover:bg-white/20 transition-colors">
              <Apple className="w-7 h-7 text-butter" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-white mb-2">Smart Pantry</CardTitle>
              <CardDescription className="text-cream/80 text-base">
                Track your ingredients seamlessly. We'll warn you before things go bad.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Small Feature 2: Roasting */}
        <Card className="bg-white border-coffee/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-coffee/5 text-coffee/60 text-xs font-bold px-3 py-1 rounded-full border border-coffee/10">
            Beta
          </div>
          <CardHeader className="h-full flex flex-col justify-between">
            <div className="bg-butter/30 p-3.5 rounded-2xl w-fit group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              <Flame className="w-7 h-7 text-tangerine group-hover:animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-coffee mb-2">Roast My Meal</CardTitle>
              <CardDescription className="text-coffee/70 text-base">
                Upload a picture of your cooking disaster and let our AI brutally (but lovingly) roast your technique.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Large Feature 2: History */}
        <Card className="md:col-span-2 bg-gradient-to-br from-white to-tangerine/5 border-tangerine/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <CardHeader className="h-full flex flex-col justify-end pb-8">
            <div className="bg-white p-3.5 rounded-2xl w-fit mb-6 shadow-sm group-hover:-rotate-12 group-hover:shadow-md transition-all duration-300 border border-coffee/5">
              <UtensilsCrossed className="w-8 h-8 text-coffee" />
            </div>
            <CardTitle className="text-3xl font-serif text-coffee mb-2">Cooking History & Mastery</CardTitle>
            <CardDescription className="text-coffee/80 text-base md:text-lg max-w-lg leading-relaxed">
              Rate your meals, add private notes on what to tweak next time, and watch your culinary skill level rise from "Microwave Master" to "Home Chef".
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}