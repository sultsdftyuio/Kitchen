// components/roast-section.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowRight, Sparkles, ChefHat, Bug, AlertTriangle } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export function RoastSection() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [debugMode, setDebugMode] = useState(true); // Default to true for now

  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    append, 
    isLoading, 
    error,
    data 
  } = useChat({
    api: '/api/chat',
    onError: (err) => {
      console.error("Client: Chat Error Recieved:", err);
    },
    onFinish: (msg) => {
      console.log("Client: Chat Finished:", msg);
    }
  });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMagicClick = () => {
    console.log("Magic button clicked");
    append({ 
      role: "user", 
      content: "Based on my current pantry inventory, what can I cook right now?" 
    });
  };

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-forest">
      <div className="max-w-4xl mx-auto">
        
        {/* DEBUG PANEL */}
        {debugMode && (
          <div className="mb-8 p-4 bg-black/80 text-green-400 font-mono text-xs rounded-xl overflow-x-auto border border-green-500/30">
            <div className="flex justify-between items-center mb-2 border-b border-green-500/30 pb-2">
              <span className="font-bold flex items-center gap-2"><Bug className="w-4 h-4"/> DEBUG CONSOLE</span>
              <button onClick={() => setDebugMode(false)} className="text-white hover:text-red-400">Hide</button>
            </div>
            <div>Status: {isLoading ? "⏳ Generating..." : "Idle"}</div>
            <div>Messages: {messages.length}</div>
            <div>API Route: /api/chat</div>
            {error && (
              <div className="text-red-400 font-bold mt-2 p-2 border border-red-500 rounded bg-red-900/20">
                ❌ ERROR: {error.message}
              </div>
            )}
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream text-balance">
            Your AI <span className="text-butter">Sous Chef</span>
          </h2>
          <p className="mt-4 text-cream/80 text-lg max-w-2xl mx-auto">
            I know what's in your pantry. Ask me for a recipe.
          </p>
        </div>

        {/* Chat Window */}
        <div className="bg-cream rounded-3xl border-2 border-border hard-shadow-lg p-4 sm:p-6 max-w-2xl mx-auto flex flex-col h-[600px]">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-border shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose rounded-full" />
              <div className="w-3 h-3 bg-butter rounded-full" />
              <div className="w-3 h-3 bg-[#86EFAC] rounded-full" />
              <span className="ml-2 font-medium text-coffee text-sm">KitchenOS Chef</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-coffee/20">
            
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                <ChefHat className="w-12 h-12 text-coffee" />
                <p className="text-coffee text-sm">
                  My database is connected to your pantry.<br/>
                  Click the magic button below to get started.
                </p>
              </div>
            )}

            {messages.map((m) => (
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
                  <p className="whitespace-pre-wrap text-sm sm:text-base">{m.content}</p>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-butter rounded-2xl rounded-tl-none px-5 py-3">
                   <div className="flex gap-1">
                     <span className="w-2 h-2 bg-coffee/40 rounded-full animate-bounce" />
                     <span className="w-2 h-2 bg-coffee/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                     <span className="w-2 h-2 bg-coffee/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                 </div>
               </div>
            )}
            
            {/* Error Message Display in Chat Flow */}
            {error && (
              <div className="flex justify-center my-4">
                <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Something went wrong. Check the Debug Console above.</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Area */}
          <div className="shrink-0 space-y-3">
            {messages.length === 0 && (
              <button
                type="button" // Explicitly type button to prevent form submission
                onClick={handleMagicClick}
                className="w-full bg-tangerine text-white py-3 rounded-xl border-2 border-border hard-shadow hover:translate-y-1 hover:shadow-none transition-all font-bold flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                What can I cook right now?
              </button>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white rounded-2xl px-2 py-2 border-2 border-border hard-shadow">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask your chef..."
                className="flex-1 bg-transparent px-3 py-2 text-coffee placeholder:text-coffee-dark/50 outline-none text-base"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-coffee text-white p-3 rounded-xl border-2 border-border hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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