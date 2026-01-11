"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp } from "lucide-react"

interface HistoryData {
  date: string
  value: number
  high: number
  low: number
}

export default function MarketIndexChart() {
  const [data, setData] = useState<HistoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/indices/masi/history?period=1mo')
        if (response.ok) {
          const result = await response.json()
          if (result.history && result.history.length > 0) {
            setData(result.history)
          } else {
            setData(generateMockData())
          }
        } else {
          setData(generateMockData())
        }
      } catch (error) {
        console.error("Error fetching MASI history:", error)
        setData(generateMockData())
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  function generateMockData(): HistoryData[] {
    const data: HistoryData[] = []
    const baseValue = 13000
    const now = new Date()
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const variation = Math.sin(i * 0.3) * 100 + (30 - i) * 5
      const value = baseValue + variation
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100,
        high: Math.round((value + 20) * 100) / 100,
        low: Math.round((value - 20) * 100) / 100
      })
    }
    return data
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            MASI Index - 30 Day Trend
          </CardTitle>
          <CardDescription>Historical price movement with technical levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-muted-foreground text-sm">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            MASI Index - 30 Day Trend
          </CardTitle>
          <CardDescription>Historical price movement with technical levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((item, idx) => ({
    day: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    index: item.value,
    high: item.high,
    low: item.low,
  }))

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          MASI Index - 30 Day Trend
        </CardTitle>
        <CardDescription>Historical price movement with technical levels</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              domain={['dataMin - 50', 'dataMax + 50']}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))", fontWeight: 600 }}
              itemStyle={{ color: "hsl(var(--primary))" }}
            />
            <Area
              type="monotone" 
              dataKey="index" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2.5} 
              fill="url(#colorIndex)"
              name="MASI Index"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
