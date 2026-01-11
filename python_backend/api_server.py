"""
FastAPI Server for Market Data Pipeline
========================================

REST API server that exposes the Casablanca Stock Exchange data pipeline
to the Next.js frontend.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timezone
import logging
from typing import Optional, List, Dict
import uvicorn
import os

from data_pipeline import MarketDataPipeline
from data_pipeline.config import PipelineConfig

# OpenAI import
try:
    from openai import OpenAI
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    OPENAI_AVAILABLE = True
except Exception as e:
    logger = logging.getLogger(__name__)
    logger.warning(f"OpenAI not available: {e}")
    OPENAI_AVAILABLE = False

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Casablanca Stock Exchange API",
    description="Real-time market data from Bourse de Casablanca",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data pipeline
logger.info("Initializing market data pipeline...")
pipeline = MarketDataPipeline()
logger.info("Pipeline ready!")


def get_mock_market_data():
    """Return mock market data for demonstration when real sources are unavailable."""
    from datetime import timezone
    
    return {
        "indices": {
            "masi": 13245.67,
            "masi_change": 125.34,
            "masi_volume": 2450000,
            "madex": 10789.23,
            "madex_change": 87.12,
            "madex_volume": 1980000,
            "market_status": "OPEN",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "mock"
        },
        "stocks": [
            {
                "symbol": "ATW",
                "name": "Attijariwafa Bank",
                "price": 489.50,
                "open": 477.20,
                "high": 491.00,
                "low": 475.50,
                "close": 489.50,
                "volume": 145678,
                "change": 12.30,
                "change_percent": 2.58,
                "market_cap": 45678900000.0,
                "sector": "Banking",
                "pe_ratio": 18.5,
                "dividend_yield": 4.2,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "mock"
            },
            {
                "symbol": "BCP",
                "name": "Banque Centrale Populaire",
                "price": 285.75,
                "open": 289.00,
                "high": 290.50,
                "low": 284.00,
                "close": 285.75,
                "volume": 98234,
                "change": -3.25,
                "change_percent": -1.13,
                "market_cap": 28900000000.0,
                "sector": "Banking",
                "pe_ratio": 15.2,
                "dividend_yield": 3.8,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "mock"
            },
            {
                "symbol": "IAM",
                "name": "Maroc Telecom",
                "price": 128.40,
                "open": 126.50,
                "high": 129.00,
                "low": 126.00,
                "close": 128.40,
                "volume": 234567,
                "change": 1.90,
                "change_percent": 1.50,
                "market_cap": 23456000000.0,
                "sector": "Telecommunications",
                "pe_ratio": 22.3,
                "dividend_yield": 5.1,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "mock"
            },
            {
                "symbol": "CDM",
                "name": "Crédit du Maroc",
                "price": 542.00,
                "open": 538.50,
                "high": 545.00,
                "low": 537.00,
                "close": 542.00,
                "volume": 45823,
                "change": 3.50,
                "change_percent": 0.65,
                "market_cap": 15234000000.0,
                "sector": "Banking",
                "pe_ratio": 16.8,
                "dividend_yield": 4.5,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "mock"
            },
            {
                "symbol": "ADH",
                "name": "Douja Prom Addoha",
                "price": 18.75,
                "open": 18.50,
                "high": 18.90,
                "low": 18.40,
                "close": 18.75,
                "volume": 567891,
                "change": 0.25,
                "change_percent": 1.35,
                "market_cap": 8900000000.0,
                "sector": "Real Estate",
                "pe_ratio": 12.5,
                "dividend_yield": 2.8,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "mock"
            }
        ],
        "data_quality": {
            "completeness": 100,
            "freshness": 100,
            "source_health": "mock"
        },
        "fetch_metadata": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "duration_seconds": 0.1,
            "primary_success": False,
            "fallback_used": False,
            "stocks_fetched": 5,
            "indices_fetched": 2,
            "errors": []
        }
    }


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "Casablanca Stock Exchange API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/health")
async def health_check():
    """Detailed health check with pipeline status."""
    try:
        status = pipeline.get_pipeline_status()
        return {
            "status": "healthy",
            "pipeline": status,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")


@app.get("/api/market/snapshot")
async def get_market_snapshot(force_refresh: bool = False, use_mock: bool = True):
    """
    Get complete market snapshot including indices and stocks.
    
    Query params:
        force_refresh: Force refresh data from sources (default: false)
        use_mock: Use mock data directly (default: true for faster loading)
    """
    # Use mock data by default for faster response
    if use_mock:
        logger.info("Returning mock data (use_mock=True)")
        return get_mock_market_data()
    
    try:
        logger.info(f"Fetching market snapshot (force_refresh={force_refresh})")
        
        # Try to fetch real data, fallback to mock if it fails
        try:
            market_data = pipeline.fetch_market_snapshot(force_refresh=force_refresh)
        except Exception as real_data_error:
            logger.warning(f"Failed to fetch real data: {real_data_error}")
            logger.info("Returning mock data for demonstration")
            
            # Return mock data
            from datetime import timezone
            from decimal import Decimal
            
            return get_mock_market_data()
        
        
        # Convert to JSON-serializable format
        return {
            "indices": {
                "masi": float(market_data.indices.masi),
                "masi_change": float(market_data.indices.masi_change),
                "masi_volume": market_data.indices.masi_volume,
                "madex": float(market_data.indices.madex),
                "madex_change": float(market_data.indices.madex_change),
                "madex_volume": market_data.indices.madex_volume,
                "market_status": market_data.indices.market_status,
                "timestamp": market_data.indices.timestamp.isoformat(),
                "source": market_data.indices.source
            },
            "stocks": [
                {
                    "symbol": stock.symbol,
                    "name": stock.name,
                    "price": float(stock.price),
                    "open": float(stock.open) if stock.open else None,
                    "high": float(stock.high) if stock.high else None,
                    "low": float(stock.low) if stock.low else None,
                    "close": float(stock.close) if stock.close else None,
                    "volume": stock.volume,
                    "change": float(stock.change),
                    "change_percent": float(stock.change_percent),
                    "market_cap": float(stock.market_cap) if stock.market_cap else None,
                    "sector": stock.sector,
                    "pe_ratio": float(stock.pe_ratio) if stock.pe_ratio else None,
                    "dividend_yield": float(stock.dividend_yield) if stock.dividend_yield else None,
                    "timestamp": stock.timestamp.isoformat(),
                    "source": stock.source
                }
                for stock in market_data.stocks
            ],
            "data_quality": market_data.data_quality,
            "fetch_metadata": market_data.fetch_metadata
        }
    except Exception as e:
        logger.error(f"Error fetching market snapshot: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stocks")
async def get_all_stocks():
    """Get list of all stocks."""
    try:
        df = pipeline.get_stocks_dataframe()
        
        if df.empty:
            return {"stocks": []}
        
        # Convert DataFrame to list of dicts
        stocks = df.to_dict('records')
        
        # Convert Decimal to float
        for stock in stocks:
            for key, value in stock.items():
                if hasattr(value, '__float__'):
                    stock[key] = float(value)
        
        return {"stocks": stocks}
    except Exception as e:
        logger.error(f"Error fetching stocks: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stocks/{symbol}")
async def get_stock_detail(symbol: str):
    """Get detailed information for a specific stock."""
    try:
        market_data = pipeline.fetch_market_snapshot()
        
        # Find the stock
        stock = next((s for s in market_data.stocks if s.symbol == symbol), None)
        
        if not stock:
            raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
        
        return {
            "symbol": stock.symbol,
            "name": stock.name,
            "price": float(stock.price),
            "open": float(stock.open) if stock.open else None,
            "high": float(stock.high) if stock.high else None,
            "low": float(stock.low) if stock.low else None,
            "close": float(stock.close) if stock.close else None,
            "volume": stock.volume,
            "change": float(stock.change),
            "change_percent": float(stock.change_percent),
            "market_cap": float(stock.market_cap) if stock.market_cap else None,
            "sector": stock.sector,
            "pe_ratio": float(stock.pe_ratio) if stock.pe_ratio else None,
            "dividend_yield": float(stock.dividend_yield) if stock.dividend_yield else None,
            "timestamp": stock.timestamp.isoformat(),
            "source": stock.source
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching stock {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/indices/masi/history")
async def get_masi_history(period: str = "1mo"):
    """
    Get historical MASI index data (mock data for now).
    
    Query params:
        period: Time period (1mo, 3mo, 6mo, 1y)
    """
    try:
        logger.info(f"Fetching MASI history (period={period})")
        
        # Generate mock historical data for MASI index
        from datetime import timedelta
        
        days_map = {"1mo": 30, "3mo": 90, "6mo": 180, "1y": 365}
        num_days = days_map.get(period, 30)
        
        base_value = 13100
        history = []
        
        for i in range(num_days):
            date = (datetime.now(timezone.utc) - timedelta(days=num_days-i)).date()
            # Simulate realistic market movement
            import random
            random.seed(i)  # Consistent data
            value = base_value + (i * 5) + random.uniform(-50, 50)
            
            history.append({
                "date": date.isoformat(),
                "value": round(value, 2),
                "high": round(value + random.uniform(10, 30), 2),
                "low": round(value - random.uniform(10, 30), 2)
            })
        
        return {"history": history, "period": period}
    except Exception as e:
        logger.error(f"Error fetching MASI history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stocks/{symbol}/history")
async def get_stock_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d"
):
    """
    Get historical data for a stock.
    
    Query params:
        period: Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, max)
        interval: Data interval (1m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo)
    """
    try:
        logger.info(f"Fetching history for {symbol} (period={period}, interval={interval})")
        hist_df = pipeline.fetch_historical_data(symbol, period=period, interval=interval)
        
        if hist_df.empty:
            return {"history": [], "symbol": symbol}
        
        # Reset index to include date column
        hist_df = hist_df.reset_index()
        
        # Convert to records
        history = hist_df.to_dict('records')
        
        # Convert datetime and Decimal to serializable formats
        for record in history:
            for key, value in record.items():
                if hasattr(value, 'isoformat'):
                    record[key] = value.isoformat()
                elif hasattr(value, '__float__'):
                    record[key] = float(value)
        
        return {
            "symbol": symbol,
            "period": period,
            "interval": interval,
            "history": history
        }
    except Exception as e:
        logger.error(f"Error fetching history for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sectors")
async def get_sector_performance():
    """Get sector-wise performance statistics."""
    try:
        df = pipeline.get_stocks_dataframe()
        
        if df.empty or 'sector' not in df.columns:
            return {"sectors": []}
        
        # Group by sector
        sector_stats = df.groupby('sector').agg({
            'symbol': 'count',
            'change_percent': 'mean',
            'volume': 'sum'
        }).reset_index()
        
        sector_stats.columns = ['sector', 'stock_count', 'avg_change', 'total_volume']
        
        # Convert to records
        sectors = sector_stats.to_dict('records')
        
        # Convert numeric types
        for sector in sectors:
            for key, value in sector.items():
                if hasattr(value, '__float__'):
                    sector[key] = float(value)
        
        return {"sectors": sectors}
    except Exception as e:
        logger.error(f"Error fetching sector performance: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Chatbot Models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []


@app.post("/api/chat")
async def chat_with_ai(request: ChatRequest):
    """
    AI chatbot for Bourse de Casablanca questions.
    Uses OpenAI GPT to answer questions about the Moroccan stock market.
    """
    if not OPENAI_AVAILABLE:
        return {
            "response": "I'm sorry, the AI chatbot is currently unavailable. Please check that the OpenAI API key is configured.",
            "error": "OpenAI not configured"
        }
    
    try:
        # System prompt for Bourse de Casablanca expert
        system_prompt = """You are an expert AI assistant specializing in the Moroccan stock market (Bourse de Casablanca).
        
Your knowledge includes:
- Bourse de Casablanca structure and operations
- MASI (Moroccan All Shares Index) and MADEX indices
- Major Moroccan companies and sectors (Banking, Telecommunications, Real Estate, Mining, etc.)
- Moroccan stock trading regulations and procedures
- Investment strategies for the Moroccan market
- Financial concepts and terminology in both French and English

Provide clear, accurate, and helpful responses. When discussing specific stocks or investment strategies, always remind users to do their own research and consult with financial advisors.

Keep responses concise (2-3 paragraphs max) unless asked for detailed explanations."""

        # Build conversation history
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add recent history (last 5 exchanges)
        for msg in request.history[-10:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Add current message
        messages.append({"role": "user", "content": request.message})
        
        # Call OpenAI
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        assistant_response = response.choices[0].message.content
        
        return {
            "response": assistant_response,
            "tokens_used": response.usage.total_tokens if hasattr(response, 'usage') else 0
        }
        
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return {
            "response": "I apologize, but I encountered an error processing your question. Please try rephrasing or ask another question about the Bourse de Casablanca.",
            "error": str(e)
        }


if __name__ == "__main__":
    logger.info("Starting Casablanca Stock Exchange API server...")
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
