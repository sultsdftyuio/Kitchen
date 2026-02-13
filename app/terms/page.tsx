import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/utils/supabase/server";
import { 
  Scale, ShieldCheck, FileSignature, Users, Zap, Ban, 
  CreditCard, Layers, LifeBuoy, Siren, Gavel, Flag, 
  MapPin, Terminal, Fingerprint, Ghost, ScrollText, AlertOctagon,
  Lightbulb, Infinity
} from "lucide-react";

export default async function TermsOfService() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-cream font-sans text-coffee selection:bg-tangerine/30">
      <Navbar user={user} />
      
      <div className="max-w-6xl mx-auto px-6 py-24">
        
        {/* --- HEADER --- */}
        <header className="mb-16 border-b-4 border-coffee pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-4 bg-coffee rounded-2xl">
              <ScrollText className="w-10 h-10 text-cream" />
            </div>
            <div className="uppercase tracking-widest font-bold text-coffee/60 text-sm">
              Usage Agreement & Conditions
            </div>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-coffee">
            Terms of <span className="text-tangerine">Service</span>
          </h1>
          
          {/* TL;DR SUMMARY BOX */}
          <div className="bg-coffee text-cream p-8 rounded-2xl shadow-xl max-w-4xl">
            <h3 className="font-serif text-2xl mb-4 text-tangerine">Key Takeaways (TL;DR)</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed text-cream/90">
              <ul className="space-y-2 list-disc pl-4">
                <li><strong>AI Risk:</strong> Our AI may "hallucinate" dangerous or inaccurate recipes. You use it at your own risk.</li>
                <li><strong>Food Safety:</strong> You are responsible for checking internal temperatures and allergens.</li>
                <li><strong>Eligibility:</strong> You must be 18+ to use KitchenOS.</li>
              </ul>
              <ul className="space-y-2 list-disc pl-4">
                <li><strong>Liability:</strong> Our liability is limited to $100 or what you paid us.</li>
                <li><strong>Disputes:</strong> You agree to individual arbitration (no class actions).</li>
                <li><strong>Refunds:</strong> Payments are generally non-refundable unless required by law.</li>
              </ul>
            </div>
            <p className="text-cream/60 text-xs mt-6 border-t border-cream/10 pt-4">
              <strong>Last Updated:</strong> February 12, 2026
            </p>
          </div>
        </header>

        {/* --- NAVIGATION GRID --- */}
        <nav className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-20">
          {[
            { id: "acceptance", label: "1. Acceptance", icon: FileSignature },
            { id: "accounts", label: "2. Accounts", icon: Users },
            { id: "ai-disclaimer", label: "3. AI Risks", icon: Ghost },
            { id: "conduct", label: "4. Conduct", icon: Ban },
            { id: "content", label: "5. Content", icon: Layers },
            { id: "intellectual", label: "6. IP Rights", icon: Fingerprint },
            { id: "payment", label: "7. Payments", icon: CreditCard },
            { id: "termination", label: "8. Termination", icon: Siren },
            { id: "liability", label: "9. Liability", icon: AlertOctagon },
            { id: "indemnification", label: "10. Indemnity", icon: ShieldCheck },
            { id: "disclaimer", label: "11. Disclaimers", icon: LifeBuoy },
            { id: "governing", label: "12. Governing Law", icon: MapPin },
            { id: "arbitration", label: "13. Arbitration", icon: Gavel },
            { id: "changes", label: "14. Changes", icon: Zap },
            { id: "feedback", label: "15. Feedback", icon: Lightbulb },
            { id: "survival", label: "16. Survival", icon: Infinity },
          ].map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className="flex flex-col items-center justify-center p-3 bg-white border border-coffee/10 rounded-xl hover:border-tangerine hover:shadow-lg transition-all group"
            >
              <item.icon className="w-4 h-4 mb-2 text-coffee/40 group-hover:text-tangerine transition-colors" />
              <span className="font-bold text-[10px] uppercase tracking-wide text-center">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* --- MAIN CONTENT --- */}
        <div className="space-y-24 prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-coffee prose-p:text-coffee/80 prose-li:text-coffee/80">
          
          {/* SECTION 1: ACCEPTANCE */}
          <section id="acceptance" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <FileSignature className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">1. Acceptance of Terms</h2>
            </div>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Capacity:</strong> You represent that you are over the age of 18 (or the age of majority in your jurisdiction) and have the legal capacity to enter into a binding contract.</li>
              <li><strong>Minors:</strong> If you are under 18, you may only use the Service with the consent and supervision of a parent or legal guardian. The Service is strictly prohibited for users under 13.</li>
            </ul>
          </section>

          {/* SECTION 2: ACCOUNTS */}
          <section id="accounts" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">2. Accounts & Security</h2>
            </div>
            <p>
              When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <div className="bg-white p-6 rounded-xl border border-coffee/10 mt-4">
              <h4 className="font-bold text-coffee mb-2">Your Responsibilities:</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                <li>You agree not to disclose your password to any third party.</li>
                <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                <li>You may not use as a username the name of another person or entity or that is not lawfully available for use.</li>
              </ul>
            </div>
          </section>

          {/* SECTION 3: AI DISCLAIMER (CRITICAL) */}
          <section id="ai-disclaimer" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Ghost className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">3. Artificial Intelligence & Output Disclaimer</h2>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <p className="font-bold text-red-700 mb-2 uppercase text-sm tracking-wide">Significant Risk Warning</p>
              <p className="text-red-900/80 mb-4">
                KitchenOS uses Large Language Models (LLMs) to generate recipes, cooking advice, and inventory suggestions ("AI Output"). AI Output is probabilistic and may be inaccurate, misleading, or offensive.
              </p>
              <ul className="space-y-3 text-red-900/80 text-sm list-disc pl-5">
                <li><strong>No Food Safety Guarantee:</strong> The AI may suggest cooking times or temperatures that are unsafe. You are solely responsible for following USDA/FDA guidelines for food safety (e.g., internal temperatures for meat).</li>
                <li><strong>Allergen Hallucinations:</strong> The AI may fail to identify allergens or may incorrectly suggest an ingredient is safe for a specific diet. <strong>ALWAYS</strong> verify ingredients on physical packaging.</li>
                <li><strong>Not Medical Advice:</strong> Nutritional data or dietary advice generated by the AI is for entertainment purposes only and should not be used to manage medical conditions.</li>
              </ul>
            </div>
          </section>

          {/* SECTION 4: CONDUCT */}
          <section id="conduct" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Ban className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">4. Prohibited Conduct</h2>
            </div>
            <p>You agree not to do any of the following:</p>
            <ul className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
              <li className="bg-white p-4 rounded-lg border border-coffee/10">
                <strong>Illegal Use:</strong> Use the Service for any illegal purpose or in violation of any local, state, national, or international law.
              </li>
              <li className="bg-white p-4 rounded-lg border border-coffee/10">
                <strong>Harassment:</strong> Harass, threaten, demean, embarrass, or otherwise harm any other user of the Service.
              </li>
              <li className="bg-white p-4 rounded-lg border border-coffee/10">
                <strong>Reverse Engineering:</strong> Attempt to source code, reverse engineer, decompile, or disassemble any aspect of the Service.
              </li>
              <li className="bg-white p-4 rounded-lg border border-coffee/10">
                <strong>Scraping/Bots:</strong> Use any robot, spider, scraper, or other automated means to access the Service for any purpose.
              </li>
              <li className="bg-white p-4 rounded-lg border border-coffee/10">
                <strong>Interference:</strong> Interfere with security-related features of the Service, including features that prevent or restrict the use or copying of any content.
              </li>
              <li className="bg-white p-4 rounded-lg border border-coffee/10">
                <strong>Impersonation:</strong> Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.
              </li>
            </ul>
          </section>

          {/* SECTION 5: CONTENT */}
          <section id="content" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">5. User Content</h2>
            </div>
            <p>
              "User Content" means any content that you post, submit, or otherwise transmit to the Service (e.g., pantry items, recipe notes, photos).
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Ownership:</strong> You retain copyright and any other proprietary rights that you may hold in the User Content that you post to the Service.</li>
              <li><strong>License:</strong> By posting User Content, you grant KitchenOS a worldwide, non-exclusive, royalty-free, fully paid, transferable, and sublicensable right to use, reproduce, modify, adapt, publish, prepare derivative works of, distribute, and publicly display your User Content in connection with the Service.</li>
              <li><strong>Responsibility:</strong> You are solely responsible for your User Content and the consequences of posting or publishing it. We do not endorse any User Content or any opinion, recommendation, or advice expressed therein.</li>
            </ul>
          </section>

          {/* SECTION 6: INTELLECTUAL PROPERTY */}
          <section id="intellectual" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Fingerprint className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">6. Intellectual Property Rights</h2>
            </div>
            <p>
              The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of KitchenOS and its licensors.
            </p>
            <p className="mt-4">
              The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of KitchenOS.
            </p>
          </section>

          {/* SECTION 7: PAYMENTS */}
          <section id="payment" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">7. Subscription & Payments</h2>
            </div>
            <p>
              Certain aspects of the Service may be provided for a fee or other charge. If you elect to use paid aspects of the Service, you agree to the pricing and payment terms as we may update them from time to time.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Authorization:</strong> You authorize us to charge your chosen payment provider for the Service.</li>
              <li><strong>No Refunds:</strong> All fees are non-refundable unless otherwise stated or required by law.</li>
              <li><strong>Price Changes:</strong> We may change the fees for any feature of the Service, including additional fees or charges. We will give you advance notice of these changes before they apply.</li>
            </ul>
          </section>

          {/* SECTION 8: TERMINATION */}
          <section id="termination" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Siren className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">8. Termination</h2>
            </div>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="mt-4">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or delete your account via the settings page.
            </p>
          </section>

          {/* SECTION 9: LIMITATION OF LIABILITY */}
          <section id="liability" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <AlertOctagon className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">9. Limitation of Liability</h2>
            </div>
            <div className="uppercase font-mono text-xs bg-coffee text-cream p-8 rounded-xl leading-relaxed">
              IN NO EVENT SHALL KITCHENOS, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (III) ANY CONTENT OBTAINED FROM THE SERVICE; AND (IV) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
            </div>
          </section>

          {/* SECTION 10: INDEMNIFICATION */}
          <section id="indemnification" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">10. Indemnification</h2>
            </div>
            <p>
              You agree to defend, indemnify, and hold harmless KitchenOS and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your use and access of the Service, by you or any person using your account and password;</li>
              <li>A breach of these Terms;</li>
              <li>Content posted on the Service;</li>
              <li>Your violation of any law or the rights of a third party.</li>
            </ul>
          </section>

          {/* SECTION 11: DISCLAIMER */}
          <section id="disclaimer" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <LifeBuoy className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">11. Disclaimer</h2>
            </div>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </p>
            <p className="mt-4">
              KitchenOS its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
            </p>
          </section>

          {/* SECTION 12: GOVERNING LAW */}
          <section id="governing" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">12. Governing Law</h2>
            </div>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the <strong>State of Delaware, United States</strong>, without regard to its conflict of law provisions.
            </p>
            <p className="mt-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
          </section>

          {/* SECTION 13: ARBITRATION */}
          <section id="arbitration" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Gavel className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">13. Binding Arbitration & Waiver</h2>
            </div>
            <div className="bg-coffee/5 p-6 rounded-xl border border-coffee/10">
              <p className="mb-4">
                <strong>Dispute Resolution:</strong> Any dispute, controversy or claim arising out of, relating to or in connection with this contract, including the breach, termination or validity thereof, shall be finally resolved by arbitration.
              </p>
              <p className="mb-4">
                <strong>Class Action Waiver:</strong> YOU AND KITCHENOS AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
              </p>
              <p>
                <strong>Jury Trial Waiver:</strong> You and we waive any constitutional and statutory rights to go to court and have a trial in front of a judge or a jury.
              </p>
            </div>
          </section>

          {/* SECTION 14: CHANGES */}
          <section id="changes" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">14. Changes to Terms</h2>
            </div>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="mt-4">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>

           {/* SECTION 15: FEEDBACK */}
           <section id="feedback" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">15. Feedback</h2>
            </div>
            <p>
              You assign all rights, title and interest in any Feedback you provide the Company. If for any reason such assignment is ineffective, you agree to grant the Company a non-exclusive, perpetual, irrevocable, royalty free, worldwide right and license to use, reproduce, disclose, sub-license, distribute, modify and exploit such Feedback without restriction.
            </p>
          </section>

           {/* SECTION 16: SURVIVAL */}
           <section id="survival" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Infinity className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">16. Survival</h2>
            </div>
            <p>
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
            </p>
          </section>

          {/* SECTION 17: CONTACT */}
          <div id="contact" className="mt-24 pt-12 border-t border-coffee/10 text-center">
            <Terminal className="w-12 h-12 text-coffee mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold mb-4">Questions about these Terms?</h3>
            <p className="text-coffee/60 mb-8 max-w-lg mx-auto">
              We are happy to clarify any questions you may have regarding our terms of service or legal obligations.
            </p>
            <a 
              href="mailto:legal@kitchenos.dev" 
              className="inline-flex items-center justify-center px-8 py-3 bg-coffee text-cream rounded-full font-bold hover:bg-tangerine transition-colors"
            >
              legal@kitchenos.dev
            </a>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}