"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Clock } from "lucide-react"
import AIBriefing from "./ai-briefing"
import MarketIndexChart from "./market-index-chart"
import SectorPerformance from "./sector-performance"
import MarketHeatmap from "./market-heatmap"

interface DashboardOverviewProps {
  riskProfile: "conservative" | "balanced" | "aggressive"
}

export default function DashboardOverview({ riskProfile }: DashboardOverviewProps) {
  const [marketData, setMarketData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/market')
        const data = await res.json()
        setMarketData(data)
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const kpis = [
    {
      title: "MASI Index",
      value: marketData?.indices?.masi?.toFixed(2) || "13,245.67",
      change: marketData?.indices?.masi_change?.toFixed(2) || "+1.25",
      changePercent: ((marketData?.indices?.masi_change || 0) / (marketData?.indices?.masi || 13245) * 100).toFixed(2) || "+0.95",
      icon: TrendingUp,
      trend: (marketData?.indices?.masi_change || 0) >= 0 ? "up" : "down",
      color: (marketData?.indices?.masi_change || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
      bgColor: (marketData?.indices?.masi_change || 0) >= 0 ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30",
    },
    {
      title: "MADEX Index",
      value: marketData?.indices?.madex?.toFixed(2) || "10,789.23",
      change: marketData?.indices?.madex_change?.toFixed(2) || "+0.87",
      changePercent: ((marketData?.indices?.madex_change || 0) / (marketData?.indices?.madex || 10789) * 100).toFixed(2) || "+0.81",
      icon: BarChart3,
      trend: (marketData?.indices?.madex_change || 0) >= 0 ? "up" : "down",
      color: (marketData?.indices?.madex_change || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
      bgColor: (marketData?.indices?.madex_change || 0) >= 0 ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30",
    },
    {
      title: "Trading Volume",
      value: marketData?.indices?.masi_volume ? `${(marketData.indices.masi_volume / 1000000).toFixed(2)}M` : "2.45M",
      change: "+15%",
      changePercent: "+15.00",
      icon: Activity,
      trend: "up",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Market Status",
      value: marketData?.indices?.market_status || "OPEN",
      change: currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      changePercent: "",
      icon: Clock,
      trend: "neutral",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${kpi.bgColor}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              {kpi.changePercent && (
                <div className="flex items-center gap-1 mt-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : kpi.trend === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : null}
                  <span className={`text-xs font-medium ${kpi.color}`}>
                    {kpi.changePercent}% ({kpi.change})
                  </span>
                </div>
              )}
              {!kpi.changePercent && (
                <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <MarketIndexChart />
          <SectorPerformance />
          <MarketHeatmap />
        </div>

        {/* AI Briefing - Takes 1 column */}
        <div className="lg:col-span-1">
          <AIBriefing />
        </div>
      </div>

      {/* Stocks Preview */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Top Movers
          </CardTitle>
          <CardDescription>Best and worst performing stocks today</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="gainers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
              <TabsTrigger value="losers">Top Losers</TabsTrigger>
            </TabsList>
            <TabsContent value="gainers" className="space-y-2">
              {(marketData?.stocks || []).slice(0, 5).filter((s: any) => s.change_percent > 0).map((stock: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30">
                  <div>
                    <p className="font-semibold text-foreground">{stock.symbol}</p>
                    <p className="text-xs text-muted-foreground">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{stock.price?.toFixed(2)} MAD</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                      <TrendingUp className="h-3 w-3" />
                      +{stock.change_percent?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="losers" className="space-y-2">
              {(marketData?.stocks || []).slice(0, 5).filter((s: any) => s.change_percent < 0).map((stock: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30">
                  <div>
                    <p className="font-semibold text-foreground">{stock.symbol}</p>
                    <p className="text-xs text-muted-foreground">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{stock.price?.toFixed(2)} MAD</p>
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 justify-end">
                      <TrendingDown className="h-3 w-3" />
                      {stock.change_percent?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
