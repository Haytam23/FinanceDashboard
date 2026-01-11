"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Low Risk (Safe)", value: 35 },
  { name: "Moderate Risk", value: 45 },
  { name: "High Risk", value: 20 },
]

const COLORS = ["hsl(var(--color-success))", "hsl(var(--color-warning))", "hsl(var(--color-danger))"]

export default function RiskProfileChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--color-card))",
            border: "1px solid hsl(var(--color-border))",
            borderRadius: "var(--radius)",
          }}
          labelStyle={{ color: "hsl(var(--color-foreground))" }}
          formatter={(value) => `${value}%`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
