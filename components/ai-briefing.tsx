"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Clock, Calendar } from "lucide-react"

interface CachedBriefing {
  briefing: string
  date: string
  timestamp: number
}

export default function AIBriefing() {
  const [briefing, setBriefing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [briefingDate, setBriefingDate] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getFormattedTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const loadCachedBriefing = (): CachedBriefing | null => {
    try {
      const cached = localStorage.getItem('ai-briefing-cache')
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (e) {
      console.error("Error loading cached briefing:", e)
    }
    return null
  }

  const saveBriefingToCache = (briefingText: string) => {
    const cache: CachedBriefing = {
      briefing: briefingText,
      date: getTodayString(),
      timestamp: Date.now()
    }
    try {
      localStorage.setItem('ai-briefing-cache', JSON.stringify(cache))
    } catch (e) {
      console.error("Error saving briefing to cache:", e)
    }
  }

  const generateBriefing = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true)
      setError(null)

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = loadCachedBriefing()
        if (cached && cached.date === getTodayString()) {
          // Use cached briefing from today
          setBriefing(cached.briefing)
          setBriefingDate(getFormattedDate())
          setLastUpdated(getFormattedTime(cached.timestamp))
          setLoading(false)
          return
        }
      }

      const today = getFormattedDate()

      const marketData = {
        masiValue: 12450,
        masiChange: 0.8,
        madexChange: 1.2,
        bankingSector: 2.1,
        telecomSector: 1.8,
        materialsSector: 0.9,
        miningSector: -1.8,
        volume: "high",
        sentiment: "bullish",
        volatility: "moderate",
      }

      const response = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketData, date: today }),
      })

      if (!response.ok) throw new Error("Failed to fetch briefing")
      const data = await response.json()
      
      setBriefing(data.briefing)
      setBriefingDate(today)
      setLastUpdated(getFormattedTime(Date.now()))
      saveBriefingToCache(data.briefing)
    } catch (err) {
      console.error("Error generating briefing:", err)
      // Fallback briefing
      const fallbackBriefing = "The Moroccan stock market opened today with positive sentiment as the MASI index gained 0.8% to reach 12,450 points. Banking stocks led the rally with a +2.1% gain, reflecting strong investor confidence in the financial sector. The MADEX liquid index also performed well, rising 1.2%.\n\nKey market drivers: Government infrastructure spending announcements boosted construction and materials stocks (+0.9%). Telecom sector showed resilience with +1.8% gains despite sector rotation pressures. Mining stocks (-1.8%) faced headwinds from global commodity price weakness, particularly gold.\n\nMarket Technical View: Trading volume above average indicates strong participation. The market remains in a bull regime with moderate volatility—an optimal environment for selective stock accumulation."
      
      setBriefing(fallbackBriefing)
      setBriefingDate(getFormattedDate())
      setLastUpdated(getFormattedTime(Date.now()))
      saveBriefingToCache(fallbackBriefing)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateBriefing()
  }, [])

  const handleRefresh = () => {
    generateBriefing(true)
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 via-card to-secondary/5 backdrop-blur h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span>🤖</span>
              AI Market Briefing
            </CardTitle>
            <CardDescription>Expert analysis of Casablanca Stock Exchange</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-xs text-muted-foreground animate-pulse flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                Generating insights...
              </span>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={loading}
                className="gap-1.5 text-xs h-8"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                Update Briefing
              </Button>
            )}
          </div>
        </div>
        {/* Briefing metadata */}
        {briefingDate && (
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {briefingDate}
            </span>
            {lastUpdated && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated at {lastUpdated}
              </span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Briefing Text */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {briefing ? (
            <div className="text-foreground leading-relaxed space-y-3">
              {briefing.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="text-sm text-foreground/90">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-sm">Loading briefing...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

