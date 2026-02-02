import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturesBento } from "@/components/features-bento";
import { RoastSection } from "@/components/roast-section";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturesBento />
      <RoastSection />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  );
}
