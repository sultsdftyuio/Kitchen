export function RoastSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-forest">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream text-balance">
            Your Fridge is Chaos.{" "}
            <span className="text-butter">We Fix That.</span>
          </h2>
        </div>

        {/* Chat Window */}
        <div className="bg-cream rounded-3xl border-2 border-border hard-shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-border">
            <div className="w-3 h-3 bg-rose rounded-full" />
            <div className="w-3 h-3 bg-butter rounded-full" />
            <div className="w-3 h-3 bg-[#86EFAC] rounded-full" />
            <span className="ml-2 font-medium text-coffee text-sm">
              KitchenOS Chat
            </span>
          </div>

          <div className="space-y-4">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-lavender rounded-2xl rounded-tr-none px-5 py-3 max-w-[80%]">
                <p className="text-coffee">
                  I have 3 eggs, slightly old spinach, and rice.
                </p>
              </div>
            </div>

            {/* Bot Message */}
            <div className="flex justify-start">
              <div className="bg-butter rounded-2xl rounded-tl-none px-5 py-3 max-w-[80%]">
                <p className="text-coffee">
                  Perfect. {"Let's make a"}{" "}
                  <span className="font-semibold">
                    Spinach & Egg Fried Rice
                  </span>{" "}
                  with a crispy garlic topping. Shall I guide you step-by-step?
                </p>
              </div>
            </div>

            {/* Quick Replies */}
            <div className="flex gap-2 flex-wrap pt-2">
              <button className="bg-white text-coffee px-4 py-2 rounded-full border-2 border-border text-sm font-medium hard-shadow hard-shadow-hover">
                {"Yes, let's go! 🚀"}
              </button>
              <button className="bg-white text-coffee px-4 py-2 rounded-full border-2 border-border text-sm font-medium hard-shadow hard-shadow-hover">
                Show me the recipe first
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
