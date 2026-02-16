// components/cook-mode.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, Mic, MicOff, Volume2, CheckCircle2, Clock, Users, Flame, ChefHat, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner" 
import { cn } from "@/lib/utils"
import { logCookingHistoryAction } from "@/app/actions/history"

interface CookModeProps {
  recipe: {
    name: string
    ingredients: any[]
    instructions: string[]
    nutrition?: {
      prep_time?: string | null
      cook_time?: string | null
      servings?: number | null
      difficulty?: string | null
    }
  }
}

export function CookMode({ recipe }: CookModeProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, recipe.instructions.length])

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
    return () => {
      if (wakeLock) wakeLock.release();
    };
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
      try {
        recognition.start()
        setIsListening(true)
        toast.success("Listening... Say 'Next', 'Back', or 'Repeat'")
      } catch (e) {
        console.error(e)
      }
    }
  }

  // 4. Text-to-Speech
  const speakText = (text: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  const speakStep = () => speakText(recipe.instructions[currentStep])

  // 5. Finish Cooking Handler
  const handleFinishCooking = async () => {
    setIsFinishing(true)
    try {
      await logCookingHistoryAction(recipe.name)
      toast.success("Meal complete! Logged to your KitchenOS history. 👨‍🍳")
      router.push("/dashboard") // Redirect to dashboard to see the updated history
    } catch (error) {
      toast.error("Failed to save to history, but we hope the food is great!")
      setIsFinishing(false)
    }
  }

  // Progress calculation
  const progress = ((currentStep + 1) / recipe.instructions.length) * 100

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Header Controls & Metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-coffee/10 shadow-sm">
        <div>
          <h1 className="text-3xl font-serif font-bold text-coffee mb-2">{recipe.name}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm font-medium text-coffee-dark/70">
            {recipe.nutrition?.prep_time && (
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Prep: {recipe.nutrition.prep_time}</span>
            )}
            {recipe.nutrition?.cook_time && (
              <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> Cook: {recipe.nutrition.cook_time}</span>
            )}
            {recipe.nutrition?.servings && (
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Serves: {recipe.nutrition.servings}</span>
            )}
            {recipe.nutrition?.difficulty && (
              <span className="flex items-center gap-1"><ChefHat className="w-4 h-4" /> {recipe.nutrition.difficulty}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 self-start md:self-center">
           <Button 
            variant={isListening ? "default" : "outline"} 
            onClick={toggleListening}
            className={cn(
              "transition-all duration-300",
              isListening 
                ? "bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse border-none" 
                : "border-coffee/20 text-coffee hover:bg-coffee/5 bg-white"
            )}
          >
            {isListening ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
            {isListening ? "Listening" : "Enable Voice"}
          </Button>
          <Button variant="outline" onClick={speakStep} className="border-coffee/20 text-coffee bg-white hover:bg-coffee/5">
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Step Card */}
      <Card className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 text-center border-0 shadow-xl bg-white mb-8 relative overflow-hidden transition-all duration-300 rounded-3xl">
        <div className="absolute top-0 left-0 w-full">
           <Progress value={progress} className="h-2 rounded-none bg-coffee/5 [&>div]:bg-tangerine" />
        </div>
        
        <div className="absolute top-8 left-8">
            <span className="bg-coffee/5 text-coffee px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
                Step {currentStep + 1} of {recipe.instructions.length}
            </span>
        </div>

        <div className="flex-1 flex items-center justify-center w-full max-w-2xl mt-8">
          <h2 className="text-3xl md:text-5xl font-medium text-coffee leading-tight">
            {recipe.instructions[currentStep]}
          </h2>
        </div>

        {/* Navigation Hints */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-coffee/40 font-mono uppercase tracking-widest bg-coffee/5 px-6 py-3 rounded-full">
          {currentStep > 0 && <span className="flex items-center gap-2"><Mic className="w-3 h-3"/> "Back"</span>}
          <span className="flex items-center gap-2"><Mic className="w-3 h-3"/> "Repeat"</span>
          {currentStep < recipe.instructions.length - 1 && <span className="flex items-center gap-2"><Mic className="w-3 h-3"/> "Next"</span>}
        </div>
      </Card>

      {/* Manual Controls (Backup) */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={prevStep} 
          disabled={currentStep === 0 || isFinishing}
          variant="outline" 
          className="h-16 text-xl border-coffee/20 text-coffee bg-white hover:bg-coffee/5 rounded-2xl"
        >
          <ChevronLeft className="mr-2" /> Previous
        </Button>
        
        {currentStep === recipe.instructions.length - 1 ? (
          <Button 
            onClick={handleFinishCooking}
            disabled={isFinishing}
            className="h-16 text-xl bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]"
          >
            {isFinishing ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <CheckCircle2 className="mr-2 h-6 w-6" />} 
            {isFinishing ? "Saving..." : "Finish Cooking"}
          </Button>
        ) : (
          <Button 
            onClick={nextStep}
            className="h-16 text-xl bg-tangerine hover:bg-orange-600 text-white rounded-2xl shadow-lg shadow-tangerine/20 transition-all hover:scale-[1.02]"
          >
            Next Step <ChevronRight className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}