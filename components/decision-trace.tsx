"use client"

interface DecisionStep {
  step: number
  signal: string
  value: string
  weight: "strong" | "moderate" | "weak"
}

interface DecisionTraceProps {
  recommendation: "buy" | "hold" | "avoid"
  reasoning: DecisionStep[]
  confidence: number
}

export default function DecisionTrace({ recommendation, reasoning, confidence }: DecisionTraceProps) {
  const getWeightColor = (weight: string) => {
    switch (weight) {
      case "strong":
        return "bg-success/20 text-success"
      case "moderate":
        return "bg-warning/20 text-warning"
      case "weak":
        return "bg-muted text-muted-foreground"
    }
  }

  const getWeightIcon = (weight: string) => {
    switch (weight) {
      case "strong":
        return "↑↑"
      case "moderate":
        return "↑"
      case "weak":
        return "→"
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground text-sm">How Did AI Decide?</h4>

      {/* Decision Flow */}
      <div className="space-y-2">
        {reasoning.map((step) => (
          <div key={step.step} className="flex items-start gap-3">
            <div className={`text-xs font-bold px-2 py-1 rounded ${getWeightColor(step.weight)}`}>
              {step.step}. {getWeightIcon(step.weight)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{step.signal}</p>
              <p className="text-xs text-muted-foreground">{step.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <div className="border-t border-border pt-3 mt-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Recommendation</p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              recommendation === "buy"
                ? "bg-success/20 text-success"
                : recommendation === "hold"
                  ? "bg-warning/20 text-warning"
                  : "bg-danger/20 text-danger"
            }`}
          >
            {recommendation.toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Confidence: <strong>{confidence}%</strong> - Based on {reasoning.length} analyzed signals
        </p>
      </div>
    </div>
  )
}
