"use client"

import { Card } from "@/components/ui/card"
import { LayoutDashboard, BarChart3, Shield, BookOpen, MessageCircle } from "lucide-react"

interface SidebarProps {
  activeTab: "overview" | "stocks" | "risk" | "chatbot"
  setActiveTab: (tab: "overview" | "stocks" | "risk" | "chatbot") => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { 
      id: "overview", 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      description: "Market overview & insights" 
    },
    { 
      id: "stocks", 
      label: "Stocks", 
      icon: BarChart3, 
      description: "Individual stock analysis" 
    },
    { 
      id: "risk", 
      label: "Risk Analysis", 
      icon: Shield, 
      description: "Portfolio risk metrics" 
    },
  ]

  return (
    <aside className="hidden lg:flex lg:w-72 bg-gradient-to-b from-card to-card/50 border-r border-border/50 flex-col p-6 gap-6 shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-border/50">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
          C
        </div>
        <div>
          <h2 className="font-bold text-foreground text-lg">Casablanca</h2>
          <p className="text-xs text-muted-foreground">Stock Exchange</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
          Navigation
        </p>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 group ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-foreground hover:bg-accent hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? '' : 'text-muted-foreground group-hover:text-foreground'}`} />
              <div className="flex-1">
                <p className="font-semibold text-sm">{tab.label}</p>
                <p className={`text-xs mt-0.5 ${activeTab === tab.id ? 'opacity-90' : 'text-muted-foreground'}`}>
                  {tab.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Info Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
        onClick={() => setActiveTab("chatbot")}>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-foreground">AI Learning Assistant</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Chat with our AI assistant to learn about Bourse de Casablanca and get instant answers.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-primary font-medium group-hover:translate-x-1 transition-transform inline-block">
              Start Chatting →
            </span>
          </div>
        </div>
      </Card>
    </aside>
  )
}
