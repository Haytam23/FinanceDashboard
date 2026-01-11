"""
Main Data Pipeline Orchestrator
================================

Coordinates all data sources with intelligent fallback logic.
Primary entry point for data ingestion.
"""

import logging
from typing import Optional, List, Dict
from datetime import datetime
import pandas as pd

from .schemas import StockData, MarketIndices, UnifiedMarketData, TechnicalIndicators
from .casablanca_source import CasablancaBourseClient
from .yahoo_fallback import YahooFinanceFallback
from .alphavantage_optional import AlphaVantageClient
from .config import PipelineConfig, setup_logging

logger = logging.getLogger(__name__)


class MarketDataPipeline:
    """
    Main data pipeline orchestrator.
    
    Coordinates primary, fallback, and optional data sources with
    automatic failover and data quality monitoring.
    
    Usage:
        # Initialize with default configuration
        pipeline = MarketDataPipeline()
        
        # Fetch market data
        market_data = pipeline.fetch_market_snapshot()
        
        # Get as DataFrame
        df = pipeline.get_stocks_dataframe()
        
        # Fetch historical data
        hist_df = pipeline.fetch_historical_data('ATW', period='1y')
    """
    
    def __init__(self, config: Optional[PipelineConfig] = None):
        """
        Initialize the data pipeline.
        
        Args:
            config: PipelineConfig instance (defaults to environment-based config)
        """
        # Load configuration
        self.config = config or PipelineConfig.from_env()
        
        # Setup logging
        setup_logging(self.config)
        
        logger.info("=" * 60)
        logger.info("Initializing Casablanca Stock Exchange Data Pipeline")
        logger.info("=" * 60)
        
        # Initialize data sources
        self._init_data_sources()
        
        # Runtime state
        self._last_fetch_time: Optional[datetime] = None
        self._last_data_source: Optional[str] = None
        self._cached_data: Optional[UnifiedMarketData] = None
        
        logger.info("Pipeline initialization complete")
    
    def _init_data_sources(self) -> None:
        """Initialize all configured data sources."""
        # Primary source: Casablanca Bourse
        logger.info("Initializing primary data source: Casablanca Bourse")
        self.primary_source = CasablancaBourseClient(
            timeout=self.config.data_source.request_timeout_seconds,
            max_retries=self.config.data_source.max_retries
        )
        
        # Fallback source: Yahoo Finance
        if self.config.data_source.enable_yahoo_fallback:
            logger.info("Initializing fallback data source: Yahoo Finance")
            self.fallback_source = YahooFinanceFallback(
                cache_duration_minutes=self.config.data_source.cache_duration_minutes
            )
        else:
            self.fallback_source = None
            logger.info("Yahoo Finance fallback disabled")
        
        # Optional: Alpha Vantage
        if self.config.data_source.enable_alphavantage:
            logger.info("Initializing optional data source: Alpha Vantage")
            self.alphavantage = AlphaVantageClient(
                api_key=self.config.data_source.alphavantage_api_key,
                timeout=self.config.data_source.request_timeout_seconds
            )
        else:
            self.alphavantage = None
            logger.info("Alpha Vantage integration disabled")
    
    def fetch_market_snapshot(self, force_refresh: bool = False) -> UnifiedMarketData:
        """
        Fetch complete market snapshot.
        
        Args:
            force_refresh: Force refresh even if cached data is available
        
        Returns:
            UnifiedMarketData object containing indices, stocks, and metadata
        """
        logger.info("Fetching market snapshot")
        start_time = datetime.now()
        
        # Try primary source first
        indices, stocks, source_used = self._fetch_from_primary()
        
        # Fallback if primary fails
        if (not stocks or not indices) and self.config.auto_fallback and self.fallback_source:
            logger.warning("Primary source failed, attempting fallback")
            indices, stocks, source_used = self._fetch_from_fallback()
        
        # Fetch technical indicators if enabled
        technical_indicators = None
        if self.alphavantage and self.alphavantage.is_enabled():
            technical_indicators = self._fetch_technical_indicators([s.symbol for s in stocks])
        
        # Calculate data quality metrics
        data_quality = self._calculate_data_quality(stocks)
        
        # Create fetch metadata
        fetch_duration = (datetime.now() - start_time).total_seconds()
        fetch_metadata = {
            'fetch_timestamp': datetime.now().isoformat(),
            'source_used': source_used,
            'fetch_duration_seconds': fetch_duration,
            'stocks_count': len(stocks),
            'has_indices': indices is not None,
            'has_technical_indicators': technical_indicators is not None
        }
        
        # Create unified data object
        market_data = UnifiedMarketData(
            indices=indices,
            stocks=stocks,
            technical_indicators=technical_indicators,
            data_quality=data_quality,
            fetch_metadata=fetch_metadata
        )
        
        # Update runtime state
        self._last_fetch_time = datetime.now()
        self._last_data_source = source_used
        self._cached_data = market_data
        
        logger.info(f"Market snapshot complete (source={source_used}, duration={fetch_duration:.2f}s)")
        
        return market_data
    
    def _fetch_from_primary(self) -> tuple[Optional[MarketIndices], List[StockData], str]:
        """Fetch data from primary source (Casablanca Bourse)."""
        try:
            logger.info("Fetching from primary source (Casablanca Bourse)")
            
            indices = self.primary_source.fetch_market_indices()
            stocks = self.primary_source.fetch_all_stocks()
            
            if indices and stocks:
                logger.info(f"Successfully fetched from primary source ({len(stocks)} stocks)")
                return indices, stocks, 'casablanca_bourse'
            else:
                logger.warning("Primary source returned incomplete data")
                return None, [], 'none'
                
        except Exception as e:
            logger.error(f"Error fetching from primary source: {e}")
            return None, [], 'none'
    
    def _fetch_from_fallback(self) -> tuple[Optional[MarketIndices], List[StockData], str]:
        """Fetch data from fallback source (Yahoo Finance)."""
        try:
            logger.info("Fetching from fallback source (Yahoo Finance)")
            
            # Yahoo Finance doesn't have direct MASI/MADEX, so we calculate approximations
            moroccan_symbols = ['ATW', 'BCP', 'CDM', 'IAM', 'ADH', 'ALL', 'LHM', 'SID', 'WAA', 'MNG', 'LBL']
            stocks = self.fallback_source.fetch_all_stocks(moroccan_symbols)
            
            # Calculate synthetic indices from stock performance
            if stocks:
                avg_change = sum(float(s.change_percent) for s in stocks) / len(stocks)
                
                # Create synthetic indices
                indices = MarketIndices(
                    masi=12847.35,  # Base value
                    masi_change=avg_change,
                    madex=10452.18,  # Base value
                    madex_change=avg_change * 1.1,  # MADEX typically more volatile
                    source='calculated',
                    market_status='closed'  # Yahoo data is always delayed
                )
                
                logger.info(f"Successfully fetched from fallback source ({len(stocks)} stocks)")
                return indices, stocks, 'yahoo_finance'
            else:
                logger.error("Fallback source failed to fetch stocks")
                return None, [], 'none'
                
        except Exception as e:
            logger.error(f"Error fetching from fallback source: {e}")
            return None, [], 'none'
    
    def _fetch_technical_indicators(self, symbols: List[str]) -> Dict[str, TechnicalIndicators]:
        """Fetch technical indicators for list of symbols."""
        if not self.alphavantage or not self.alphavantage.is_enabled():
            return {}
        
        logger.info(f"Fetching technical indicators for {len(symbols)} symbols")
        indicators_map = {}
        
        for symbol in symbols[:5]:  # Limit to avoid rate limits
            indicators = self.alphavantage.fetch_all_indicators(symbol)
            if indicators:
                indicators_map[symbol] = indicators
        
        logger.info(f"Fetched indicators for {len(indicators_map)} symbols")
        return indicators_map
    
    def _calculate_data_quality(self, stocks: List[StockData]) -> dict:
        """Calculate data quality metrics."""
        if not stocks:
            return {
                'completeness': 0.0,
                'total_stocks': 0,
                'missing_fields': {}
            }
        
        total_fields = 0
        missing_fields_count = {
            'market_cap': 0,
            'sector': 0,
            'pe_ratio': 0,
            'dividend_yield': 0
        }
        
        for stock in stocks:
            total_fields += 4
            if not stock.market_cap:
                missing_fields_count['market_cap'] += 1
            if not stock.sector:
                missing_fields_count['sector'] += 1
            if not stock.pe_ratio:
                missing_fields_count['pe_ratio'] += 1
            if not stock.dividend_yield:
                missing_fields_count['dividend_yield'] += 1
        
        total_missing = sum(missing_fields_count.values())
        completeness = ((total_fields - total_missing) / total_fields * 100) if total_fields > 0 else 0
        
        return {
            'completeness': round(completeness, 2),
            'total_stocks': len(stocks),
            'missing_fields': missing_fields_count
        }
    
    def get_stocks_dataframe(self) -> pd.DataFrame:
        """
        Get current stocks as pandas DataFrame.
        
        Returns:
            DataFrame with stock data
        """
        if not self._cached_data or not self._cached_data.stocks:
            logger.info("No cached data, fetching fresh data")
            self.fetch_market_snapshot()
        
        stocks = self._cached_data.stocks
        data = [stock.dict() for stock in stocks]
        df = pd.DataFrame(data)
        
        return df
    
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
            period: Time period (e.g., '1d', '5d', '1mo', '1y')
            interval: Data interval (e.g., '1d', '1h', '5m')
        
        Returns:
            DataFrame with historical OHLCV data
        """
        if not self.fallback_source:
            logger.error("Yahoo Finance fallback not enabled - cannot fetch historical data")
            return pd.DataFrame()
        
        logger.info(f"Fetching historical data for {symbol} (period={period}, interval={interval})")
        return self.fallback_source.fetch_historical_data(symbol, period, interval)
    
    def get_pipeline_status(self) -> dict:
        """
        Get current pipeline status and health.
        
        Returns:
            Dictionary with status information
        """
        return {
            'initialized': True,
            'primary_source': 'casablanca_bourse',
            'fallback_enabled': self.fallback_source is not None,
            'alphavantage_enabled': self.alphavantage is not None and self.alphavantage.is_enabled(),
            'last_fetch_time': self._last_fetch_time.isoformat() if self._last_fetch_time else None,
            'last_data_source': self._last_data_source,
            'has_cached_data': self._cached_data is not None,
            'config': {
                'log_level': self.config.log_level,
                'auto_fallback': self.config.auto_fallback,
                'cache_duration_minutes': self.config.data_source.cache_duration_minutes
            }
        }
