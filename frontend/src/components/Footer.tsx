"use client";

import { Github, Linkedin, Globe, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/maximiliano-cervantes-ing/",
      icon: <Linkedin className="h-5 w-5" />,
      color: "hover:text-blue-500"
    },
    {
      name: "GitHub",
      href: "https://github.com/Maxcerva12",
      icon: <Github className="h-5 w-5" />,
      color: "hover:text-gray-900 dark:hover:text-white"
    },
    {
      name: "Portfolio",
      href: "https://portafoliomax.onrender.com/",
      icon: <Globe className="h-5 w-5" />,
      color: "hover:text-teal-500"
    },
    {
      name: "Contacto",
      href: "mailto:mc349821@gmail.com",
      icon: <Mail className="h-5 w-5" />,
      color: "hover:text-red-500"
    }
  ];

  return (
    <footer className="border-t border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo & Description */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="bg-primary p-1.5 rounded-md">
                  <span className="text-primary-foreground font-bold text-xl">T</span>
                </div>
                <h3 className="font-bold text-xl">TransVox AI</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Una herramienta profesional para la transcripción de audio a texto 
                utilizando tecnología avanzada de reconocimiento de voz.
              </p>
            </div>
            
            {/* Links */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Características</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-muted-foreground hover:text-foreground transition-colors">
                    <a href="#">Transcripción de audio</a>
                  </li>
                  <li className="text-muted-foreground hover:text-foreground transition-colors">
                    <a href="#">Traducción automática</a>
                  </li>
                  <li className="text-muted-foreground hover:text-foreground transition-colors">
                    <a href="#">Múltiples formatos de audio</a>
                  </li>
                  <li className="text-muted-foreground hover:text-foreground transition-colors">
                    <a href="#">Detección de idioma</a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Tecnologías</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-muted-foreground hover:text-foreground transition-colors">
                    <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
                  </li>
                  <li className="text-muted-foreground hover:text-foreground transition-colors">
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a>
                  </li>
                  <li className="text-muted-foreground hover:text-foreground transition-colors">
                    <a href="https://fastapi.tiangolo.com" target="_blank" rel="noopener noreferrer">FastAPI</a>
                  </li>
                  <li className="text-muted-foreground hover:text-foreground transition-colors">
                    <a href="https://openai.com/research/whisper" target="_blank" rel="noopener noreferrer">OpenAI Whisper</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Social Links & Copyright */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} TransVox AI. Desarrollado por Maximiliano Cervantes.
            </p>
            
            <TooltipProvider>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {socialLinks.map((link) => (
                  <Tooltip key={link.name}>
                    <TooltipTrigger asChild>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-muted-foreground transition-colors ${link.color} hover:scale-110`}
                      >
                        {link.icon}
                        <span className="sr-only">{link.name}</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </footer>
  );
}
