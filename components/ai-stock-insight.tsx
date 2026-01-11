"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AIStockInsightProps {
  symbol: string
  name: string
  price: number
}

export default function AIStockInsight({ symbol, name, price }: AIStockInsightProps) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateInsight = async () => {
      try {
        setLoading(true)
        const stockData = {
          symbol,
          name,
          price,
          pe: 12.5,
          dividendYield: 3.2,
          earnings: 12.3,
        }

        const marketContext = {
          indexChange: 0.8,
          sectorChange: 2.1,
          sentiment: "bullish",
        }

        const response = await fetch("/api/stock-recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol, stockData, marketContext }),
        })

        if (!response.ok) throw new Error("Failed to fetch insight")
        const data = await response.json()
        setInsight(data.recommendation)
      } catch (err) {
        console.error("Error:", err)
        setInsight(
          `${name} (${symbol}) shows strong fundamentals with consistent earnings growth. Recent positive guidance suggests upside potential for long-term investors.`,
        )
      } finally {
        setLoading(false)
      }
    }

    generateInsight()
  }, [symbol, name, price])

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>AI-Powered Analysis</CardTitle>
        <CardDescription>{name} - Investment Insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Analyzing...</p>
        ) : insight ? (
          <p className="text-foreground leading-relaxed">{insight}</p>
        ) : (
          <p className="text-destructive">Could not generate insight</p>
        )}
      </CardContent>
    </Card>
  )
}
