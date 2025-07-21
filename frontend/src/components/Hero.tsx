"use client";

import { FileAudio, Waves, Globe, ClipboardCheck, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface HeroProps {
  onGetStartedClick: () => void;
  onHowItWorksClick?: () => void;
}

export function Hero({ onGetStartedClick, onHowItWorksClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background" />
      
      {/* Animated dots pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-6">
            <Waves className="w-4 h-4 mr-2" /> 
            Transcripciones precisas con IA
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Transcribe audio a texto <br className="hidden sm:inline" />
            <span className="text-primary">en minutos</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Convierte fácilmente tus archivos de audio a texto con nuestra 
            herramienta potenciada por IA. Sin limitaciones, sin registros, completamente gratuita.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg"
              onClick={onGetStartedClick}
              className="px-8 shadow-lg"
            >
              <FileAudio className="w-4 h-4 mr-2" />
              Comenzar ahora
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8"
              onClick={onHowItWorksClick ? onHowItWorksClick : () => {
                const element = document.getElementById('como-funciona');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Ver cómo funciona
            </Button>
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-8">
          {[
            {
              icon: <Globe className="w-5 h-5 text-primary" />,
              title: "Múltiples idiomas",
              description: "Soporte para más de 30 idiomas con detección automática"
            },
            {
              icon: <Clock className="w-5 h-5 text-primary" />,
              title: "Procesamiento rápido",
              description: "Transcripciones en minutos con alta precisión"
            },
            {
              icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
              title: "Precisión líder",
              description: "Basado en la tecnología OpenAI Whisper"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "flex flex-col items-center text-center p-6 rounded-xl",
                "border bg-card shadow-sm"
              )}
            >
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
