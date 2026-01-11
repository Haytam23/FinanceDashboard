"use client"

interface OverconfidenceGuardProps {
  show: boolean
  reason: string
}

export default function OverconfidenceGuard({ show, reason }: OverconfidenceGuardProps) {
  if (!show) return null

  return (
    <div className="bg-warning/10 border-l-4 border-warning rounded-r-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Overconfidence Guard Active</h4>
          <p className="text-xs text-foreground/80 mt-1">{reason}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Consider reducing position size or waiting for additional confirmation signals.
          </p>
        </div>
      </div>
    </div>
  )
}
