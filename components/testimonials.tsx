const testimonials = [
  {
    name: "Maria G.",
    role: "Home Cook",
    quote:
      "kernelcook turned me from a microwave expert into someone who actually enjoys cooking. My family thinks I took classes!",
    ringColor: "ring-tangerine",
    initial: "M",
    bgColor: "bg-rose",
  },
  {
    name: "James T.",
    role: "Busy Parent",
    quote:
      "The ingredient tracking alone has saved us so much money. We barely throw anything away now.",
    ringColor: "ring-forest",
    initial: "J",
    bgColor: "bg-butter",
  },
  {
    name: "Sophie L.",
    role: "Food Blogger",
    quote:
      "It's like having a grandmother who knows every cuisine. The recipes have soul - you can taste the difference.",
    ringColor: "ring-lavender",
    initial: "S",
    bgColor: "bg-lavender",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-butter/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-coffee text-balance">
            Love Letters from <span className="text-tangerine">Cooks</span>
          </h2>
          <p className="mt-4 text-lg text-coffee-dark max-w-2xl mx-auto">
            {"Join thousands of happy home cooks"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border-2 border-border hard-shadow p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-14 h-14 ${testimonial.bgColor} rounded-full flex items-center justify-center border-2 border-border ring-4 ${testimonial.ringColor}`}
                >
                  <span className="font-serif text-xl font-bold text-coffee">
                    {testimonial.initial}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-coffee">{testimonial.name}</p>
                  <p className="text-sm text-coffee-dark">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-coffee-dark leading-relaxed italic">
                {'"'}{testimonial.quote}{'"'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
