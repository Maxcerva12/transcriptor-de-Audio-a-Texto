"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  color?: "default" | "muted" | "accent";
}

export function Section({ 
  id, 
  children, 
  className, 
  fullWidth = false,
  color = "default" 
}: SectionProps) {
  const bgColors = {
    default: "bg-background",
    muted: "bg-muted/30",
    accent: "bg-primary/5"
  };

  return (
    <section 
      id={id} 
      className={cn(bgColors[color], className)}
    >
      <div className={cn(
        fullWidth ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16",
      )}>
        {children}
      </div>
    </section>
  );
}
