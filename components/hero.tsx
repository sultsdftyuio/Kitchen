// components/hero.tsx
import Link from "next/link";
import { 
  ArrowRight, 
  ChefHat, 
  Sparkles, 
  Carrot, 
  Beef, 
  Star, 
  Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-tangerine/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-butter/20 rounded-full blur-3xl -z-10" />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Copy & CTAs */}
        <div className="flex flex-col items-start text-left relative z-10">
          {/* Mini Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-butter/50 border border-tangerine/20 text-coffee-dark mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-tangerine" />
            <span className="text-sm font-medium">Your AI Sous-Chef has arrived</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-coffee mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 leading-[1.1]">
            Cook with <span className="text-tangerine italic">Heart.</span><br />
            Manage with <br className="hidden md:block" />
            <span className="underline decoration-butter decoration-8 underline-offset-4">Ease.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="max-w-xl text-lg md:text-xl text-coffee/80 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            kernelcook remembers your tastes, tracks your ingredients, and helps you turn random pantry leftovers into Michelin-worthy meals.
          </p>

          {/* Calls to Action */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Button asChild size="lg" className="bg-tangerine hover:bg-tangerine/90 text-white rounded-xl text-lg h-14 px-8 shadow-lg shadow-tangerine/25 transition-transform hover:-translate-y-1">
              <Link href="/signup">
                Start Cooking For Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-coffee/20 text-coffee hover:bg-coffee/5 rounded-xl text-lg h-14 px-8 transition-transform hover:-translate-y-1 bg-transparent">
              <Link href="#how-it-works">
                <ChefHat className="mr-2 w-5 h-5" />
                See How It Works
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Floating UI Showcase */}
        <div className="relative h-[500px] lg:h-[600px] w-full hidden md:block">
          
          {/* Main central decorative element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-butter to-tangerine/30 rounded-full blur-2xl opacity-50 animate-pulse" />

          {/* Floating Widget 1: Generating Recipe (Top Right) */}
          <div className="absolute top-10 right-4 lg:right-10 w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-cream p-5 transform rotate-3 hover:rotate-0 transition-transform duration-500 animate-in fade-in slide-in-from-right-8 delay-300 z-20">
            <div className="flex gap-3 items-center mb-4">
              <div className="bg-tangerine/10 p-2 rounded-xl">
                <Sparkles className="text-tangerine w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-coffee leading-none">Generating Recipe</h3>
                <span className="text-xs text-coffee/60">Analyzing pantry...</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-2 bg-butter/30 rounded-full w-full overflow-hidden">
                <div className="h-full bg-tangerine rounded-full w-2/3 animate-[pulse_2s_ease-in-out_infinite]" />
              </div>
              <div className="flex justify-between text-[10px] text-coffee/50 font-medium uppercase tracking-wider">
                <span>Creativity: High</span>
                <span>Time: 30m</span>
              </div>
            </div>
          </div>

          {/* Floating Widget 2: Pantry Inventory (Middle Left) */}
          <div className="absolute top-1/3 -left-4 lg:left-0 w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-cream p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500 animate-in fade-in slide-in-from-left-8 delay-500 z-30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-coffee text-sm">Pantry Alerts</h3>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-cream/50 p-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-1.5 rounded-lg"><Carrot className="w-4 h-4 text-orange-600" /></div>
                  <span className="text-sm font-medium text-coffee">Carrots</span>
                </div>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded-md shadow-sm text-coffee">Expires soon</span>
              </div>
              
              <div className="flex items-center justify-between bg-cream/50 p-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="bg-red-100 p-1.5 rounded-lg"><Beef className="w-4 h-4 text-red-600" /></div>
                  <span className="text-sm font-medium text-coffee">Ribeye</span>
                </div>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded-md shadow-sm text-coffee">Defrosted</span>
              </div>
            </div>
          </div>

          {/* Floating Widget 3: Skill Level Up (Bottom Right) */}
          <div className="absolute bottom-20 right-10 lg:right-20 bg-coffee text-cream rounded-2xl shadow-2xl p-5 transform rotate-6 hover:-rotate-2 transition-transform duration-500 animate-in fade-in slide-in-from-bottom-12 delay-700 z-40">
            <div className="flex items-center gap-4">
              <div className="bg-tangerine p-3 rounded-full hard-shadow">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-tangerine text-tangerine" />
                  <Star className="w-4 h-4 fill-tangerine text-tangerine" />
                  <Star className="w-4 h-4 fill-tangerine text-tangerine" />
                  <Star className="w-4 h-4 fill-tangerine text-tangerine" />
                  <Star className="w-4 h-4 text-tangerine/30" />
                </div>
                <span className="text-sm font-bold block">Skill Level Up!</span>
                <span className="text-xs text-cream/70">Promoted to Line Cook</span>
              </div>
            </div>
          </div>

          {/* Decorative small element */}
          <div className="absolute bottom-1/3 right-1/4 bg-white p-3 rounded-full shadow-lg border border-butter/50 animate-bounce delay-1000">
             <Clock className="w-5 h-5 text-tangerine" />
          </div>

        </div>
      </div>
    </section>
  );
}