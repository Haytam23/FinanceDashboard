"use client"

import { LayoutDashboard, BarChart3, Shield, MessageCircle } from "lucide-react"

interface MobileNavProps {
  activeTab: "overview" | "stocks" | "risk" | "chatbot"
  setActiveTab: (tab: "overview" | "stocks" | "risk" | "chatbot") => void
}

const tabs = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "stocks", label: "Stocks", icon: BarChart3 },
  { id: "risk", label: "Risk", icon: Shield },
  { id: "chatbot", label: "Chat", icon: MessageCircle },
]

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary/10" 
                  : ""
              }`}>
                <tab.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
