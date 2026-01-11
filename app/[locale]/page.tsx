"use client"

import { useState } from "react"
import Header from "@/components/header"
import MarketOverview from "@/components/market-overview"
import StockCards from "@/components/stock-cards"
import RiskAnalysis from "@/components/risk-analysis"
import Sidebar from "@/components/sidebar"
import DailyActionSummary from "@/components/daily-action-summary"
import FinanceGlossary from "@/components/finance-glossary"
import LearningResources from "@/components/learning-resources"
import Footer from "@/components/footer"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "stocks" | "risk">("overview")
  const [riskProfile, setRiskProfile] = useState<"conservative" | "balanced" | "aggressive">("balanced")

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header riskProfile={riskProfile} setRiskProfile={setRiskProfile} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <MarketOverview riskProfile={riskProfile} />
                <DailyActionSummary riskProfile={riskProfile} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FinanceGlossary />
                  <LearningResources />
                </div>
              </div>
            )}

            {activeTab === "stocks" && (
              <div className="space-y-8">
                <StockCards riskProfile={riskProfile} />
              </div>
            )}

            {activeTab === "risk" && (
              <div className="space-y-8">
                <RiskAnalysis riskProfile={riskProfile} />
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
