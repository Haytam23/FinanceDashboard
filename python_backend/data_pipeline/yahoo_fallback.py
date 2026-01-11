"""
Yahoo Finance Fallback Data Source
===================================

Secondary data source using yfinance library.
Used when primary Casablanca Bourse source is unavailable.

Provides:
- Historical price data
- Trend analysis
- Volatility calculations
- Fallback real-time quotes
"""

import logging
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Optional, List
import pandas as pd
import yfinance as yf
import numpy as np

from .schemas import StockData, MarketIndices

logger = logging.getLogger(__name__)


class YahooFinanceFallback:
    """
    Fallback data provider using Yahoo Finance.
    
    Handles Moroccan stocks that may be listed internationally
    or provides proxy data for analysis.
    """
    
    # Mapping of Moroccan symbols to Yahoo Finance tickers
    SYMBOL_MAPPING = {
        'ATW': 'ATW.CS',  # Casablanca suffix
        'BCP': 'BCP.CS',
        'CDM': 'CDM.CS',
        'IAM': 'IAM.CS',
        'ADH': 'ADH.CS',
        'ALL': 'ALL.CS',
        'LHM': 'LHM.CS',
        'SID': 'SID.CS',
        'WAA': 'WAA.CS',
        'MNG': 'MNG.CS',
        'LBL': 'LBL.CS',
    }
    
    def __init__(self, cache_duration_minutes: int = 5):
        """
        Initialize Yahoo Finance fallback client.
        
        Args:
            cache_duration_minutes: Cache duration to avoid excessive API calls
        """
        self.cache_duration = timedelta(minutes=cache_duration_minutes)
        self._cache = {}
        self._cache_timestamps = {}
        
        logger.info("Initialized Yahoo Finance fallback client")
    
    def _get_yahoo_symbol(self, local_symbol: str) -> str:
        """
        Convert local Moroccan symbol to Yahoo Finance ticker.
        
        Args:
            local_symbol: Local stock symbol (e.g., 'ATW')
        
        Returns:
            Yahoo Finance ticker (e.g., 'ATW.CS')
        """
        return self.SYMBOL_MAPPING.get(local_symbol, f"{local_symbol}.CS")
    
    def _is_cache_valid(self, symbol: str) -> bool:
        """Check if cached data is still valid."""
        if symbol not in self._cache_timestamps:
            return False
        
        age = datetime.now() - self._cache_timestamps[symbol]
        return age < self.cache_duration
    
    def fetch_stock_data(self, symbol: str, use_cache: bool = True) -> Optional[StockData]:
        """
        Fetch stock data from Yahoo Finance.
        
        Args:
            symbol: Local stock symbol
            use_cache: Whether to use cached data if available
        
        Returns:
            StockData object or None if fetch fails
        """
        try:
            # Check cache first
            if use_cache and self._is_cache_valid(symbol):
                logger.debug(f"Using cached data for {symbol}")
                return self._cache[symbol]
            
            yahoo_symbol = self._get_yahoo_symbol(symbol)
            logger.info(f"Fetching {symbol} ({yahoo_symbol}) from Yahoo Finance")
            
            ticker = yf.Ticker(yahoo_symbol)
            info = ticker.info
            hist = ticker.history(period='5d')
            
            if hist.empty:
                logger.warning(f"No historical data available for {yahoo_symbol}")
                return None
            
            latest = hist.iloc[-1]
            previous = hist.iloc[-2] if len(hist) > 1 else latest
            
            # Calculate change
            current_price = float(latest['Close'])
            previous_price = float(previous['Close'])
            change = current_price - previous_price
            change_percent = (change / previous_price * 100) if previous_price else 0
            
            stock_data = StockData(
                symbol=symbol,
                name=info.get('longName', symbol),
                price=Decimal(str(current_price)),
                open=Decimal(str(float(latest['Open']))) if 'Open' in latest else None,
                high=Decimal(str(float(latest['High']))) if 'High' in latest else None,
                low=Decimal(str(float(latest['Low']))) if 'Low' in latest else None,
                close=Decimal(str(current_price)),
                volume=int(latest['Volume']),
                change=Decimal(str(change)),
                change_percent=Decimal(str(change_percent)),
                market_cap=Decimal(str(info.get('marketCap', 0))) if info.get('marketCap') else None,
                sector=info.get('sector'),
                pe_ratio=Decimal(str(info.get('trailingPE', 0))) if info.get('trailingPE') else None,
                dividend_yield=Decimal(str(info.get('dividendYield', 0) * 100)) if info.get('dividendYield') else None,
                source='yahoo_finance'
            )
            
            # Update cache
            self._cache[symbol] = stock_data
            self._cache_timestamps[symbol] = datetime.now()
            
            return stock_data
            
        except Exception as e:
            logger.error(f"Error fetching {symbol} from Yahoo Finance: {e}")
            return None
    
    def fetch_all_stocks(self, symbols: List[str]) -> List[StockData]:
        """
        Fetch data for multiple stocks.
        
        Args:
            symbols: List of stock symbols
        
        Returns:
            List of StockData objects
        """
        stocks = []
        for symbol in symbols:
            stock_data = self.fetch_stock_data(symbol)
            if stock_data:
                stocks.append(stock_data)
        
        logger.info(f"Fetched {len(stocks)}/{len(symbols)} stocks from Yahoo Finance")
        return stocks
    
    def fetch_historical_data(
        self,
        symbol: str,
        period: str = '1y',
        interval: str = '1d'
    ) -> pd.DataFrame:
        """
        Fetch historical price data.
        
        Args:
            symbol: Stock symbol
            period: Data period (e.g., '1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', 'max')
            interval: Data interval (e.g., '1m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo')
        
        Returns:
            pandas DataFrame with OHLCV data
        """
        try:
            yahoo_symbol = self._get_yahoo_symbol(symbol)
            logger.info(f"Fetching historical data for {symbol} (period={period}, interval={interval})")
            
            ticker = yf.Ticker(yahoo_symbol)
            hist = ticker.history(period=period, interval=interval)
            
            if hist.empty:
                logger.warning(f"No historical data for {yahoo_symbol}")
                return pd.DataFrame()
            
            # Normalize column names
            hist = hist.rename(columns={
                'Open': 'open',
                'High': 'high',
                'Low': 'low',
                'Close': 'close',
                'Volume': 'volume'
            })
            
            hist['symbol'] = symbol
            hist['source'] = 'yahoo_finance'
            
            return hist
            
        except Exception as e:
            logger.error(f"Error fetching historical data for {symbol}: {e}")
            return pd.DataFrame()
    
    def calculate_volatility(self, symbol: str, period: str = '1y') -> Optional[float]:
        """
        Calculate historical volatility (annualized standard deviation of returns).
        
        Args:
            symbol: Stock symbol
            period: Historical period for calculation
        
        Returns:
            Annualized volatility as percentage
        """
        try:
            hist = self.fetch_historical_data(symbol, period=period, interval='1d')
            
            if hist.empty or len(hist) < 2:
                return None
            
            # Calculate daily returns
            hist['returns'] = hist['close'].pct_change()
            
            # Annualized volatility (assuming 252 trading days)
            volatility = hist['returns'].std() * np.sqrt(252) * 100
            
            logger.info(f"Calculated volatility for {symbol}: {volatility:.2f}%")
            return float(volatility)
            
        except Exception as e:
            logger.error(f"Error calculating volatility for {symbol}: {e}")
            return None
    
    def calculate_moving_averages(
        self,
        symbol: str,
        periods: List[int] = [20, 50, 200]
    ) -> dict:
        """
        Calculate simple moving averages.
        
        Args:
            symbol: Stock symbol
            periods: List of periods for SMA calculation
        
        Returns:
            Dictionary of {period: sma_value}
        """
        try:
            hist = self.fetch_historical_data(symbol, period='1y', interval='1d')
            
            if hist.empty:
                return {}
            
            smas = {}
            for period in periods:
                if len(hist) >= period:
                    sma = hist['close'].rolling(window=period).mean().iloc[-1]
                    smas[f'sma_{period}'] = float(sma)
            
            logger.info(f"Calculated moving averages for {symbol}: {smas}")
            return smas
            
        except Exception as e:
            logger.error(f"Error calculating moving averages for {symbol}: {e}")
            return {}
    
    def calculate_rsi(self, symbol: str, period: int = 14) -> Optional[float]:
        """
        Calculate Relative Strength Index (RSI).
        
        Args:
            symbol: Stock symbol
            period: RSI period (default: 14)
        
        Returns:
            RSI value (0-100)
        """
        try:
            hist = self.fetch_historical_data(symbol, period='3mo', interval='1d')
            
            if hist.empty or len(hist) < period + 1:
                return None
            
            # Calculate price changes
            delta = hist['close'].diff()
            
            # Separate gains and losses
            gains = delta.where(delta > 0, 0)
            losses = -delta.where(delta < 0, 0)
            
            # Calculate average gains and losses
            avg_gains = gains.rolling(window=period).mean()
            avg_losses = losses.rolling(window=period).mean()
            
            # Calculate RS and RSI
            rs = avg_gains / avg_losses
            rsi = 100 - (100 / (1 + rs))
            
            current_rsi = float(rsi.iloc[-1])
            logger.info(f"Calculated RSI for {symbol}: {current_rsi:.2f}")
            
            return current_rsi
            
        except Exception as e:
            logger.error(f"Error calculating RSI for {symbol}: {e}")
            return None
    
    def to_dataframe(self, stocks: List[StockData]) -> pd.DataFrame:
        """
        Convert list of StockData to pandas DataFrame.
        
        Args:
            stocks: List of StockData objects
        
        Returns:
            pandas DataFrame
        """
        if not stocks:
            return pd.DataFrame()
        
        data = [stock.dict() for stock in stocks]
        df = pd.DataFrame(data)
        
        return df
