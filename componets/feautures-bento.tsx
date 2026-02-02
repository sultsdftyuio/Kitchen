import { Brain, Package, ChefHat } from "lucide-react"; // feautures-bento.tsx

const features = [
  {
    icon: Brain,
    title: "I Remember You.",
    description:
      "I know you hate cilantro and love extra garlic. I never forget.",
    bgColor: "bg-rose",
  },
  {
    icon: Package,
    title: "The Magic Fridge.",
    description:
      "Track what you buy. Get alerts before ingredients expire.",
    bgColor: "bg-[#BFDBFE]",
  },
  {
    icon: ChefHat,
    title: "Your Sous-Chef.",
    description:
      "No walls of text. Just one instruction at a time.",
    bgColor: "bg-butter",
  },
];

export function FeaturesBento() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-coffee text-balance">
            Cooking Made <span className="text-tangerine">Personal</span>
          </h2>
          <p className="mt-4 text-lg text-coffee-dark max-w-2xl mx-auto">
            {"Every feature designed to make your kitchen feel like home"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-3xl border-2 border-border hard-shadow p-8 transform transition-transform hover:-translate-y-1`}
            >
              <div className="bg-white w-14 h-14 rounded-2xl border-2 border-border flex items-center justify-center mb-6 hard-shadow">
                <feature.icon className="w-7 h-7 text-tangerine" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-coffee mb-3">
                {feature.title}
              </h3>
              <p className="text-coffee-dark leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
