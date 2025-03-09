# FastAPI Backend Implementation Guide

This guide outlines a step-by-step process for implementing a robust FastAPI backend that will seamlessly connect to your React frontend.

## 1. Project Setup

### 1.1 Create Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Entry point
│   ├── core/                # Core configuration
│   │   ├── __init__.py
│   │   ├── config.py        # Environment & app config
│   │   ├── security.py      # Authentication & security
│   │   └── logging.py       # Logging configuration
│   ├── api/                 # API routes
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies (auth, DB session)
│   │   └── endpoints/       # Route handlers by feature
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       ├── users.py
│   │       └── ...
│   ├── models/              # Database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── ...
│   ├── schemas/             # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── ...
│   ├── crud/                # Database operations
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── user.py
│   │   └── ...
│   ├── db/                  # Database configuration
│   │   ├── __init__.py
│   │   ├── session.py
│   │   └── base.py
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   └── ...
│   └── utils/               # Utility functions
│       ├── __init__.py
│       └── ...
├── tests/                   # Test suite
│   ├── __init__.py
│   ├── conftest.py          # Test configurations
│   ├── api/                 # API tests
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   └── ...
│   └── ...
├── alembic/                 # Database migrations
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
├── pyproject.toml           # Project metadata & dependencies
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── .gitignore
└── README.md
```

### 1.2 Set Up Virtual Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

### 1.3 Install Dependencies

Create a `pyproject.toml` file:

```toml
[tool.poetry]
name = "your-project-name"
version = "0.1.0"
description = "FastAPI backend for your application"
authors = ["Your Name <your.email@example.com>"]

[tool.poetry.dependencies]
python = "^3.9"
fastapi = "^0.103.1"
uvicorn = "^0.23.2"
pydantic = "^2.3.0"
pydantic-settings = "^2.0.3"
sqlalchemy = "^2.0.20"
alembic = "^1.12.0"
python-jose = "^3.3.0"
passlib = "^1.7.4"
python-multipart = "^0.0.6"
asyncpg = "^0.28.0"  # For PostgreSQL async support
python-dotenv = "^1.0.0"
email-validator = "^2.0.0"
tenacity = "^8.2.3"  # For retrying operations
httpx = "^0.24.1"    # For HTTP requests
bcrypt = "^4.0.1"    # For password hashing

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.21.1"
black = "^23.7.0"
isort = "^5.12.0"
mypy = "^1.5.1"
flake8 = "^6.1.0"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

If you're not using Poetry, create a `requirements.txt`:

```bash
pip install fastapi uvicorn[standard] pydantic pydantic-settings sqlalchemy alembic python-jose[cryptography] passlib python-multipart asyncpg python-dotenv email-validator tenacity httpx bcrypt
pip install -D pytest pytest-asyncio black isort mypy flake8
```

## 2. Core Configuration

### 2.1 Environment Setup

Create a `.env` file:

```
# Environment
ENVIRONMENT=development

# Backend
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]
PROJECT_NAME=YourProjectName
SECRET_KEY=your-secret-key-generate-a-secure-one
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/db_name
```

Create a `.env.example` file with the same structure but without sensitive values.

### 2.2 Configuration Settings

Create `app/core/config.py`:

```python
from typing import Any, Dict, List, Optional, Union
from pydantic import AnyHttpUrl, PostgresDsn, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str
    ENVIRONMENT: str
    BACKEND_CORS_ORIGINS: List[str] = []
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # JWT
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: PostgresDsn
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
```

### 2.3 Security Setup

Create `app/core/security.py`:

```python
from datetime import datetime, timedelta
from typing import Any, Optional

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any]) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

## 3. Database Setup

### 3.1 Database Connection

Create `app/db/session.py`:

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.ENVIRONMENT == "development",
)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

Create `app/db/base.py`:

```python
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
```

### 3.2 Database Models

Create `app/models/user.py`:

```python
from sqlalchemy import Boolean, Column, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

In `app/models/__init__.py`, import all models:

```python
from app.models.user import User
```

### 3.3 Pydantic Schemas

Create `app/schemas/user.py`:

```python
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
import uuid

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    full_name: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str
```

Create schemas for authentication in `app/schemas/token.py`:

```python
from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = None
```

In `app/schemas/__init__.py`, import all schemas:

```python
from app.schemas.token import Token, TokenPayload
from app.schemas.user import User, UserCreate, UserInDB, UserUpdate
```

### 3.4 CRUD Operations

Create `app/crud/base.py`:

```python
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from uuid import uuid4

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        query = select(self.model).where(self.model.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        query = select(self.model).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def create(
        self, db: AsyncSession, *, obj_in: CreateSchemaType
    ) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, id=str(uuid4()))
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
            
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
                
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: str) -> ModelType:
        obj = await self.get(db=db, id=id)
        await db.delete(obj)
        await db.commit()
        return obj
```

Create `app/crud/user.py`:

```python
from typing import Any, Dict, Optional, Union
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        query = select(User).where(User.email == email)
        result = await db.execute(query)
        return result.scalars().first()

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            is_active=obj_in.is_active,
            is_superuser=False,
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self, db: AsyncSession, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
            
        if update_data.get("password"):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
            
        return await super().update(db, db_obj=db_obj, obj_in=update_data)

    async def authenticate(
        self, db: AsyncSession, *, email: str, password: str
    ) -> Optional[User]:
        user = await self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser

user = CRUDUser(User)
```

In `app/crud/__init__.py`, import all CRUD modules:

```python
from app.crud.user import user
```

### 3.5 Database Migrations

Initialize Alembic:

```bash
alembic init alembic
```

Configure `alembic/env.py`:

```python
import asyncio
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import AsyncEngine

from alembic import context

# Import your models here
from app.db.base import Base
from app.models import User

# this is the Alembic Config object
config = context.config

# Import project settings
from app.core.config import settings
config.set_main_option("sqlalchemy.url", str(settings.DATABASE_URL))

# Interpret the config file for Python logging
fileConfig(config.config_file_name)

# Import all models here
target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    context.configure(
        connection=connection, 
        target_metadata=target_metadata,
        compare_type=True
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = AsyncEngine(
        engine_from_config(
            config.get_section(config.config_ini_section),
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
            future=True,
        )
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
```

Create initial migration:

```bash
alembic revision --autogenerate -m "Initial migration"
```

Apply migrations:

```bash
alembic upgrade head
```

## 4. API Dependencies

Create `app/api/deps.py`:

```python
from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import verify_password
from app.crud import user as user_crud
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import TokenPayload

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"/api/auth/login"
)

async def get_current_user(
    db: AsyncSession = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
        
    if token_data.type == "refresh":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot use refresh token for authentication",
        )
        
    user = await user_crud.user.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not user_crud.user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not user_crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user
```

## 5. API Endpoints

### 5.1 Authentication Endpoints

Create `app/api/endpoints/auth.py`:

```python
from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token
from app.crud import user as user_crud
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import Token, TokenPayload
from app.schemas.user import UserCreate, User as UserSchema

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await user_crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user_crud.user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(
    db: AsyncSession = Depends(get_db),
    refresh_token: str = Body(...),
) -> Any:
    """
    Refresh access token
    """
    try:
        payload = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid refresh token",
        )
        
    if token_data.type != "refresh":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token type",
        )
        
    user = await user_crud.user.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user_crud.user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token = create_access_token(user.id)
    new_refresh_token = create_refresh_token(user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/register", response_model=UserSchema)
async def register(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """
    Register a new user.
    """
    user = await user_crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    user = await user_crud.user.create(db, obj_in=user_in)
    return user

@router.post("/test-token", response_model=UserSchema)
async def test_token(current_user: User = Depends(get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user
```

### 5.2 User Endpoints

Create `app/api/endpoints/users.py`:

```python
from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_superuser, get_current_active_user
from app.crud import user as user_crud
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate

router = APIRouter()

@router.get("/", response_model=List[UserSchema])
async def read_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = await user_crud.user.get_multi(db, skip=skip, limit=limit)
    return users

@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=UserSchema)
async def update_user_me(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    user = await user_crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return user

@router.get("/{user_id}", response_model=UserSchema)
async def read_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = await user_crud.user.get(db, id=user_id)
    if user == current_user:
        return user
    if not user_crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=403, detail="Not enough permissions"
        )
    return user

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: str,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Update a user.
    """
    user = await user_crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    user = await user_crud.user.update(db, db_obj=user, obj_in=user_in)
    return user
```

### 5.3 Setting Up API Routes

Create `app/api/__init__.py`:

```python
from fastapi import APIRouter

from app.api.endpoints import auth, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
```

## 6. Main Application Setup

Create `app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from app.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Set all CORS origins enabled
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(api_router, prefix="/api")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

## 7. Testing Setup

### 7.1 Test Configuration

Create `tests/conftest.py` for common test fixtures:

```python
import asyncio
from typing import Dict, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.main import app
from app.api.deps import get_db

# Use an in-memory SQLite database for testing
TEST_SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def db_engine():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def db_session(db_engine):
    async with TestingSessionLocal() as session:
        yield session

@pytest.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def test_user():
    return {
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User"
    }

### 7.2 Authentication Tests

Create `tests/api/test_auth.py`:

```python
import pytest
from httpx import AsyncClient

from app.core.config import settings

@pytest.mark.asyncio
async def test_register_user(client, test_user):
    response = await client.post(
        f"/api/auth/register",
        json=test_user,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["full_name"] == test_user["full_name"]
    assert "id" in data
    assert "hashed_password" not in data

@pytest.mark.asyncio
async def test_login_user(client, test_user):
    # First register a user
    await client.post(
        f"/api/auth/register",
        json=test_user,
    )
    
    # Then try to login
    response = await client.post(
        f"/api/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    
@pytest.mark.asyncio
async def test_test_token(client, test_user):
    # First register a user
    register_response = await client.post(
        f"/api/auth/register",
        json=test_user,
    )
    
    # Then login to get token
    login_response = await client.post(
        f"/api/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )
    
    token = login_response.json()["access_token"]
    
    # Test token endpoint
    response = await client.post(
        f"/api/auth/test-token",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
```

## 8. Frontend Integration

Now that we have a robust FastAPI backend, let's integrate it with your React frontend.

### 8.1 API Service in Frontend

Create a service to interact with your FastAPI backend in the frontend project:

```typescript
// src/services/api.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }
            
            const response = await axios.post(`${API_URL}/auth/refresh`, {
              refresh_token: refreshToken,
            });
            
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            
            // Retry the original request with the new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            return this.api(originalRequest);
          } catch (refreshError) {
            // If refresh token fails, logout the user
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

export default ApiService.getInstance().getAxiosInstance();
```

### 8.2 Authentication Service

Create an authentication service in your frontend:

```typescript
// src/services/authService.ts
import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthTokens> {
    const params = new URLSearchParams();
    params.append('username', data.email);
    params.append('password', data.password);
    
    const response = await api.post<AuthTokens>('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    this.setTokens(response.data);
    return response.data;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post<AuthTokens>('/auth/refresh', { 
      refresh_token: refreshToken 
    });
    
    this.setTokens(response.data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }
}

export default new AuthService();
```

### 8.3 User Service

Create a user service for user-related API calls:

```typescript
// src/services/userService.ts
import api from './api';
import { User } from './authService';

export interface UserUpdateData {
  full_name?: string;
  password?: string;
}

class UserService {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  }

  async updateMe(data: UserUpdateData): Promise<User> {
    const response = await api.put<User>('/users/me', data);
    return response.data;
  }
  
  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  }
}

export default new UserService();
```

### 8.4 Creating an Authentication Context

Create an authentication context for your React app:

```tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService, { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async (): Promise<void> => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      await authService.logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await authService.login({ email, password });
      await checkAuth();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await authService.register({ email, password, full_name: fullName });
      await login(email, password);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 8.5 Protected Route Component

Create a component to handle protected routes:

```tsx
// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
```

### 8.6 Update App Routes

Update your React Router configuration to include protected routes:

```tsx
// src/App.tsx or src/routes.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
```

## A9. Deployment

### 9.1 Docker Setup

Create a `Dockerfile` for your FastAPI backend:

```dockerfile
FROM python:3.9-slim

WORKDIR /app/

# Install poetry
RUN pip install poetry==1.5.1

# Copy poetry configuration files
COPY pyproject.toml poetry.lock* /app/

# Configure poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy application code
COPY . /app/

# Set environment variables
ENV PYTHONPATH=/app

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create a `docker-compose.yml` file:

```yaml
version: '3'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - .env
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=app
    ports:
      - "5432:5432"
    networks:
      - app-network

networks:
  app-network:

volumes:
  postgres_data:
```

### 9.2 Deployment Scripts

Create a deployment script at `scripts/deploy.sh`:

```bash
#!/bin/bash
set -e

# Apply database migrations
echo "Applying database migrations..."
alembic upgrade head

# Start the application
echo "Starting the application..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Ensure the script is executable:

```bash
chmod +x scripts/deploy.sh
```

### 9.3 CI/CD Setup

Create a GitHub Actions workflow file at `.github/workflows/main.yml`:

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install poetry
          poetry install
      - name: Run tests
        run: |
          poetry run pytest

  build-and-deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: your-registry/your-image:latest
      
      # Add deployment steps for your specific hosting platform
      # This could be deployment to AWS, GCP, Azure, etc.
```

## 10. Final Steps and Integration Testing

### 10.1 Testing the Integration

Create a simple integration test for frontend and backend in your frontend project:

```tsx
// src/tests/integration/auth.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginPage from '../../pages/Login';
import authService from '../../services/authService';

// Mock the auth service
jest.mock('../../services/authService');

describe('Auth Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login flow works', async () => {
    // Mock successful login
    (authService.login as jest.Mock).mockResolvedValue({
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      token_type: 'bearer'
    });
    
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: '123',
      email: 'test@example.com',
      full_name: 'Test User',
      is_active: true,
      created_at: new Date().toISOString()
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill in login form
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // Expect the login function to be called with correct params
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    // Expect redirection or success message
    await waitFor(() => {
      expect(authService.getCurrentUser).toHaveBeenCalled();
    });
  });
});
```

### 10.2 Documentation

Create an API documentation file at `docs/API.md`:

```markdown
# API Documentation

## Authentication

### Register
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe"
  }
  ```
- **Response**: User object

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body** (form-urlencoded):
  ```
  username=user@example.com&password=securepassword
  ```
- **Response**: JWT tokens
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Request Body**:
  ```json
  {
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response**: New JWT tokens

## Users

### Get Current User
- **Endpoint**: `GET /api/users/me`
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**: Current user object

### Update Current User
- **Endpoint**: `PUT /api/users/me`
- **Headers**: `Authorization: Bearer {access_token}`
- **Request Body**:
  ```json
  {
    "full_name": "Updated Name",
    "password": "newpassword"
  }
  ```
- **Response**: Updated user object

### Get User by ID (Admin Only)
- **Endpoint**: `GET /api/users/{user_id}`
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**: User object

### Update User (Admin Only)
- **Endpoint**: `PUT /api/users/{user_id}`
- **Headers**: `Authorization: Bearer {access_token}`
- **Request Body**: Same as update current user
- **Response**: Updated user object
```

## 11. Conclusion

You now have a robust FastAPI backend that integrates seamlessly with your React frontend. The architecture follows best practices with:

1. **Clean project structure** - Organized by feature and function
2. **Dependency injection** - For testing and maintainability
3. **Authentication system** - JWT-based with refresh tokens
4. **Database abstraction** - SQLAlchemy async ORM with migrations
5. **API documentation** - OpenAPI/Swagger UI built-in
6. **Frontend integration** - Services to communicate with the backend
7. **Testing** - Unit and integration tests
8. **Deployment** - Docker and CI/CD setup

This implementation provides a solid foundation that you can extend with:

- Additional API endpoints specific to your application needs
- More complex authorization/permissions
- Cache layer (Redis)
- Background tasks using Celery or FastAPI background tasks
- File uploads using FastAPI's file handling
- WebSockets for real-time communication
- Metrics and monitoring

The implementation is designed to be scalable, maintainable, and follows industry best practices for modern web applications.


### 7.3 User API Tests

Create `tests/api/test_users.py`:

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_users_me(client, test_user):
    # First register a user
    await client.post(
        f"/api/auth/register",
        json=test_user,
    )
    
    # Then login to get token
    login_response = await client.post(
        f"/api/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )
    
    token = login_response.json()["access_token"]
    
    # Test the me endpoint
    response = await client.get(
        f"/api/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert "id" in data
    
@pytest.mark.asyncio
async def test_update_user_me(client, test_user):
    # First register a user
    await client.post(
        f"/api/auth/register",
        json=test_user,
    )
    
    # Then login to get token
    login_response = await client.post(
        f"/api/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )
    
    token = login_response.json()["access_token"]
    
    # Update user
    update_data = {
        "full_name": "Updated Name"
    }
    
    response = await client.put(
        f"/api/users/me",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == update_data["full_name"]
    assert data["email"] == test_user["email"]
```