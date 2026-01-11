"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, BarChart3, Shield, Brain, Zap, Globe, 
  Check, ArrowRight, Star, Users, LineChart, PieChart,
  Lock, CreditCard, Sparkles, ChevronRight, Play
} from "lucide-react"

interface LandingPageProps {
  onEnterDashboard: () => void
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubscribe = async () => {
    setIsSubscribing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubscribing(false)
    setShowSuccess(true)
    // Store subscription status
    localStorage.setItem('subscribed', 'true')
  }

  const features = [
    {
      icon: LineChart,
      title: "Real-Time Market Data",
      description: "Track MASI index and all major Moroccan stocks with live updates every 30 seconds"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get daily AI briefings, sentiment analysis, and smart investment recommendations"
    },
    {
      icon: Shield,
      title: "Risk Analysis",
      description: "Advanced portfolio risk metrics, scenario analysis, and early warning signals"
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Beautiful charts, heatmaps, and interactive visualizations for better decisions"
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Real-time notifications for price movements, volume spikes, and market events"
    },
    {
      icon: Globe,
      title: "Mobile Optimized",
      description: "Access your dashboard anywhere with our fully responsive mobile experience"
    }
  ]

  const testimonials = [
    {
      name: "Ahmed B.",
      role: "Individual Investor",
      content: "This dashboard transformed how I track the Moroccan market. The AI insights are incredibly valuable!",
      rating: 5
    },
    {
      name: "Sara M.",
      role: "Financial Analyst",
      content: "Finally, a professional tool for Bourse de Casablanca. The risk analysis features are top-notch.",
      rating: 5
    },
    {
      name: "Youssef K.",
      role: "Day Trader",
      content: "Real-time data and beautiful visualizations. Worth every dirham of the subscription.",
      rating: 5
    }
  ]

  const stats = [
    { value: "10+", label: "Stocks Tracked" },
    { value: "24/7", label: "AI Analysis" },
    { value: "30s", label: "Data Refresh" },
    { value: "99.9%", label: "Uptime" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900">CasaFinance</h1>
              <p className="text-xs text-slate-500">Bourse de Casablanca</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:flex">Features</Button>
            <Button variant="ghost" className="hidden sm:flex">Pricing</Button>
            <Button onClick={onEnterDashboard} className="bg-emerald-600 hover:bg-emerald-700">
              Enter Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Market Intelligence
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Master the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Moroccan Stock Market
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Professional-grade analytics, AI insights, and real-time data for the Bourse de Casablanca. 
            Make smarter investment decisions with our comprehensive dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={onEnterDashboard}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 text-lg px-8"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No credit card required • 7-day free trial
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-slate-100 text-slate-700">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for the Moroccan stock market
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              One plan, all features. No hidden fees.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-center">
                <span className="text-white font-semibold">MOST POPULAR</span>
              </div>
              <CardHeader className="text-center pt-8 pb-4">
                <CardTitle className="text-2xl mb-2">Pro Plan</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">$1.99</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <CardDescription className="mt-2">
                  Billed monthly • Cancel anytime
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-4 mb-8">
                  {[
                    "Real-time MASI & stock data",
                    "AI-powered daily briefings",
                    "Advanced risk analysis tools",
                    "Sentiment analysis for all stocks",
                    "Technical indicators (RSI, MACD)",
                    "Scenario analysis simulations",
                    "Mobile-optimized dashboard",
                    "Priority customer support",
                    "Unlimited data access"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {showSuccess ? (
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                      <Check className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="font-semibold text-emerald-700 mb-2">Subscription Activated!</p>
                    <Button 
                      onClick={onEnterDashboard}
                      className="bg-emerald-600 hover:bg-emerald-700 w-full"
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
                    className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25"
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

                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    All Cards Accepted
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-slate-100 text-slate-700">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Loved by Investors
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Moroccan investors using CasaFinance to make smarter decisions.
          </p>
          <Button 
            size="lg" 
            onClick={onEnterDashboard}
            className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl text-lg px-8"
          >
            Get Started Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">CasaFinance</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 CasaFinance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
