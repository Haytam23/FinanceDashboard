"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, TrendingDown, AlertTriangle, Activity, 
  Target, Zap, BarChart3, PieChart, LineChart,
  CheckCircle2, Info, Gauge, Layers, GitBranch, ShieldAlert, ShieldCheck
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts"

interface RiskAnalysisProps {
  riskProfile: "conservative" | "balanced" | "aggressive"
}

export default function RiskAnalysis({ riskProfile }: RiskAnalysisProps) {
  const [activeScenario, setActiveScenario] = useState<"bull" | "base" | "bear">("base")

  const riskMetrics = {
    conservative: {
      volatilityIndex: 14.2,
      var95: 1.8,
      maxDrawdown: -8.5,
      sharpeRatio: 1.45,
      diversification: 92,
      beta: 0.75,
      riskScore: 28,
    },
    balanced: {
      volatilityIndex: 18.5,
      var95: 2.8,
      maxDrawdown: -12.3,
      sharpeRatio: 1.22,
      diversification: 78,
      beta: 1.0,
      riskScore: 52,
    },
    aggressive: {
      volatilityIndex: 24.3,
      var95: 4.2,
      maxDrawdown: -18.5,
      sharpeRatio: 0.98,
      diversification: 65,
      beta: 1.35,
      riskScore: 76,
    },
  }

  const metrics = riskMetrics[riskProfile]

  // Volatility trend data
  const volatilityData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    volatility: 15 + Math.sin(i * 0.3) * 5 + Math.random() * 3,
    benchmark: 18,
  }))

  // Risk distribution data
  const riskDistribution = [
    { name: "Low Risk", value: riskProfile === "conservative" ? 55 : riskProfile === "balanced" ? 35 : 20, color: "#10b981" },
    { name: "Medium Risk", value: riskProfile === "conservative" ? 35 : riskProfile === "balanced" ? 45 : 35, color: "#f59e0b" },
    { name: "High Risk", value: riskProfile === "conservative" ? 10 : riskProfile === "balanced" ? 20 : 45, color: "#ef4444" },
  ]

  // Sector risk radar data
  const sectorRiskData = [
    { sector: "Banking", risk: 65, return: 78 },
    { sector: "Telecom", risk: 45, return: 62 },
    { sector: "Mining", risk: 85, return: 92 },
    { sector: "Real Estate", risk: 72, return: 58 },
    { sector: "Materials", risk: 55, return: 68 },
    { sector: "Consumer", risk: 38, return: 52 },
  ]

  // Scenario impact data
  const scenarioData = {
    bull: {
      marketChange: "+15%",
      portfolioImpact: "+12.8%",
      probability: 30,
      holdings: [
        { name: "ATW", impact: "+18%", color: "text-emerald-500" },
        { name: "IAM", impact: "+12%", color: "text-emerald-500" },
        { name: "MNG", impact: "+22%", color: "text-emerald-500" },
        { name: "BCP", impact: "+14%", color: "text-emerald-500" },
      ]
    },
    base: {
      marketChange: "+3%",
      portfolioImpact: "+2.5%",
      probability: 45,
      holdings: [
        { name: "ATW", impact: "+4%", color: "text-emerald-500" },
        { name: "IAM", impact: "+2%", color: "text-emerald-500" },
        { name: "MNG", impact: "+5%", color: "text-emerald-500" },
        { name: "BCP", impact: "+3%", color: "text-emerald-500" },
      ]
    },
    bear: {
      marketChange: "-12%",
      portfolioImpact: "-9.4%",
      probability: 25,
      holdings: [
        { name: "ATW", impact: "-10%", color: "text-red-500" },
        { name: "IAM", impact: "-6%", color: "text-red-500" },
        { name: "MNG", impact: "-15%", color: "text-red-500" },
        { name: "BCP", impact: "-8%", color: "text-red-500" },
      ]
    }
  }

  const currentScenario = scenarioData[activeScenario]

  // Warning signals
  const warnings = [
    { signal: "Volume Anomaly", status: "normal", icon: Activity, value: "Normal", desc: "Trading volume within expected range" },
    { signal: "Volatility Alert", status: "warning", icon: Zap, value: "+8%", desc: "Above 30-day average" },
    { signal: "Correlation Risk", status: "normal", icon: GitBranch, value: "Stable", desc: "Asset correlations unchanged" },
    { signal: "Liquidity Score", status: "normal", icon: Layers, value: "Good", desc: "Adequate market depth" },
  ]

  const getRiskScoreColor = (score: number) => {
    if (score < 35) return "text-emerald-500"
    if (score < 65) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            Risk Analysis
          </h1>
          <p className="text-muted-foreground mt-1">Portfolio risk management for {riskProfile} investors</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Overall Risk Score</p>
            <p className={`text-3xl font-bold ${getRiskScoreColor(metrics.riskScore)}`}>
              {metrics.riskScore}<span className="text-lg">/100</span>
            </p>
          </div>
          <div className={`p-3 rounded-xl ${metrics.riskScore < 35 ? 'bg-emerald-500/10' : metrics.riskScore < 65 ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
            {metrics.riskScore < 35 ? (
              <ShieldCheck className={`h-8 w-8 ${getRiskScoreColor(metrics.riskScore)}`} />
            ) : metrics.riskScore < 65 ? (
              <Shield className={`h-8 w-8 ${getRiskScoreColor(metrics.riskScore)}`} />
            ) : (
              <ShieldAlert className={`h-8 w-8 ${getRiskScoreColor(metrics.riskScore)}`} />
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Volatility", value: metrics.volatilityIndex.toFixed(1), icon: Activity, suffix: "", color: metrics.volatilityIndex > 20 ? "text-amber-500" : "text-emerald-500" },
          { label: "VaR (95%)", value: metrics.var95.toFixed(1), icon: Target, suffix: "%", color: "text-foreground" },
          { label: "Max Drawdown", value: metrics.maxDrawdown.toFixed(1), icon: TrendingDown, suffix: "%", color: "text-red-500" },
          { label: "Sharpe Ratio", value: metrics.sharpeRatio.toFixed(2), icon: BarChart3, suffix: "", color: metrics.sharpeRatio > 1 ? "text-emerald-500" : "text-amber-500" },
          { label: "Beta", value: metrics.beta.toFixed(2), icon: Gauge, suffix: "", color: "text-foreground" },
          { label: "Diversification", value: metrics.diversification, icon: PieChart, suffix: "%", color: metrics.diversification > 75 ? "text-emerald-500" : "text-amber-500" },
        ].map((metric) => (
          <Card key={metric.label} className="border-0 shadow-md bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {metric.label}
                </Badge>
              </div>
              <p className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}{metric.suffix}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Volatility Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Volatility Trend
                  </CardTitle>
                  <CardDescription>30-day volatility vs benchmark</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-primary rounded"></span>
                    <span className="text-muted-foreground">Portfolio</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-muted-foreground rounded"></span>
                    <span className="text-muted-foreground">Benchmark</span>
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={volatilityData}>
                  <defs>
                    <linearGradient id="volatilityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} domain={[10, 25]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="volatility" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#volatilityGradient)" />
                  <Area type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sector Risk Radar */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Sector Risk-Return Profile
              </CardTitle>
              <CardDescription>Risk vs expected return by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={sectorRiskData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="sector" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Risk" dataKey="risk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Return" dataKey="return" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={2} />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Risk Distribution & Warnings */}
        <div className="space-y-6">
          {/* Risk Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Portfolio Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {riskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warning Signals */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Risk Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {warnings.map((warning) => (
                <div 
                  key={warning.signal}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    warning.status === "warning" ? "bg-amber-500/10 border border-amber-500/20" : "bg-muted/50"
                  }`}
                >
                  <warning.icon className={`h-4 w-4 ${warning.status === "warning" ? "text-amber-500" : "text-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{warning.signal}</p>
                      <Badge 
                        variant={warning.status === "warning" ? "destructive" : "secondary"}
                        className={`ml-2 text-[10px] ${warning.status === "warning" ? "bg-amber-500" : ""}`}
                      >
                        {warning.value}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{warning.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scenario Analysis */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Scenario Analysis
          </CardTitle>
          <CardDescription>Stress test your portfolio under different market conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {(["bull", "base", "bear"] as const).map((scenario) => {
              const data = scenarioData[scenario]
              const isActive = activeScenario === scenario
              return (
                <button
                  key={scenario}
                  onClick={() => setActiveScenario(scenario)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    isActive 
                      ? scenario === "bull" 
                        ? "bg-emerald-500/10 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10" 
                        : scenario === "bear"
                        ? "bg-red-500/10 border-2 border-red-500 shadow-lg shadow-red-500/10"
                        : "bg-primary/10 border-2 border-primary shadow-lg shadow-primary/10"
                      : "bg-muted/50 border-2 border-transparent hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg font-bold ${
                      scenario === "bull" ? "text-emerald-500" : scenario === "bear" ? "text-red-500" : "text-primary"
                    }`}>
                      {scenario === "bull" ? "🐂 Bull" : scenario === "bear" ? "🐻 Bear" : "📊 Base"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {data.probability}% prob.
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Market</span>
                      <span className={scenario === "bear" ? "text-red-500 font-semibold" : "text-emerald-500 font-semibold"}>
                        {data.marketChange}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Portfolio</span>
                      <span className={scenario === "bear" ? "text-red-500 font-semibold" : "text-emerald-500 font-semibold"}>
                        {data.portfolioImpact}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Impact Details */}
          <div className="bg-muted/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Holdings Impact ({activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)} Scenario)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentScenario.holdings.map((holding) => (
                <div key={holding.name} className="bg-background rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-muted-foreground">{holding.name}</p>
                  <p className={`text-xl font-bold ${holding.color}`}>{holding.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-card to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Risk Management Recommendations
          </CardTitle>
          <CardDescription>Personalized strategies for your {riskProfile} profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Target,
                title: "Position Sizing",
                desc: `Limit individual positions to ${riskProfile === "conservative" ? "3-5%" : riskProfile === "balanced" ? "5-8%" : "8-12%"} of portfolio value`,
                color: "text-blue-500",
                bgColor: "bg-blue-500/10",
              },
              {
                icon: Shield,
                title: "Stop Loss Strategy",
                desc: `Set stop losses ${riskProfile === "conservative" ? "5-8%" : riskProfile === "balanced" ? "8-12%" : "12-15%"} below entry prices`,
                color: "text-emerald-500",
                bgColor: "bg-emerald-500/10",
              },
              {
                icon: Layers,
                title: "Diversification",
                desc: `Maintain exposure across ${riskProfile === "conservative" ? "6+" : riskProfile === "balanced" ? "5+" : "4+"} sectors for risk mitigation`,
                color: "text-purple-500",
                bgColor: "bg-purple-500/10",
              },
            ].map((rec) => (
              <div key={rec.title} className={`${rec.bgColor} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <rec.icon className={`h-5 w-5 ${rec.color}`} />
                  <h4 className="font-semibold">{rec.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{rec.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
