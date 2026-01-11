import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export async function POST(request: Request) {
  try {
    const { portfolioRisk, volatility, correlation } = await request.json()

    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      system: `You are a risk management expert specializing in portfolio optimization for Moroccan investors.
      Provide practical, actionable risk management advice.
      Explain risk concepts clearly to non-experts.
      Focus on actionable strategies to improve risk-adjusted returns.
      Consider the Moroccan market context and local investment options.`,
      prompt: `Analyze this portfolio risk profile for a Moroccan investor: 
      Portfolio risk: ${JSON.stringify(portfolioRisk)}
      Volatility: ${volatility}
      Correlation: ${correlation}
      
      Provide 3 specific risk management recommendations with explanations tailored to the Moroccan market.`,
    })

    return Response.json({ insight: text })
  } catch (error) {
    console.error("Error generating risk insight:", error)
    return Response.json({ error: "Failed to generate risk insight" }, { status: 500 })
  }
}
