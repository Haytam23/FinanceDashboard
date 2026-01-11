// Moroccan Stock Market Data - Casablanca Stock Exchange (Bourse de Casablanca)
// Using realistic data based on major Moroccan companies

export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  sector: string
  pe?: number
  dividend?: number
}

export interface MarketData {
  masi: number
  masiChange: number
  madex: number
  madexChange: number
  date: string
  stocks: Stock[]
  sectors: Record<string, number>
  tradingVolume: number
}

// Major Moroccan companies on Bourse de Casablanca
const moroccanStocks: Stock[] = [
  // Banking Sector
  {
    symbol: "ATW",
    name: "Attijariwafa Bank",
    price: 485.50,
    change: 5.20,
    changePercent: 1.08,
    volume: 125420,
    marketCap: 95600000000,
    sector: "Banking",
    pe: 15.2,
    dividend: 3.8
  },
  {
    symbol: "BCP",
    name: "Banque Centrale Populaire",
    price: 268.00,
    change: -2.10,
    changePercent: -0.78,
    volume: 98340,
    marketCap: 52400000000,
    sector: "Banking",
    pe: 13.8,
    dividend: 4.2
  },
  {
    symbol: "CDM",
    name: "Crédit du Maroc",
    price: 895.00,
    change: 8.50,
    changePercent: 0.96,
    volume: 15230,
    marketCap: 12800000000,
    sector: "Banking",
    pe: 16.5,
    dividend: 3.5
  },
  // Telecom
  {
    symbol: "IAM",
    name: "Maroc Telecom",
    price: 142.50,
    change: 1.80,
    changePercent: 1.28,
    volume: 342150,
    marketCap: 125400000000,
    sector: "Telecommunications",
    pe: 18.3,
    dividend: 5.2
  },
  // Real Estate & Construction
  {
    symbol: "ADH",
    name: "Douja Prom Addoha",
    price: 12.85,
    change: -0.15,
    changePercent: -1.15,
    volume: 456780,
    marketCap: 8200000000,
    sector: "Real Estate",
    pe: 22.1,
    dividend: 2.1
  },
  {
    symbol: "ALL",
    name: "Alliances",
    price: 68.50,
    change: 2.30,
    changePercent: 3.47,
    volume: 23450,
    marketCap: 2850000000,
    sector: "Real Estate",
    pe: 19.4,
    dividend: 2.8
  },
  // Industry
  {
    symbol: "LHM",
    name: "LafargeHolcim Maroc",
    price: 1850.00,
    change: -12.00,
    changePercent: -0.64,
    volume: 8920,
    marketCap: 18500000000,
    sector: "Materials",
    pe: 14.2,
    dividend: 3.9
  },
  {
    symbol: "SID",
    name: "Sonasid",
    price: 425.00,
    change: 5.50,
    changePercent: 1.31,
    volume: 12340,
    marketCap: 6800000000,
    sector: "Materials",
    pe: 11.8,
    dividend: 4.5
  },
  // Energy
  {
    symbol: "SRM",
    name: "Samir Raffinage",
    price: 145.20,
    change: -3.20,
    changePercent: -2.16,
    volume: 67890,
    marketCap: 4200000000,
    sector: "Energy",
    pe: 9.5,
    dividend: 1.2
  },
  // Insurance
  {
    symbol: "WAA",
    name: "Wafa Assurance",
    price: 3820.00,
    change: 25.00,
    changePercent: 0.66,
    volume: 4520,
    marketCap: 15300000000,
    sector: "Insurance",
    pe: 17.8,
    dividend: 3.2
  },
  // Mining
  {
    symbol: "MNG",
    name: "Managem",
    price: 2150.00,
    change: 18.00,
    changePercent: 0.84,
    volume: 14560,
    marketCap: 22400000000,
    sector: "Mining",
    pe: 16.9,
    dividend: 2.9
  },
  // Retail & Distribution
  {
    symbol: "LBL",
    name: "Label'Vie",
    price: 3450.00,
    change: -15.00,
    changePercent: -0.43,
    volume: 6780,
    marketCap: 12900000000,
    sector: "Retail",
    pe: 24.5,
    dividend: 2.3
  },
]

export function getMoroccanMarketData(): MarketData {
  // Calculate MASI (Moroccan All Shares Index)
  const masi = 12847.35
  const masiChange = 0.58
  
  // Calculate MADEX (Moroccan Most Active Shares Index)
  const madex = 10452.18
  const madexChange = 0.73
  
  // Calculate sector performance
  const sectors: Record<string, number> = {
    "Banking": 1.42,
    "Telecommunications": 0.95,
    "Real Estate": -0.68,
    "Materials": 0.35,
    "Energy": -1.82,
    "Insurance": 0.88,
    "Mining": 1.15,
    "Retail": -0.24
  }
  
  // Calculate total trading volume
  const tradingVolume = moroccanStocks.reduce((sum, stock) => sum + stock.volume, 0)
  
  return {
    masi,
    masiChange,
    madex,
    madexChange,
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    stocks: moroccanStocks,
    sectors,
    tradingVolume
  }
}

export function getStockBySymbol(symbol: string): Stock | undefined {
  return moroccanStocks.find(stock => stock.symbol === symbol)
}

export function getStocksBySector(sector: string): Stock[] {
  return moroccanStocks.filter(stock => stock.sector === sector)
}

// Add some randomness to simulate live market data
export function getLiveMarketData(): MarketData {
  const baseData = getMoroccanMarketData()
  
  // Add small random variations to simulate real-time updates
  const stocks = baseData.stocks.map(stock => ({
    ...stock,
    price: stock.price + (Math.random() - 0.5) * 5,
    change: stock.change + (Math.random() - 0.5) * 1,
    changePercent: stock.changePercent + (Math.random() - 0.5) * 0.5,
    volume: Math.floor(stock.volume * (0.9 + Math.random() * 0.2))
  }))
  
  return {
    ...baseData,
    stocks
  }
}
