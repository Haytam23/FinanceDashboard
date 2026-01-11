// Market data utilities and API client
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000'

export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  change_percent: number
  volume: number
  market_cap?: number
  sector?: string
  pe_ratio?: number
  dividend_yield?: number
  open?: number
  high?: number
  low?: number
  close?: number
  source: string
  timestamp: string
}

export interface MarketIndices {
  masi: number
  masi_change: number
  madex: number
  madex_change: number
  market_status: string
  source: string
  timestamp: string
}

export interface MarketSnapshot {
  indices: MarketIndices
  stocks: StockData[]
  data_quality: {
    completeness: number
    total_stocks: number
    missing_fields: Record<string, number>
  }
  fetch_metadata: {
    fetch_timestamp: string
    source_used: string
    fetch_duration_seconds: number
    stocks_count: number
  }
}

export async function fetchMarketSnapshot(forceRefresh = false): Promise<MarketSnapshot> {
  const url = `${PYTHON_API_URL}/api/market/snapshot${forceRefresh ? '?force_refresh=true' : ''}`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch market snapshot: ${response.statusText}`)
  }
  
  return response.json()
}

export async function fetchStockDetail(symbol: string): Promise<StockData> {
  const response = await fetch(`${PYTHON_API_URL}/api/stocks/${symbol}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stock ${symbol}: ${response.statusText}`)
  }
  
  return response.json()
}

export async function fetchStockHistory(
  symbol: string,
  period: string = '1mo',
  interval: string = '1d'
): Promise<any> {
  const response = await fetch(
    `${PYTHON_API_URL}/api/stocks/${symbol}/history?period=${period}&interval=${interval}`
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch history for ${symbol}: ${response.statusText}`)
  }
  
  return response.json()
}
