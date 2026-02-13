// components/features-bento.tsx
import { Apple, Brain, Flame, UtensilsCrossed } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FeaturesBento() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-coffee mb-4">Everything your kitchen needs.</h2>
        <p className="text-lg text-coffee/70 max-w-2xl mx-auto">
          We combined inventory management with state-of-the-art AI coaching so you never have to ask "What's for dinner?" again.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        {/* Large Feature 1: AI Recipes */}
        <Card className="md:col-span-2 bg-gradient-to-br from-butter/40 to-cream border-tangerine/20 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative group">
          <CardHeader>
            <div className="bg-white p-3 rounded-2xl w-fit mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Brain className="w-8 h-8 text-tangerine" />
            </div>
            <CardTitle className="text-2xl font-serif text-coffee">AI Recipe Generation</CardTitle>
            <CardDescription className="text-coffee/80 text-base max-w-md mt-2">
              Tell KitchenOS what's in your pantry, your dietary restrictions, and your skill level. Get a personalized, step-by-step recipe in seconds.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Small Feature 1: Pantry */}
        <Card className="bg-coffee text-cream border-none shadow-md hover:shadow-lg transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 group-hover:scale-125 transition-all duration-500">
             <Apple className="w-32 h-32" />
          </div>
          <CardHeader className="relative z-10">
            <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4 backdrop-blur-md">
              <Apple className="w-8 h-8 text-butter" />
            </div>
            <CardTitle className="text-xl font-serif text-white">Smart Pantry</CardTitle>
            <CardDescription className="text-cream/80 text-base mt-2">
              Track your ingredients seamlessly. We'll warn you before things go bad.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Small Feature 2: Roasting */}
        <Card className="bg-white border-coffee/10 shadow-md hover:shadow-lg transition-shadow group">
          <CardHeader>
            <div className="bg-butter/30 p-3 rounded-2xl w-fit mb-4 group-hover:rotate-12 transition-transform">
              <Flame className="w-8 h-8 text-tangerine" />
            </div>
            <CardTitle className="text-xl font-serif text-coffee">Roast My Meal</CardTitle>
            <CardDescription className="text-coffee/70 text-base mt-2">
              Upload a picture of your cooking disaster and let our AI brutally (but lovingly) roast your technique.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Large Feature 2: History */}
        <Card className="md:col-span-2 bg-gradient-to-br from-white to-tangerine/10 border-tangerine/20 shadow-md hover:shadow-lg transition-shadow group">
          <CardHeader>
            <div className="bg-white p-3 rounded-2xl w-fit mb-4 shadow-sm group-hover:-rotate-12 transition-transform">
              <UtensilsCrossed className="w-8 h-8 text-coffee" />
            </div>
            <CardTitle className="text-2xl font-serif text-coffee">Cooking History & Mastery</CardTitle>
            <CardDescription className="text-coffee/80 text-base max-w-md mt-2">
              Rate your meals, add private notes on what to tweak next time, and watch your culinary skill level rise from "Microwave Master" to "Home Chef".
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}