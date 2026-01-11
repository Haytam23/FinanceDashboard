"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RiskHeatmap() {
  const stocks = ["BNMA", "MRSW", "ONMT", "CIMR", "ITISSF", "ATLGOLD"]
  const sectors = ["Banking", "Telecom", "Materials", "Mining"]

  const heatmapData = [
    [1, 3, 2, 4], // BNMA
    [2, 2, 3, 4], // MRSW
    [2, 3, 2, 4], // ONMT
    [3, 2, 1, 3], // CIMR
    [1, 2, 2, 4], // ITISSF
    [4, 3, 2, 1], // ATLGOLD
  ]

  const getRiskColor = (value: number) => {
    switch (value) {
      case 1:
        return "bg-success/80"
      case 2:
        return "bg-warning/80"
      case 3:
        return "bg-orange-500/80"
      case 4:
        return "bg-danger/80"
      default:
        return "bg-muted"
    }
  }

  const getRiskLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Low Risk"
      case 2:
        return "Moderate Risk"
      case 3:
        return "High Risk"
      case 4:
        return "Very High Risk"
      default:
        return "Unknown"
    }
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Risk Heatmap: Stocks vs Sectors</CardTitle>
        <CardDescription>Color-coded risk levels for portfolio analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header */}
            <div className="flex gap-2">
              <div className="w-16 flex-shrink-0"></div>
              {sectors.map((sector) => (
                <div key={sector} className="w-20 text-xs font-semibold text-center text-muted-foreground">
                  {sector}
                </div>
              ))}
            </div>

            {/* Rows */}
            {stocks.map((stock, stockIdx) => (
              <div key={stock} className="flex gap-2 mt-2">
                <div className="w-16 flex-shrink-0 text-xs font-semibold text-foreground">{stock}</div>
                {heatmapData[stockIdx].map((risk, sectorIdx) => (
                  <TooltipProvider key={`${stock}-${sectorIdx}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-20 h-10 rounded cursor-pointer transition-opacity hover:opacity-80 flex items-center justify-center text-xs font-bold text-white ${getRiskColor(risk)}`}
                        >
                          {risk}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {stock} in {sectors[sectorIdx]}: {getRiskLabel(risk)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs font-semibold text-foreground mb-3">Risk Scale</p>
          <div className="grid grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/80"></div>
              <span className="text-xs text-muted-foreground">1 = Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning/80"></div>
              <span className="text-xs text-muted-foreground">2 = Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500/80"></div>
              <span className="text-xs text-muted-foreground">3 = High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-danger/80"></div>
              <span className="text-xs text-muted-foreground">4 = Very High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
