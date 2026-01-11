"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, Shield, Brain, Zap, 
  Check, ArrowRight, Star, LineChart, PieChart,
  Lock, CreditCard, ChevronRight
} from "lucide-react"

interface LandingPageProps {
  onEnterDashboard: () => void
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubscribe = async () => {
    setIsSubscribing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubscribing(false)
    setShowSuccess(true)
    localStorage.setItem('subscribed', 'true')
  }

  const features = [
    {
      icon: LineChart,
      title: "Real-Time Data",
      description: "Live MASI index and stock updates"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Smart analysis and recommendations"
    },
    {
      icon: Shield,
      title: "Risk Analysis",
      description: "Portfolio metrics and alerts"
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Charts and heatmaps"
    }
  ]

  const stats = [
    { value: "10+", label: "Stocks" },
    { value: "24/7", label: "AI Analysis" },
    { value: "30s", label: "Refresh" },
    { value: "99.9%", label: "Uptime" }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={onEnterDashboard}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-semibold text-lg text-slate-900">Casablanca Exchange</h1>
              <p className="text-xs text-slate-500">AI-Powered Market Intelligence</p>
            </div>
          </button>
          <Button onClick={onEnterDashboard} className="bg-blue-600 hover:bg-blue-700">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Master the{" "}
            <span className="text-blue-600">
              Moroccan Stock Market
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
            Professional analytics and AI insights for the Bourse de Casablanca.
          </p>
          <Button 
            size="lg" 
            onClick={onEnterDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
          >
            Enter Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-4 gap-4 max-w-lg mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Simple Pricing
            </h2>
            <p className="text-slate-600">
              One plan, all features
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            <Card className="border border-blue-200 shadow-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl mb-2">Pro Plan</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">$1.99</span>
                  <span className="text-slate-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {[
                    "Real-time market data",
                    "AI-powered briefings",
                    "Risk analysis tools",
                    "Technical indicators",
                    "Mobile dashboard"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {showSuccess ? (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Check className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-blue-700 mb-3">Subscribed!</p>
                    <Button 
                      onClick={onEnterDashboard}
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubscribing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Subscribe
                      </>
                    )}
                  </Button>
                )}

                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secure
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    All Cards
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button 
              onClick={onEnterDashboard}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">Casablanca Exchange</span>
            </button>
            <p className="text-sm text-slate-500">
              © 2026 Casablanca Exchange. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
