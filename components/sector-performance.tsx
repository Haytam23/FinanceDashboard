"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { Layers } from "lucide-react"

const data = [
  { sector: "Banking", value: 2.1 },
  { sector: "Telecom", value: 1.8 },
  { sector: "Materials", value: 0.9 },
  { sector: "Real Estate", value: 0.5 },
  { sector: "Mining", value: -1.8 },
]

const COLORS = {
  positive: "#10b981", // emerald-500
  negative: "#ef4444", // red-500
}

export default function SectorPerformance() {
  const maxValue = Math.max(...data.map(d => Math.abs(d.value)))
  const gainers = data.filter(d => d.value > 0).length
  const losers = data.filter(d => d.value < 0).length

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-primary" />
              Sector Performance
            </CardTitle>
            <CardDescription>Today's sector comparison</CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-muted-foreground">{gainers} Gaining</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-muted-foreground">{losers} Declining</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.4} 
              horizontal={false}
            />
            <XAxis 
              type="number"
              domain={[-maxValue - 0.5, maxValue + 0.5]}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}%`}
            />
            <YAxis 
              type="category"
              dataKey="sector"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <ReferenceLine x={0} stroke="hsl(var(--border))" strokeWidth={1} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgb(0 0 0 / 0.15)",
                padding: "8px 12px",
              }}
              labelStyle={{ 
                color: "hsl(var(--popover-foreground))", 
                fontWeight: 600,
                marginBottom: "4px"
              }}
              formatter={(value: number) => [
                <span key="value" style={{ color: value >= 0 ? COLORS.positive : COLORS.negative, fontWeight: 600 }}>
                  {value >= 0 ? '+' : ''}{value}%
                </span>,
                'Change'
              ]}
              cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
            />
            <Bar 
              dataKey="value" 
              radius={4}
              maxBarSize={28}
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value >= 0 ? COLORS.positive : COLORS.negative}
                  opacity={0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
