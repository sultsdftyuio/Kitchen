import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/utils/supabase/server";
import { 
  Shield, ShieldAlert, Gavel, Scale, Lock, FileWarning, 
  Eye, EyeOff, Server, Globe, Cpu, History, AlertTriangle 
} from "lucide-react";

export default async function PrivacyPolicy() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-cream font-sans text-coffee selection:bg-tangerine/30">
      <Navbar user={user} />
      
      <div className="max-w-5xl mx-auto px-6 py-24">
        
        {/* --- HEADER --- */}
        <header className="mb-16 border-b-4 border-coffee pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-4 bg-coffee rounded-2xl">
              <Scale className="w-10 h-10 text-cream" />
            </div>
            <div className="uppercase tracking-widest font-bold text-coffee/60 text-sm">
              Legal Compliance & Liability Shield
            </div>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-coffee">
            Master Privacy & <br />
            <span className="text-tangerine">Terms of Service</span>
          </h1>
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg max-w-2xl">
            <p className="text-red-700 font-bold text-sm uppercase tracking-wide mb-1">
              Binding Agreement
            </p>
            <p className="text-red-900/80 text-sm leading-relaxed">
              By using KitchenOS, you agree to these Terms, the Privacy Policy, and the <strong>Class Action Waiver</strong>. You acknowledge that AI advice is not professional culinary or medical advice.
            </p>
          </div>
        </header>

        {/* --- NAVIGATION GRID --- */}
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { id: "ai-safety", label: "AI Safety & Risk", icon: FileWarning },
            { id: "data-collection", label: "Data Collection", icon: Eye },
            { id: "processing", label: "AI Processing", icon: Cpu },
            { id: "rights", label: "Your Rights", icon: Globe },
            { id: "liability", label: "Liability Cap", icon: ShieldAlert },
            { id: "arbitration", label: "Arbitration", icon: Gavel },
          ].map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className="flex flex-col items-center justify-center p-4 bg-white border border-coffee/10 rounded-2xl hover:border-tangerine hover:shadow-lg transition-all group"
            >
              <item.icon className="w-6 h-6 mb-2 text-coffee/40 group-hover:text-tangerine transition-colors" />
              <span className="font-bold text-xs text-center">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* --- MAIN CONTENT --- */}
        <div className="space-y-24 prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-coffee prose-p:text-coffee/80 prose-li:text-coffee/80">
          
          {/* SECTION 1: AI SAFETY (DEFENSIVE) */}
          <section id="ai-safety" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <FileWarning className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">1. AI Limitations & Health Disclaimer</h2>
            </div>
            <div className="bg-coffee/5 p-8 rounded-3xl border border-coffee/10">
              <h4 className="font-bold text-red-600 uppercase text-sm tracking-wide mb-4">Strict Liability Waiver</h4>
              <p className="font-medium text-lg mb-6">
                KitchenOS utilizes artificial intelligence ("AI") to generate recipes. You acknowledge that:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <span className="font-serif font-bold text-tangerine text-xl">A.</span>
                  <div>
                    <strong>"Hallucination" Risk:</strong> The AI may generate information that is factually incorrect, dangerous, or chemically impossible. KitchenOS makes no warranties regarding accuracy.
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="font-serif font-bold text-tangerine text-xl">B.</span>
                  <div>
                    <strong>Food Safety:</strong> You are solely responsible for verifying that ingredients are cooked to safe temperatures. KitchenOS is not responsible for foodborne illness.
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="font-serif font-bold text-tangerine text-xl">C.</span>
                  <div>
                    <strong>Allergens:</strong> The AI may inadvertently suggest ingredients containing allergens. <strong>ALWAYS</strong> verify ingredients before cooking.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* SECTION 2: DATA COLLECTION (PRIVACY) */}
          <section id="data-collection" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">2. Data Collection & Usage</h2>
            </div>
            <p>We collect specific data to operate the service. We do not sell this data.</p>
            
            <div className="grid md:grid-cols-2 gap-6 not-prose my-8">
              <div className="p-6 bg-white rounded-2xl border border-coffee/10">
                <h4 className="font-bold text-coffee mb-2 flex items-center gap-2">
                   <Lock className="w-4 h-4 text-tangerine" /> Personal Data
                </h4>
                <ul className="space-y-2 text-sm text-coffee/70">
                  <li>• Email address & Identity (via Supabase)</li>
                  <li>• Dietary restrictions & Allergies</li>
                  <li>• Cooking skill level</li>
                </ul>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-coffee/10">
                <h4 className="font-bold text-coffee mb-2 flex items-center gap-2">
                   <Server className="w-4 h-4 text-blue-600" /> Usage Data
                </h4>
                <ul className="space-y-2 text-sm text-coffee/70">
                  <li>• Pantry inventory items</li>
                  <li>• Cooking history & Recipe logs</li>
                  <li>• Device information (IP, Browser)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 3: AI PROCESSING (PRIVACY) */}
          <section id="processing" className="bg-coffee/5 p-8 rounded-3xl border border-coffee/10 scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0">3. Artificial Intelligence Processing</h2>
            </div>
            <p>
              KitchenOS utilizes <strong>OpenAI</strong> LLMs. Here is how we protect your data during this process:
            </p>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li>
                <strong>Stateless Processing:</strong> Data sent to AI (ingredients, preferences) is used <em>solely</em> to generate the immediate response. It is not used to train OpenAI's public models.
              </li>
              <li>
                <strong>Anonymization:</strong> We strip PII (Personally Identifiable Information) before sending prompts to the AI. The AI knows "a user has chicken," not "John Doe has chicken."
              </li>
            </ul>
          </section>

          {/* SECTION 4: SHARING & SECURITY (PRIVACY) */}
          <section id="security" className="scroll-mt-32">
            <h2 className="text-3xl mb-6">4. Data Sharing & Security</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold flex items-center gap-2 mb-3">
                  <Server className="w-4 h-4" /> Third-Party Processors
                </h4>
                <ul className="text-sm list-disc pl-5 space-y-1 text-coffee/70">
                  <li><strong>OpenAI:</strong> Recipe Generation.</li>
                  <li><strong>Supabase:</strong> Database & Auth.</li>
                  <li><strong>Vercel:</strong> Hosting & Edge Network.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold flex items-center gap-2 mb-3">
                  <EyeOff className="w-4 h-4" /> Security Measures
                </h4>
                <p className="text-sm text-coffee/70">
                  We use <strong>Row Level Security (RLS)</strong> to ensure you can only access your own pantry. All data is encrypted in transit (SSL/TLS).
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5: USER RIGHTS (GDPR/CCPA) */}
          <section id="rights" className="scroll-mt-32">
             <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">5. Your Privacy Rights</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold">GDPR (Europe)</h3>
                <p className="text-sm">You have the right to access, rectify, or erase your data ("Right to be forgotten"). You may export your data at any time.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">CCPA (California)</h3>
                <p className="text-sm">We do not sell your personal data. You have the right to request disclosure of data collection categories and request deletion.</p>
              </div>
            </div>
          </section>

          {/* SECTION 6: LIMITATION OF LIABILITY (DEFENSIVE) */}
          <section id="liability" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">6. Limitation of Liability</h2>
            </div>
            <div className="uppercase font-mono text-xs bg-coffee text-cream p-6 rounded-xl leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, KITCHENOS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY; OR (C) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR CONTENT.
            </div>
          </section>

          {/* SECTION 7: ARBITRATION (DEFENSIVE) */}
          <section id="arbitration" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Gavel className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">7. Binding Arbitration</h2>
            </div>
            <div className="border-l-4 border-tangerine pl-6 space-y-4">
              <p>
                <strong>Mandatory Arbitration:</strong> Any dispute arising out of these Terms shall be determined by arbitration in Delaware, USA, before one arbitrator.
              </p>
              <p>
                <strong>Class Action Waiver:</strong> YOU AGREE TO BRING CLAIMS ONLY IN YOUR INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
              </p>
            </div>
          </section>

          {/* CONTACT */}
          <div className="mt-24 pt-12 border-t border-coffee/10 text-center">
            <h3 className="font-serif text-2xl font-bold mb-4">Legal Inquiries</h3>
            <p className="text-coffee/60 mb-8">
              For privacy requests or legal notices:
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