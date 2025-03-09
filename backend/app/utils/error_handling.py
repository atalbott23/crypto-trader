"""
Error handling utilities for the application.
This module provides custom exceptions and error handling functions.
"""
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import http_exception_handler
from typing import Any, Dict, Optional

from app.core.logging import logger

# Custom exception classes
class DatabaseError(Exception):
    """Exception raised for database-related errors."""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details
        super().__init__(self.message)

class AuthenticationError(Exception):
    """Exception raised for authentication-related errors."""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details
        super().__init__(self.message)

class ValidationError(Exception):
    """Exception raised for validation errors."""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details
        super().__init__(self.message)

class ExternalServiceError(Exception):
    """Exception raised for errors related to external services."""
    def __init__(self, message: str, service_name: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.service_name = service_name
        self.details = details
        super().__init__(f"{service_name}: {message}")

# Exception handlers
async def database_exception_handler(request: Request, exc: DatabaseError) -> JSONResponse:
    """Handle database exceptions."""
    logger.error(f"Database error: {exc.message}", extra={"details": exc.details})
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Database error", "message": exc.message, "details": exc.details}
    )

async def authentication_exception_handler(request: Request, exc: AuthenticationError) -> JSONResponse:
    """Handle authentication exceptions."""
    logger.warning(f"Authentication error: {exc.message}", extra={"details": exc.details})
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"error": "Authentication error", "message": exc.message, "details": exc.details}
    )

async def validation_exception_handler(request: Request, exc: ValidationError) -> JSONResponse:
    """Handle validation exceptions."""
    logger.info(f"Validation error: {exc.message}", extra={"details": exc.details})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": "Validation error", "message": exc.message, "details": exc.details}
    )

async def external_service_exception_handler(request: Request, exc: ExternalServiceError) -> JSONResponse:
    """Handle external service exceptions."""
    logger.error(f"External service error: {exc.service_name} - {exc.message}", 
                 extra={"service": exc.service_name, "details": exc.details})
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "External service error", 
            "service": exc.service_name,
            "message": exc.message, 
            "details": exc.details
        }
    )

def handle_unhandled_exception(request: Request, exc: Exception) -> JSONResponse:
    """Handle any unhandled exceptions."""
    logger.exception(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Server error", "message": "An unexpected error occurred"}
    ) 