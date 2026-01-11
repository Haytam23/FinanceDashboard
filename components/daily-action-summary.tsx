"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DailyActionSummaryProps {
  riskProfile: "conservative" | "balanced" | "aggressive"
}

export default function DailyActionSummary({ riskProfile }: DailyActionSummaryProps) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // Update time immediately and every minute
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      setCurrentTime(timeString)
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const summaries = {
    conservative: {
      headline: "Maintain Conservative Positioning",
      guidance: "Market is in a favorable bull regime. Focus on capital preservation.",
      actions: [
        "Hold current positions in BNMA and ITISSF",
        "Avoid high-volatility mining stocks",
        "Consider allocating 15-20% to cash/bonds",
        "Monitor earnings announcements next week",
      ],
      allocation: "40% Banking, 30% Telecom, 10% Materials, 20% Cash",
    },
    balanced: {
      headline: "Selective Accumulation Recommended",
      guidance: "Bull market offers good entry points in quality stocks.",
      actions: [
        "Buy on dips in BNMA (support at 240 DH)",
        "Accumulate CIMR at current levels",
        "Reduce exposure to ATLGOLD below 40 DH",
        "Maintain 10-15% cash reserve for opportunities",
      ],
      allocation: "35% Banking, 30% Telecom, 20% Materials, 10% Mining, 5% Cash",
    },
    aggressive: {
      headline: "Maximize Growth Opportunities",
      guidance: "Strong bull market conditions favor aggressive positioning.",
      actions: [
        "Increase exposure to momentum leaders (ITISSF, CIMR)",
        "Short mining sector weakness if comfortable with leverage",
        "Use sector rotation to capture outperformers",
        "Maintain tight stop-losses due to volatility",
      ],
      allocation: "25% Banking, 35% Telecom, 25% Materials, 10% Mining, 5% Alternatives",
    },
  }

  const current = summaries[riskProfile]

  return (
    <Card className="border border-border bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              Daily Action Summary
            </CardTitle>
            <CardDescription>Today's recommended actions for your {riskProfile} profile</CardDescription>
          </div>
          <Badge variant="secondary">UPDATED {currentTime || "..."}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Headline */}
        <div className="bg-background rounded-lg p-4 border border-border">
          <h3 className="text-lg font-bold text-foreground">{current.headline}</h3>
          <p className="text-sm text-foreground/80 mt-2">{current.guidance}</p>
        </div>

        {/* Action Items */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Recommended Actions</h4>
          <ul className="space-y-2">
            {current.actions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-foreground/80 pt-0.5">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Portfolio Allocation */}
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Suggested Allocation</h4>
          <p className="text-xs text-muted-foreground mb-3">{current.allocation}</p>
          <div className="space-y-2">
            {[
              {
                sector: "Banking",
                percent: riskProfile === "conservative" ? 40 : riskProfile === "balanced" ? 35 : 25,
              },
              { sector: "Telecom", percent: 30 },
              {
                sector: "Materials",
                percent: riskProfile === "conservative" ? 10 : riskProfile === "balanced" ? 20 : 25,
              },
              {
                sector: "Cash/Other",
                percent: riskProfile === "conservative" ? 20 : riskProfile === "balanced" ? 15 : 20,
              },
            ].map((item) => (
              <div key={item.sector}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{item.sector}</span>
                  <span className="text-muted-foreground">{item.percent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
          <p className="text-xs text-foreground/80">
            This summary is educational guidance only, not financial advice. Consult a qualified financial advisor
            before making investment decisions. Always conduct your own due diligence.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
