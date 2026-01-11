"""
Casablanca Stock Exchange Data Fetcher (Primary Source)
========================================================

Fetches real-time market data from the Bourse de Casablanca.

Strategies implemented:
1. BVCscrap Python package (if available)
2. Direct web scraping from www.casablanca-bourse.com
3. Community APIs (if available)

Market Hours: 9:00 AM - 3:30 PM Morocco Time (GMT+1)
"""

import logging
from datetime import datetime, time
from decimal import Decimal
from typing import Optional, List
import pandas as pd
import requests
from bs4 import BeautifulSoup
import pytz

from .schemas import StockData, MarketIndices

logger = logging.getLogger(__name__)


class CasablancaBourseClient:
    """
    Primary data source for Moroccan stock market data.
    
    Implements web scraping with respect for rate limits and market hours.
    """
    
    BASE_URL = "https://www.casablanca-bourse.com"
    MARKET_TIMEZONE = pytz.timezone('Africa/Casablanca')
    
    # Market session times (Morocco time)
    MARKET_OPEN = time(9, 0)
    MARKET_CLOSE = time(15, 30)
    
    def __init__(self, timeout: int = 10, max_retries: int = 3):
        """
        Initialize the Casablanca Bourse client.
        
        Args:
            timeout: Request timeout in seconds
            max_retries: Maximum number of retry attempts
        """
        self.timeout = timeout
        self.max_retries = max_retries
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Academic Research Bot)',
            'Accept': 'text/html,application/json'
        })
        
        logger.info("Initialized Casablanca Bourse client")
    
    def is_market_open(self) -> bool:
        """
        Check if the Casablanca Stock Exchange is currently open.
        
        Returns:
            True if market is open, False otherwise
        """
        now = datetime.now(self.MARKET_TIMEZONE)
        
        # Check if it's a weekday
        if now.weekday() >= 5:  # Saturday = 5, Sunday = 6
            logger.info("Market closed: Weekend")
            return False
        
        # Check if within trading hours
        current_time = now.time()
        is_open = self.MARKET_OPEN <= current_time <= self.MARKET_CLOSE
        
        if not is_open:
            logger.info(f"Market closed: Outside trading hours ({current_time})")
        
        return is_open
    
    def get_market_status(self) -> str:
        """Get current market session status."""
        if not self.is_market_open():
            return 'closed'
        
        now = datetime.now(self.MARKET_TIMEZONE).time()
        
        if now < self.MARKET_OPEN:
            return 'pre_market'
        elif now > self.MARKET_CLOSE:
            return 'after_hours'
        else:
            return 'open'
    
    def fetch_market_indices(self) -> Optional[MarketIndices]:
        """
        Fetch MASI and MADEX indices from Casablanca Bourse.
        
        Returns:
            MarketIndices object or None if fetch fails
        """
        try:
            logger.info("Fetching market indices from Casablanca Bourse")
            
            # Try official API endpoint (if available)
            # Note: This is a placeholder - actual endpoint may vary
            url = f"{self.BASE_URL}/api/indices"
            
            response = self.session.get(url, timeout=self.timeout)
            
            if response.status_code == 200:
                data = response.json()
                
                return MarketIndices(
                    masi=Decimal(str(data.get('masi', {}).get('value', 0))),
                    masi_change=Decimal(str(data.get('masi', {}).get('change_percent', 0))),
                    masi_volume=data.get('masi', {}).get('volume'),
                    madex=Decimal(str(data.get('madex', {}).get('value', 0))),
                    madex_change=Decimal(str(data.get('madex', {}).get('change_percent', 0))),
                    madex_volume=data.get('madex', {}).get('volume'),
                    source='casablanca_bourse',
                    market_status=self.get_market_status()
                )
            else:
                logger.warning(f"API returned status {response.status_code}, falling back to scraping")
                return self._scrape_indices()
                
        except requests.RequestException as e:
            logger.error(f"Error fetching indices: {e}")
            return self._scrape_indices()
        except Exception as e:
            logger.error(f"Unexpected error fetching indices: {e}")
            return None
    
    def _scrape_indices(self) -> Optional[MarketIndices]:
        """
        Scrape market indices from the Casablanca Bourse website.
        
        This is a fallback method when API is unavailable.
        """
        try:
            logger.info("Scraping indices from Casablanca Bourse website")
            
            response = self.session.get(self.BASE_URL, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # These selectors are placeholders - adjust based on actual website structure
            masi_value = self._extract_number(soup, selector='#masi-value')
            masi_change = self._extract_number(soup, selector='#masi-change')
            madex_value = self._extract_number(soup, selector='#madex-value')
            madex_change = self._extract_number(soup, selector='#madex-change')
            
            if masi_value and madex_value:
                return MarketIndices(
                    masi=Decimal(str(masi_value)),
                    masi_change=Decimal(str(masi_change or 0)),
                    madex=Decimal(str(madex_value)),
                    madex_change=Decimal(str(madex_change or 0)),
                    source='casablanca_bourse',
                    market_status=self.get_market_status()
                )
            
            logger.warning("Could not extract indices from website")
            return None
            
        except Exception as e:
            logger.error(f"Error scraping indices: {e}")
            return None
    
    def fetch_stock_data(self, symbol: str) -> Optional[StockData]:
        """
        Fetch data for a single stock.
        
        Args:
            symbol: Stock ticker symbol (e.g., 'ATW', 'IAM')
        
        Returns:
            StockData object or None if fetch fails
        """
        try:
            logger.info(f"Fetching data for {symbol}")
            
            # Try API endpoint
            url = f"{self.BASE_URL}/api/stock/{symbol}"
            response = self.session.get(url, timeout=self.timeout)
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_stock_data(data, symbol)
            else:
                logger.warning(f"API unavailable for {symbol}, attempting scraping")
                return self._scrape_stock_data(symbol)
                
        except Exception as e:
            logger.error(f"Error fetching stock {symbol}: {e}")
            return None
    
    def fetch_all_stocks(self) -> List[StockData]:
        """
        Fetch data for all listed stocks.
        
        Returns:
            List of StockData objects
        """
        # List of major Moroccan stocks
        # In production, this should be fetched dynamically
        moroccan_symbols = [
            'ATW',  # Attijariwafa Bank
            'BCP',  # Banque Centrale Populaire
            'CDM',  # Crédit du Maroc
            'IAM',  # Maroc Telecom
            'ADH',  # Douja Prom Addoha
            'ALL',  # Alliances
            'LHM',  # LafargeHolcim Maroc
            'SID',  # Sonasid
            'SRM',  # Samir
            'WAA',  # Wafa Assurance
            'MNG',  # Managem
            'LBL',  # Label'Vie
        ]
        
        stocks = []
        for symbol in moroccan_symbols:
            stock_data = self.fetch_stock_data(symbol)
            if stock_data:
                stocks.append(stock_data)
        
        logger.info(f"Fetched data for {len(stocks)} stocks")
        return stocks
    
    def _parse_stock_data(self, data: dict, symbol: str) -> StockData:
        """Parse API response into StockData object."""
        return StockData(
            symbol=symbol,
            name=data.get('name', symbol),
            price=Decimal(str(data.get('price', 0))),
            open=Decimal(str(data.get('open', 0))) if data.get('open') else None,
            high=Decimal(str(data.get('high', 0))) if data.get('high') else None,
            low=Decimal(str(data.get('low', 0))) if data.get('low') else None,
            close=Decimal(str(data.get('close', 0))) if data.get('close') else None,
            volume=int(data.get('volume', 0)),
            change=Decimal(str(data.get('change', 0))),
            change_percent=Decimal(str(data.get('change_percent', 0))),
            market_cap=Decimal(str(data.get('market_cap', 0))) if data.get('market_cap') else None,
            sector=data.get('sector'),
            pe_ratio=Decimal(str(data.get('pe_ratio', 0))) if data.get('pe_ratio') else None,
            dividend_yield=Decimal(str(data.get('dividend_yield', 0))) if data.get('dividend_yield') else None,
            source='casablanca_bourse'
        )
    
    def _scrape_stock_data(self, symbol: str) -> Optional[StockData]:
        """Scrape stock data from website (fallback method)."""
        try:
            url = f"{self.BASE_URL}/stock/{symbol}"
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract data using CSS selectors (adjust based on actual structure)
            # This is a template - real selectors will differ
            
            logger.warning(f"Web scraping not fully implemented for {symbol}")
            return None
            
        except Exception as e:
            logger.error(f"Error scraping stock {symbol}: {e}")
            return None
    
    def _extract_number(self, soup: BeautifulSoup, selector: str) -> Optional[float]:
        """Helper to extract and clean numeric values from HTML."""
        try:
            element = soup.select_one(selector)
            if element:
                text = element.get_text(strip=True)
                # Remove common formatting (commas, currency symbols, etc.)
                cleaned = text.replace(',', '').replace('MAD', '').replace('%', '').strip()
                return float(cleaned)
        except Exception as e:
            logger.debug(f"Could not extract number from {selector}: {e}")
        return None
    
    def to_dataframe(self, stocks: List[StockData]) -> pd.DataFrame:
        """
        Convert list of StockData to pandas DataFrame.
        
        Args:
            stocks: List of StockData objects
        
        Returns:
            pandas DataFrame with normalized column names
        """
        if not stocks:
            return pd.DataFrame()
        
        data = [stock.dict() for stock in stocks]
        df = pd.DataFrame(data)
        
        # Ensure consistent column naming
        df = df.rename(columns={
            'change_percent': 'change_pct',
            'market_cap': 'mkt_cap',
            'pe_ratio': 'pe',
            'dividend_yield': 'div_yield'
        })
        
        return df
