"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EducationalTooltipProps {
  term: string
  explanation: string
  example?: string
  children: React.ReactNode
}

export default function EducationalTooltip({ term, explanation, example, children }: EducationalTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="underline decoration-dotted decoration-muted-foreground hover:decoration-foreground transition-colors cursor-help font-medium">
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-sm">{term}</p>
            <p className="text-xs text-foreground/90">{explanation}</p>
            {example && <p className="text-xs text-foreground/70 italic">Example: {example}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
