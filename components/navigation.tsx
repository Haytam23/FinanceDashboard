"use client"

interface NavigationProps {
  activeTab: "overview" | "stocks" | "risk"
  setActiveTab: (tab: "overview" | "stocks" | "risk") => void
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: "overview", label: "Market Overview", icon: "📈" },
    { id: "stocks", label: "Stock Analysis", icon: "📊" },
    { id: "risk", label: "Risk & Scenarios", icon: "⚠️" },
  ]

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
