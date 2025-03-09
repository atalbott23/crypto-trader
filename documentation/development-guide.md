# Crypto Trader Development Guide

This guide provides essential information for developers working on the Crypto Trader application. It includes setup instructions, development workflows, coding standards, and troubleshooting tips.

## Backend Rebuild Instructions

### Prerequisites
- Python 3.8+ installed
- Git for version control
- Access to Supabase account and project
- Node.js and npm for frontend development

### Step 1: Setup Backend Environment

1. **Create and activate a virtual environment**
   ```bash
   cd crypto-trader
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

2. **Install dependencies with specific versions**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Important packages to include**
   ```
   fastapi==0.104.1
   uvicorn==0.24.0
   pydantic==2.4.2
   pydantic-settings==2.1.0
   supabase==1.0.3
   python-jose==3.3.0
   passlib==1.7.4
   python-multipart==0.0.6
   ```

### Step 2: Establish Core Configuration

1. **Create config.py in app/core**
   - Use Pydantic's BaseSettings for environment variables
   - Include all necessary configuration parameters
   - Example structure:
   ```python
   from pydantic_settings import BaseSettings
   from typing import Optional
   
   class Settings(BaseSettings):
       PROJECT_NAME: str = "Crypto Trader API"
       API_V1_STR: str = "/api/v1"
       
       # Supabase
       SUPABASE_URL: str
       SUPABASE_KEY: str
       
       # Security
       SECRET_KEY: str
       ALGORITHM: str = "HS256"
       ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
       
       class Config:
           env_file = ".env"
           case_sensitive = True
   
   settings = Settings()
   ```

2. **Create logging.py in app/core**
   - Set up proper logging configuration
   - Include handlers for different environments
   - Example structure:
   ```python
   import logging
   import sys
   from typing import Optional
   
   def get_logger(name: Optional[str] = None) -> logging.Logger:
       logger = logging.getLogger(name)
       handler = logging.StreamHandler(sys.stdout)
       formatter = logging.Formatter(
           "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
       )
       handler.setFormatter(formatter)
       logger.addHandler(handler)
       logger.setLevel(logging.INFO)
       return logger
   
   logger = get_logger("crypto_trader")
   ```

3. **Create security.py in app/core**
   - Implement JWT token creation and validation
   - Set up password hashing
   - Example structure:
   ```python
   from datetime import datetime, timedelta
   from typing import Optional
   from jose import jwt
   from passlib.context import CryptContext
   from app.core.config import settings
   
   pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
   
   def verify_password(plain_password: str, hashed_password: str) -> bool:
       return pwd_context.verify(plain_password, hashed_password)
   
   def get_password_hash(password: str) -> str:
       return pwd_context.hash(password)
   
   def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
       to_encode = data.copy()
       expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
       to_encode.update({"exp": expire})
       encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
       return encoded_jwt
   ```

### Step 3: Database Integration

1. **Setup Supabase client in app/db/session.py**
   ```python
   from supabase import create_client
   from app.core.config import settings
   from app.core.logging import logger
   
   def get_supabase_client():
       try:
           supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
           return supabase
       except Exception as e:
           logger.error(f"Error connecting to Supabase: {e}")
           raise
   
   supabase = get_supabase_client()
   ```

2. **Implement base CRUD operations in app/crud/base.py**
   ```python
   from typing import Any, Dict, Generic, List, Optional, Type, TypeVar
   from uuid import UUID
   from app.db.session import supabase
   
   class CRUDBase:
       def __init__(self, table_name: str):
           self.table_name = table_name
           
       def get(self, id: UUID) -> Optional[Dict[str, Any]]:
           response = supabase.table(self.table_name).select("*").eq("id", str(id)).execute()
           if response.data and len(response.data) > 0:
               return response.data[0]
           return None
   
       def get_multi(self, *, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
           response = supabase.table(self.table_name).select("*").range(skip, skip + limit - 1).execute()
           return response.data
   
       def create(self, *, obj_in: Dict[str, Any]) -> Dict[str, Any]:
           response = supabase.table(self.table_name).insert(obj_in).execute()
           if response.data and len(response.data) > 0:
               return response.data[0]
           return None
   
       def update(self, *, id: UUID, obj_in: Dict[str, Any]) -> Optional[Dict[str, Any]]:
           response = supabase.table(self.table_name).update(obj_in).eq("id", str(id)).execute()
           if response.data and len(response.data) > 0:
               return response.data[0]
           return None
   
       def remove(self, *, id: UUID) -> Optional[Dict[str, Any]]:
           response = supabase.table(self.table_name).delete().eq("id", str(id)).execute()
           if response.data and len(response.data) > 0:
               return response.data[0]
           return None
   ```

3. **Setup Row Level Security in app/db/rls.py**
   ```python
   from typing import Optional, List
   from app.db.session import supabase
   from app.core.logging import logger
   
   def enable_rls_for_table(table_name: str) -> bool:
       try:
           # SQL to enable RLS on a table
           sql = f"ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;"
           supabase.table(table_name).execute(sql)
           return True
       except Exception as e:
           logger.error(f"Failed to enable RLS for table {table_name}: {e}")
           return False
   
   def create_user_isolation_policy(table_name: str, user_id_column: str = "user_id") -> bool:
       try:
           policy_name = f"{table_name}_user_isolation"
           sql = f"""
           CREATE POLICY {policy_name} ON {table_name}
           USING ({user_id_column} = auth.uid())
           WITH CHECK ({user_id_column} = auth.uid());
           """
           supabase.table(table_name).execute(sql)
           return True
       except Exception as e:
           logger.error(f"Failed to create policy for table {table_name}: {e}")
           return False
   ```

### Step 4: API Implementation

1. **Create deps.py for API dependencies**
   ```python
   from fastapi import Depends, HTTPException, status
   from fastapi.security import OAuth2PasswordBearer
   from jose import jwt, JWTError
   from app.core.config import settings
   from app.core.security import verify_password
   from app.schemas.user import UserInDB
   from app.crud.user import crud_user
   
   oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")
   
   async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
       credentials_exception = HTTPException(
           status_code=status.HTTP_401_UNAUTHORIZED,
           detail="Could not validate credentials",
           headers={"WWW-Authenticate": "Bearer"},
       )
       try:
           payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
           user_id: str = payload.get("sub")
           if user_id is None:
               raise credentials_exception
       except JWTError:
           raise credentials_exception
           
       user = crud_user.get(user_id)
       if user is None:
           raise credentials_exception
       return UserInDB(**user)
   ```

2. **Implement API Router in app/api/api.py**
   ```python
   from fastapi import APIRouter
   
   api_router = APIRouter()
   
   # Import and include routers
   from app.api.endpoints import auth, users
   
   api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
   api_router.include_router(users.router, prefix="/users", tags=["users"])
   ```

3. **Create endpoint modules like app/api/endpoints/auth.py**
   ```python
   from fastapi import APIRouter, Depends, HTTPException, status
   from fastapi.security import OAuth2PasswordRequestForm
   from datetime import timedelta
   
   from app.core.config import settings
   from app.core.security import create_access_token, verify_password
   from app.schemas.token import Token
   from app.crud.user import crud_user
   
   router = APIRouter()
   
   @router.post("/login", response_model=Token)
   async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
       user = crud_user.authenticate(email=form_data.username, password=form_data.password)
       if not user:
           raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Incorrect email or password",
               headers={"WWW-Authenticate": "Bearer"},
           )
       access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
       access_token = create_access_token(
           data={"sub": str(user.id)}, expires_delta=access_token_expires
       )
       return {"access_token": access_token, "token_type": "bearer"}
   ```

### Step 5: Models and Schemas

1. **Create Pydantic schemas in app/schemas/**
   - Example user schema (app/schemas/user.py):
   ```python
   from typing import Optional
   from pydantic import BaseModel, EmailStr, UUID4
   
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
       id: UUID4
   
   class User(UserInDBBase):
       pass
   
   class UserInDB(UserInDBBase):
       hashed_password: str
   ```

2. **Create corresponding CRUD operations**
   - Example user CRUD (app/crud/user.py):
   ```python
   from typing import Optional, Dict, Any
   from uuid import UUID
   
   from app.core.security import get_password_hash, verify_password
   from app.crud.base import CRUDBase
   
   class CRUDUser(CRUDBase):
       def get_by_email(self, *, email: str) -> Optional[Dict[str, Any]]:
           response = self.db.table(self.table_name).select("*").eq("email", email).execute()
           if response.data and len(response.data) > 0:
               return response.data[0]
           return None
   
       def create(self, *, obj_in: Dict[str, Any]) -> Dict[str, Any]:
           db_obj = obj_in.copy()
           db_obj["hashed_password"] = get_password_hash(obj_in["password"])
           del db_obj["password"]
           return super().create(obj_in=db_obj)
   
       def authenticate(self, *, email: str, password: str) -> Optional[Dict[str, Any]]:
           user = self.get_by_email(email=email)
           if not user:
               return None
           if not verify_password(password, user["hashed_password"]):
               return None
           return user
   
   crud_user = CRUDUser(table_name="users")
   ```

## Best Practices for Backend Development

### Code Organization
- Use absolute imports rather than relative imports
- Keep modules small and focused on a single responsibility
- Group related functionality together
- Use proper type hints for all functions and variables

### API Design
- Use consistent naming conventions for endpoints
- Group endpoints by resource or functionality
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Implement proper error handling and response codes
- Document all endpoints using FastAPI's built-in features

### Error Handling
- Use try/except blocks with specific exception types
- Provide meaningful error messages
- Log errors with appropriate severity levels
- Return standardized error responses from API endpoints

### Testing
- Write unit tests for all core functionality
- Create integration tests for API endpoints
- Use a consistent testing pattern
- Mock external dependencies in tests

## Troubleshooting Common Issues

### Import Errors
- Ensure all `__init__.py` files are present in all directories
- Use absolute imports (e.g., `from app.core.config import settings`)
- Check for circular import dependencies
- Verify Python environment is activated

### File Encoding Issues
- Ensure all Python files are saved with UTF-8 encoding (without BOM)
- Check for null bytes in Python files, especially in `__init__.py` files
  - These can cause "SyntaxError: source code string cannot contain null bytes"
  - Use PowerShell to find files with null bytes: `Get-ChildItem -Path "app" -Recurse -Filter "*.py" | ForEach-Object { $file = $_; Get-Content -Path $file.FullName -Encoding Byte | Where-Object { $_ -eq 0 } | ForEach-Object { Write-Host "Null byte found in $($file.FullName)" } }`
  - Fix by recreating the files with proper UTF-8 encoding: `Out-File -FilePath path\to\file.py -InputObject "# File content" -Encoding utf8`
- Avoid copying files from editors or systems that might use different encodings
- Configure your text editor to use UTF-8 as the default encoding for all files

### Database Connection Issues
- Verify Supabase credentials in `.env` file
- Check network connectivity to Supabase
- Ensure proper error handling in database connection code
- Verify table names and column references

### Authentication Problems
- Check JWT token configuration (secret key, algorithm, expiration)
- Verify user credentials in database
- Ensure proper token validation in protected routes
- Check for proper password hashing and verification

## Git Workflow

1. **Create feature branches from development**
   ```bash
   git checkout development
   git pull
   git checkout -b feature/my-feature
   ```

2. **Commit changes with descriptive messages**
   ```bash
   git add .
   git commit -m "Add user authentication endpoints"
   ```

3. **Push changes and create pull requests**
   ```bash
   git push -u origin feature/my-feature
   ```

4. **Merge after code review**
   - Ensure all tests pass
   - Get approval from at least one team member
   - Squash and merge to keep history clean

## Next Steps in Development

Follow the tasks outlined in the implementation roadmap:

1. Complete Phase 1: Foundation and Infrastructure
2. Proceed to Phase 2: Core Functionality
3. Implement Phase 3: Advanced Features
4. Conduct Phase 4: Testing, Optimization, and Deployment
5. Complete Phase 5: Documentation and Maintenance

Remember to update this document as development progresses and new patterns or solutions are discovered. 