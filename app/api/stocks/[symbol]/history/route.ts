export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000'
    const { symbol } = params
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '1mo'
    const interval = searchParams.get('interval') || '1d'
    
    const response = await fetch(
      `${PYTHON_API_URL}/api/stocks/${symbol}/history?period=${period}&interval=${interval}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch history for ${symbol}`)
    }
    
    const data = await response.json()
    
    return Response.json(data)
  } catch (error) {
    console.error("Error fetching stock history:", error)
    return Response.json({ 
      error: "Failed to fetch stock history",
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
