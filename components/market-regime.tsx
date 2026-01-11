"use client"

interface MarketRegimeProps {
  regime: "bull" | "bear" | "sideways" | "volatile"
  confidence: number
}

export default function MarketRegime({ regime, confidence }: MarketRegimeProps) {
  const regimeData = {
    bull: {
      icon: "📈",
      label: "Bull Market",
      description: "Rising trend with positive momentum",
      color: "text-success bg-success/10",
      risk: "Opportunity with normal risk",
    },
    bear: {
      icon: "📉",
      label: "Bear Market",
      description: "Declining trend with negative momentum",
      color: "text-danger bg-danger/10",
      risk: "Defensive positioning recommended",
    },
    sideways: {
      icon: "↔️",
      label: "Sideways Market",
      description: "Range-bound with no clear direction",
      color: "text-warning bg-warning/10",
      risk: "Wait for clear signals",
    },
    volatile: {
      icon: "⚡",
      label: "High Volatility",
      description: "Unstable market with sudden swings",
      color: "text-danger bg-danger/10",
      risk: "Use smaller position sizes",
    },
  }

  const current = regimeData[regime]

  return (
    <div className={`${current.color} border border-current/20 rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{current.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{current.label}</h3>
          <p className="text-sm text-foreground/80 mt-1">{current.description}</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/70">Confidence</span>
              <span className="font-semibold">{confidence}%</span>
            </div>
            <div className="w-full bg-foreground/10 rounded-full h-2">
              <div className="bg-current rounded-full h-2 transition-all" style={{ width: `${confidence}%` }} />
            </div>
          </div>
          <p className="text-xs text-foreground/70 mt-2 font-medium">⚠️ {current.risk}</p>
        </div>
      </div>
    </div>
  )
}
