"""
Configuration Management
========================

Centralized configuration for the data pipeline.
"""

import os
from typing import Optional
from dataclasses import dataclass
import yaml
from pathlib import Path

import logging

logger = logging.getLogger(__name__)


@dataclass
class DataSourceConfig:
    """Configuration for data sources."""
    primary_source: str = 'casablanca_bourse'
    enable_yahoo_fallback: bool = True
    enable_alphavantage: bool = False
    alphavantage_api_key: Optional[str] = None
    cache_duration_minutes: int = 5
    request_timeout_seconds: int = 10
    max_retries: int = 3


@dataclass
class PipelineConfig:
    """Overall pipeline configuration."""
    data_source: DataSourceConfig
    log_level: str = 'INFO'
    log_file: Optional[str] = None
    enable_data_validation: bool = True
    auto_fallback: bool = True
    
    @classmethod
    def from_yaml(cls, config_path: str) -> 'PipelineConfig':
        """
        Load configuration from YAML file.
        
        Args:
            config_path: Path to YAML configuration file
        
        Returns:
            PipelineConfig instance
        """
        try:
            with open(config_path, 'r') as f:
                config_data = yaml.safe_load(f)
            
            data_source = DataSourceConfig(**config_data.get('data_source', {}))
            
            return cls(
                data_source=data_source,
                log_level=config_data.get('log_level', 'INFO'),
                log_file=config_data.get('log_file'),
                enable_data_validation=config_data.get('enable_data_validation', True),
                auto_fallback=config_data.get('auto_fallback', True)
            )
        except FileNotFoundError:
            logger.warning(f"Config file not found: {config_path}, using defaults")
            return cls(data_source=DataSourceConfig())
        except Exception as e:
            logger.error(f"Error loading config: {e}, using defaults")
            return cls(data_source=DataSourceConfig())
    
    @classmethod
    def from_env(cls) -> 'PipelineConfig':
        """
        Load configuration from environment variables.
        
        Returns:
            PipelineConfig instance
        """
        data_source = DataSourceConfig(
            primary_source=os.getenv('PRIMARY_DATA_SOURCE', 'casablanca_bourse'),
            enable_yahoo_fallback=os.getenv('ENABLE_YAHOO_FALLBACK', 'true').lower() == 'true',
            enable_alphavantage=os.getenv('ENABLE_ALPHAVANTAGE', 'false').lower() == 'true',
            alphavantage_api_key=os.getenv('ALPHAVANTAGE_API_KEY'),
            cache_duration_minutes=int(os.getenv('CACHE_DURATION_MINUTES', '5')),
            request_timeout_seconds=int(os.getenv('REQUEST_TIMEOUT_SECONDS', '10')),
            max_retries=int(os.getenv('MAX_RETRIES', '3'))
        )
        
        return cls(
            data_source=data_source,
            log_level=os.getenv('LOG_LEVEL', 'INFO'),
            log_file=os.getenv('LOG_FILE'),
            enable_data_validation=os.getenv('ENABLE_DATA_VALIDATION', 'true').lower() == 'true',
            auto_fallback=os.getenv('AUTO_FALLBACK', 'true').lower() == 'true'
        )
    
    def to_yaml(self, output_path: str) -> None:
        """
        Save configuration to YAML file.
        
        Args:
            output_path: Path where to save the configuration
        """
        config_dict = {
            'data_source': {
                'primary_source': self.data_source.primary_source,
                'enable_yahoo_fallback': self.data_source.enable_yahoo_fallback,
                'enable_alphavantage': self.data_source.enable_alphavantage,
                'alphavantage_api_key': self.data_source.alphavantage_api_key,
                'cache_duration_minutes': self.data_source.cache_duration_minutes,
                'request_timeout_seconds': self.data_source.request_timeout_seconds,
                'max_retries': self.data_source.max_retries
            },
            'log_level': self.log_level,
            'log_file': self.log_file,
            'enable_data_validation': self.enable_data_validation,
            'auto_fallback': self.auto_fallback
        }
        
        with open(output_path, 'w') as f:
            yaml.dump(config_dict, f, default_flow_style=False)
        
        logger.info(f"Configuration saved to {output_path}")


def setup_logging(config: PipelineConfig) -> None:
    """
    Configure logging based on pipeline configuration.
    
    Args:
        config: PipelineConfig instance
    """
    log_level = getattr(logging, config.log_level.upper(), logging.INFO)
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)
    console_handler.setFormatter(formatter)
    
    handlers = [console_handler]
    
    # File handler (if specified)
    if config.log_file:
        try:
            Path(config.log_file).parent.mkdir(parents=True, exist_ok=True)
            file_handler = logging.FileHandler(config.log_file)
            file_handler.setLevel(log_level)
            file_handler.setFormatter(formatter)
            handlers.append(file_handler)
        except Exception as e:
            logger.error(f"Could not create log file handler: {e}")
    
    # Configure root logger
    logging.basicConfig(
        level=log_level,
        handlers=handlers,
        force=True
    )
    
    logger.info(f"Logging configured (level={config.log_level})")
