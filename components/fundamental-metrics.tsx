"use client"

import { Card, CardContent } from "@/components/ui/card"

interface FundamentalMetricsProps {
  symbol: string
}

export default function FundamentalMetrics({ symbol }: FundamentalMetricsProps) {
  const metrics = [
    { label: "P/E Ratio", value: "12.5", explanation: "Lower is more attractive for value investors" },
    { label: "Dividend Yield", value: "3.2%", explanation: "Annual return from dividends" },
    { label: "Debt to Equity", value: "0.45", explanation: "Lower indicates stronger financial health" },
    { label: "ROE", value: "18.5%", explanation: "Return on equity - profitability measure" },
    { label: "Current Ratio", value: "1.8", explanation: "Ability to pay short-term obligations" },
    { label: "Earnings Growth", value: "+12.3%", explanation: "Year-over-year profit growth" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="border border-border hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
            </div>
            <p className="text-2xl font-bold text-foreground mb-2">{metric.value}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{metric.explanation}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
