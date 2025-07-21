"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="text-sm text-muted-foreground">{progress}%</span>
          )}
        </div>
      )}

      <Progress 
        value={Math.min(progress, 100)} 
        className="h-2 transition-all duration-300"
      />
    </div>
  );
};
