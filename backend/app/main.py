"""
Main module for the FastAPI application.
Configures and runs the API server.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import os
import uvicorn

from app.core.config import settings
from app.core.logging import logger
from app.utils.error_handling import (
    DatabaseError, 
    AuthenticationError, 
    ValidationError, 
    ExternalServiceError,
    database_exception_handler,
    authentication_exception_handler,
    validation_exception_handler,
    external_service_exception_handler,
    handle_unhandled_exception
)

def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        FastAPI: Configured FastAPI application
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="API for cryptocurrency portfolio management and automated trading",
        version="0.1.0",
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Register exception handlers
    app.add_exception_handler(DatabaseError, database_exception_handler)
    app.add_exception_handler(AuthenticationError, authentication_exception_handler)
    app.add_exception_handler(ValidationError, validation_exception_handler)
    app.add_exception_handler(ExternalServiceError, external_service_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    
    # Register base routes
    @app.get("/")
    async def root():
        """Root endpoint."""
        return {"message": f"Welcome to {settings.PROJECT_NAME} API"}
    
    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy"}
    
    # Add startup event
    @app.on_event("startup")
    async def startup_event():
        """Handle startup events."""
        logger.info(f"Starting {settings.PROJECT_NAME} API...")
    
    # Add shutdown event
    @app.on_event("shutdown")
    async def shutdown_event():
        """Handle shutdown events."""
        logger.info(f"Shutting down {settings.PROJECT_NAME} API...")
    
    # Register middleware for global exception handling
    @app.middleware("http")
    async def exception_middleware(request: Request, call_next):
        """Middleware for global exception handling."""
        try:
            return await call_next(request)
        except Exception as exc:
            # Log the exception
            logger.exception(f"Unhandled exception: {str(exc)}")
            
            # Generate a more user-friendly error response
            return JSONResponse(
                status_code=500,
                content={"error": "Internal Server Error", "message": "An unexpected error occurred"}
            )
    
    return app

app = create_application() 