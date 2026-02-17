// app/page.tsx
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturesBento } from "@/components/features-bento";
import { HowItWorks } from "@/components/how-it-works";
import { RoastSection } from "@/components/roast-section";
import { Testimonials } from "@/components/testimonials";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-cream font-sans text-coffee selection:bg-tangerine/30 flex flex-col">
      {/* Landing Page Navbar */}
      <Navbar user={user} />
      
      {/* Page Content */}
      <main className="flex-1">
        <Hero />
        <FeaturesBento />
        <HowItWorks />
        <RoastSection />
        <Testimonials /> 
        <FAQSection />
      </main>

      {/* Landing Page Footer */}
      <Footer />
    </div>
  );
}