"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const scenarios = [
  {
    id: "bull",
    name: "Bull Market +10%",
    description: "Market surge driven by strong GDP growth",
    probability: "25%",
    portfolioImpact: "+8.2%",
    stocks: [
      { symbol: "BNMA", impact: "+12%" },
      { symbol: "ITISSF", impact: "+11%" },
      { symbol: "CIMR", impact: "+9%" },
    ],
    color: "success",
  },
  {
    id: "base",
    name: "Base Case Stable",
    description: "Current trend continues with normal volatility",
    probability: "50%",
    portfolioImpact: "+1.5%",
    stocks: [
      { symbol: "BNMA", impact: "+2%" },
      { symbol: "MRSW", impact: "+1%" },
      { symbol: "CIMR", impact: "+1.5%" },
    ],
    color: "warning",
  },
  {
    id: "bear",
    name: "Bear Market -10%",
    description: "Downturn from global economic slowdown",
    probability: "25%",
    portfolioImpact: "-6.8%",
    stocks: [
      { symbol: "ATLGOLD", impact: "-15%" },
      { symbol: "CIMR", impact: "-8%" },
      { symbol: "MRSW", impact: "-5%" },
    ],
    color: "danger",
  },
]

export default function ScenarioAnalysis() {
  return (
    <Tabs defaultValue="bull" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="bull">Bull (+10%)</TabsTrigger>
        <TabsTrigger value="base">Base Case</TabsTrigger>
        <TabsTrigger value="bear">Bear (-10%)</TabsTrigger>
      </TabsList>

      {scenarios.map((scenario) => (
        <TabsContent key={scenario.id} value={scenario.id} className="mt-4 space-y-4">
          <div className={`p-4 rounded-lg bg-${scenario.color}/10 border border-${scenario.color}/20`}>
            <p className="font-semibold text-foreground mb-1">{scenario.name}</p>
            <p className="text-xs text-foreground/80 mb-3">{scenario.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Probability</p>
                <p className="text-lg font-bold text-foreground">{scenario.probability}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Portfolio Impact</p>
                <p
                  className={`text-lg font-bold ${scenario.color === "success" ? "text-success" : scenario.color === "danger" ? "text-danger" : "text-warning"}`}
                >
                  {scenario.portfolioImpact}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Impact on Holdings</p>
            {scenario.stocks.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <span className="font-medium text-foreground text-sm">{stock.symbol}</span>
                <span className={`text-sm font-bold ${stock.impact.startsWith("+") ? "text-success" : "text-danger"}`}>
                  {stock.impact}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
