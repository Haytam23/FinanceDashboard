"use client"

interface ConfidenceIndicatorProps {
  confidence: number
  label?: string
  showExplanation?: boolean
}

export default function ConfidenceIndicator({
  confidence,
  label = "AI Confidence",
  showExplanation = true,
}: ConfidenceIndicatorProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "bg-success text-success"
    if (conf >= 60) return "bg-warning text-warning"
    return "bg-danger text-danger"
  }

  const getConfidenceInterpretation = (conf: number) => {
    if (conf >= 85) return "Very High - Strong signal with consistent data"
    if (conf >= 70) return "High - Reliable signal with minor uncertainty"
    if (conf >= 55) return "Moderate - Mixed signals, approach with caution"
    return "Low - Unstable data, wait for clarity"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={`text-lg font-bold ${getConfidenceColor(confidence)}`}>{confidence}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${getConfidenceColor(confidence)}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      {showExplanation && <p className="text-xs text-muted-foreground">{getConfidenceInterpretation(confidence)}</p>}
    </div>
  )
}
