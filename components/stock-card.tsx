"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Stock {
  symbol: string
  company: string
  sector: string
  price: string
  change: string
  trend: "up" | "down"
  volatility: string
  recommendation: "buy" | "hold" | "avoid"
  confidence: number
  riskLabel: string
}

interface StockCardProps {
  stock: Stock
}

export default function StockCard({ stock }: StockCardProps) {
  const getRecommendationColor = (rec: "buy" | "hold" | "avoid") => {
    switch (rec) {
      case "buy":
        return "bg-success/15 text-success border-success/30"
      case "hold":
        return "bg-warning/15 text-warning border-warning/30"
      case "avoid":
        return "bg-danger/15 text-danger border-danger/30"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Safe":
        return "bg-success/15 text-success"
      case "Moderate":
        return "bg-warning/15 text-warning"
      case "Risky":
        return "bg-danger/15 text-danger"
    }
  }

  const getVolatilityIcon = (vol: string) => {
    switch (vol) {
      case "Low":
        return "↔️"
      case "Medium":
        return "≈≈"
      case "High":
        return "⚡"
    }
  }

  return (
    <Card className="border border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-lg text-foreground">{stock.symbol}</p>
              <p className="text-xs text-muted-foreground">{stock.company}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {stock.sector}
              </Badge>
            </div>
            <Badge className={getRecommendationColor(stock.recommendation)}>{stock.recommendation.toUpperCase()}</Badge>
          </div>

          {/* Price & Change */}
          <div className="border-t border-border pt-3">
            <p className="text-2xl font-bold text-foreground">{stock.price} DH</p>
            <p className={`text-sm font-semibold mt-1 ${stock.trend === "up" ? "text-success" : "text-danger"}`}>
              {stock.trend === "up" ? "↑" : "↓"} {stock.change}
            </p>
          </div>

          {/* Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Volatility</span>
              <span className="font-medium">
                {getVolatilityIcon(stock.volatility)} {stock.volatility}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Risk Level</span>
              <Badge variant="outline" className={getRiskColor(stock.riskLabel)}>
                {stock.riskLabel}
              </Badge>
            </div>
          </div>

          {/* Confidence */}
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">AI Confidence</span>
              <span className="font-bold text-foreground">{stock.confidence}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${stock.confidence}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
