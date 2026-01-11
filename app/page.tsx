"use client"

import { useState, useEffect } from "react"
import LandingPage from "@/components/landing-page"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import Footer from "@/components/footer"
import MobileNav from "@/components/mobile-nav"
import DashboardOverview from "@/components/dashboard-overview"
import StockAnalysis from "@/components/stock-analysis"
import RiskAnalysis from "@/components/risk-analysis"
import BourseChatbot from "@/components/bourse-chatbot"

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "stocks" | "risk" | "chatbot">("overview")
  const [riskProfile, setRiskProfile] = useState<"conservative" | "balanced" | "aggressive">("balanced")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Always show landing page first
  }, [])

  const handleEnterDashboard = () => {
    localStorage.setItem('hasVisitedDashboard', 'true')
    setShowDashboard(true)
  }

  const handleBackToLanding = () => {
    setShowDashboard(false)
  }

  if (!mounted) {
    return null
  }

  // Show landing page first
  if (!showDashboard) {
    return <LandingPage onEnterDashboard={handleEnterDashboard} />
  }

  // Show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground flex flex-col">
      <Header 
        riskProfile={riskProfile} 
        setRiskProfile={setRiskProfile} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogoClick={handleBackToLanding}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === "overview" && <DashboardOverview riskProfile={riskProfile} />}
            {activeTab === "stocks" && <StockAnalysis />}
            {activeTab === "risk" && <RiskAnalysis riskProfile={riskProfile} />}
            {activeTab === "chatbot" && <BourseChatbot />}
          </div>
        </main>
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
      
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
