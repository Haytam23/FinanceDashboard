"use client"

import { Card, CardContent } from "@/components/ui/card"

interface InfoCardProps {
  title: string
  description: string
  icon: string
  color: "primary" | "secondary" | "accent" | "destructive"
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  destructive: "bg-destructive/10 text-destructive",
}

export default function InfoCard({ title, description, icon, color }: InfoCardProps) {
  return (
    <Card className="border border-border">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div
            className={`text-3xl flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
