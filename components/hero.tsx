// components/hero.tsx
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

// NOTICE: "export function" (Named Export), NOT "export default function"
export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-coffee/10 hard-shadow-sm mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-tangerine fill-tangerine" />
          <span className="text-sm font-bold text-coffee">
            The sous-chef for your brain
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-coffee mb-6 leading-[1.1] animate-fade-in-up delay-100">
          Stop wasting food. <br />
          <span className="text-tangerine relative inline-block">
            Start cooking.
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-butter/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-xl text-coffee-dark/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          KitchenOS tracks your pantry, suggests recipes based on what you have, 
          and helps you master the art of "making do" with style.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-coffee hover:bg-coffee-dark text-white text-lg font-bold px-8 py-4 rounded-2xl border-2 border-transparent hard-shadow hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-2 group"
          >
            Start Your Pantry
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/login"
            className="w-full sm:w-auto bg-white hover:bg-cream text-coffee text-lg font-bold px-8 py-4 rounded-2xl border-2 border-coffee hard-shadow hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            I have an account
          </Link>
        </div>
      </div>
    </section>
  );
}