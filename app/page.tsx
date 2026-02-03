// app/page.tsx
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturesBento } from "@/components/features-bento";
import { HowItWorks } from "@/components/how-it-works";
import { RoastSection } from "@/components/roast-section";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-cream font-sans text-coffee selection:bg-tangerine/30">
      <Navbar user={user} />
      
      <Hero />
      
      <FeaturesBento />
      
      <HowItWorks />

      <RoastSection />
      
      <Testimonials /> 

      <Footer />
    </main>
  );
}