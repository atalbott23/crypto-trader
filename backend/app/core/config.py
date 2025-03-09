"""
Application configuration module.
Handles loading and validating environment variables and configuration settings.
"""
import os
from pydantic import BaseSettings, validator, AnyHttpUrl, SecretStr
from typing import Optional, Dict, Any, List, Union
import logging

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Crypto Trader"
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        """Parse CORS origins from string format to list."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Supabase Settings
    SUPABASE_URL: str
    SUPABASE_KEY: SecretStr
    
    @validator("SUPABASE_URL")
    def validate_supabase_url(cls, v: str) -> str:
        """Validate Supabase URL format."""
        if not v:
            raise ValueError("SUPABASE_URL environment variable is required")
        return v
    
    # JWT Settings
    SECRET_KEY: SecretStr
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    @validator("SECRET_KEY")
    def validate_secret_key(cls, v: SecretStr) -> SecretStr:
        """Validate SECRET_KEY is set and not default."""
        if v.get_secret_value() == "your-secret-key-here":
            raise ValueError("SECRET_KEY must be changed from default value")
        if len(v.get_secret_value()) < 32:
            raise ValueError("SECRET_KEY should be at least 32 characters long")
        return v
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @validator("LOG_LEVEL")
    def validate_log_level(cls, v: str) -> str:
        """Validate log level is a valid level."""
        valid_levels = ("DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL")
        if v not in valid_levels:
            raise ValueError(f"LOG_LEVEL must be one of {valid_levels}")
        return v
    
    class Config:
        """Pydantic config for settings."""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

def get_settings() -> Settings:
    """
    Get application settings with proper error handling.
    
    Returns:
        Settings: Application settings object
        
    Raises:
        SystemExit: If critical settings are missing or invalid
    """
    try:
        settings = Settings()
        logging.info(f"Loaded settings for: {settings.PROJECT_NAME}")
        return settings
    except Exception as e:
        logging.critical(f"Failed to load settings: {str(e)}")
        logging.critical("Please check your .env file and environment variables")
        # In production, you might want to raise SystemExit(1) here
        # For now, we'll re-raise to get more details during development
        raise

# Initialize global settings 
settings = get_settings() 