from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime, timedelta
import random
import math

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Generate realistic MASI history data
        history = []
        base_value = 12500
        
        for i in range(90):
            date = datetime.now() - timedelta(days=90-i)
            # Add trend and noise
            trend = i * 2.5
            seasonal = math.sin(i * 0.1) * 100
            noise = random.uniform(-50, 50)
            
            value = base_value + trend + seasonal + noise
            
            history.append({
                "date": date.strftime("%Y-%m-%d"),
                "value": round(value, 2),
                "volume": random.randint(40000000, 80000000)
            })
        
        response = {
            "index": "MASI",
            "history": history,
            "period": "90d"
        }
        
        self.wfile.write(json.dumps(response).encode())
        return
