// components/features-bento.tsx
import { 
  Apple, 
  Brain, 
  UtensilsCrossed, 
  Sparkles, 
  ChefHat, 
  MessageSquare, 
  Trophy 
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FeaturesBento() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-5">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee tracking-tight">
          Everything your kitchen needs.
        </h2>
        <p className="text-lg md:text-xl text-coffee/70 max-w-2xl mx-auto leading-relaxed">
          We combined smart inventory management with state-of-the-art AI coaching so you never have to ask "What's for dinner?" again.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
        {/* ROW 1: Large Feature 1 (Recipes) + Small Feature 1 (Pantry) */}
        
        <Card className="md:col-span-2 bg-gradient-to-br from-butter/60 via-cream to-cream border-tangerine/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group">
          <div className="absolute top-4 right-4 bg-tangerine/10 text-tangerine text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-tangerine/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Most Popular
          </div>
          <CardHeader className="h-full flex flex-col justify-end pb-8">
            <div className="bg-white p-3.5 rounded-2xl w-fit mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 relative">
              <div className="absolute inset-0 bg-tangerine/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Brain className="w-8 h-8 text-tangerine relative z-10" />
            </div>
            <CardTitle className="text-3xl font-serif text-coffee mb-3">AI Recipe Generation</CardTitle>
            <CardDescription className="text-coffee/80 text-base md:text-lg max-w-lg leading-relaxed">
              Tell kernelcook what's in your pantry, your dietary restrictions, and your skill level. Get a personalized, step-by-step recipe in seconds.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-coffee text-cream border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none">
             <Apple className="w-48 h-48" />
          </div>
          <CardHeader className="relative z-10 h-full flex flex-col justify-between">
            <div className="bg-white/10 p-3.5 rounded-2xl w-fit backdrop-blur-md border border-white/5 group-hover:bg-white/20 transition-colors shadow-sm">
              <Apple className="w-7 h-7 text-butter" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-white mb-2">Smart Pantry</CardTitle>
              <CardDescription className="text-cream/80 text-base leading-relaxed">
                Track your ingredients seamlessly. We'll warn you before things go bad and suggest meals to reduce waste.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* ROW 2: Small Feature 2 (AI Chat) + Large Feature 2 (Cook Mode) */}

        <Card className="bg-white border-coffee/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <CardHeader className="h-full flex flex-col justify-between">
            <div className="bg-tangerine/10 p-3.5 rounded-2xl w-fit group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-sm">
              <MessageSquare className="w-7 h-7 text-tangerine group-hover:animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-coffee mb-2">AI Sous-Chef</CardTitle>
              <CardDescription className="text-coffee/70 text-base leading-relaxed">
                Missing an ingredient? Need to scale a recipe? Chat with your AI assistant on the fly to save dinner.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="md:col-span-2 bg-gradient-to-br from-white to-tangerine/5 border-tangerine/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <CardHeader className="h-full flex flex-col justify-end pb-8">
            <div className="bg-white p-3.5 rounded-2xl w-fit mb-6 shadow-sm group-hover:-rotate-12 group-hover:shadow-md transition-all duration-300 border border-coffee/5 relative">
              <div className="absolute inset-0 bg-coffee/5 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <ChefHat className="w-8 h-8 text-coffee relative z-10" />
            </div>
            <CardTitle className="text-3xl font-serif text-coffee mb-3">Distraction-Free Cook Mode</CardTitle>
            <CardDescription className="text-coffee/80 text-base md:text-lg max-w-lg leading-relaxed">
              No more scrolling past a blogger's life story with flour-covered hands. Get a clean, step-by-step interface designed for the actual kitchen.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* ROW 3: Large Feature 3 (History) + Small Feature 3 (Gamification) */}

        <Card className="md:col-span-2 bg-gradient-to-br from-cream to-butter/30 border-coffee/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group">
          <CardHeader className="h-full flex flex-col justify-end pb-8">
            <div className="bg-white p-3.5 rounded-2xl w-fit mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 relative">
              <UtensilsCrossed className="w-8 h-8 text-coffee" />
            </div>
            <CardTitle className="text-3xl font-serif text-coffee mb-3">Cooking History</CardTitle>
            <CardDescription className="text-coffee/80 text-base md:text-lg max-w-lg leading-relaxed">
              Log your meals, rate them, and add private notes on what to tweak next time. Build your personal, perfected cookbook over time.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-coffee text-cream border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none">
             <Trophy className="w-48 h-48" />
          </div>
          <CardHeader className="relative z-10 h-full flex flex-col justify-between">
            <div className="bg-white/10 p-3.5 rounded-2xl w-fit backdrop-blur-md border border-white/5 group-hover:bg-white/20 transition-colors shadow-sm">
              <Trophy className="w-7 h-7 text-butter" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-white mb-2">Level Up</CardTitle>
              <CardDescription className="text-cream/80 text-base leading-relaxed">
                Earn XP for every meal you cook. Watch your culinary rank rise from "Microwave Master" to "Home Chef".
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

      </div>
    </section>
  );
}