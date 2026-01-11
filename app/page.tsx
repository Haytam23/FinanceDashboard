"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import Footer from "@/components/footer"
import DashboardOverview from "@/components/dashboard-overview"
import StockAnalysis from "@/components/stock-analysis"
import RiskAnalysis from "@/components/risk-analysis"
import BourseChatbot from "@/components/bourse-chatbot"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "stocks" | "risk" | "chatbot">("overview")
  const [riskProfile, setRiskProfile] = useState<"conservative" | "balanced" | "aggressive">("balanced")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground flex flex-col">
      <Header riskProfile={riskProfile} setRiskProfile={setRiskProfile} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === "overview" && <DashboardOverview riskProfile={riskProfile} />}
            {activeTab === "stocks" && <StockAnalysis />}
            {activeTab === "risk" && <RiskAnalysis riskProfile={riskProfile} />}
            {activeTab === "chatbot" && <BourseChatbot />}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
