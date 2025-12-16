from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional
from app.models.user import UserRole
from enum import Enum


class Role(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.USER
    school_id: Optional[int] = None
    club_id: Optional[int] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=60,  # 400에러 로그찍힌 bcrypt 안전 구간 (72 bytes보다 여유)
        description="8~60자 비밀번호"
    )
    name: str
    role: UserRole = UserRole.USER
    admin_code: Optional[str] = None
    school_id: Optional[int] = None
    club_id: Optional[int] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: UserRole
    school_id: Optional[int] = None
    club_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
