// app/page.tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturesBento } from "@/components/features-bento";
import { HowItWorks } from "@/components/how-it-works";
import { RoastSection } from "@/components/roast-section";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream font-sans text-coffee selection:bg-tangerine/30">
      <Navbar />
      <Hero />
      
      <div id="features">
        <FeaturesBento />
      </div>
      
      <div id="how-it-works">
        <HowItWorks />
      </div>

      <RoastSection />
      
      <div id="pricing">
        <Testimonials /> 
        {/* Note: We can rename Testimonials to Pricing or add a specific pricing component later */}
      </div>

      <Footer />
    </main>
  );
}