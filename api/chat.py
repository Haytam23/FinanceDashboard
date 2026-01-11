from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body)
            message = data.get('message', '').lower()
        except:
            message = ''
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Knowledge base for Bourse de Casablanca
        response = self.get_response(message)
        
        self.wfile.write(json.dumps({"response": response}).encode())
        return
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
    
    def get_response(self, message):
        knowledge = {
            "masi": "The MASI (Moroccan All Shares Index) is the main stock index of the Bourse de Casablanca. It tracks all listed companies and is the primary benchmark for the Moroccan stock market. Current level is around 13,245 points.",
            "trading hours": "The Bourse de Casablanca is open Monday to Friday, 9:30 AM to 3:30 PM (Morocco time). Pre-opening session runs from 9:00 AM to 9:30 AM.",
            "how to invest": "To invest in the Moroccan stock market: 1) Open a brokerage account with an authorized broker (like Attijari Intermediation, BMCE Capital Bourse, or CDG Capital Bourse), 2) Fund your account, 3) Start with blue-chip stocks like ATW, IAM, or BCP for stability.",
            "best stocks": "Top Moroccan stocks to consider: Attijariwafa Bank (ATW) - largest bank, Maroc Telecom (IAM) - telecom leader, Cosumar (CSR) - sugar monopoly, Label Vie (LBV) - retail growth, HPS - fintech innovation.",
            "sectors": "Main sectors on Bourse de Casablanca: Banking (40% of market cap), Telecom, Real Estate, Mining, Construction Materials, Agribusiness, and Technology.",
            "dividends": "Many Moroccan stocks pay attractive dividends. Maroc Telecom (IAM) typically yields 5-6%, banks like ATW and BCP yield 3-4%. Dividend payments are usually annual after shareholder approval.",
            "atw": "Attijariwafa Bank (ATW) is Morocco's largest bank by market cap. It has operations across Africa and is considered a blue-chip investment. Current price around 485 MAD.",
            "iam": "Maroc Telecom (IAM) is the dominant telecom operator in Morocco. Majority owned by Etisalat. Known for stable dividends and defensive characteristics.",
            "risks": "Key risks: Currency fluctuation, political changes, economic dependence on agriculture and tourism, liquidity constraints in smaller stocks, and global market correlation.",
            "hello": "Hello! I'm your Bourse de Casablanca assistant. I can help you with information about Moroccan stocks, market indices, trading hours, and investment strategies. What would you like to know?",
            "help": "I can help you with: Market indices (MASI, MADEX), Stock information (ATW, IAM, BCP, etc.), Trading hours, How to invest, Sector analysis, Dividend information, and Market risks. Just ask!"
        }
        
        for key, value in knowledge.items():
            if key in message:
                return value
        
        return "I'm your Bourse de Casablanca assistant. I can help with questions about MASI index, trading hours, how to invest, best stocks, sectors, dividends, and more. What would you like to know about the Moroccan stock market?"
