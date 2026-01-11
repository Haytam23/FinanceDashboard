import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export async function POST(request: Request) {
  try {
    const { scenario, portfolioComposition, riskProfile } = await request.json()

    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      system: `You are a financial strategist specializing in scenario planning for Moroccan investors.
      Analyze how different market scenarios would impact a portfolio on the Casablanca Stock Exchange.
      Provide clear, actionable insights without jargon.
      Focus on practical implications and recommended adjustments for Moroccan stocks and sectors.
      Consider local economic factors, currency (MAD), and regional market dynamics.`,
      prompt: `Analyze this scenario for a ${riskProfile} Moroccan investor:
      Scenario: ${scenario}
      Portfolio: ${JSON.stringify(portfolioComposition)}
      
      Explain:
      1. How this scenario would impact each position in the Moroccan market context
      2. Which Moroccan sectors would be most affected
      3. Recommended portfolio adjustments using Casablanca Stock Exchange securities
      4. Risk management steps considering the Moroccan market`,
    })

    return Response.json({ analysis: text })
  } catch (error) {
    console.error("Error generating scenario analysis:", error)
    return Response.json({ error: "Failed to generate scenario analysis" }, { status: 500 })
  }
}
