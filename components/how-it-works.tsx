// components/how-it-works.tsx
import { ClipboardList, ChefHat, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    {
      icon: <ClipboardList className="w-8 h-8 text-tangerine" />,
      title: "1. Tell us what you have",
      description: "Log your pantry items. We'll track quantities and warn you before your expensive produce goes bad.",
    },
    {
      icon: <ChefHat className="w-8 h-8 text-butter" />,
      title: "2. Let the AI do the thinking",
      description: "Select what you want to use, and our AI will generate a step-by-step recipe tailored to your exact skill level.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-tangerine" />,
      title: "3. Cook, Rate, and Level Up",
      description: "Log your cooked meals, add private notes on what to tweak, and watch your culinary stats improve over time.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Decorative background line connecting the steps (visible on desktop) */}
      <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-butter/50 to-transparent -z-10" />

      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-coffee mb-4">From pantry to plate in 3 steps.</h2>
        <p className="text-lg text-coffee/70 max-w-2xl mx-auto">
          No more scrolling through endless recipe blogs. KitchenOS gets straight to the point.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="relative bg-white/80 backdrop-blur-sm border-butter/30 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            {/* Number badge */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-coffee text-cream rounded-full flex items-center justify-center font-bold font-serif shadow-md">
              {index + 1}
            </div>
            <CardContent className="pt-8 text-center flex flex-col items-center">
              <div className="bg-cream p-4 rounded-full mb-6 border-2 border-white shadow-inner">
                {step.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-coffee mb-3">{step.title}</h3>
              <p className="text-coffee/70 leading-relaxed">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}