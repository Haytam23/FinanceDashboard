from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
import random

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Mock Moroccan market data
        stocks = [
            {"symbol": "ATW", "name": "Attijariwafa Bank", "price": 485.50, "change": 2.35, "changePercent": 0.49, "volume": 45230, "sector": "Banking"},
            {"symbol": "BCP", "name": "Banque Centrale Populaire", "price": 268.00, "change": -1.20, "changePercent": -0.45, "volume": 32100, "sector": "Banking"},
            {"symbol": "IAM", "name": "Maroc Telecom", "price": 128.50, "change": 1.50, "changePercent": 1.18, "volume": 89450, "sector": "Telecom"},
            {"symbol": "BOA", "name": "Bank of Africa", "price": 185.00, "change": 0.80, "changePercent": 0.43, "volume": 28900, "sector": "Banking"},
            {"symbol": "CMA", "name": "Ciments du Maroc", "price": 1850.00, "change": -15.00, "changePercent": -0.80, "volume": 5670, "sector": "Materials"},
            {"symbol": "MNG", "name": "Managem", "price": 1420.00, "change": 25.00, "changePercent": 1.79, "volume": 12340, "sector": "Mining"},
            {"symbol": "LBV", "name": "Label Vie", "price": 4250.00, "change": 50.00, "changePercent": 1.19, "volume": 3200, "sector": "Retail"},
            {"symbol": "TQM", "name": "Taqa Morocco", "price": 1180.00, "change": -8.00, "changePercent": -0.67, "volume": 7890, "sector": "Energy"},
            {"symbol": "CSR", "name": "Cosumar", "price": 198.50, "change": 2.10, "changePercent": 1.07, "volume": 41200, "sector": "Agribusiness"},
            {"symbol": "HPS", "name": "HPS", "price": 6800.00, "change": 120.00, "changePercent": 1.80, "volume": 1890, "sector": "Technology"},
        ]
        
        # Add some randomness
        for stock in stocks:
            variation = random.uniform(-0.5, 0.5)
            stock["change"] = round(stock["change"] + variation, 2)
            stock["changePercent"] = round((stock["change"] / stock["price"]) * 100, 2)
        
        indices = {
            "MASI": {"value": 13245.67, "change": 45.23, "changePercent": 0.34},
            "MADEX": {"value": 10876.54, "change": 32.11, "changePercent": 0.30},
        }
        
        response = {
            "stocks": stocks,
            "indices": indices,
            "timestamp": datetime.now().isoformat(),
            "market_status": "open" if datetime.now().hour >= 9 and datetime.now().hour < 15 else "closed"
        }
        
        self.wfile.write(json.dumps(response).encode())
        return
