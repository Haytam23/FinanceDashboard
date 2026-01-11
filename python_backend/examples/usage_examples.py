"""
Example Usage of the Market Data Pipeline
==========================================

This script demonstrates how to use the Casablanca Stock Exchange
data ingestion pipeline for various use cases.
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from data_pipeline import MarketDataPipeline
from data_pipeline.config import PipelineConfig
import pandas as pd


def example_basic_usage():
    """Basic usage: Fetch market snapshot."""
    print("=" * 70)
    print("EXAMPLE 1: Basic Market Snapshot")
    print("=" * 70)
    
    # Initialize pipeline with default configuration
    pipeline = MarketDataPipeline()
    
    # Fetch complete market snapshot
    market_data = pipeline.fetch_market_snapshot()
    
    # Access market indices
    print(f"\nMarket Indices:")
    print(f"MASI: {market_data.indices.masi} ({market_data.indices.masi_change:+.2f}%)")
    print(f"MADEX: {market_data.indices.madex} ({market_data.indices.madex_change:+.2f}%)")
    print(f"Market Status: {market_data.indices.market_status}")
    
    # Access stocks
    print(f"\nStocks Fetched: {len(market_data.stocks)}")
    for stock in market_data.stocks[:3]:  # Show first 3
        print(f"  {stock.symbol} ({stock.name}): {stock.price} MAD ({stock.change_percent:+.2f}%)")
    
    # Data quality
    print(f"\nData Quality:")
    print(f"  Completeness: {market_data.data_quality['completeness']:.1f}%")
    print(f"  Total Stocks: {market_data.data_quality['total_stocks']}")
    
    # Fetch metadata
    print(f"\nFetch Metadata:")
    print(f"  Source Used: {market_data.fetch_metadata['source_used']}")
    print(f"  Duration: {market_data.fetch_metadata['fetch_duration_seconds']:.2f}s")
    
    print()


def example_dataframe_export():
    """Export data to pandas DataFrame."""
    print("=" * 70)
    print("EXAMPLE 2: Export to DataFrame")
    print("=" * 70)
    
    pipeline = MarketDataPipeline()
    
    # Get stocks as DataFrame
    df = pipeline.get_stocks_dataframe()
    
    print(f"\nDataFrame Shape: {df.shape}")
    print(f"\nColumns: {df.columns.tolist()}")
    print(f"\nFirst few rows:")
    print(df[['symbol', 'name', 'price', 'change_percent', 'volume']].head())
    
    # Calculate statistics
    print(f"\nMarket Statistics:")
    print(f"  Average Change: {df['change_percent'].mean():.2f}%")
    print(f"  Most Volatile: {df.loc[df['change_percent'].abs().idxmax(), 'symbol']}")
    print(f"  Highest Volume: {df.loc[df['volume'].idxmax(), 'symbol']}")
    
    # Export to CSV
    output_file = 'market_data_export.csv'
    df.to_csv(output_file, index=False)
    print(f"\n✓ Data exported to {output_file}")
    
    print()


def example_historical_data():
    """Fetch historical price data."""
    print("=" * 70)
    print("EXAMPLE 3: Historical Data Analysis")
    print("=" * 70)
    
    pipeline = MarketDataPipeline()
    
    # Fetch 1-year historical data for Attijariwafa Bank
    symbol = 'ATW'
    hist_df = pipeline.fetch_historical_data(symbol, period='1y', interval='1d')
    
    if not hist_df.empty:
        print(f"\nHistorical data for {symbol}:")
        print(f"  Period: {hist_df.index[0]} to {hist_df.index[-1]}")
        print(f"  Data Points: {len(hist_df)}")
        print(f"\nPrice Statistics:")
        print(f"  Current: {hist_df['close'].iloc[-1]:.2f} MAD")
        print(f"  52-Week High: {hist_df['high'].max():.2f} MAD")
        print(f"  52-Week Low: {hist_df['low'].min():.2f} MAD")
        print(f"  Average Volume: {hist_df['volume'].mean():,.0f}")
        
        # Calculate returns
        returns = hist_df['close'].pct_change()
        print(f"\nReturns Analysis:")
        print(f"  1-Year Return: {((hist_df['close'].iloc[-1] / hist_df['close'].iloc[0]) - 1) * 100:.2f}%")
        print(f"  Volatility: {returns.std() * (252 ** 0.5) * 100:.2f}%")
        
        # Export historical data
        hist_output = f'{symbol}_historical_data.csv'
        hist_df.to_csv(hist_output)
        print(f"\n✓ Historical data exported to {hist_output}")
    else:
        print(f"\n✗ Could not fetch historical data for {symbol}")
    
    print()


def example_custom_config():
    """Use custom configuration."""
    print("=" * 70)
    print("EXAMPLE 4: Custom Configuration")
    print("=" * 70)
    
    # Load configuration from YAML file
    config = PipelineConfig.from_yaml('config.yaml')
    
    # Or create programmatically
    # from data_pipeline.config import DataSourceConfig
    # config = PipelineConfig(
    #     data_source=DataSourceConfig(
    #         enable_yahoo_fallback=True,
    #         enable_alphavantage=True,
    #         alphavantage_api_key='YOUR_API_KEY'
    #     ),
    #     log_level='DEBUG'
    # )
    
    pipeline = MarketDataPipeline(config=config)
    
    # Check pipeline status
    status = pipeline.get_pipeline_status()
    
    print("\nPipeline Status:")
    print(f"  Primary Source: {status['primary_source']}")
    print(f"  Fallback Enabled: {status['fallback_enabled']}")
    print(f"  Alpha Vantage Enabled: {status['alphavantage_enabled']}")
    print(f"  Auto Fallback: {status['config']['auto_fallback']}")
    print(f"  Log Level: {status['config']['log_level']}")
    
    print()


def example_sector_analysis():
    """Analyze stocks by sector."""
    print("=" * 70)
    print("EXAMPLE 5: Sector Analysis")
    print("=" * 70)
    
    pipeline = MarketDataPipeline()
    df = pipeline.get_stocks_dataframe()
    
    if not df.empty and 'sector' in df.columns:
        # Group by sector
        sector_stats = df.groupby('sector').agg({
            'symbol': 'count',
            'change_percent': 'mean',
            'volume': 'sum'
        }).round(2)
        
        sector_stats.columns = ['Stocks', 'Avg Change %', 'Total Volume']
        sector_stats = sector_stats.sort_values('Avg Change %', ascending=False)
        
        print("\nSector Performance:")
        print(sector_stats)
        
        print("\nBest Performing Sector:")
        best_sector = sector_stats.index[0]
        print(f"  {best_sector}: {sector_stats.loc[best_sector, 'Avg Change %']:+.2f}%")
        
        print("\nWorst Performing Sector:")
        worst_sector = sector_stats.index[-1]
        print(f"  {worst_sector}: {sector_stats.loc[worst_sector, 'Avg Change %']:+.2f}%")
    else:
        print("\n✗ Sector data not available")
    
    print()


def main():
    """Run all examples."""
    print("\n")
    print("╔" + "=" * 68 + "╗")
    print("║" + " " * 68 + "║")
    print("║" + "  Casablanca Stock Exchange Data Pipeline - Examples".center(68) + "║")
    print("║" + " " * 68 + "║")
    print("╚" + "=" * 68 + "╝")
    print("\n")
    
    try:
        example_basic_usage()
        example_dataframe_export()
        example_historical_data()
        example_custom_config()
        example_sector_analysis()
        
        print("=" * 70)
        print("All examples completed successfully!")
        print("=" * 70)
        print()
        
    except Exception as e:
        print(f"\n✗ Error running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
