"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, TrendingDown, AlertTriangle, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import StockDetailModal from "./stock-detail-modal"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  marketCap: number
  sector: string
}

export default function StockAnalysis() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchStocks()
  }, [])

  const getMockStocks = (): Stock[] => [
    { symbol: "ATW", name: "Attijariwafa Bank", price: 489.50, change: 12.30, changePercent: 2.58, volume: 145678, high: 491.00, low: 475.50, marketCap: 45678900000, sector: "Banking" },
    { symbol: "BCP", name: "Banque Centrale Populaire", price: 285.75, change: -3.25, changePercent: -1.13, volume: 98234, high: 290.50, low: 284.00, marketCap: 28900000000, sector: "Banking" },
    { symbol: "IAM", name: "Maroc Telecom", price: 128.40, change: 1.90, changePercent: 1.50, volume: 234567, high: 129.00, low: 126.00, marketCap: 38500000000, sector: "Telecommunications" },
    { symbol: "LHM", name: "LafargeHolcim Maroc", price: 1890.00, change: 15.00, changePercent: 0.80, volume: 12345, high: 1895.00, low: 1870.00, marketCap: 15600000000, sector: "Materials" },
    { symbol: "ADH", name: "Douja Prom Addoha", price: 12.45, change: -0.35, changePercent: -2.73, volume: 456789, high: 12.90, low: 12.30, marketCap: 4500000000, sector: "Real Estate" },
    { symbol: "MNG", name: "Managem", price: 1456.00, change: 45.00, changePercent: 3.19, volume: 23456, high: 1460.00, low: 1410.00, marketCap: 12300000000, sector: "Mining" },
    { symbol: "CDM", name: "Credit du Maroc", price: 612.50, change: -8.50, changePercent: -1.37, volume: 34567, high: 625.00, low: 610.00, marketCap: 8900000000, sector: "Banking" },
    { symbol: "CIH", name: "CIH Bank", price: 345.00, change: 5.50, changePercent: 1.62, volume: 45678, high: 348.00, low: 340.00, marketCap: 6700000000, sector: "Banking" }
  ]

  const fetchStocks = async () => {
    try {
      const response = await fetch("/api/market")
      const data = await response.json()
      
      if (data.stocks && data.stocks.length > 0) {
        const formattedStocks = data.stocks.map((stock: any) => ({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.change_percent,
          volume: stock.volume,
          high: stock.high,
          low: stock.low,
          marketCap: stock.market_cap,
          sector: stock.sector
        }))
        setStocks(formattedStocks)
      } else {
        setStocks(getMockStocks())
      }
    } catch (error) {
      console.error("Failed to fetch stocks:", error)
      setStocks(getMockStocks())
    } finally {
      setLoading(false)
    }
  }

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSector = sectorFilter === "all" || stock.sector === sectorFilter
    return matchesSearch && matchesSector
  })

  const sectors = ["all", ...Array.from(new Set(stocks.map(s => s.sector)))]

  const getRiskLevel = (changePercent: number) => {
    const absChange = Math.abs(changePercent)
    if (absChange > 5) return { level: "High", color: "destructive" }
    if (absChange > 2) return { level: "Medium", color: "secondary" }
    return { level: "Low", color: "default" }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur">
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading stocks...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Stock Analysis
        </CardTitle>
        <CardDescription>Detailed stock performance and risk analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map(sector => (
                <SelectItem key={sector} value={sector}>
                  {sector === "all" ? "All Sectors" : sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stock Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStocks.map((stock) => {
            const isPositive = stock.change >= 0
            const risk = getRiskLevel(stock.changePercent)
            
            return (
              <Card 
                key={stock.symbol} 
                className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card/50 to-card hover:from-primary/5 hover:to-secondary/5 cursor-pointer"
                onClick={() => {
                  setSelectedStock(stock)
                  setModalOpen(true)
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                      <CardDescription className="text-xs">{stock.name}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {stock.sector}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Price */}
                  <div>
                    <div className="text-2xl font-bold">
                      {stock.price.toFixed(2)} MAD
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                    <div>
                      <div className="text-xs text-muted-foreground">High</div>
                      <div className="text-sm font-medium">{stock.high.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Low</div>
                      <div className="text-sm font-medium">{stock.low.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Volume</div>
                      <div className="text-sm font-medium">{(stock.volume / 1000000).toFixed(2)}M</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Risk</div>
                      <Badge variant={risk.color as any} className="text-xs h-5">
                        {risk.level}
                      </Badge>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      AI Insight
                    </div>
                    <p className="text-xs leading-relaxed">
                      {stock.changePercent > 3 
                        ? "Strong upward momentum. Consider taking profits."
                        : stock.changePercent < -3
                        ? "Significant decline. Monitor closely before entry."
                        : stock.changePercent > 0
                        ? "Positive movement. Potential accumulation zone."
                        : "Slight pullback. Good entry for long-term positions."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No stocks found matching your criteria</p>
          </div>
        )}
      </CardContent>

      {/* Stock Detail Modal */}
      <StockDetailModal 
        stock={selectedStock}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedStock(null)
        }}
      />
    </Card>
  )
}
