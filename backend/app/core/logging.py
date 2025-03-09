"""
Logging configuration for the application.
Provides centralized logging setup with different handlers for different environments.
"""
import logging
import sys
import os
from typing import Dict, Optional, Any
from logging.handlers import RotatingFileHandler
import json
from datetime import datetime

class JsonFormatter(logging.Formatter):
    """
    JSON formatter for structured logging.
    Formats log records as JSON objects for easier parsing and analysis.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_record = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add traceback if present
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
            
        # Add extra fields if present
        if hasattr(record, "extra"):
            log_record["extra"] = record.extra
            
        return json.dumps(log_record)

def setup_logging(log_level: str = "INFO", log_to_file: bool = False, 
                  log_file: str = "app.log", json_format: bool = False) -> logging.Logger:
    """
    Configure logging for the application.
    
    Args:
        log_level (str): Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_to_file (bool): Whether to log to a file
        log_file (str): Path to the log file
        json_format (bool): Whether to use JSON formatting for logs
        
    Returns:
        logging.Logger: Configured logger instance
    """
    # Create formatter based on format preference
    if json_format:
        formatter = JsonFormatter()
    else:
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
    
    # Set log level
    level = getattr(logging, log_level.upper())
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    
    # Clear existing handlers to avoid duplicate logs
    if root_logger.handlers:
        root_logger.handlers.clear()
    
    # Add console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(level)
    root_logger.addHandler(console_handler)
    
    # Add file handler if enabled
    if log_to_file:
        log_dir = os.path.dirname(log_file)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir)
            
        file_handler = RotatingFileHandler(
            log_file, maxBytes=10485760, backupCount=5  # 10MB max file size, keep 5 backups
        )
        file_handler.setFormatter(formatter)
        file_handler.setLevel(level)
        root_logger.addHandler(file_handler)
    
    # Set log levels for specific libraries
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    
    # Create logger for the app
    logger = logging.getLogger("crypto_trader")
    logger.setLevel(level)
    
    # Log startup message
    logger.info(f"Logging initialized at {log_level} level")
    if log_to_file:
        logger.info(f"Logging to file: {log_file}")
    
    return logger

def get_logger() -> logging.Logger:
    """
    Get the application logger.
    
    Returns:
        logging.Logger: Application logger instance
    """
    return logging.getLogger("crypto_trader")

def log_with_context(logger: logging.Logger, level: str, message: str, 
                    extra: Optional[Dict[str, Any]] = None) -> None:
    """
    Log a message with additional context.
    
    Args:
        logger (logging.Logger): Logger instance
        level (str): Log level
        message (str): Log message
        extra (Optional[Dict[str, Any]]): Extra context to include
    """
    log_method = getattr(logger, level.lower())
    extra_dict = {"extra": extra} if extra else {}
    log_method(message, extra=extra_dict)

# Create a logger instance (default configuration)
logger = setup_logging() 