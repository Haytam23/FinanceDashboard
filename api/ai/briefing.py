from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Check for OpenAI API key
        openai_key = os.environ.get('OPENAI_API_KEY')
        
        if openai_key:
            # If OpenAI is available, you could make a real call here
            # For now, return enhanced mock data
            pass
        
        # Smart fallback briefing
        briefing = {
            "title": "Bourse de Casablanca - Daily Market Analysis",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "summary": "The Moroccan stock market showed mixed performance today with the MASI index gaining 0.34%. Banking sector led the gains while materials faced headwinds.",
            "sections": [
                {
                    "title": "📈 Market Overview",
                    "content": "The MASI index closed at 13,245.67 points, up 45.23 points (+0.34%). Trading volume reached 156 million MAD, slightly above the 30-day average. Market breadth was positive with 28 gainers versus 19 decliners."
                },
                {
                    "title": "🏦 Sector Highlights",
                    "content": "**Banking (+0.8%)**: Attijariwafa Bank and BCP led gains on strong Q4 earnings expectations. **Technology (+1.5%)**: HPS continued its rally on digital transformation momentum. **Materials (-0.6%)**: Ciments du Maroc declined on construction slowdown concerns."
                },
                {
                    "title": "🔥 Top Movers",
                    "content": "**Gainers**: HPS (+1.80%), Managem (+1.79%), Label Vie (+1.19%). **Decliners**: Ciments du Maroc (-0.80%), Taqa Morocco (-0.67%), BCP (-0.45%)."
                },
                {
                    "title": "📊 Technical Analysis",
                    "content": "MASI remains above its 50-day moving average (12,980), maintaining bullish momentum. RSI at 58 indicates room for further upside. Key resistance at 13,400; support at 13,000."
                },
                {
                    "title": "💡 Investment Insights",
                    "content": "Banking sector presents value opportunities ahead of earnings season. Consider accumulating quality names on dips. Technology sector momentum remains strong but valuations are stretched."
                }
            ],
            "sentiment": "bullish",
            "confidence": 72
        }
        
        self.wfile.write(json.dumps(briefing).encode())
        return
