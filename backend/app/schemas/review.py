from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    is_public: bool = True
    rating: Optional[int] = Field(None, ge=1, le=5)


class ReviewUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=2000)
    is_public: Optional[bool] = None
    rating: Optional[int] = Field(None, ge=1, le=5)


class ReviewOut(BaseModel):
    id: int
    performance_id: int
    author_user_id: int
    content: str
    is_public: bool
    rating: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
