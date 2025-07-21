"use client";

import { useState, useEffect } from "react";
import { Mic, Menu, X, Volume2, Github } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "./ui/sheet";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onHomeClick?: () => void;
  onHowItWorksClick?: () => void;
  onFeaturesClick?: () => void;
}

export function Header({
  onHomeClick,
  onHowItWorksClick,
  onFeaturesClick
}: HeaderProps = {}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, handler?: () => void, id?: string) => {
    if (handler) {
      e.preventDefault();
      handler();
    } else if (id) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled 
          ? "bg-background/80 backdrop-blur-md shadow border-b border-border" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title - Desktop */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                TransVox AI
              </h1>
              <p className="text-xs text-muted-foreground">
                Transcripción inteligente
              </p>
            </div>
          </div>

          {/* Mobile Logo */}
          <div className="md:hidden flex items-center space-x-2">
            <h1 className="text-lg font-bold text-foreground">
              Transquitor
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <a 
                href="#" 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={(e) => handleNavClick(e, onHomeClick)}
              >
                Inicio
              </a>
              <a 
                href="#como-funciona" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => handleNavClick(e, onHowItWorksClick, "como-funciona")}
              >
                Cómo funciona
              </a>
              <a 
                href="#caracteristicas" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => handleNavClick(e, onFeaturesClick, "caracteristicas")}
              >
                Características
              </a>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">OpenAI Whisper</span>
              </div>
              <a href="https://github.com/Maxcerva12" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <ModeToggle />
            </nav>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-4">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-6 mt-8">
                  <SheetClose asChild>
                    <a 
                      href="#" 
                      className="text-foreground font-medium hover:text-primary transition-colors flex items-center"
                      onClick={(e) => handleNavClick(e, onHomeClick)}
                    >
                      Inicio
                    </a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a 
                      href="#como-funciona" 
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                      onClick={(e) => handleNavClick(e, onHowItWorksClick, "como-funciona")}
                    >
                      Cómo funciona
                    </a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a 
                      href="#caracteristicas" 
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                      onClick={(e) => handleNavClick(e, onFeaturesClick, "caracteristicas")}
                    >
                      Características
                    </a>
                  </SheetClose>
                  <div className="h-px w-full bg-border"></div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-xs">OpenAI Whisper</span>
                  </div>
                  <a 
                    href="https://github.com/Maxcerva12" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
