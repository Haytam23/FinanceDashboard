"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "Day 1", volatility: 12.5 },
  { day: "Day 5", volatility: 14.2 },
  { day: "Day 10", volatility: 16.8 },
  { day: "Day 15", volatility: 15.3 },
  { day: "Day 20", volatility: 17.5 },
  { day: "Day 25", volatility: 18.2 },
  { day: "Day 30", volatility: 18.5 },
]

export default function VolatilityTrend() {
  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--color-secondary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--color-secondary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
          <XAxis dataKey="day" stroke="hsl(var(--color-muted-foreground))" />
          <YAxis stroke="hsl(var(--color-muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--color-card))",
              border: "1px solid hsl(var(--color-border))",
              borderRadius: "var(--radius)",
            }}
            labelStyle={{ color: "hsl(var(--color-foreground))" }}
            formatter={(value) => `${value}%`}
          />
          <Area
            type="monotone"
            dataKey="volatility"
            stroke="hsl(var(--color-secondary))"
            fillOpacity={1}
            fill="url(#colorVol)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current</p>
          <p className="text-lg font-bold text-foreground">18.5</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">30-Day Avg</p>
          <p className="text-lg font-bold text-foreground">15.9</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Trend</p>
          <p className="text-lg font-bold text-warning">Rising</p>
        </div>
      </div>
    </div>
  )
}
