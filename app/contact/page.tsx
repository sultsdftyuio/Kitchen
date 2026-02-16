// app/contact/page.tsx
import Link from "next/link";
import { Mail, Lightbulb, Briefcase, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-coffee-dark/70 hover:text-tangerine transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl border-2 border-border hard-shadow-lg p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-tangerine/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex bg-white p-3 rounded-2xl border-2 border-border hard-shadow mb-6 rotate-[-2deg]">
              <Mail className="w-8 h-8 text-coffee" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-coffee mb-4">
              Get in Touch
            </h1>
            <p className="text-coffee-dark/80 text-lg max-w-xl mx-auto">
              Whether you have a brilliant idea to improve Kernelcook or want to discuss a business partnership, we'd love to hear from you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 relative z-10">
            {/* Suggestions Card */}
            <a 
              href="mailto:hello@kernelcook.com?subject=Feature%20Suggestion%20for%20Kernelcook"
              className="group block bg-cream/30 p-6 rounded-2xl border-2 border-border hover:border-tangerine hover:bg-cream/50 transition-all text-center"
            >
              <div className="mx-auto bg-white w-12 h-12 flex items-center justify-center rounded-xl border-2 border-border mb-4 group-hover:-translate-y-1 transition-transform">
                <Lightbulb className="w-6 h-6 text-tangerine" />
              </div>
              <h3 className="font-bold text-coffee text-xl mb-2">Suggestions</h3>
              <p className="text-coffee-dark/70 text-sm mb-4">
                Have an idea for a new feature? Found a bug? Let us know how we can make your AI kitchen experience better.
              </p>
              <span className="text-tangerine font-bold text-sm group-hover:underline underline-offset-2 flex items-center justify-center gap-1">
                Share an idea →
              </span>
            </a>

            {/* Business Inquiries Card */}
            <a 
              href="mailto:hello@kernelcook.com?subject=Business%20Inquiry%20-%20Kernelcook"
              className="group block bg-cream/30 p-6 rounded-2xl border-2 border-border hover:border-coffee hover:bg-cream/50 transition-all text-center"
            >
              <div className="mx-auto bg-white w-12 h-12 flex items-center justify-center rounded-xl border-2 border-border mb-4 group-hover:-translate-y-1 transition-transform">
                <Briefcase className="w-6 h-6 text-coffee" />
              </div>
              <h3 className="font-bold text-coffee text-xl mb-2">Business</h3>
              <p className="text-coffee-dark/70 text-sm mb-4">
                Interested in partnerships, press, or commercial opportunities? Reach out to our founding team directly.
              </p>
              <span className="text-coffee font-bold text-sm group-hover:underline underline-offset-2 flex items-center justify-center gap-1">
                Contact us →
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}