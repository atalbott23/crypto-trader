from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.schemas.user import User

router = APIRouter()

@router.get("/me", response_model=User)
async def read_users_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user.
    """
    # This is a placeholder for actual user data
    # In a real app, we would return the current user from the database
    return {
        "email": "user@example.com",
        "is_active": True,
        "is_superuser": False,
        "full_name": "Test User",
        "id": 1
    } 