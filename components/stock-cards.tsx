"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StockCard from "./stock-card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface StockCardsProps {
  riskProfile: "conservative" | "balanced" | "aggressive"
}

export default function StockCards({ riskProfile }: StockCardsProps) {
  const [expandedStocks, setExpandedStocks] = useState<string[]>([])

  const stocks = [
    {
      symbol: "BNMA",
      company: "Banque Marocaine de l'Afrique",
      sector: "Banking",
      price: "245.50",
      change: "+2.1%",
      trend: "up",
      volatility: "Low",
      recommendation: "buy",
      confidence: 87,
      riskLabel: "Safe",
      reasoning: [
        "Price trend is up - crossed 20-day average",
        "Volume is high - strong buying activity",
        "Market sentiment is positive",
        "Banking sector is leading today",
      ],
      technicalScore: 8,
      fundamentalScore: 8,
      sentimentScore: 7,
    },
    {
      symbol: "MRSW",
      company: "Maroc Telecom",
      sector: "Telecom",
      price: "89.30",
      change: "+1.8%",
      trend: "up",
      volatility: "Medium",
      recommendation: "hold",
      confidence: 72,
      riskLabel: "Moderate",
      reasoning: [
        "Price trending sideways at resistance level",
        "Volume declining - consolidation phase",
        "Earnings report coming next week",
        "Defensive sector holding up well",
      ],
      technicalScore: 6,
      fundamentalScore: 7,
      sentimentScore: 6,
    },
    {
      symbol: "ONMT",
      company: "Onatel Morocco",
      sector: "Telecom",
      price: "156.75",
      change: "-0.5%",
      trend: "down",
      volatility: "Medium",
      recommendation: "avoid",
      confidence: 65,
      riskLabel: "Moderate",
      reasoning: [
        "Price breaking below support levels",
        "Volume is low - weak participation",
        "Sector rotation away from defensive",
        "News about competitive pressure",
      ],
      technicalScore: 4,
      fundamentalScore: 5,
      sentimentScore: 4,
    },
    {
      symbol: "CIMR",
      company: "Ciment du Maroc",
      sector: "Materials",
      price: "876.20",
      change: "+0.9%",
      trend: "up",
      volatility: "Medium",
      recommendation: "buy",
      confidence: 79,
      riskLabel: "Moderate",
      reasoning: [
        "Construction sector benefiting from government projects",
        "Strong volume confirms uptrend",
        "Fundamentals improving",
        "Cyclical recovery in progress",
      ],
      technicalScore: 7,
      fundamentalScore: 7,
      sentimentScore: 7,
    },
    {
      symbol: "ITISSF",
      company: "Itissalat Al-Maghrib",
      sector: "Telecom",
      price: "134.50",
      change: "+2.3%",
      trend: "up",
      volatility: "Low",
      recommendation: "buy",
      confidence: 84,
      riskLabel: "Safe",
      reasoning: [
        "Strong uptrend with accelerating momentum",
        "5G rollout driving future growth",
        "Stable cash flows and dividends",
        "Regional growth opportunities",
      ],
      technicalScore: 8,
      fundamentalScore: 8,
      sentimentScore: 8,
    },
    {
      symbol: "ATLASGOLD",
      company: "Atlas Gold Resources",
      sector: "Mining",
      price: "45.20",
      change: "-1.8%",
      trend: "down",
      volatility: "High",
      recommendation: "avoid",
      confidence: 82,
      riskLabel: "Risky",
      reasoning: [
        "Gold prices under pressure from strong dollar",
        "Production issues reported in Q2",
        "High volatility unsuitable for conservative investors",
        "Wait for stabilization signals",
      ],
      technicalScore: 3,
      fundamentalScore: 4,
      sentimentScore: 3,
    },
  ]

  const toggleExpanded = (symbol: string) => {
    setExpandedStocks((prev) => (prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]))
  }

  // Filter stocks based on risk profile
  const filteredStocks = stocks.filter((stock) => {
    if (riskProfile === "conservative") {
      return stock.riskLabel === "Safe"
    }
    if (riskProfile === "aggressive") {
      return true
    }
    // balanced
    return stock.riskLabel !== "Risky"
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Stock Analysis</h1>
        <p className="text-muted-foreground">AI-powered recommendations tailored to your {riskProfile} risk profile</p>
      </div>

      {/* Filters & View Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Stocks ({stocks.length})</TabsTrigger>
          <TabsTrigger value="recommended">
            Recommended ({stocks.filter((s) => s.recommendation === "buy").length})
          </TabsTrigger>
          <TabsTrigger value="high-conf">
            High Confidence ({stocks.filter((s) => s.confidence >= 80).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map((stock) => (
              <Collapsible key={stock.symbol} open={expandedStocks.includes(stock.symbol)}>
                <CollapsibleTrigger asChild onClick={() => toggleExpanded(stock.symbol)}>
                  <div className="cursor-pointer">
                    <StockCard stock={stock} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <Card className="bg-muted/50 border border-border p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">AI Decision Reasoning</h4>
                        <ul className="space-y-2">
                          {stock.reasoning.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                              <span className="text-lg">→</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Signal Breakdown</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Technical</p>
                            <div className="flex items-end gap-1">
                              {Array(10)
                                .fill(0)
                                .map((_, i) => (
                                  <div
                                    key={i}
                                    className={`flex-1 rounded-sm ${
                                      i < stock.technicalScore ? "bg-success" : "bg-muted"
                                    }`}
                                    style={{ height: `${(i + 1) * 4}px` }}
                                  />
                                ))}
                            </div>
                            <p className="text-xs font-semibold mt-1">{stock.technicalScore}/10</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Fundamental</p>
                            <div className="flex items-end gap-1">
                              {Array(10)
                                .fill(0)
                                .map((_, i) => (
                                  <div
                                    key={i}
                                    className={`flex-1 rounded-sm ${
                                      i < stock.fundamentalScore ? "bg-success" : "bg-muted"
                                    }`}
                                    style={{ height: `${(i + 1) * 4}px` }}
                                  />
                                ))}
                            </div>
                            <p className="text-xs font-semibold mt-1">{stock.fundamentalScore}/10</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                            <div className="flex items-end gap-1">
                              {Array(10)
                                .fill(0)
                                .map((_, i) => (
                                  <div
                                    key={i}
                                    className={`flex-1 rounded-sm ${
                                      i < stock.sentimentScore ? "bg-success" : "bg-muted"
                                    }`}
                                    style={{ height: `${(i + 1) * 4}px` }}
                                  />
                                ))}
                            </div>
                            <p className="text-xs font-semibold mt-1">{stock.sentimentScore}/10</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks
              .filter((s) => s.recommendation === "buy")
              .map((stock) => (
                <Collapsible key={stock.symbol} open={expandedStocks.includes(stock.symbol)}>
                  <CollapsibleTrigger asChild onClick={() => toggleExpanded(stock.symbol)}>
                    <div className="cursor-pointer">
                      <StockCard stock={stock} />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <Card className="bg-muted/50 border border-border p-4">
                      <div className="space-y-2">
                        {stock.reasoning.map((reason, idx) => (
                          <div key={idx} className="text-sm text-foreground/80">
                            → {reason}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="high-conf" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks
              .filter((s) => s.confidence >= 80)
              .map((stock) => (
                <Collapsible key={stock.symbol} open={expandedStocks.includes(stock.symbol)}>
                  <CollapsibleTrigger asChild onClick={() => toggleExpanded(stock.symbol)}>
                    <div className="cursor-pointer">
                      <StockCard stock={stock} />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <Card className="bg-muted/50 border border-border p-4">
                      <div className="space-y-2">
                        {stock.reasoning.map((reason, idx) => (
                          <div key={idx} className="text-sm text-foreground/80">
                            → {reason}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Portfolio Suggestion */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle>Suggested Portfolio Allocation</CardTitle>
          <CardDescription>Educational example based on current market regime and your risk profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground/80">
            Based on the current bull market and your {riskProfile} risk profile, a diversified portfolio might look
            like:
          </p>
          <div className="space-y-3">
            {[
              { sector: "Banking", allocation: 35, stocks: "BNMA, BNPA" },
              { sector: "Telecom", allocation: 30, stocks: "ITISSF, MRSW" },
              { sector: "Materials", allocation: 20, stocks: "CIMR" },
              { sector: "Cash/Bonds", allocation: 15, stocks: "For stability" },
            ].map((item) => (
              <div key={item.sector}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{item.sector}</span>
                  <span className="text-muted-foreground text-xs">{item.stocks}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary rounded-full h-2.5" style={{ width: `${item.allocation}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.allocation}%</p>
              </div>
            ))}
          </div>
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mt-4">
            <p className="text-xs text-foreground/80">
              <strong>Disclaimer:</strong> This is educational guidance only, not financial advice. Past performance
              does not guarantee future results. Consult a financial advisor before investing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
