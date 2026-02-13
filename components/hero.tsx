// components/hero.tsx
import Link from "next/link";
import { ArrowRight, ChefHat, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-tangerine/10 rounded-full blur-3xl -z-10" />
      
      {/* Mini Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-butter/50 border border-tangerine/20 text-coffee-dark mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Sparkles className="w-4 h-4 text-tangerine" />
        <span className="text-sm font-medium">Your AI Sous-Chef has arrived</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-coffee mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        Cook with <span className="text-tangerine italic">Heart.</span> <br className="hidden md:block" />
        Manage with <span className="underline decoration-butter decoration-8 underline-offset-4">Ease.</span>
      </h1>
      
      {/* Subheadline */}
      <p className="max-w-2xl text-lg md:text-xl text-coffee/80 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        KitchenOS remembers your tastes, tracks your ingredients, and helps you turn random pantry leftovers into Michelin-worthy meals.
      </p>

      {/* Calls to Action */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
        <Button asChild size="lg" className="bg-tangerine hover:bg-tangerine/90 text-white rounded-xl text-lg h-14 px-8 shadow-lg shadow-tangerine/25 transition-transform hover:-translate-y-1">
          <Link href="/signup">
            Start Cooking For Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-2 border-coffee/20 text-coffee hover:bg-coffee/5 rounded-xl text-lg h-14 px-8 transition-transform hover:-translate-y-1">
          <Link href="#how-it-works">
            <ChefHat className="mr-2 w-5 h-5" />
            See How It Works
          </Link>
        </Button>
      </div>
    </section>
  );
}