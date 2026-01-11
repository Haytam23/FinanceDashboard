"use client"

const correlations = [
  {
    pair: "Banking ↔ Telecom",
    value: 0.68,
    description: "Strong positive correlation",
  },
  {
    pair: "Banking ↔ Materials",
    value: 0.45,
    description: "Moderate positive correlation",
  },
  {
    pair: "Telecom ↔ Materials",
    value: 0.38,
    description: "Moderate positive correlation",
  },
  {
    pair: "Banking ↔ Mining",
    value: -0.22,
    description: "Weak negative correlation",
  },
  {
    pair: "Telecom ↔ Mining",
    value: -0.18,
    description: "Weak negative correlation",
  },
  {
    pair: "Materials ↔ Mining",
    value: 0.12,
    description: "Near zero - low relationship",
  },
]

export default function CorrelationMatrix() {
  const getCorrelationColor = (value: number) => {
    if (value >= 0.5) return "bg-success/20"
    if (value >= 0.25) return "bg-warning/20"
    if (value >= 0) return "bg-muted"
    if (value >= -0.25) return "bg-accent/20"
    return "bg-danger/20"
  }

  return (
    <div className="space-y-3">
      {correlations.map((corr) => (
        <div key={corr.pair} className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground text-sm">{corr.pair}</p>
            <p className="text-sm font-bold text-foreground">{corr.value.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 rounded-full flex-1 ${getCorrelationColor(corr.value)}`} />
            <p className="text-xs text-muted-foreground w-32 text-right">{corr.description}</p>
          </div>
        </div>
      ))}

      <div className="pt-4 mt-4 border-t border-border text-xs text-muted-foreground space-y-1">
        <p>
          <span className="font-semibold">+1.0:</span> Perfect positive (move together)
        </p>
        <p>
          <span className="font-semibold">0.0:</span> No correlation (independent)
        </p>
        <p>
          <span className="font-semibold">-1.0:</span> Perfect negative (opposite moves)
        </p>
      </div>
    </div>
  )
}
