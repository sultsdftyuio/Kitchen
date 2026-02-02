import { Camera, MessageCircle, UtensilsCrossed } from "lucide-react"; // how-it-works.tsx

const steps = [
  {
    number: "1",
    icon: Camera,
    title: "Snap a receipt or log groceries.",
    description:
      "Simply take a photo of your grocery receipt or manually add items to your digital pantry.",
  },
  {
    number: "2",
    icon: MessageCircle,
    title: "Chat with the Chef.",
    description:
      "Tell us what you're craving or let us surprise you based on what's in your fridge.",
  },
  {
    number: "3",
    icon: UtensilsCrossed,
    title: "Cook, Eat, Save.",
    description:
      "Follow step-by-step guidance, enjoy your meal, and reduce food waste.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-coffee text-balance">
            Simple as <span className="text-tangerine">1, 2, 3</span>
          </h2>
          <p className="mt-4 text-lg text-coffee-dark max-w-2xl mx-auto">
            From empty fridge to full plate in minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative inline-block mb-6">
                <span className="font-serif text-8xl font-bold text-butter">
                  {step.number}
                </span>
                <div className="absolute -bottom-2 -right-2 bg-white w-14 h-14 rounded-2xl border-2 border-border flex items-center justify-center hard-shadow">
                  <step.icon className="w-7 h-7 text-tangerine" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-coffee mb-3">
                {step.title}
              </h3>
              <p className="text-coffee-dark leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
