"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

export default function FinanceGlossary() {
  const [searchTerm, setSearchTerm] = useState("")

  const glossaryTerms = [
    {
      term: "Bull Market",
      definition: "A market condition characterized by rising prices and investor optimism",
      example: "MASI up 15% over 3 months signals a bull market",
    },
    {
      term: "Bear Market",
      definition: "A market condition with falling prices and pessimistic investor sentiment",
      example: "20% decline from recent highs is considered a bear market",
    },
    {
      term: "Volatility",
      definition: "The degree of price fluctuation - higher volatility means larger price swings",
      example: "A stock moving 5% daily has high volatility vs one moving 0.5%",
    },
    {
      term: "Diversification",
      definition: "Spreading investments across different assets to reduce risk",
      example: "Owning both banking and telecom stocks reduces sector-specific risk",
    },
    {
      term: "Correlation",
      definition: "How two assets move together - correlation of 1.0 means perfect sync",
      example: "Banking and telecom stocks often have low correlation (0.3-0.5)",
    },
    {
      term: "Liquidity",
      definition: "How easily an asset can be bought or sold without moving the price",
      example: "BNMA stock is highly liquid with millions of shares traded daily",
    },
    {
      term: "Value at Risk (VaR)",
      definition: "Maximum expected loss with a given probability (usually 95%)",
      example: "VaR of 2.8% means 95% chance daily loss won't exceed 2.8%",
    },
    {
      term: "Sharpe Ratio",
      definition: "Risk-adjusted return metric - higher is better",
      example: "A Sharpe of 1.5 means 1.5% excess return per unit of risk",
    },
    {
      term: "Drawdown",
      definition: "Peak-to-trough decline during a downtrend",
      example: "Max drawdown of -12% means largest loss from peak was 12%",
    },
    {
      term: "Confidence Score",
      definition: "AI's certainty level in a recommendation (0-100%)",
      example: "80% confidence means strong signal with consistent supporting data",
    },
  ]

  const filteredTerms = useMemo(
    () =>
      glossaryTerms.filter(
        (item) =>
          item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.definition.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  )

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Finance Glossary</CardTitle>
        <CardDescription>Learn key investment and financial terms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search glossary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item) => (
              <div key={item.term} className="border-l-2 border-primary/30 pl-3 py-2">
                <p className="font-semibold text-sm text-foreground">{item.term}</p>
                <p className="text-xs text-foreground/80 mt-1">{item.definition}</p>
                <p className="text-xs text-muted-foreground mt-1 italic">Example: {item.example}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground py-4 text-center">No terms found</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
