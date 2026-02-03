// components/hero.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-butter px-4 py-2 rounded-full border-2 border-border mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-tangerine" />
              <span className="text-sm font-medium text-coffee">
                AI-Powered Cooking
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-coffee leading-tight text-balance animate-fade-in-up delay-100">
              Cooking has a Soul.{" "}
              <span className="text-tangerine relative inline-block">
                Your AI should too.
                {/* Underline decoration */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-butter/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-coffee-dark max-w-xl mx-auto lg:mx-0 text-pretty animate-fade-in-up delay-200">
              Turn your lonely leftovers into a feast. The first culinary AI
              that cooks with heart, not just algorithms.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
              <Link
                href="/signup"
                className="group bg-tangerine text-white px-8 py-4 rounded-3xl font-semibold text-lg border-2 border-border hard-shadow-lg hard-shadow-hover flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="bg-white text-coffee px-8 py-4 rounded-3xl font-semibold text-lg border-2 border-border hard-shadow hard-shadow-hover transition-transform hover:-translate-y-1 flex items-center justify-center"
              >
                Watch Demo
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start animate-fade-in-up delay-500">
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

          {/* Right Visual - Preserving your specific animations */}
          <div className="relative mt-12 lg:mt-0">
            {/* Main Chat Card */}
            <div className="relative animate-float z-10">
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
                    <p className="text-coffee text-sm">
                      {"Let's turn that stale bread into Pappa al Pomodoro! 🍅"}
                    </p>
                  </div>
                  <div className="bg-tangerine/10 rounded-2xl rounded-tr-none px-4 py-3 ml-auto max-w-[200px]">
                    <p className="text-coffee text-sm">That sounds amazing!</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 bg-cream rounded-xl px-4 py-3 border-2 border-border">
                  <input
                    type="text"
                    disabled
                    placeholder="What's in your fridge?"
                    className="flex-1 bg-transparent text-sm text-coffee placeholder:text-coffee-dark/50 outline-none"
                  />
                  <div className="bg-tangerine text-white p-2 rounded-lg">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-8 -right-4 bg-rose px-4 py-2 rounded-full border-2 border-border hard-shadow animate-float-delayed font-medium text-coffee text-sm z-20">
              🌶️ Spicy
            </div>

            <div className="absolute top-1/2 -left-8 bg-butter px-4 py-2 rounded-full border-2 border-border hard-shadow animate-float font-medium text-coffee hidden sm:block z-20">
              🥦 Zero Waste
            </div>

            <div className="absolute -bottom-8 right-12 bg-lavender px-4 py-2 rounded-full border-2 border-border hard-shadow animate-float-delayed font-medium text-coffee text-sm z-20">
              ⏱️ 15 Mins
            </div>
            
            {/* Background Blob for depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-tangerine/5 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}