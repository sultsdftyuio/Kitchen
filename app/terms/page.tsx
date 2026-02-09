import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/utils/supabase/server";
import { ScrollText, ShieldAlert, Gavel, Ban, Zap, Copyright } from "lucide-react";
import Link from "next/link";

export default async function TermsOfService() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-cream font-sans text-coffee selection:bg-tangerine/30">
      <Navbar user={user} />
      
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="mb-16 border-b-2 border-coffee/10 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-coffee rounded-2xl">
              <ScrollText className="w-8 h-8 text-cream" />
            </div>
            <span className="font-serif text-xl font-bold text-coffee/60">Legal Contracts</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-coffee">
            Terms of <span className="text-tangerine">Service</span>
          </h1>
          <p className="text-lg text-coffee/70 max-w-2xl leading-relaxed">
            Effective Date: February 9, 2026 <br />
            Read these terms carefully before using KitchenOS.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-16 prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-coffee">
          
          {/* 1. Acceptance */}
          <section>
            <h2 className="text-3xl font-bold mb-6">1. Acceptance of Terms</h2>
            <p className="text-lg leading-relaxed">
              By accessing or using KitchenOS ("the Service"), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service. These Terms apply to all visitors, users, and others who access the Service.
            </p>
          </section>

          {/* 2. AI & Safety - CRITICAL DEFENSE */}
          <section className="bg-red-50 p-8 rounded-3xl border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              <h2 className="!my-0 text-red-900">2. Critical Safety Disclaimers</h2>
            </div>
            <div className="space-y-4 text-red-900/80">
              <p><strong>A. Not Professional Advice:</strong> KitchenOS is an AI-powered tool, not a professional chef or nutritionist. Recipes are generated algorithmically and may contain errors.</p>
              <p><strong>B. Food Safety:</strong> You are responsible for ensuring all food is cooked to safe temperatures. We are not liable for foodborne illnesses.</p>
              <p><strong>C. Allergies:</strong> You must verify all ingredients. The Service cannot guarantee that generated recipes are free from allergens, even if you have input dietary restrictions.</p>
            </div>
          </section>

          {/* 3. User Accounts */}
          <section>
            <h2 className="text-3xl font-bold mb-6">3. Accounts & Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for safeguarding the password that you use to access the Service.</li>
              <li>You agree not to disclose your password to any third party.</li>
              <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
              <li>We reserve the right to terminate accounts that are inactive for an extended period.</li>
            </ul>
          </section>

          {/* 4. Intellectual Property */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Copyright className="w-6 h-6 text-tangerine" />
              <h2 className="!my-0">4. Intellectual Property</h2>
            </div>
            <p>
              The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of KitchenOS Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
          </section>

          {/* 5. Prohibited Uses */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Ban className="w-6 h-6 text-tangerine" />
              <h2 className="!my-0">5. Prohibited Activities</h2>
            </div>
            <p>You agree not to engage in any of the following activities:</p>
            <ul className="grid md:grid-cols-2 gap-4 mt-4 text-sm font-medium">
              <li className="bg-white p-4 rounded-xl border border-coffee/10">Reverse engineering the AI models.</li>
              <li className="bg-white p-4 rounded-xl border border-coffee/10">Using the Service to generate harmful or illegal content.</li>
              <li className="bg-white p-4 rounded-xl border border-coffee/10">Automated scraping or data mining.</li>
              <li className="bg-white p-4 rounded-xl border border-coffee/10">Reselling the Service without authorization.</li>
            </ul>
          </section>

          {/* 6. Liability Cap */}
          <section className="bg-coffee text-cream p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="w-6 h-6 text-tangerine" />
              <h2 className="!my-0 text-cream">6. Limitation of Liability</h2>
            </div>
            <p className="uppercase text-xs tracking-wide leading-relaxed font-mono opacity-80">
              In no event shall KitchenOS, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
            </p>
          </section>

          {/* 7. Changes */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-tangerine" />
              <h2 className="!my-0">7. Changes to Terms</h2>
            </div>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

           {/* Contact */}
           <div className="mt-16 pt-8 border-t border-coffee/10">
            <p className="text-coffee/60">
              Questions about the Terms of Service? <br />
              <a href="mailto:legal@kitchenos.dev" className="text-tangerine font-bold hover:underline">legal@kitchenos.dev</a>
            </p>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}