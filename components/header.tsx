"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Settings, TrendingUp } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MobileSidebarTrigger } from "@/components/sidebar"

interface HeaderProps {
  riskProfile: "conservative" | "balanced" | "aggressive"
  setRiskProfile: (profile: "conservative" | "balanced" | "aggressive") => void
  activeTab: "overview" | "stocks" | "risk" | "chatbot"
  setActiveTab: (tab: "overview" | "stocks" | "risk" | "chatbot") => void
}

export default function Header({ riskProfile, setRiskProfile, activeTab, setActiveTab }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [marketData, setMarketData] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const res = await fetch('/api/market')
        const data = await res.json()
        setMarketData(data)
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const riskProfileConfig = {
    conservative: { label: "Conservative", color: "bg-blue-500 dark:bg-blue-600" },
    balanced: { label: "Balanced", color: "bg-purple-500 dark:bg-purple-600" },
    aggressive: { label: "Aggressive", color: "bg-orange-500 dark:bg-orange-600" },
  }

  if (!mounted) return null

  return (
    <header className="border-b border-border/50 bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4 max-w-[1600px] flex items-center justify-between gap-4">
        {/* Mobile Menu + Logo & Title */}
        <div className="flex items-center gap-2">
          <MobileSidebarTrigger activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-md">
            <TrendingUp className="text-primary-foreground h-6 w-6" />
          </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">Casablanca Exchange</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Market Intelligence</p>
            </div>
          </div>
        </div>

        {/* Market Status */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                LIVE
              </Badge>
              <span className="text-sm text-muted-foreground">MASI:</span>
              <span className="text-sm font-bold text-foreground">
                {marketData?.indices?.masi?.toFixed(2) || "13,245.67"}
              </span>
              <span className={`text-xs font-medium ${(marketData?.indices?.masi_change || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {(marketData?.indices?.masi_change || 0) >= 0 ? '+' : ''}{((marketData?.indices?.masi_change || 0) / (marketData?.indices?.masi || 13245) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Risk Profile Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <div className={`w-2 h-2 rounded-full ${riskProfileConfig[riskProfile].color}`}></div>
                <span className="hidden sm:inline">{riskProfileConfig[riskProfile].label}</span>
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Risk Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={riskProfile} onValueChange={(value) => setRiskProfile(value as any)}>
                {Object.entries(riskProfileConfig).map(([key, config]) => (
                  <DropdownMenuRadioItem key={key} value={key} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                      {config.label}
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
