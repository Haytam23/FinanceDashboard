"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StockDetailViewProps {
  symbol: string
  name: string
}

const priceHistory = [
  { date: "Mon", price: 630, volume: 2200000 },
  { date: "Tue", price: 635, volume: 2400000 },
  { date: "Wed", price: 640, volume: 2100000 },
  { date: "Thu", price: 645, volume: 2800000 },
  { date: "Fri", price: 648, volume: 2600000 },
  { date: "Mon", price: 645, volume: 2300000 },
  { date: "Tue", price: 650, volume: 2500000 },
  { date: "Wed", price: 652, volume: 2200000 },
]

export default function StockDetailView({ symbol, name }: StockDetailViewProps) {
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Price History - {symbol}</CardTitle>
        <CardDescription>Weekly price movement and trading volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={priceHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" />
            <YAxis stroke="hsl(var(--color-muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--color-foreground))" }}
              formatter={(value) => `${value} DH`}
            />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--color-primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
