import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { getStockBySymbol } from '@/lib/moroccan-market-data'

export async function POST(request: Request) {
  try {
    const { symbol, stockData, marketContext } = await request.json()
    
    // Get real Moroccan stock data if available
    const moroccanStock = getStockBySymbol(symbol)
    const stockInfo = moroccanStock || stockData

    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      system: `You are a seasoned investment advisor with expertise in the Casablanca Stock Exchange.
      Provide clear, data-driven investment recommendations for Moroccan stocks.
      Always consider both technical and fundamental factors.
      Explain your reasoning in terms non-experts can understand.
      Recommend actions: BUY, HOLD, or SELL with confidence levels.
      All prices are in Moroccan Dirhams (MAD).
      Consider local market dynamics, Moroccan economic factors, and regional influences.`,
      prompt: `Analyze ${symbol} - ${stockInfo?.name || 'Stock'} with this data:
      
      Current Price: ${stockInfo?.price} MAD
      Change: ${stockInfo?.changePercent}%
      Volume: ${stockInfo?.volume}
      Sector: ${stockInfo?.sector}
      P/E Ratio: ${stockInfo?.pe}
      Dividend Yield: ${stockInfo?.dividend}%
      
      Market context: ${JSON.stringify(marketContext)}
      
      Provide a detailed recommendation including:
      - BUY/HOLD/SELL rating with confidence level
      - Target price in MAD
      - Risk assessment for Moroccan market
      - Key catalysts and risk factors
      - Entry and exit points`,
    })

    return Response.json({ recommendation: text })
  } catch (error) {
    console.error("Error generating recommendation:", error)
    return Response.json({ error: "Failed to generate recommendation" }, { status: 500 })
  }
}
