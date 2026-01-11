export async function GET() {
  const urls = [
    process.env.PYTHON_API_URL || 'http://127.0.0.1:8000',
    'http://localhost:8000'
  ]
  
  let lastError: Error | null = null
  
  for (const baseUrl of urls) {
    try {
      // Add use_mock=true for faster response with mock data
      const response = await fetch(`${baseUrl}/api/market/snapshot?use_mock=true`, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        return Response.json(data)
      }
    } catch (error) {
      lastError = error as Error
      continue
    }
  }
  
  // Return fallback mock data if backend is unavailable
  console.error("Error fetching market data:", lastError)
  return Response.json(getMockMarketData())
}

function getMockMarketData() {
  return {
    indices: {
      masi: 13245.67,
      masi_change: 125.34,
      masi_volume: 2450000,
      madex: 10789.23,
      madex_change: 87.12,
      madex_volume: 1980000,
      market_status: "OPEN",
      timestamp: new Date().toISOString(),
      source: "mock"
    },
    stocks: [
      {
        symbol: "ATW",
        name: "Attijariwafa Bank",
        price: 489.50,
        open: 477.20,
        high: 491.00,
        low: 475.50,
        close: 489.50,
        volume: 145678,
        change: 12.30,
        change_percent: 2.58,
        market_cap: 45678900000.0,
        sector: "Banking"
      },
      {
        symbol: "BCP",
        name: "Banque Centrale Populaire",
        price: 285.75,
        open: 289.00,
        high: 290.50,
        low: 284.00,
        close: 285.75,
        volume: 98234,
        change: -3.25,
        change_percent: -1.13,
        market_cap: 28900000000.0,
        sector: "Banking"
      },
      {
        symbol: "IAM",
        name: "Maroc Telecom",
        price: 128.40,
        open: 126.50,
        high: 129.00,
        low: 126.00,
        close: 128.40,
        volume: 234567,
        change: 1.90,
        change_percent: 1.50,
        market_cap: 38500000000.0,
        sector: "Telecommunications"
      },
      {
        symbol: "LHM",
        name: "LafargeHolcim Maroc",
        price: 1890.00,
        open: 1875.00,
        high: 1895.00,
        low: 1870.00,
        close: 1890.00,
        volume: 12345,
        change: 15.00,
        change_percent: 0.80,
        market_cap: 15600000000.0,
        sector: "Materials"
      },
      {
        symbol: "ADH",
        name: "Douja Prom Addoha",
        price: 12.45,
        open: 12.80,
        high: 12.90,
        low: 12.30,
        close: 12.45,
        volume: 456789,
        change: -0.35,
        change_percent: -2.73,
        market_cap: 4500000000.0,
        sector: "Real Estate"
      }
    ],
    data_quality: {
      completeness: 100,
      source: "mock"
    }
  }
}
