import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const urls = [
    process.env.PYTHON_API_URL || 'http://127.0.0.1:8000',
    'http://localhost:8000'
  ]
  
  const body = await request.json()
  const userMessage = body.message?.toLowerCase() || ''
  
  // Try backend first
  for (const baseUrl of urls) {
    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      
      if (response.ok) {
        const data = await response.json()
        // If backend returned an error (e.g., OpenAI not configured), use fallback
        if (data.error) {
          break // Exit loop and use fallback
        }
        return Response.json(data)
      }
    } catch (error) {
      continue
    }
  }
  
  // Smart fallback responses based on keywords
  const fallbackResponse = getFallbackResponse(userMessage)
  return Response.json({ response: fallbackResponse })
}

function getFallbackResponse(message: string): string {
  // Knowledge base about Bourse de Casablanca
  
  // MASI and indices
  if (message.includes('masi') || message.includes('madex') || message.includes('index') || message.includes('indice')) {
    return "The MASI (Moroccan All Shares Index) is the main index of the Casablanca Stock Exchange, tracking all listed companies. It serves as the primary benchmark for the Moroccan equity market. The MADEX (Most Active Shares Index) tracks the most liquid stocks.\n\nBoth indices are calculated in real-time during trading hours (9:30 AM - 3:30 PM). As of now, the MASI is trading around 13,245 points. The indices are weighted by free-float market capitalization."
  }
  
  // Trading hours
  if (message.includes('trading') || message.includes('hours') || message.includes('open') || message.includes('when') && message.includes('market')) {
    return "The Casablanca Stock Exchange operates Monday through Friday with the following schedule:\n\n• Pre-opening: 9:00 - 9:30 AM (orders collected without execution)\n• Continuous trading: 9:30 AM - 3:30 PM\n• Closing auction: 3:30 PM\n\nThe market is closed on weekends and Moroccan public holidays including Eid al-Fitr, Eid al-Adha, and national holidays."
  }
  
  // How to invest
  if ((message.includes('how') && (message.includes('invest') || message.includes('buy') || message.includes('trade') || message.includes('start'))) || message.includes('begin') || message.includes('beginner')) {
    return "To start investing in the Casablanca Stock Exchange:\n\n1. **Open an account** with a licensed Moroccan brokerage firm (e.g., Attijari Intermédiation, BMCE Capital Bourse, CDG Capital Bourse)\n2. **Complete KYC** - Provide ID, proof of address, and sign agreements\n3. **Fund your account** - Transfer money to your brokerage account\n4. **Place orders** - Through your broker's platform or by phone\n\nMinimum investment varies by broker (typically 5,000-10,000 MAD). Foreign investors can participate with some regulatory requirements."
  }
  
  // Sectors and companies
  if (message.includes('sector') || message.includes('companies') || message.includes('listed') || message.includes('top')) {
    return "The Casablanca Stock Exchange lists about 75 companies across key sectors:\n\n• **Banking** (largest): Attijariwafa Bank (ATW), BCP, BMCI, CIH Bank\n• **Telecommunications**: Maroc Telecom (IAM)\n• **Mining**: Managem (MNG), SMI\n• **Real Estate**: Addoha (ADH), Alliances\n• **Materials**: LafargeHolcim Maroc (LHM)\n• **Consumer**: Label'Vie, Cosumar\n\nThe banking sector represents about 40% of total market capitalization."
  }
  
  // Specific stocks
  if (message.includes('attijariwafa') || message.includes('atw')) {
    return "**Attijariwafa Bank (ATW)** is Morocco's largest bank and one of Africa's biggest financial institutions.\n\n• Current price: ~489.50 MAD\n• Market Cap: ~45.6 billion MAD\n• Sector: Banking\n• Dividend yield: ~4.2%\n\nThe bank has operations in 25+ countries across Africa and Europe. It's consistently one of the most traded stocks on the exchange with strong institutional interest."
  }
  
  if (message.includes('maroc telecom') || message.includes('iam') || message.includes('telecom')) {
    return "**Maroc Telecom (IAM)** is Morocco's largest telecommunications company, majority-owned by Etisalat.\n\n• Current price: ~128.40 MAD\n• Market Cap: ~38.5 billion MAD\n• Sector: Telecommunications\n• Dividend yield: ~5.8%\n\nIt provides mobile, fixed-line, and internet services in Morocco and has subsidiaries in several African countries. Known for consistent dividend payments."
  }
  
  if (message.includes('bcp') || message.includes('banque centrale populaire') || message.includes('populaire')) {
    return "**Banque Centrale Populaire (BCP)** is Morocco's second-largest banking group, built on a cooperative model.\n\n• Current price: ~285.75 MAD\n• Market Cap: ~28.9 billion MAD\n• Sector: Banking\n• Dividend yield: ~3.8%\n\nBCP has a strong retail banking presence and is expanding across Africa. It's known for its stability and community-focused approach."
  }
  
  // Dividends
  if (message.includes('dividend') || message.includes('yield') || message.includes('income')) {
    return "Many Moroccan companies pay attractive dividends:\n\n**High dividend stocks:**\n• Maroc Telecom: ~5.8% yield\n• Attijariwafa Bank: ~4.2% yield\n• BCP: ~3.8% yield\n• Cosumar: ~3.5% yield\n\nDividends are typically paid annually after the AGM (April-June). The ex-dividend date is announced beforehand. Consider tax implications - Morocco has a 15% withholding tax on dividends for residents."
  }
  
  // Risk
  if (message.includes('risk') || message.includes('volatile') || message.includes('safe') || message.includes('danger')) {
    return "**Risks in the Moroccan stock market:**\n\n• **Liquidity risk**: Some small-cap stocks have low trading volumes\n• **Market volatility**: Emerging market sensitivity to global events\n• **Currency risk**: For foreign investors, MAD fluctuations matter\n• **Concentration**: Heavy weighting toward banking sector\n\n**Risk mitigation:**\n✓ Diversify across sectors\n✓ Focus on blue-chips for stability\n✓ Don't invest more than you can afford to lose\n✓ Consider long-term horizons"
  }
  
  // History
  if (message.includes('history') || message.includes('founded') || message.includes('origin') || message.includes('old')) {
    return "**History of Bourse de Casablanca:**\n\n• **1929**: Founded during French protectorate era\n• **1967**: Reorganized as 'Bourse des Valeurs de Casablanca'\n• **1993**: Major modernization with electronic trading\n• **1997**: First privatization wave boosted listings\n• **2000s**: Integration of clearing systems\n• **Today**: Modern exchange with ~75 listed companies\n\nRegulated by AMMC (Autorité Marocaine du Marché des Capitaux). Member of African Securities Exchanges Association."
  }
  
  // Broker
  if (message.includes('broker') || message.includes('courtier') || message.includes('account')) {
    return "**Licensed Moroccan Brokers (Sociétés de Bourse):**\n\n• Attijari Intermédiation\n• BMCE Capital Bourse\n• CDG Capital Bourse\n• Upline Securities\n• CFG Marchés\n• Crédit du Maroc Capital\n• BMCI Bourse\n\n**To choose a broker, consider:**\n✓ Commission fees (typically 0.5-1% per trade)\n✓ Minimum account requirements\n✓ Online platform quality\n✓ Research and support services"
  }
  
  // Analysis / Technical
  if (message.includes('analysis') || message.includes('technical') || message.includes('fundamental') || message.includes('rsi') || message.includes('macd')) {
    return "**Stock Analysis Approaches:**\n\n**Technical Analysis:**\n• RSI (Relative Strength Index): Overbought >70, Oversold <30\n• MACD: Trend direction and momentum\n• Moving Averages: SMA 20, SMA 50 for trends\n• Support/Resistance levels\n\n**Fundamental Analysis:**\n• P/E Ratio: Compare with sector average\n• Dividend yield and payout ratio\n• Earnings growth and ROE\n• Debt-to-equity ratio\n\nClick on any stock in our dashboard for detailed analysis!"
  }
  
  // What is / Explain
  if (message.includes('what is') || message.includes('explain') || message.includes('define') || message.includes('meaning')) {
    if (message.includes('bourse') || message.includes('stock exchange') || message.includes('casablanca')) {
      return "**Bourse de Casablanca** (Casablanca Stock Exchange) is Morocco's only stock exchange, located in Casablanca's financial district.\n\n• Founded in 1929\n• Lists ~75 companies\n• Total market cap: ~600 billion MAD\n• Main indices: MASI and MADEX\n• Currency: Moroccan Dirham (MAD)\n• Regulator: AMMC\n\nIt's one of Africa's most developed capital markets and a gateway for investing in Morocco's economy."
    }
  }
  
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('bonjour') || message.includes('salut')) {
    return "Hello! 👋 Welcome to the Bourse de Casablanca AI Assistant!\n\nI can help you with:\n• Understanding MASI and MADEX indices\n• Information about listed companies\n• How to start investing\n• Trading hours and procedures\n• Stock analysis concepts\n\nWhat would you like to know about the Moroccan stock market?"
  }
  
  // Thanks
  if (message.includes('thank') || message.includes('merci') || message.includes('shukran')) {
    return "You're welcome! 😊 If you have more questions about the Moroccan stock market, feel free to ask. I'm here to help you navigate Bourse de Casablanca!"
  }
  
  // Default response
  return "The Bourse de Casablanca is Morocco's main stock exchange, established in 1929. With about 75 listed companies across banking, telecom, mining, and other sectors, it's one of Africa's leading capital markets.\n\n**Quick facts:**\n• Main index: MASI (currently ~13,245 points)\n• Trading hours: 9:30 AM - 3:30 PM (Mon-Fri)\n• Currency: Moroccan Dirham (MAD)\n\nAsk me about specific stocks, how to invest, sectors, or any trading concepts!"
}
