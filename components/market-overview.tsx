"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MarketRegime from "./market-regime"
import AIBriefing from "./ai-briefing"
import MarketIndexChart from "./market-index-chart"
import SectorPerformance from "./sector-performance"

interface MarketOverviewProps {
  riskProfile: "conservative" | "balanced" | "aggressive"
}

export default function MarketOverview({ riskProfile }: MarketOverviewProps) {
  const [regime] = useState<"bull" | "bear" | "sideways" | "volatile">("bull")

  const indices = [
    {
      name: "MASI",
      value: "12,450",
      change: "+0.8%",
      trend: "up",
      description: "Main Index (Moroccan All Shares Index)",
    },
    {
      name: "MADEX",
      value: "8,230",
      change: "+1.2%",
      trend: "up",
      description: "Liquid stocks index",
    },
    {
      name: "Market Sentiment",
      value: "Bullish",
      change: "+2.1%",
      trend: "up",
      description: "Overall investor confidence",
    },
    {
      name: "Trading Volume",
      value: "High",
      change: "+15%",
      trend: "up",
      description: "Activity level vs average",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Regime Detection Card */}
      <MarketRegime regime={regime} confidence={78} />

      {/* AI Market Briefing */}
      <AIBriefing />

      {/* Key Indices */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Market Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((index) => (
            <Card key={index.name} className="border border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{index.name}</p>
                <p className="text-2xl font-bold text-foreground">{index.value}</p>
                <p className={`text-sm font-medium mt-2 ${index.trend === "up" ? "text-success" : "text-danger"}`}>
                  {index.change}
                </p>
                <p className="text-xs text-muted-foreground mt-2">{index.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border">
          <CardHeader>
            <CardTitle>MASI Index - 30 Day Trend</CardTitle>
            <CardDescription>Historical price movement with technical levels</CardDescription>
          </CardHeader>
          <CardContent>
            <MarketIndexChart />
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Sector Performance</CardTitle>
            <CardDescription>Today's sector breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <SectorPerformance />
          </CardContent>
        </Card>
      </div>

      {/* Additional Market Insights */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Market Insights & Analysis</CardTitle>
          <CardDescription>Additional market context based on your risk profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="concentration" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="concentration">Market Concentration</TabsTrigger>
              <TabsTrigger value="liquidity">Liquidity Analysis</TabsTrigger>
              <TabsTrigger value="correlation">Sector Rotation</TabsTrigger>
            </TabsList>

            <TabsContent value="concentration" className="space-y-4 mt-4">
              <div className="space-y-3">
                <p className="text-sm text-foreground/80">
                  The top 5 companies represent 42% of total market capitalization. This concentration level is
                  moderate.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Concentration Risk</span>
                    <span className="font-semibold">Moderate</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning rounded-full h-2 w-1/2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="liquidity" className="space-y-4 mt-4">
              <div className="space-y-3">
                <p className="text-sm text-foreground/80">
                  Trading volume is 15% above average today. Most stocks have adequate liquidity for entry/exit.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Liquidity Level</span>
                    <span className="font-semibold">High</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success rounded-full h-2 w-4/5" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="correlation" className="space-y-4 mt-4">
              <div className="space-y-3">
                <p className="text-sm text-foreground/80">
                  Banking sector is leading. Capital rotating from Energy to Tech indicates growth sentiment.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-lg">→</span>
                    <span>Banking +2.1% (strength continues)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">↗️</span>
                    <span>Tech +1.8% (gaining momentum)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">↘️</span>
                    <span>Energy -1.2% (weakness signals)</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
