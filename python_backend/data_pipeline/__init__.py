"""
Casablanca Stock Exchange Data Ingestion Pipeline
==================================================

A modular data pipeline for fetching and normalizing financial data
from the Moroccan stock market with intelligent fallback mechanisms.

Author: Financial Data Engineering Team
Purpose: Academic and decision-support analytics
License: MIT
"""

from .pipeline import MarketDataPipeline
from .schemas import StockData, MarketIndices, UnifiedMarketData

__all__ = ['MarketDataPipeline', 'StockData', 'MarketIndices', 'UnifiedMarketData']
__version__ = '1.0.0'
