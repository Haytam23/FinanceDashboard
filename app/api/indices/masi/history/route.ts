import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get('period') || '1mo'
  
  const urls = [
    process.env.PYTHON_API_URL || 'http://127.0.0.1:8000',
    'http://localhost:8000'
  ]
  
  let lastError: Error | null = null
  
  for (const baseUrl of urls) {
    try {
      const response = await fetch(`${baseUrl}/api/indices/masi/history?period=${period}`, {
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
  
  // Return mock historical data if backend is unavailable
  console.error("Error fetching MASI history:", lastError)
  const mockHistory = generateMockHistory()
  return Response.json(mockHistory)
}

function generateMockHistory() {
  const data = []
  const baseValue = 13000
  const now = new Date()
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Add some randomness to simulate real data
    const variation = (Math.random() - 0.5) * 200
    const value = baseValue + (30 - i) * 8 + variation
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 500000
    })
  }
  
  return { history: data, source: 'mock' }
}
