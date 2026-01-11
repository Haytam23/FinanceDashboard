"use client"

import { Card, CardContent } from "@/components/ui/card"

interface QuickStatsProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: string
}

export default function QuickStats({ title, value, change, isPositive, icon }: QuickStatsProps) {
  return (
    <Card className="border border-border hover:border-primary/50 transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
            <p className={`text-sm font-medium ${isPositive ? "text-accent" : "text-destructive"}`}>{change}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  )
}
