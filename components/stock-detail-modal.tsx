"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, TrendingDown, Activity, BarChart3, PieChart, 
  Target, AlertTriangle, ThumbsUp, ThumbsDown, Minus,
  Calendar, Clock, DollarSign, Percent, ArrowUpRight, ArrowDownRight,
  X, ArrowLeft
} from "lucide-react"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart as RechartsPieChart, Pie, Legend
} from "recharts"

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

interface StockDetailModalProps {
  stock: Stock | null
  open: boolean
  onClose: () => void
}

// Generate mock price history
function generatePriceHistory(basePrice: number, days: number = 30) {
  const data = []
  let price = basePrice * 0.95
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Add some realistic variation
    const change = (Math.random() - 0.48) * (basePrice * 0.02)
    price = Math.max(price + change, basePrice * 0.85)
    price = Math.min(price, basePrice * 1.15)
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 100000) + 50000
    })
  }
  
  // Ensure last price matches current
  if (data.length > 0) {
    data[data.length - 1].price = basePrice
  }
  
  return data
}

// Generate sentiment data
function generateSentimentData(changePercent: number) {
  const basePositive = changePercent > 0 ? 50 + changePercent * 5 : 40 - changePercent * 2
  const positive = Math.min(Math.max(basePositive + (Math.random() * 10 - 5), 20), 80)
  const negative = Math.min(Math.max(30 - changePercent * 3 + (Math.random() * 10 - 5), 10), 60)
  const neutral = 100 - positive - negative
  
  return {
    positive: Math.round(positive),
    negative: Math.round(Math.max(negative, 5)),
    neutral: Math.round(Math.max(neutral, 10)),
    overall: changePercent > 1.5 ? "Bullish" : changePercent < -1.5 ? "Bearish" : "Neutral",
    score: Math.round(50 + changePercent * 8)
  }
}

// Generate technical indicators
function generateTechnicalIndicators(stock: Stock) {
  const rsi = Math.round(50 + stock.changePercent * 5 + (Math.random() * 10 - 5))
  const macd = stock.changePercent > 0 ? "Bullish" : "Bearish"
  const sma20 = stock.price * (1 - stock.changePercent / 100 * 0.5)
  const sma50 = stock.price * (1 - stock.changePercent / 100 * 1.2)
  const ema12 = stock.price * (1 - stock.changePercent / 100 * 0.3)
  
  return {
    rsi: Math.min(Math.max(rsi, 20), 80),
    macd,
    sma20: Math.round(sma20 * 100) / 100,
    sma50: Math.round(sma50 * 100) / 100,
    ema12: Math.round(ema12 * 100) / 100,
    support: Math.round(stock.low * 0.98 * 100) / 100,
    resistance: Math.round(stock.high * 1.02 * 100) / 100,
    volatility: Math.abs(stock.changePercent) > 3 ? "High" : Math.abs(stock.changePercent) > 1.5 ? "Medium" : "Low"
  }
}

export default function StockDetailModal({ stock, open, onClose }: StockDetailModalProps) {
  const [priceHistory, setPriceHistory] = useState<any[]>([])
  const [sentiment, setSentiment] = useState<any>(null)
  const [technicals, setTechnicals] = useState<any>(null)

  useEffect(() => {
    if (stock) {
      setPriceHistory(generatePriceHistory(stock.price))
      setSentiment(generateSentimentData(stock.changePercent))
      setTechnicals(generateTechnicalIndicators(stock))
    }
  }, [stock])

  if (!stock) return null

  const isPositive = stock.change >= 0
  const sentimentColors = {
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#6b7280"
  }

  const pieData = sentiment ? [
    { name: "Bullish", value: sentiment.positive, color: sentimentColors.positive },
    { name: "Bearish", value: sentiment.negative, color: sentimentColors.negative },
    { name: "Neutral", value: sentiment.neutral, color: sentimentColors.neutral },
  ] : []

  const getRSIColor = (rsi: number) => {
    if (rsi >= 70) return "text-red-500"
    if (rsi <= 30) return "text-emerald-500"
    return "text-yellow-500"
  }

  const getRSILabel = (rsi: number) => {
    if (rsi >= 70) return "Overbought"
    if (rsi <= 30) return "Oversold"
    return "Neutral"
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 sm:p-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="mb-3 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Stocks</span>
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{stock.symbol.slice(0, 2)}</span>
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold">{stock.symbol}</DialogTitle>
                <DialogDescription className="text-sm sm:text-base">{stock.name}</DialogDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold">{stock.price.toFixed(2)} MAD</div>
              <div className={`flex items-center justify-end gap-1 text-base sm:text-lg font-semibold ${
                isPositive ? "text-emerald-600" : "text-red-600"
              }`}>
                {isPositive ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">High</div>
              <div className="font-semibold text-emerald-600">{stock.high.toFixed(2)}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Low</div>
              <div className="font-semibold text-red-600">{stock.low.toFixed(2)}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="font-semibold">{(stock.volume / 1000).toFixed(0)}K</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Market Cap</div>
              <div className="font-semibold">{(stock.marketCap / 1e9).toFixed(1)}B</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chart" className="gap-2">
                <Activity className="h-4 w-4" />
                Price Chart
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="gap-2">
                <PieChart className="h-4 w-4" />
                Sentiment
              </TabsTrigger>
              <TabsTrigger value="technical" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Technical
              </TabsTrigger>
            </TabsList>

            {/* Price Chart Tab */}
            <TabsContent value="chart" className="mt-4">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    30-Day Price History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={priceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        domain={['auto', 'auto']}
                        tickFormatter={(v) => v.toFixed(0)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)} MAD`, "Price"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isPositive ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  
                  {/* Volume Chart */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium mb-2 text-muted-foreground">Volume</div>
                    <ResponsiveContainer width="100%" height={80}>
                      <BarChart data={priceHistory}>
                        <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.5} radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sentiment Tab */}
            <TabsContent value="sentiment" className="mt-4 space-y-4">
              {sentiment && (
                <>
                  {/* Overall Sentiment */}
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {sentiment.overall === "Bullish" ? (
                          <ThumbsUp className="h-5 w-5 text-emerald-500" />
                        ) : sentiment.overall === "Bearish" ? (
                          <ThumbsDown className="h-5 w-5 text-red-500" />
                        ) : (
                          <Minus className="h-5 w-5 text-yellow-500" />
                        )}
                        Overall Market Sentiment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-4xl font-bold">{sentiment.score}/100</div>
                          <Badge 
                            variant={sentiment.overall === "Bullish" ? "default" : sentiment.overall === "Bearish" ? "destructive" : "secondary"}
                            className="mt-1"
                          >
                            {sentiment.overall}
                          </Badge>
                        </div>
                        <div className="w-48 h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                formatter={(value) => <span className="text-xs">{value}</span>}
                              />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      {/* Sentiment Bars */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-emerald-600 font-medium">Bullish</span>
                            <span>{sentiment.positive}%</span>
                          </div>
                          <Progress value={sentiment.positive} className="h-2 bg-muted" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-red-600 font-medium">Bearish</span>
                            <span>{sentiment.negative}%</span>
                          </div>
                          <Progress value={sentiment.negative} className="h-2 bg-muted [&>div]:bg-red-500" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 font-medium">Neutral</span>
                            <span>{sentiment.neutral}%</span>
                          </div>
                          <Progress value={sentiment.neutral} className="h-2 bg-muted [&>div]:bg-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Analysis */}
                  <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        AI Analysis Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm leading-relaxed">
                        {stock.changePercent > 2 
                          ? `${stock.name} is showing strong bullish momentum with a ${stock.changePercent.toFixed(2)}% gain today. The positive sentiment suggests continued institutional interest. Consider monitoring for profit-taking opportunities near resistance levels.`
                          : stock.changePercent < -2
                          ? `${stock.name} is under selling pressure with a ${Math.abs(stock.changePercent).toFixed(2)}% decline. Market sentiment has turned cautious. Watch for support levels and potential reversal signals before considering new positions.`
                          : stock.changePercent > 0
                          ? `${stock.name} is trading with mild positive momentum. The balanced sentiment indicates a consolidation phase. This could present accumulation opportunities for long-term investors.`
                          : `${stock.name} is experiencing a minor pullback. Current levels may offer entry points for investors with a longer time horizon. Monitor sector trends for confirmation.`
                        }
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">
                          {stock.sector}
                        </Badge>
                        <Badge variant={isPositive ? "default" : "destructive"}>
                          {isPositive ? "Uptrend" : "Downtrend"}
                        </Badge>
                        <Badge variant="secondary">
                          Vol: {(stock.volume / 1000).toFixed(0)}K
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="mt-4 space-y-4">
              {technicals && (
                <>
                  {/* Key Indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-0 shadow-md">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-2">RSI (14)</div>
                          <div className={`text-4xl font-bold ${getRSIColor(technicals.rsi)}`}>
                            {technicals.rsi}
                          </div>
                          <Badge variant="outline" className="mt-2">
                            {getRSILabel(technicals.rsi)}
                          </Badge>
                        </div>
                        <div className="mt-4">
                          <div className="h-2 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-full relative">
                            <div 
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-800 rounded-full"
                              style={{ left: `${technicals.rsi}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Oversold</span>
                            <span>Overbought</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-2">MACD Signal</div>
                          <div className={`text-4xl font-bold ${technicals.macd === "Bullish" ? "text-emerald-500" : "text-red-500"}`}>
                            {technicals.macd === "Bullish" ? "↑" : "↓"}
                          </div>
                          <Badge variant={technicals.macd === "Bullish" ? "default" : "destructive"} className="mt-2">
                            {technicals.macd}
                          </Badge>
                        </div>
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                          {technicals.macd === "Bullish" 
                            ? "MACD line above signal line" 
                            : "MACD line below signal line"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Moving Averages */}
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Moving Averages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">SMA 20</div>
                            <div className="text-sm text-muted-foreground">20-day Simple MA</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{technicals.sma20.toFixed(2)} MAD</div>
                            <Badge variant={stock.price > technicals.sma20 ? "default" : "destructive"} className="text-xs">
                              {stock.price > technicals.sma20 ? "Above" : "Below"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">SMA 50</div>
                            <div className="text-sm text-muted-foreground">50-day Simple MA</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{technicals.sma50.toFixed(2)} MAD</div>
                            <Badge variant={stock.price > technicals.sma50 ? "default" : "destructive"} className="text-xs">
                              {stock.price > technicals.sma50 ? "Above" : "Below"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">EMA 12</div>
                            <div className="text-sm text-muted-foreground">12-day Exponential MA</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{technicals.ema12.toFixed(2)} MAD</div>
                            <Badge variant={stock.price > technicals.ema12 ? "default" : "destructive"} className="text-xs">
                              {stock.price > technicals.ema12 ? "Above" : "Below"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Support & Resistance */}
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Key Levels
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800/30">
                          <div className="text-xs text-muted-foreground mb-1">Resistance</div>
                          <div className="text-xl font-bold text-red-600">{technicals.resistance.toFixed(2)}</div>
                        </div>
                        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="text-xs text-muted-foreground mb-1">Current</div>
                          <div className="text-xl font-bold text-primary">{stock.price.toFixed(2)}</div>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                          <div className="text-xs text-muted-foreground mb-1">Support</div>
                          <div className="text-xl font-bold text-emerald-600">{technicals.support.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-medium">Volatility</span>
                        <Badge variant={
                          technicals.volatility === "High" ? "destructive" : 
                          technicals.volatility === "Medium" ? "secondary" : "default"
                        }>
                          {technicals.volatility}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
