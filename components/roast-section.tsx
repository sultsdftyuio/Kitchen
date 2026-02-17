// components/roast-section.tsx
import { Lightbulb, Camera, Send, GraduationCap, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RoastSection() {
  return (
    <section className="py-24 my-12 bg-coffee text-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-tangerine/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-butter/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Text Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-butter/20 text-butter-light border border-butter/30 mb-6">
            <GraduationCap className="w-4 h-4 text-butter" />
            <span className="text-sm font-bold tracking-wider uppercase">Always Learning</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Mistakes happen.<br />
            <span className="text-tangerine">Let's fix them together.</span>
          </h2>
          <p className="text-lg text-cream/80 mb-8 leading-relaxed max-w-md">
            Even the best chefs have bad days in the kitchen. Upload a photo of a dish that didn't go as planned, and our AI will gently analyze your technique and tell you exactly how to perfect it next time.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-cream/90">
              <Camera className="w-5 h-5 text-tangerine" /> Snap a photo of the result.
            </li>
            <li className="flex items-center gap-3 text-cream/90">
              <Lightbulb className="w-5 h-5 text-tangerine" /> Get a constructive analysis.
            </li>
            <li className="flex items-center gap-3 text-cream/90">
              <HeartHandshake className="w-5 h-5 text-tangerine" /> Improve your skills with confidence.
            </li>
          </ul>
        </div>

        {/* Mock Chat UI */}
        <div className="bg-[#2A2320] rounded-2xl border border-white/10 shadow-2xl p-4 md:p-6 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-butter flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-coffee-dark" />
            </div>
            <div>
              <h4 className="font-bold font-serif text-white">Chef's Assistant</h4>
              <p className="text-xs text-cream/50">Online • Ready to help</p>
            </div>
          </div>

          <div className="space-y-6 mb-6">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-white/10 rounded-2xl rounded-tr-sm p-4 max-w-[80%] border border-white/5">
                <div className="w-full h-32 bg-black/40 rounded-lg mb-2 flex items-center justify-center border border-white/5">
                  <span className="text-xs text-cream/30"></span>
                </div>
                <p className="text-sm text-cream/90">I tried baking sourdough, but it didn't rise at all. It's like a brick. What went wrong?</p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="bg-butter/10 rounded-2xl rounded-tl-sm p-4 max-w-[85%] border border-butter/20">
                <p className="text-sm text-cream/90 leading-relaxed">
                  <strong className="text-butter block mb-1">Don't worry, bread can be tricky!</strong>
                  Looking at the dense crumb structure, it seems your yeast might not have activated properly. This usually happens for two reasons:
                  <br /><br />
                  <span className="text-tangerine font-medium">1. Water Temperature:</span> If the water was too hot (above 120°F/49°C), it can kill the yeast. Next time, aim for lukewarm water that feels barely warm to the touch.
                  <br /><br />
                  <span className="text-tangerine font-medium">2. Proofing Time:</span> Your dough might have needed a warmer spot to rise. 
                  <br /><br />
                  Keep practicing! Your crust color actually looks fantastic. You've got this! 🥖
                </p>
              </div>
            </div>
          </div>

          {/* Fake Input */}
          <div className="bg-black/20 rounded-full p-2 flex items-center gap-2 border border-white/10">
            <div className="p-2 bg-white/5 rounded-full text-cream/50 cursor-not-allowed">
              <Camera className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm text-cream/30 px-2">Ask for advice...</div>
            <Button size="icon" className="rounded-full bg-butter hover:bg-butter/90 text-coffee" disabled>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}