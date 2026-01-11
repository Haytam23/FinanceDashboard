"""
Data Schemas and Models
========================

Defines unified data structures for all market data sources.
Ensures consistency across primary, fallback, and optional data providers.
"""

from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field, validator
from decimal import Decimal


class StockData(BaseModel):
    """
    Unified stock data schema.
    
    All data sources must normalize to this format for consistency.
    """
    symbol: str = Field(..., description="Stock ticker symbol")
    name: str = Field(..., description="Company name")
    price: Decimal = Field(..., description="Current/closing price in MAD")
    open: Optional[Decimal] = Field(None, description="Opening price")
    high: Optional[Decimal] = Field(None, description="Day's high")
    low: Optional[Decimal] = Field(None, description="Day's low")
    close: Optional[Decimal] = Field(None, description="Closing price")
    volume: int = Field(..., description="Trading volume")
    change: Decimal = Field(..., description="Absolute price change")
    change_percent: Decimal = Field(..., description="Percentage change")
    market_cap: Optional[Decimal] = Field(None, description="Market capitalization in MAD")
    sector: Optional[str] = Field(None, description="Industry sector")
    pe_ratio: Optional[Decimal] = Field(None, description="Price-to-earnings ratio")
    dividend_yield: Optional[Decimal] = Field(None, description="Dividend yield percentage")
    timestamp: datetime = Field(default_factory=datetime.now, description="Data fetch timestamp")
    source: Literal['casablanca_bourse', 'yahoo_finance', 'manual'] = Field(..., description="Data source identifier")
    
    @validator('price', 'change', 'change_percent')
    def validate_numeric(cls, v):
        """Ensure numeric values are valid"""
        if v is not None and v < 0 and v != v:  # Check for NaN
            raise ValueError("Invalid numeric value")
        return v
    
    class Config:
        json_encoders = {
            Decimal: float,
            datetime: lambda v: v.isoformat()
        }


class MarketIndices(BaseModel):
    """
    Market indices data for Casablanca Stock Exchange.
    
    Tracks MASI (Moroccan All Shares Index) and MADEX (Moroccan Most Active Shares Index).
    """
    masi: Decimal = Field(..., description="MASI index value")
    masi_change: Decimal = Field(..., description="MASI percentage change")
    masi_volume: Optional[int] = Field(None, description="MASI trading volume")
    
    madex: Decimal = Field(..., description="MADEX index value")
    madex_change: Decimal = Field(..., description="MADEX percentage change")
    madex_volume: Optional[int] = Field(None, description="MADEX trading volume")
    
    timestamp: datetime = Field(default_factory=datetime.now, description="Data fetch timestamp")
    source: Literal['casablanca_bourse', 'calculated', 'yahoo_finance'] = Field(..., description="Data source")
    market_status: Literal['open', 'closed', 'pre_market', 'after_hours'] = Field(..., description="Market session status")
    
    class Config:
        json_encoders = {
            Decimal: float,
            datetime: lambda v: v.isoformat()
        }


class TechnicalIndicators(BaseModel):
    """
    Technical indicators (optional - from Alpha Vantage or calculated).
    """
    symbol: str
    rsi: Optional[Decimal] = Field(None, description="Relative Strength Index")
    sma_20: Optional[Decimal] = Field(None, description="20-day Simple Moving Average")
    sma_50: Optional[Decimal] = Field(None, description="50-day Simple Moving Average")
    sma_200: Optional[Decimal] = Field(None, description="200-day Simple Moving Average")
    ema_12: Optional[Decimal] = Field(None, description="12-day Exponential Moving Average")
    ema_26: Optional[Decimal] = Field(None, description="26-day Exponential Moving Average")
    macd: Optional[Decimal] = Field(None, description="MACD indicator")
    macd_signal: Optional[Decimal] = Field(None, description="MACD signal line")
    bollinger_upper: Optional[Decimal] = Field(None, description="Bollinger Band upper")
    bollinger_lower: Optional[Decimal] = Field(None, description="Bollinger Band lower")
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        json_encoders = {
            Decimal: float,
            datetime: lambda v: v.isoformat()
        }


class UnifiedMarketData(BaseModel):
    """
    Complete market snapshot combining all data types.
    
    This is the primary output format for the data pipeline.
    """
    indices: MarketIndices
    stocks: list[StockData]
    technical_indicators: Optional[dict[str, TechnicalIndicators]] = Field(None, description="Symbol -> Indicators mapping")
    data_quality: dict = Field(default_factory=dict, description="Data quality metrics")
    fetch_metadata: dict = Field(default_factory=dict, description="Fetch process metadata")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
