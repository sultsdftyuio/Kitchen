"use client"; //hero.tsx

import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-butter px-4 py-2 rounded-full border-2 border-border mb-6">
              <Sparkles className="w-4 h-4 text-tangerine" />
              <span className="text-sm font-medium text-coffee">
                AI-Powered Cooking
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-coffee leading-tight text-balance">
              Cooking has a Soul.{" "}
              <span className="text-tangerine">Your AI should too.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-coffee-dark max-w-xl mx-auto lg:mx-0 text-pretty">
              Turn your lonely leftovers into a feast. The first culinary AI
              that cooks with heart, not just algorithms.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group bg-tangerine text-white px-8 py-4 rounded-3xl font-semibold text-lg border-2 border-border hard-shadow-lg hard-shadow-hover flex items-center justify-center gap-2">
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-coffee px-8 py-4 rounded-3xl font-semibold text-lg border-2 border-border hard-shadow hard-shadow-hover">
                Watch Demo
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-lavender border-2 border-white flex items-center justify-center text-sm font-medium text-coffee"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-coffee-dark">
                <span className="font-bold text-coffee">12,000+</span> home
                cooks already cooking smarter
              </p>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Main Chat Card */}
            <div className="relative animate-float">
              <div className="bg-white rounded-3xl border-2 border-border hard-shadow-lg p-6 transform -rotate-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-tangerine rounded-full flex items-center justify-center border-2 border-border">
                    <span className="text-white text-lg">🍳</span>
                  </div>
                  <div>
                    <p className="font-semibold text-coffee">KitchenOS Chef</p>
                    <p className="text-xs text-coffee-dark">Online</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-cream rounded-2xl rounded-tl-none px-4 py-3 max-w-[280px]">
                    <p className="text-coffee">
                      {"Let's turn that stale bread into Pappa al Pomodoro! 🍅"}
                    </p>
                  </div>
                  <div className="bg-tangerine/10 rounded-2xl rounded-tr-none px-4 py-3 ml-auto max-w-[200px]">
                    <p className="text-coffee">That sounds amazing!</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 bg-cream rounded-xl px-4 py-3 border-2 border-border">
                  <input
                    type="text"
                    placeholder="What's in your fridge?"
                    className="flex-1 bg-transparent text-sm text-coffee placeholder:text-coffee-dark/50 outline-none"
                  />
                  <button className="bg-tangerine text-white p-2 rounded-lg">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-4 -right-4 bg-rose px-4 py-2 rounded-full border-2 border-border hard-shadow animate-float-delayed font-medium text-coffee">
              🌶️ Spicy
            </div>

            <div className="absolute top-1/2 -left-8 bg-butter px-4 py-2 rounded-full border-2 border-border hard-shadow animate-float font-medium text-coffee hidden sm:block">
              🥦 Zero Waste
            </div>

            <div className="absolute -bottom-4 right-12 bg-lavender px-4 py-2 rounded-full border-2 border-border hard-shadow animate-float-delayed font-medium text-coffee">
              ⏱️ 15 Mins
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
