"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HeatmapCell {
  symbol: string
  name: string
  value: number
  volatility: number
  sector: string
}

const mockData: HeatmapCell[] = [
  { symbol: "ATW", name: "Attijariwafa Bank", value: 2.8, volatility: 1.2, sector: "Banking" },
  { symbol: "BCP", name: "Banque Centrale Populaire", value: 1.9, volatility: 0.9, sector: "Banking" },
  { symbol: "IAM", name: "Maroc Telecom", value: 1.2, volatility: 0.7, sector: "Telecom" },
  { symbol: "CDM", name: "Ciments du Maroc", value: -0.8, volatility: 1.5, sector: "Materials" },
  { symbol: "ADH", name: "Douja Prom Addoha", value: -2.3, volatility: 2.1, sector: "Real Estate" },
  { symbol: "MNG", name: "Managem", value: -1.5, volatility: 1.8, sector: "Mining" },
  { symbol: "LBL", name: "Label'Vie", value: 0.5, volatility: 0.8, sector: "Retail" },
  { symbol: "SRM", name: "SNEP", value: 3.2, volatility: 1.6, sector: "Energy" },
]

export default function RiskHeatmap() {
  const getColorClass = (value: number) => {
    if (value > 2) return "bg-emerald-500 dark:bg-emerald-600 text-white"
    if (value > 0.5) return "bg-emerald-400 dark:bg-emerald-500 text-white"
    if (value > -0.5) return "bg-muted dark:bg-muted/80 text-foreground"
    if (value > -2) return "bg-red-400 dark:bg-red-500 text-white"
    return "bg-red-500 dark:bg-red-600 text-white"
  }

  const getVolatilityBadge = (volatility: number) => {
    if (volatility > 1.5) return { label: "High", variant: "destructive" as const }
    if (volatility > 0.8) return { label: "Med", variant: "secondary" as const }
    return { label: "Low", variant: "default" as const }
  }

  const maxAbsValue = Math.max(...mockData.map(d => Math.abs(d.value)))

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Market Heatmap
        </CardTitle>
        <CardDescription>Performance and volatility risk visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500"></div>
              <span className="text-muted-foreground">Strong Gain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted"></div>
              <span className="text-muted-foreground">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-muted-foreground">Strong Loss</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {mockData.map((cell) => {
              const colorClass = getColorClass(cell.value)
              const volatility = getVolatilityBadge(cell.volatility)
              const isPositive = cell.value >= 0
              
              return (
                <div
                  key={cell.symbol}
                  className={`
                    relative group rounded-lg p-3 transition-all duration-300
                    hover:scale-105 hover:shadow-xl cursor-pointer
                    ${colorClass}
                  `}
                  style={{
                    minHeight: `${60 + (Math.abs(cell.value) / maxAbsValue) * 40}px`
                  }}
                >
                  {/* Symbol */}
                  <div className="font-bold text-sm mb-1">{cell.symbol}</div>
                  
                  {/* Change */}
                  <div className="flex items-center gap-1 text-lg font-bold">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {cell.value >= 0 ? "+" : ""}{cell.value.toFixed(1)}%
                  </div>

                  {/* Volatility Badge */}
                  <div className="mt-2">
                    <Badge 
                      variant={volatility.variant}
                      className="text-xs h-5"
                    >
                      Vol: {volatility.label}
                    </Badge>
                  </div>

                  {/* Hover Tooltip */}
                  <div className="
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    transition-opacity duration-200 z-10
                  ">
                    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-xs whitespace-nowrap">
                      <div className="font-semibold text-popover-foreground mb-1">{cell.name}</div>
                      <div className="text-muted-foreground">{cell.sector}</div>
                      <div className="text-muted-foreground mt-1">Volatility: {cell.volatility.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {mockData.filter(d => d.value > 0).length}
              </div>
              <div className="text-xs text-muted-foreground">Gainers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {mockData.filter(d => Math.abs(d.value) < 0.5).length}
              </div>
              <div className="text-xs text-muted-foreground">Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {mockData.filter(d => d.value < 0).length}
              </div>
              <div className="text-xs text-muted-foreground">Losers</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
