"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, Shield, Brain, 
  Check, ArrowRight, LineChart, PieChart,
  Lock, CreditCard
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200/60 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#4A5568] flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-semibold text-lg text-slate-800">Casablanca Exchange</h1>
              <p className="text-xs text-slate-500">AI-Powered Market Intelligence</p>
            </div>
          </div>
          <Button onClick={onEnterDashboard} className="bg-[#4A5568] hover:bg-[#3D4852] shadow-md">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Market Data
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Master the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A5568] to-[#718096]">
              Moroccan Stock Market
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Professional analytics and AI-powered insights for the Bourse de Casablanca. Make smarter investment decisions.
          </p>
          <Button 
            size="lg" 
            onClick={onEnterDashboard}
            className="bg-[#4A5568] hover:bg-[#3D4852] text-lg px-10 py-6 shadow-xl shadow-slate-300/50"
          >
            Enter Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="text-3xl font-bold text-[#4A5568]">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-12">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-8 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-[#4A5568] flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Simple Pricing
            </h2>
            <p className="text-slate-600">
              One plan, all features included
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
              <div className="bg-[#4A5568] p-4 text-center">
                <span className="text-white font-medium">Pro Plan</span>
              </div>
              <CardHeader className="text-center pt-8 pb-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-slate-800">$1.99</span>
                  <span className="text-slate-500">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-4 mb-8">
                  {[
                    "Real-time market data",
                    "AI-powered briefings",
                    "Risk analysis tools",
                    "Technical indicators",
                    "Mobile dashboard"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#4A5568] flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {showSuccess ? (
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="h-10 w-10 rounded-full bg-[#4A5568] flex items-center justify-center mx-auto mb-3">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <p className="font-medium text-slate-700 mb-3">Subscribed!</p>
                    <Button 
                      onClick={onEnterDashboard}
                      className="bg-[#4A5568] hover:bg-[#3D4852] w-full"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                    size="lg"
                    className="w-full bg-[#4A5568] hover:bg-[#3D4852] shadow-lg"
                  >
                    {isSubscribing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                )}

                <div className="flex items-center justify-center gap-6 mt-5 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secure Payment
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
      <footer className="py-10 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#4A5568] flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-slate-800">Casablanca Exchange</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 Casablanca Exchange. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
