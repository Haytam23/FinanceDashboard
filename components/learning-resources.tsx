"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LearningResources() {
  const resources = [
    {
      category: "Market Basics",
      icon: "📚",
      items: [
        { title: "What is a Stock Market?", time: "5 min read" },
        { title: "How to Read Stock Charts", time: "8 min read" },
        { title: "Understanding Market Indices", time: "6 min read" },
      ],
    },
    {
      category: "Risk Management",
      icon: "🛡️",
      items: [
        { title: "Portfolio Diversification 101", time: "10 min read" },
        { title: "Managing Position Size", time: "7 min read" },
        { title: "Stop Loss Strategies", time: "8 min read" },
      ],
    },
    {
      category: "Technical Analysis",
      icon: "📊",
      items: [
        { title: "Support and Resistance Levels", time: "9 min read" },
        { title: "Moving Averages Explained", time: "8 min read" },
        { title: "Volume Analysis Basics", time: "7 min read" },
      ],
    },
    {
      category: "AI & Explanations",
      icon: "🤖",
      items: [
        { title: "How AI Confidence Works", time: "6 min read" },
        { title: "Reading AI Decision Traces", time: "5 min read" },
        { title: "Interpreting Risk Metrics", time: "8 min read" },
      ],
    },
  ]

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Learning Resources</CardTitle>
        <CardDescription>Educational materials to improve your investment knowledge</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((category) => (
            <div key={category.category} className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <span className="text-lg">{category.icon}</span>
                {category.category}
              </h3>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item.title} className="flex items-start gap-2 group cursor-pointer">
                    <span className="text-primary mt-1 group-hover:opacity-70">→</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button className="w-full bg-transparent" variant="outline" size="sm">
            View Full Learning Center
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
