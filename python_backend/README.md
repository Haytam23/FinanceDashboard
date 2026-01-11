# Casablanca Stock Exchange Data Pipeline

A production-quality data ingestion pipeline for the Moroccan stock market (Bourse de Casablanca) with intelligent fallback mechanisms.

## 🎯 Features

### ✅ Multi-Source Data Ingestion
- **Primary Source**: Casablanca Stock Exchange (web scraping + API)
- **Fallback Source**: Yahoo Finance (yfinance)
- **Optional**: Alpha Vantage (technical indicators)

### ✅ Intelligent Failover
- Automatic fallback to Yahoo Finance when primary source fails
- Market hours detection for Casablanca Stock Exchange
- Configurable retry logic and timeouts

### ✅ Data Quality & Validation
- Unified data schemas using Pydantic
- Automatic data validation
- Quality metrics and completeness tracking
- Source labeling for transparency

### ✅ Production-Ready
- Comprehensive logging
- Flexible configuration (YAML, environment variables, or code)
- Error handling and graceful degradation
- Clean, modular architecture

## 📦 Installation

### Prerequisites
- Python 3.9+
- pip

### Install Dependencies

```bash
pip install -r requirements.txt
```

## 🚀 Quick Start

### Basic Usage

```python
from data_pipeline import MarketDataPipeline

# Initialize pipeline
pipeline = MarketDataPipeline()

# Fetch current market data
market_data = pipeline.fetch_market_snapshot()

# Access indices
print(f"MASI: {market_data.indices.masi}")
print(f"MADEX: {market_data.indices.madex}")

# Access stocks
for stock in market_data.stocks:
    print(f"{stock.symbol}: {stock.price} MAD ({stock.change_percent:+.2f}%)")
```

### Get Data as DataFrame

```python
# Get stocks as pandas DataFrame
df = pipeline.get_stocks_dataframe()

# Analyze
print(df.describe())
df.to_csv('market_data.csv')
```

### Fetch Historical Data

```python
# Get 1-year historical data
hist_df = pipeline.fetch_historical_data('ATW', period='1y')

# Calculate statistics
returns = hist_df['close'].pct_change()
volatility = returns.std() * (252 ** 0.5) * 100
print(f"Annual Volatility: {volatility:.2f}%")
```

## ⚙️ Configuration

### Option 1: Environment Variables

```bash
export PRIMARY_DATA_SOURCE=casablanca_bourse
export ENABLE_YAHOO_FALLBACK=true
export ENABLE_ALPHAVANTAGE=false
export ALPHAVANTAGE_API_KEY=your_key_here
export LOG_LEVEL=INFO
```

### Option 2: YAML Configuration

Create `config.yaml`:

```yaml
data_source:
  primary_source: casablanca_bourse
  enable_yahoo_fallback: true
  enable_alphavantage: false
  cache_duration_minutes: 5

log_level: INFO
auto_fallback: true
```

Load in code:

```python
from data_pipeline.config import PipelineConfig

config = PipelineConfig.from_yaml('config.yaml')
pipeline = MarketDataPipeline(config=config)
```

### Option 3: Programmatic Configuration

```python
from data_pipeline import MarketDataPipeline
from data_pipeline.config import PipelineConfig, DataSourceConfig

config = PipelineConfig(
    data_source=DataSourceConfig(
        enable_yahoo_fallback=True,
        enable_alphavantage=True,
        alphavantage_api_key='YOUR_API_KEY',
        cache_duration_minutes=10
    ),
    log_level='DEBUG',
    auto_fallback=True
)

pipeline = MarketDataPipeline(config=config)
```

## 📊 Data Schema

### Stock Data
```python
{
    "symbol": "ATW",
    "name": "Attijariwafa Bank",
    "price": 485.50,
    "open": 480.00,
    "high": 487.00,
    "low": 479.50,
    "close": 485.50,
    "volume": 125420,
    "change": 5.20,
    "change_percent": 1.08,
    "market_cap": 95600000000,
    "sector": "Banking",
    "pe_ratio": 15.2,
    "dividend_yield": 3.8,
    "timestamp": "2026-01-10T14:30:00",
    "source": "casablanca_bourse"
}
```

### Market Indices
```python
{
    "masi": 12847.35,
    "masi_change": 0.58,
    "madex": 10452.18,
    "madex_change": 0.73,
    "market_status": "open",
    "source": "casablanca_bourse"
}
```

## 🔧 Advanced Usage

### Pipeline Status

```python
status = pipeline.get_pipeline_status()
print(f"Last fetch: {status['last_fetch_time']}")
print(f"Source used: {status['last_data_source']}")
print(f"Fallback enabled: {status['fallback_enabled']}")
```

### Data Quality Metrics

```python
market_data = pipeline.fetch_market_snapshot()
quality = market_data.data_quality

print(f"Completeness: {quality['completeness']}%")
print(f"Missing fields: {quality['missing_fields']}")
```

### Technical Indicators (Alpha Vantage)

```python
# Enable in configuration
config = PipelineConfig(
    data_source=DataSourceConfig(
        enable_alphavantage=True,
        alphavantage_api_key='YOUR_KEY'
    )
)

pipeline = MarketDataPipeline(config=config)
market_data = pipeline.fetch_market_snapshot()

# Access indicators
if market_data.technical_indicators:
    for symbol, indicators in market_data.technical_indicators.items():
        print(f"{symbol} RSI: {indicators.rsi}")
        print(f"{symbol} MACD: {indicators.macd}")
```

## 📚 Examples

See `examples/usage_examples.py` for comprehensive examples:

```bash
cd python_backend
python examples/usage_examples.py
```

## 🏗️ Architecture

```
data_pipeline/
├── __init__.py                 # Package initialization
├── pipeline.py                 # Main orchestrator
├── schemas.py                  # Data models (Pydantic)
├── casablanca_source.py        # Primary data source
├── yahoo_fallback.py           # Fallback data source
├── alphavantage_optional.py    # Optional indicators
└── config.py                   # Configuration management
```

## 🔍 Data Sources

### Primary: Casablanca Stock Exchange
- Real-time market data (when market is open)
- MASI and MADEX indices
- Major Moroccan listed companies
- Market hours: 9:00 AM - 3:30 PM Morocco Time (GMT+1)

### Fallback: Yahoo Finance
- Historical price data
- Delayed quotes
- Trend analysis and volatility calculations
- Works when primary source is unavailable

### Optional: Alpha Vantage
- Technical indicators (RSI, MACD, Bollinger Bands)
- Fundamental data
- Requires API key (free tier available)

## ⚠️ Important Notes

### Academic & Decision-Support Use Only
This pipeline is designed for:
- Academic research
- Financial analysis
- Decision support systems
- Portfolio analytics

**NOT for:**
- Automated trading execution
- High-frequency trading
- Real-time arbitrage

### Rate Limits
- **Casablanca Bourse**: Respect robots.txt, use appropriate delays
- **Yahoo Finance**: No official rate limits, but use caching
- **Alpha Vantage**: Free tier = 5 calls/minute, 500 calls/day

### Data Accuracy
- Primary source provides most accurate data during market hours
- Fallback data may have delays
- Always check `source` field in data to know origin
- Use `market_status` to determine if data is live or delayed

## 🧪 Testing

```bash
# Install dev dependencies
pip install pytest pytest-cov

# Run tests (when available)
pytest tests/ -v --cov=data_pipeline
```

## 📝 Logging

Logs are written to console and optionally to file:

```python
# Configure logging
config = PipelineConfig(
    log_level='DEBUG',
    log_file='logs/pipeline.log'
)
```

Log levels: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`

## 🤝 Contributing

This is an academic project. Contributions for educational purposes are welcome.

## 📄 License

MIT License - Free for academic and educational use.

## 🔗 Resources

- [Bourse de Casablanca](https://www.casablanca-bourse.com/)
- [yfinance Documentation](https://pypi.org/project/yfinance/)
- [Alpha Vantage API](https://www.alphavantage.co/documentation/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## 💡 Support

For issues, questions, or contributions, please refer to the project documentation.

---

**Built for academic research and financial analysis of the Moroccan stock market** 🇲🇦
