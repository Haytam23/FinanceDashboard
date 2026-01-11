"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BarChart3, Shield, MessageCircle, Menu, X } from "lucide-react"

interface SidebarProps {
  activeTab: "overview" | "stocks" | "risk" | "chatbot"
  setActiveTab: (tab: "overview" | "stocks" | "risk" | "chatbot") => void
}

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
  { 
    id: "chatbot", 
    label: "AI Assistant", 
    icon: MessageCircle, 
    description: "Chat & learn about stocks" 
  },
]

function SidebarContent({ activeTab, setActiveTab, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
  return (
    <>
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
      <div className="space-y-2 flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
          Navigation
        </p>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any)
              onNavigate?.()
            }}
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
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-md mt-auto">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-sm font-semibold text-foreground">Market Open</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bourse de Casablanca trading hours: 9:30 AM - 3:30 PM
          </p>
        </div>
      </Card>
    </>
  )
}

// Mobile sidebar trigger button component
export function MobileSidebarTrigger({ activeTab, setActiveTab }: SidebarProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full p-6 gap-4">
          <SidebarContent 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Desktop sidebar
export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="hidden lg:flex lg:w-72 bg-gradient-to-b from-card to-card/50 border-r border-border/50 flex-col p-6 gap-4 shadow-lg">
      <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </aside>
  )
}
