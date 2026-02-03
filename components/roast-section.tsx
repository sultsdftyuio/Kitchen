// components/roast-section.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowRight, Sparkles, ChefHat } from "lucide-react";
import { useRef, useEffect } from "react";

export function RoastSection() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: '/api/chat',
    onError: (e) => console.error("Chat Client Error:", e)
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMagicClick = () => {
    append({ 
      role: "user", 
      content: "Based on my current pantry inventory, what can I cook right now?" 
    });
  };

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-forest">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream">
            Your AI <span className="text-butter">Sous Chef</span>
          </h2>
        </div>

        <div className="bg-cream rounded-3xl border-2 border-border hard-shadow-lg p-4 sm:p-6 max-w-2xl mx-auto flex flex-col h-[600px]">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-border shrink-0">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-rose rounded-full" />
              <div className="w-3 h-3 bg-butter rounded-full" />
              <div className="w-3 h-3 bg-[#86EFAC] rounded-full" />
            </div>
            <span className="ml-2 font-medium text-coffee text-sm">KitchenOS Chef</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                <ChefHat className="w-12 h-12 text-coffee" />
                <p className="text-coffee text-sm">My database is connected to your pantry.</p>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-coffee border-2 border-transparent ${m.role === "user" ? "bg-lavender rounded-tr-none" : "bg-butter rounded-tl-none"}`}>
                  {/* Render Markdown-like bolding if needed */}
                  <p className="whitespace-pre-wrap text-sm sm:text-base">{m.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-butter rounded-2xl rounded-tl-none px-5 py-3">
                   <div className="flex gap-1 animate-pulse"><span className="text-coffee text-xs">Cooking...</span></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="shrink-0 space-y-3">
            {messages.length === 0 && (
              <button onClick={handleMagicClick} className="w-full bg-tangerine text-white py-3 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 hover:shadow-none transition-all font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" /> What can I cook right now?
              </button>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white rounded-2xl px-2 py-2 border-2 border-border hard-shadow">
              <input value={input} onChange={handleInputChange} placeholder="Ask your chef..." className="flex-1 bg-transparent px-3 py-2 text-coffee outline-none" />
              <button type="submit" disabled={!input.trim() || isLoading} className="bg-coffee text-white p-3 rounded-xl border-2 border-border hover:shadow-none transition-all"><ArrowRight className="w-5 h-5" /></button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}