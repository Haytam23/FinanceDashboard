"""
Alpha Vantage Optional Integration
===================================

Optional module for advanced technical indicators and macro-economic data.
Requires Alpha Vantage API key.

Features:
- Technical indicators (RSI, MACD, Bollinger Bands, etc.)
- Fundamental data
- Macro-economic indicators
"""

import logging
from typing import Optional, Dict
from decimal import Decimal
import requests
import pandas as pd

from .schemas import TechnicalIndicators

logger = logging.getLogger(__name__)


class AlphaVantageClient:
    """
    Optional Alpha Vantage integration for advanced analytics.
    
    Note: This requires an API key from alphavantage.co
    Free tier: 5 API calls per minute, 500 calls per day
    """
    
    BASE_URL = "https://www.alphavantage.co/query"
    
    def __init__(self, api_key: Optional[str] = None, timeout: int = 10):
        """
        Initialize Alpha Vantage client.
        
        Args:
            api_key: Alpha Vantage API key (optional)
            timeout: Request timeout in seconds
        """
        self.api_key = api_key
        self.timeout = timeout
        self.enabled = api_key is not None
        
        if not self.enabled:
            logger.warning("Alpha Vantage API key not provided - this module is disabled")
        else:
            logger.info("Alpha Vantage client initialized")
    
    def is_enabled(self) -> bool:
        """Check if Alpha Vantage integration is enabled."""
        return self.enabled
    
    def _make_request(self, params: dict) -> Optional[dict]:
        """
        Make API request to Alpha Vantage.
        
        Args:
            params: Query parameters
        
        Returns:
            JSON response or None if request fails
        """
        if not self.enabled:
            logger.debug("Alpha Vantage is disabled")
            return None
        
        try:
            params['apikey'] = self.api_key
            response = requests.get(self.BASE_URL, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            
            # Check for API errors
            if 'Error Message' in data:
                logger.error(f"Alpha Vantage API error: {data['Error Message']}")
                return None
            
            if 'Note' in data:
                logger.warning(f"Alpha Vantage rate limit: {data['Note']}")
                return None
            
            return data
            
        except requests.RequestException as e:
            logger.error(f"Error calling Alpha Vantage API: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error with Alpha Vantage: {e}")
            return None
    
    def fetch_rsi(self, symbol: str, interval: str = 'daily', time_period: int = 14) -> Optional[float]:
        """
        Fetch RSI (Relative Strength Index) from Alpha Vantage.
        
        Args:
            symbol: Stock symbol
            interval: Time interval (daily, weekly, monthly)
            time_period: Number of periods for RSI calculation
        
        Returns:
            Current RSI value or None
        """
        params = {
            'function': 'RSI',
            'symbol': symbol,
            'interval': interval,
            'time_period': time_period,
            'series_type': 'close'
        }
        
        data = self._make_request(params)
        
        if not data or 'Technical Analysis: RSI' not in data:
            return None
        
        try:
            rsi_data = data['Technical Analysis: RSI']
            latest_date = list(rsi_data.keys())[0]
            rsi_value = float(rsi_data[latest_date]['RSI'])
            
            logger.info(f"Fetched RSI for {symbol}: {rsi_value:.2f}")
            return rsi_value
            
        except (KeyError, IndexError, ValueError) as e:
            logger.error(f"Error parsing RSI data: {e}")
            return None
    
    def fetch_macd(self, symbol: str, interval: str = 'daily') -> Optional[Dict[str, float]]:
        """
        Fetch MACD (Moving Average Convergence Divergence).
        
        Args:
            symbol: Stock symbol
            interval: Time interval
        
        Returns:
            Dictionary with MACD, signal, and histogram values
        """
        params = {
            'function': 'MACD',
            'symbol': symbol,
            'interval': interval,
            'series_type': 'close'
        }
        
        data = self._make_request(params)
        
        if not data or 'Technical Analysis: MACD' not in data:
            return None
        
        try:
            macd_data = data['Technical Analysis: MACD']
            latest_date = list(macd_data.keys())[0]
            latest = macd_data[latest_date]
            
            result = {
                'macd': float(latest['MACD']),
                'signal': float(latest['MACD_Signal']),
                'histogram': float(latest['MACD_Hist'])
            }
            
            logger.info(f"Fetched MACD for {symbol}: {result}")
            return result
            
        except (KeyError, IndexError, ValueError) as e:
            logger.error(f"Error parsing MACD data: {e}")
            return None
    
    def fetch_bollinger_bands(self, symbol: str, interval: str = 'daily') -> Optional[Dict[str, float]]:
        """
        Fetch Bollinger Bands.
        
        Args:
            symbol: Stock symbol
            interval: Time interval
        
        Returns:
            Dictionary with upper, middle, and lower band values
        """
        params = {
            'function': 'BBANDS',
            'symbol': symbol,
            'interval': interval,
            'time_period': 20,
            'series_type': 'close'
        }
        
        data = self._make_request(params)
        
        if not data or 'Technical Analysis: BBANDS' not in data:
            return None
        
        try:
            bbands_data = data['Technical Analysis: BBANDS']
            latest_date = list(bbands_data.keys())[0]
            latest = bbands_data[latest_date]
            
            result = {
                'upper': float(latest['Real Upper Band']),
                'middle': float(latest['Real Middle Band']),
                'lower': float(latest['Real Lower Band'])
            }
            
            logger.info(f"Fetched Bollinger Bands for {symbol}: {result}")
            return result
            
        except (KeyError, IndexError, ValueError) as e:
            logger.error(f"Error parsing Bollinger Bands data: {e}")
            return None
    
    def fetch_sma(self, symbol: str, time_period: int = 50, interval: str = 'daily') -> Optional[float]:
        """
        Fetch Simple Moving Average.
        
        Args:
            symbol: Stock symbol
            time_period: Number of periods
            interval: Time interval
        
        Returns:
            SMA value or None
        """
        params = {
            'function': 'SMA',
            'symbol': symbol,
            'interval': interval,
            'time_period': time_period,
            'series_type': 'close'
        }
        
        data = self._make_request(params)
        
        if not data or 'Technical Analysis: SMA' not in data:
            return None
        
        try:
            sma_data = data['Technical Analysis: SMA']
            latest_date = list(sma_data.keys())[0]
            sma_value = float(sma_data[latest_date]['SMA'])
            
            logger.info(f"Fetched SMA{time_period} for {symbol}: {sma_value:.2f}")
            return sma_value
            
        except (KeyError, IndexError, ValueError) as e:
            logger.error(f"Error parsing SMA data: {e}")
            return None
    
    def fetch_all_indicators(self, symbol: str) -> Optional[TechnicalIndicators]:
        """
        Fetch comprehensive technical indicators for a symbol.
        
        Args:
            symbol: Stock symbol
        
        Returns:
            TechnicalIndicators object or None
        """
        if not self.enabled:
            return None
        
        logger.info(f"Fetching all technical indicators for {symbol}")
        
        # Fetch various indicators (respecting rate limits)
        rsi = self.fetch_rsi(symbol)
        macd_data = self.fetch_macd(symbol)
        bbands = self.fetch_bollinger_bands(symbol)
        sma_20 = self.fetch_sma(symbol, time_period=20)
        sma_50 = self.fetch_sma(symbol, time_period=50)
        sma_200 = self.fetch_sma(symbol, time_period=200)
        
        # Create TechnicalIndicators object
        indicators = TechnicalIndicators(
            symbol=symbol,
            rsi=Decimal(str(rsi)) if rsi else None,
            sma_20=Decimal(str(sma_20)) if sma_20 else None,
            sma_50=Decimal(str(sma_50)) if sma_50 else None,
            sma_200=Decimal(str(sma_200)) if sma_200 else None,
            macd=Decimal(str(macd_data['macd'])) if macd_data else None,
            macd_signal=Decimal(str(macd_data['signal'])) if macd_data else None,
            bollinger_upper=Decimal(str(bbands['upper'])) if bbands else None,
            bollinger_lower=Decimal(str(bbands['lower'])) if bbands else None
        )
        
        return indicators
