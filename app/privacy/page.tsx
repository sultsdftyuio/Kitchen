import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/utils/supabase/server";
import { 
  Shield, ShieldAlert, Gavel, Scale, Lock, FileWarning, 
  Eye, EyeOff, Server, Globe, Cpu, History, AlertTriangle,
  Cookie, Baby, Plane, Clock, Bell, FileText, Trash2,
  FileUp, Copyright, MapPin, Flag, XOctagon, MousePointerClick
} from "lucide-react";

export default async function PrivacyPolicy() {
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
          
          {/* TL;DR SUMMARY BOX */}
          <div className="bg-coffee text-cream p-8 rounded-2xl shadow-xl max-w-4xl">
            <h3 className="font-serif text-2xl mb-4 text-tangerine">Key Takeaways (TL;DR)</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed text-cream/90">
              <ul className="space-y-2 list-disc pl-4">
                <li><strong>Your Data:</strong> We collect your pantry items, recipes, and preferences to make the app work. We do not sell this data.</li>
                <li><strong>AI Processing:</strong> We send data to OpenAI to generate recipes, but we strip personal identifiers where possible.</li>
              </ul>
              <ul className="space-y-2 list-disc pl-4">
                <li><strong>Cookies:</strong> We use cookies for login and analytics (to fix bugs).</li>
                <li><strong>Deletion:</strong> You can request full data deletion at any time by emailing us.</li>
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
            { id: "ai-safety", label: "1. AI Safety", icon: FileWarning },
            { id: "data-collection", label: "2. Data Usage", icon: Eye },
            { id: "processing", label: "3. AI Process", icon: Cpu },
            { id: "cookies", label: "4. Cookies", icon: Cookie },
            { id: "retention", label: "5. Retention", icon: Clock },
            { id: "security", label: "6. Security", icon: Lock },
            { id: "children", label: "7. Children", icon: Baby },
            { id: "transfers", label: "8. Intl. Transfer", icon: Plane },
            { id: "rights", label: "9. Your Rights", icon: Globe },
            { id: "liability", label: "10. Liability", icon: ShieldAlert },
            { id: "arbitration", label: "11. Arbitration", icon: Gavel },
            { id: "ugc", label: "12. UGC Rights", icon: FileUp },
            { id: "dmca", label: "13. DMCA", icon: Copyright },
            { id: "us-laws", label: "14. US Laws", icon: MapPin },
            { id: "dnt", label: "15. Do Not Track", icon: MousePointerClick },
            { id: "severability", label: "16. Legal Misc", icon: XOctagon },
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
          
          {/* SECTION 1: AI SAFETY (DEFENSIVE) */}
          <section id="ai-safety" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <FileWarning className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">1. AI Limitations & Health Disclaimer</h2>
            </div>
            <div className="bg-coffee/5 p-8 rounded-3xl border border-coffee/10">
              <h4 className="font-bold text-red-600 uppercase text-sm tracking-wide mb-4">Strict Liability Waiver</h4>
              <p className="font-medium text-lg mb-6">
                KitchenOS utilizes Large Language Models ("LLMs") to generate recipes. By using this service, you acknowledge and accept:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <span className="font-serif font-bold text-tangerine text-xl">A.</span>
                  <div>
                    <strong>"Hallucination" Risk:</strong> The AI may generate information that is factually incorrect, dangerous, or chemically impossible. KitchenOS makes no warranties regarding accuracy, completeness, or safety of any output.
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="font-serif font-bold text-tangerine text-xl">B.</span>
                  <div>
                    <strong>Food Safety:</strong> You are solely responsible for verifying that ingredients are cooked to safe internal temperatures. KitchenOS is not responsible for foodborne illness, undercooked food, or cross-contamination suggestions.
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="font-serif font-bold text-tangerine text-xl">C.</span>
                  <div>
                    <strong>Allergens:</strong> The AI may inadvertently suggest ingredients containing allergens, even if you have indicated restrictions. <strong>ALWAYS</strong> verify ingredients before purchasing or cooking.
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="font-serif font-bold text-tangerine text-xl">D.</span>
                  <div>
                    <strong>Medical Advice:</strong> KitchenOS does not provide medical or nutritional advice. Dietary information provided by the AI is an estimate only and should not be relied upon for medical conditions (e.g., diabetes, hypertension).
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
            <p>We collect specific data to operate the service effectively. We do not sell this data to data brokers.</p>
            
            <div className="grid md:grid-cols-2 gap-6 not-prose my-8">
              <div className="p-6 bg-white rounded-2xl border border-coffee/10">
                <h4 className="font-bold text-coffee mb-2 flex items-center gap-2">
                   <Lock className="w-4 h-4 text-tangerine" /> Personal Data
                </h4>
                <ul className="space-y-2 text-sm text-coffee/70">
                  <li>• Email address & Identity (via Supabase Auth)</li>
                  <li>• Dietary restrictions & Allergies</li>
                  <li>• Cooking skill level & Preferences</li>
                  <li>• Profile images (if uploaded)</li>
                </ul>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-coffee/10">
                <h4 className="font-bold text-coffee mb-2 flex items-center gap-2">
                   <Server className="w-4 h-4 text-blue-600" /> Usage Data
                </h4>
                <ul className="space-y-2 text-sm text-coffee/70">
                  <li>• Pantry inventory items & expiration dates</li>
                  <li>• Cooking history, ratings, and notes</li>
                  <li>• Generated recipes and chat logs</li>
                  <li>• Device information (IP, Browser, OS)</li>
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
              KitchenOS utilizes <strong>OpenAI</strong> and other LLM providers. Here is how we protect your data during this process:
            </p>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li>
                <strong>Stateless Processing:</strong> Data sent to AI (ingredients, preferences) is used <em>solely</em> to generate the immediate response. We have configured our API usage such that your data is not used to train OpenAI's public foundation models.
              </li>
              <li>
                <strong>Anonymization:</strong> We attempt to strip unnecessary PII (Personally Identifiable Information) before sending prompts to the AI. The AI knows "a user has chicken," not that "John Doe at 123 Main St has chicken."
              </li>
              <li>
                <strong>Content Filtering:</strong> We employ automated moderation to prevent the generation of harmful, illegal, or sexually explicit content.
              </li>
            </ul>
          </section>

          {/* SECTION 4: COOKIES & TRACKING */}
          <section id="cookies" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Cookie className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">4. Cookies & Tracking Technologies</h2>
            </div>
            <p>
              We use "cookies" and similar tracking technologies to track the activity on our Service and hold certain information.
            </p>
            <div className="space-y-4 mt-4">
              <div className="border-l-4 border-coffee pl-4">
                <h4 className="font-bold">Essential Cookies</h4>
                <p className="text-sm">Necessary for authentication (Supabase) and security. You cannot opt-out of these without breaking the app.</p>
              </div>
              <div className="border-l-4 border-tangerine pl-4">
                <h4 className="font-bold">Analytics Cookies</h4>
                <p className="text-sm">We use <strong>Vercel Analytics</strong> to understand how users interact with the app. This data is aggregated and anonymized. It helps us debug performance issues and improve features.</p>
              </div>
            </div>
          </section>

          {/* SECTION 5: DATA RETENTION */}
          <section id="retention" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">5. Data Retention</h2>
            </div>
            <p>We retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Active Accounts:</strong> We retain data while your account is active to provide the service.</li>
              <li><strong>Inactive Accounts:</strong> We reserve the right to delete accounts that have been inactive for over 12 months.</li>
              <li><strong>Legal Obligations:</strong> We may retain usage data for internal analysis purposes or to comply with legal obligations (e.g., fraud prevention).</li>
            </ul>
          </section>

          {/* SECTION 6: SHARING & SECURITY (PRIVACY) */}
          <section id="security" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">6. Data Sharing & Security</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold flex items-center gap-2 mb-3">
                  <Server className="w-4 h-4" /> Third-Party Processors
                </h4>
                <ul className="text-sm list-disc pl-5 space-y-1 text-coffee/70">
                  <li><strong>OpenAI:</strong> Recipe Generation (API).</li>
                  <li><strong>Supabase:</strong> Database, Auth, & Storage.</li>
                  <li><strong>Vercel:</strong> Hosting, Edge Network, & Analytics.</li>
                  <li><strong>Resend (if applicable):</strong> Transactional Emails.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4" /> Security Measures
                </h4>
                <p className="text-sm text-coffee/70 mb-2">
                  We use <strong>Row Level Security (RLS)</strong> at the database level to ensure you can only access your own pantry. 
                </p>
                <p className="text-sm text-coffee/70">
                  All data is encrypted in transit (SSL/TLS) and at rest within our database infrastructure. However, no method of transmission over the Internet is 100% secure.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 7: CHILDREN'S PRIVACY */}
          <section id="children" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Baby className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">7. Children's Privacy</h2>
            </div>
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <p className="font-bold text-red-800 mb-2">Strict Age Restriction</p>
              <p className="text-sm text-red-700/80">
                KitchenOS is not intended for use by anyone under the age of 13 (or 16 in certain European jurisdictions). We do not knowingly collect personally identifiable information from children. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us immediately so we can expunge the data.
              </p>
            </div>
          </section>

          {/* SECTION 8: INTERNATIONAL TRANSFERS */}
          <section id="transfers" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Plane className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">8. International Data Transfers</h2>
            </div>
            <p>
              Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
            </p>
            <p className="mt-4">
              By using KitchenOS, you consent to the transfer of your data to the <strong>United States</strong> and other regions where our cloud providers (Supabase, Vercel, OpenAI) operate.
            </p>
          </section>

          {/* SECTION 9: USER RIGHTS (GDPR/CCPA) */}
          <section id="rights" className="scroll-mt-32">
             <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">9. Your Privacy Rights</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold">GDPR (Europe)</h3>
                <p className="text-sm">You have the right to access, rectify, or erase your data ("Right to be forgotten"). You may export your data at any time via the profile settings. You also have the right to lodge a complaint with a Data Protection Authority.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">CCPA / CPRA (California)</h3>
                <p className="text-sm">KitchenOS does not "sell" your personal data as defined by the CCPA. You have the right to request disclosure of data collection categories, request deletion, and non-discrimination for exercising these rights.</p>
              </div>
            </div>
          </section>

          {/* SECTION 10: LIMITATION OF LIABILITY (DEFENSIVE) */}
          <section id="liability" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">10. Limitation of Liability</h2>
            </div>
            <div className="uppercase font-mono text-xs bg-coffee text-cream p-6 rounded-xl leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, KITCHENOS AND ITS DEVELOPERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (C) ANY CONTENT OBTAINED FROM THE SERVICE; OR (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT. IN NO EVENT SHALL THE AGGREGATE LIABILITY OF KITCHENOS EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS (U.S. $100.00) OR THE AMOUNT YOU PAID KITCHENOS, IF ANY, IN THE PAST SIX MONTHS.
            </div>
          </section>

          {/* SECTION 11: ARBITRATION (DEFENSIVE) */}
          <section id="arbitration" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Gavel className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">11. Binding Arbitration</h2>
            </div>
            <div className="border-l-4 border-tangerine pl-6 space-y-4">
              <p>
                <strong>Mandatory Arbitration:</strong> Any dispute arising out of these Terms shall be determined by arbitration in Delaware, USA, before one arbitrator. The arbitration shall be administered by JAMS pursuant to its Comprehensive Arbitration Rules and Procedures.
              </p>
              <p>
                <strong>Class Action Waiver:</strong> YOU AGREE TO BRING CLAIMS ONLY IN YOUR INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
              </p>
            </div>
          </section>

          {/* --- NEW SECTIONS BELOW --- */}

          {/* SECTION 12: USER GENERATED CONTENT */}
          <section id="ugc" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <FileUp className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">12. User Generated Content (UGC)</h2>
            </div>
            <p>
              By uploading content (including but not limited to pantry photos, recipe notes, ratings, or profile images) to KitchenOS, you grant us a worldwide, non-exclusive, royalty-free, fully paid, right and license (with the right to sublicense) to host, store, transfer, display, perform, reproduce, modify for the purpose of formatting for display, and distribute your Content, in whole or in part, in any media formats.
            </p>
            <p className="mt-4">
              You represent and warrant that: (i) you own the Content or otherwise have the right to grant the license set forth in this section, and (ii) the posting of your Content does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
            </p>
          </section>

          {/* SECTION 13: DMCA / COPYRIGHT */}
          <section id="dmca" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Copyright className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">13. DMCA & Copyright Policy</h2>
            </div>
            <p>
              KitchenOS respects the intellectual property rights of others. It is our policy to respond to any claim that Content posted on the Service infringes a copyright or other intellectual property infringement of any person.
            </p>
            <p className="mt-4">
              If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement that is taking place through the Service, you must submit your notice in writing to <a href="mailto:legal@kitchenos.dev" className="text-tangerine hover:underline">legal@kitchenos.dev</a> and include in your notice a detailed description of the alleged infringement.
            </p>
          </section>

           {/* SECTION 14: SPECIFIC US LAWS */}
           <section id="us-laws" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">14. State-Specific US Disclosures</h2>
            </div>
            <div className="space-y-6">
              <div className="p-4 border border-coffee/10 rounded-xl">
                <h4 className="font-bold text-coffee">California Resident Rights (Shine the Light)</h4>
                <p className="text-sm mt-2">
                  Under California Civil Code Section 1798.83, California residents have the right to request in writing from businesses with whom they have an established business relationship, (a) a list of the categories of Personal Data, such as name, e-mail and mailing address and the type of services provided to the customer, that a business has disclosed to third parties (including affiliates that are separate legal entities) during the immediately preceding calendar year for the third parties' direct marketing purposes and (b) the names and addresses of all such third parties.
                </p>
              </div>
              <div className="p-4 border border-coffee/10 rounded-xl">
                <h4 className="font-bold text-coffee">Nevada Residents</h4>
                <p className="text-sm mt-2">
                  Nevada law (SB 220) gives Nevada consumers the right to opt out of the sale of certain personal information to third parties. We do not sell your personal information as defined by Nevada law.
                </p>
              </div>
              <div className="p-4 border border-coffee/10 rounded-xl">
                <h4 className="font-bold text-coffee">Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA)</h4>
                <p className="text-sm mt-2">
                  Residents of these states may have additional rights including the right to opt-out of targeted advertising, the right to data portability, and the right to appeal our decision regarding a privacy request.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 15: DO NOT TRACK */}
          <section id="dnt" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <MousePointerClick className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">15. "Do Not Track" Policy</h2>
            </div>
            <p>
              We do not support Do Not Track ("DNT"). Do Not Track is a preference you can set in your web browser to inform websites that you do not want to be tracked. You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser.
            </p>
          </section>

          {/* SECTION 16: SEVERABILITY & FORCE MAJEURE */}
          <section id="severability" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <XOctagon className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">16. Severability & Force Majeure</h2>
            </div>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Severability:</strong> If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
              </li>
              <li>
                <strong>Force Majeure:</strong> KitchenOS shall not be liable for any failure to perform its obligations hereunder where such failure results from any cause beyond KitchenOS's reasonable control, including, without limitation, mechanical, electronic or communications failure or degradation (including "line-noise" interference), acts of God, pandemics, or third-party service outages (e.g., AWS, OpenAI, Vercel).
              </li>
              <li>
                <strong>Governing Law:</strong> These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
              </li>
            </ul>
          </section>

          {/* SECTION 17: CHANGES TO TERMS */}
          <section id="changes" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">17. Changes to these Terms</h2>
            </div>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          {/* SECTION 18: ENTIRE AGREEMENT */}
          <section id="agreement" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <Flag className="w-8 h-8 text-tangerine" />
              <h2 className="!my-0 text-3xl">18. Entire Agreement</h2>
            </div>
            <p>
              These Terms, together with the Privacy Policy and any other legal notices published by KitchenOS on the Service, shall constitute the entire agreement between you and KitchenOS concerning the Service.
            </p>
          </section>

          {/* CONTACT */}
          <div className="mt-24 pt-12 border-t border-coffee/10 text-center">
            <h3 className="font-serif text-2xl font-bold mb-4">Legal Inquiries</h3>
            <p className="text-coffee/60 mb-8">
              For privacy requests, data deletion, or legal notices:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:legal@kitchenos.dev" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-coffee text-cream rounded-full font-bold hover:bg-tangerine transition-colors"
              >
                <FileText className="w-4 h-4" />
                legal@kitchenos.dev
              </a>
              <a 
                href="mailto:privacy@kitchenos.dev" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-coffee border border-coffee/20 rounded-full font-bold hover:bg-coffee/5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Request Data Deletion
              </a>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}