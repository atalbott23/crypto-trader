# Crypto Trader Project Structure

This document provides an overview of the Crypto Trader application's project structure. This helps new developers understand the organization of the codebase and guides ongoing development.

## Project Overview

Crypto Trader is divided into two main parts:
1. **Backend**: A FastAPI application with Python 
2. **Frontend**: A React application with TypeScript and Vite

## Directory Structure

```
crypto-trader/
├── backend/                 # FastAPI backend
│   ├── app/                 # Main application package
│   │   ├── api/             # API routes and endpoints
│   │   │   ├── endpoints/   # API endpoint handlers by feature
│   │   │   │   ├── auth.py  # Authentication endpoints
│   │   │   │   └── users.py # User management endpoints
│   │   │   └── api.py       # Main API router
│   │   │   └── deps.py      # Dependencies for API routes
│   │   ├── core/            # Core configuration
│   │   │   ├── config.py    # Application settings
│   │   │   ├── logging.py   # Logging setup
│   │   │   └── security.py  # Security utilities
│   │   ├── crud/            # Database operations
│   │   │   ├── base.py      # Base CRUD operations
│   │   │   ├── user.py      # User CRUD operations
│   │   │   ├── strategy.py  # Strategy CRUD operations
│   │   │   └── allocation.py # Allocation CRUD operations
│   │   ├── db/              # Database related code
│   │   │   ├── session.py   # Database session management
│   │   │   └── rls.py       # Row Level Security setup
│   │   ├── models/          # Database models
│   │   │   ├── user.py      # User model
│   │   │   ├── strategy.py  # Strategy model
│   │   │   └── allocation.py # Allocation model
│   │   ├── schemas/         # Pydantic schemas
│   │   │   ├── user.py      # User schemas
│   │   │   ├── strategy.py  # Strategy schemas
│   │   │   └── allocation.py # Allocation schemas
│   │   ├── services/        # Business logic services
│   │   │   └── auth.py      # Authentication service
│   │   └── utils/           # Utility functions
│   │       └── error_handlers.py # Error handling utilities
│   ├── tests/               # Test suite
│   ├── .env                 # Environment variables
│   ├── main.py              # Application entry point
│   └── requirements.txt     # Python dependencies
│
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Library code
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main React component
│   │   ├── index.css        # Global CSS
│   │   └── main.tsx         # Application entry point
│   ├── package.json         # NPM dependencies
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   ├── vite.config.ts       # Vite configuration
│   └── index.html           # HTML entry point
│
└── documentation/           # Project documentation
    ├── implementation-roadmap.md  # Implementation plan
    ├── project-structure.md      # This file
    ├── strategy.md               # Trading strategy documentation
    ├── fastapi-implementation.md # FastAPI implementation details
    └── supabase-schema-crypto.sql # Database schema
```

## Component Descriptions

### Backend Components

#### API Layer
- **api/endpoints/**: Individual API endpoint handlers organized by feature
- **api/api.py**: Central router that includes all endpoint routers
- **api/deps.py**: Common dependencies like authentication checks

#### Data Layer
- **models/**: Database models representing tables and relationships
- **schemas/**: Pydantic schemas for request/response validation
- **crud/**: Database CRUD operations for each model

#### Service Layer
- **services/**: Business logic services that coordinate between API and data layers

#### Configuration
- **core/**: Core configuration, settings, and security
- **db/**: Database connection and session management

### Frontend Components

#### UI Components
- **components/**: Reusable UI components
- **pages/**: Full page components

#### Application Logic
- **contexts/**: React contexts for state management
- **hooks/**: Custom React hooks
- **utils/**: Utility functions
- **lib/**: Library code for external services

## Key Files

### Backend
- **main.py**: Application entry point
- **.env**: Environment variables
- **requirements.txt**: Python dependencies

### Frontend
- **package.json**: NPM dependencies
- **vite.config.ts**: Vite configuration
- **tailwind.config.ts**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration

## Development Workflow

1. Backend services are implemented following the FastAPI structure
2. API endpoints are added to handle specific features
3. Frontend components consume these APIs through hooks and contexts
4. Business logic is maintained in backend services

## Authentication Flow

1. User registers/logs in through the authentication endpoints
2. JWT tokens are issued and stored in the frontend
3. Protected routes check tokens using the authentication dependencies
4. Row-Level Security ensures users can only access their own data

## Database Structure

The database follows the schema defined in `supabase-schema-crypto.sql`, with tables for:
- users
- strategy_config
- user_allocations
- exchange_connections
- portfolio_snapshots
- trades
- rebalance_events
- bot_activity_log 