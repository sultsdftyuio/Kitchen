// components/cook-mode.tsx
'use client'

import { useState, useEffect, useCallback } from "react"
import { ChevronRight, ChevronLeft, Mic, MicOff, Volume2, CheckCircle2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner" // Or your preferred toast lib
import { cn } from "@/lib/utils"

interface CookModeProps {
  recipe: {
    name: string
    ingredients: any[]
    instructions: string[]
  }
}

export function CookMode({ recipe }: CookModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  // 1. Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim()
        console.log("Heard:", transcript)
        handleVoiceCommand(transcript)
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech error:", event.error)
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    } else {
      console.warn("Speech recognition not supported in this browser.")
    }
  }, [])

  // 2. Wake Lock (Keep screen on)
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          console.log('Screen Wake Lock active');
        }
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    };
    requestWakeLock();
    return () => wakeLock?.release();
  }, []);

  // 3. Voice Command Logic
  const handleVoiceCommand = (command: string) => {
    if (command.includes("next") || command.includes("done") || command.includes("okay")) {
      nextStep()
    } else if (command.includes("back") || command.includes("previous")) {
      prevStep()
    } else if (command.includes("repeat") || command.includes("read")) {
      speakStep()
    }
  }

  const nextStep = () => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, recipe.instructions.length - 1)
      if (next !== prev) speakText(recipe.instructions[next])
      return next
    })
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const toggleListening = () => {
    if (!recognition) return toast.error("Voice control not supported on this device.")
    
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
      toast.success("Listening... Say 'Next', 'Back', or 'Repeat'")
    }
  }

  // 4. Text-to-Speech
  const speakText = (text: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  const speakStep = () => speakText(recipe.instructions[currentStep])

  // Progress calculation
  const progress = ((currentStep + 1) / recipe.instructions.length) * 100

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-coffee">{recipe.name}</h1>
          <p className="text-coffee-dark">Step {currentStep + 1} of {recipe.instructions.length}</p>
        </div>
        <div className="flex gap-2">
           <Button 
            variant={isListening ? "default" : "outline"} 
            onClick={toggleListening}
            className={isListening ? "bg-rose-500 hover:bg-rose-600 animate-pulse" : "border-coffee text-coffee"}
          >
            {isListening ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
            {isListening ? "Listening" : "Enable Voice"}
          </Button>
          <Button variant="outline" onClick={speakStep} className="border-coffee text-coffee">
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Step Card */}
      <Card className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 text-center border-2 border-coffee/10 hard-shadow bg-[#FFF8F0] mb-8 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 w-full">
           <Progress value={progress} className="h-2 rounded-none bg-coffee/10" />
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-medium text-coffee leading-tight">
            {recipe.instructions[currentStep]}
          </h2>
        </div>

        {/* Navigation Hints */}
        <div className="mt-8 flex gap-8 text-sm text-coffee/40 font-mono uppercase tracking-widest">
          {currentStep > 0 && <span>Values: "Back"</span>}
          <span>Values: "Repeat"</span>
          {currentStep < recipe.instructions.length - 1 && <span>Values: "Next"</span>}
        </div>
      </Card>

      {/* Manual Controls (Backup) */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={prevStep} 
          disabled={currentStep === 0}
          variant="outline" 
          className="h-16 text-xl border-coffee text-coffee"
        >
          <ChevronLeft className="mr-2" /> Previous
        </Button>
        
        {currentStep === recipe.instructions.length - 1 ? (
          <Button className="h-16 text-xl bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle2 className="mr-2" /> Finish Cooking
          </Button>
        ) : (
          <Button 
            onClick={nextStep}
            className="h-16 text-xl bg-tangerine hover:bg-orange-600 text-white"
          >
            Next Step <ChevronRight className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}