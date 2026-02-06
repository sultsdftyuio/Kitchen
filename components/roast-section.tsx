// components/roast-section.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowRight, Send } from "lucide-react";
import { useRef, useEffect } from "react";

export function RoastSection() {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat() as any;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Specific "Quick Replies" that work well with the Chef persona
  const quickReplies = [
    "I have eggs, spinach, and rice 🍳",
    "What pantry staples should I buy?",
    "Review my grocery list 📝"
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-forest">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream text-balance">
            Got Ingredients?{" "}
            <span className="text-butter">Let's Get Cooking.</span>
          </h2>
          <p className="mt-4 text-cream/80 text-lg max-w-2xl mx-auto">
            Your personal chef is ready to turn your pantry into a 5-star menu.
          </p>
        </div>

        {/* Chat Window */}
        <div className="bg-cream rounded-3xl border-2 border-border hard-shadow-lg p-6 max-w-2xl mx-auto flex flex-col h-[600px]">
          
          {/* Window Header */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-border shrink-0">
            <div className="w-3 h-3 bg-rose rounded-full" />
            <div className="w-3 h-3 bg-butter rounded-full" />
            <div className="w-3 h-3 bg-[#86EFAC] rounded-full" />
            <span className="ml-2 font-medium text-coffee text-sm">
              KitchenOS Chef
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-coffee/20">
            
            {/* Zero State / Welcome Message */}
            {(!messages || messages.length === 0) && (
              <div className="flex justify-start">
                <div className="bg-butter rounded-2xl rounded-tl-none px-5 py-3 max-w-[85%] border-2 border-transparent">
                  <p className="text-coffee">
                    {"Hello! I'm here to help you navigate your kitchen. Tell me what ingredients you have, and we'll make something wonderful."}
                  </p>
                </div>
              </div>
            )}

            {/* Dynamic Messages */}
            {messages?.map((m: any) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[85%] rounded-2xl px-5 py-3 text-coffee border-2 border-transparent
                    ${m.role === "user" 
                      ? "bg-lavender rounded-tr-none" 
                      : "bg-butter rounded-tl-none"}
                  `}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Area: Quick Replies + Input */}
          <div className="shrink-0 space-y-4">
            
            {/* Quick Replies */}
            {(!messages || messages.length < 2) && (
              <div className="flex gap-2 flex-wrap">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => append({ role: "user", content: reply })}
                    className="bg-white text-coffee px-4 py-2 rounded-full border-2 border-border text-sm font-medium hard-shadow hard-shadow-hover hover:bg-mutedYB transition-colors text-left"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white rounded-2xl px-2 py-2 border-2 border-border hard-shadow">
              <input
                value={input || ''} 
                onChange={handleInputChange}
                placeholder="Type ingredients here..."
                className="flex-1 bg-transparent px-3 py-2 text-coffee placeholder:text-coffee-dark/50 outline-none text-base"
              />
              <button 
                type="submit"
                disabled={!input?.trim()} 
                className="bg-tangerine text-white p-3 rounded-xl border-2 border-border hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}