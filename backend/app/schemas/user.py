from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.USER
    school_id: Optional[int] = None
    club_id: Optional[int] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    school_id: Optional[int] = None
    club_id: Optional[int] = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: UserRole
    school_id: Optional[int] = None
    club_id: Optional[int] = None

    class Config:
        from_attributes = True