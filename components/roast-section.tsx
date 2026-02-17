// components/roast-section.tsx
import { Trophy, Star, TrendingUp, ChefHat, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function RoastSection() {
  return (
    <section id="mastery" className="py-24 bg-coffee text-cream relative overflow-hidden my-12 rounded-[3rem] mx-4 sm:px-6 lg:px-8 max-w-7xl xl:mx-auto shadow-2xl">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-tangerine/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-butter/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Gamification Pitch */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-butter/10 text-butter border border-butter/20 text-sm font-bold shadow-sm backdrop-blur-sm">
              <Trophy className="w-4 h-4" />
              <span>Culinary RPG Mode</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]">
              Turn your kitchen <br />
              <span className="text-tangerine">into an XP farm.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-cream/80 max-w-lg leading-relaxed">
              Every meal you log earns you experience points. Track your progress across different cuisines, unlock "Chef Titles," and see your skill level rise from a kitchen novice to a professional home chef.
            </p>

            <div className="space-y-4 pt-4">
              {[
                "Earn XP for every new ingredient used",
                "Unlock badges for consistent healthy cooking",
                "Level up your 'Knife Skills' and 'Flavor Pairing' stats"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tangerine" />
                  <span className="text-cream/90 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button size="lg" className="bg-tangerine hover:bg-tangerine/90 text-white font-bold text-lg px-8 h-14 rounded-xl transition-all hover:scale-105 hover:-translate-y-1 shadow-lg shadow-tangerine/20 group">
                <ChefHat className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Training
              </Button>
            </div>
          </div>

          {/* Right Column: Mastery Dashboard Mockup */}
          <div className="relative mt-8 lg:mt-0">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-all duration-500">
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-tangerine to-butter p-0.5">
                    <div className="w-full h-full rounded-[14px] bg-coffee flex items-center justify-center text-2xl">
                      🍳
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Chef Apprentice</h3>
                    <p className="text-tangerine font-mono text-sm">LEVEL 14</p>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-cream/60">Overall Mastery</span>
                      <span className="text-butter">840 / 1200 XP</span>
                    </div>
                    <Progress value={70} className="h-2.5 bg-white/10" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <Star className="w-5 h-5 text-butter mb-2" />
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-xs text-cream/40 uppercase tracking-wider">Perfect Meals</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <TrendingUp className="w-5 h-5 text-tangerine mb-2" />
                      <div className="text-2xl font-bold text-white">5d</div>
                      <div className="text-xs text-cream/40 uppercase tracking-wider">Cooking Streak</div>
                    </div>
                  </div>
                </div>

                {/* Recent Unlock */}
                <div className="bg-tangerine/10 rounded-2xl p-4 border border-tangerine/20 flex items-center gap-4">
                  <div className="bg-tangerine p-2 rounded-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">New Badge Unlocked!</p>
                    <p className="text-xs text-tangerine">"The Saucier" - 5 Pasta Dishes Logged</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Background floating element */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-butter/20 rounded-full blur-2xl animate-pulse" />
          </div>

        </div>
      </div>
    </section>
  );
}