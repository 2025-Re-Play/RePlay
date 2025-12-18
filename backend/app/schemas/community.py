from __future__ import annotations

from datetime import datetime, date
from typing import Optional, Literal, List
from pydantic import BaseModel, Field

PostType = Literal["general", "request"]


class CommunityPostCreate(BaseModel):
    type: PostType
    title: str = Field(..., max_length=200)
    content: str

    image_url: Optional[str] = Field(default=None, max_length=500)
    tags: Optional[str] = Field(default=None, max_length=500)

    club_id: Optional[int] = None

    request_category: Optional[str] = Field(default=None, max_length=100)
    desired_start_date: Optional[date] = None
    desired_end_date: Optional[date] = None


class CommunityPostUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200)
    content: Optional[str] = None

    image_url: Optional[str] = Field(default=None, max_length=500)
    tags: Optional[str] = Field(default=None, max_length=500)

    club_id: Optional[int] = None

    request_category: Optional[str] = Field(default=None, max_length=100)
    desired_start_date: Optional[date] = None
    desired_end_date: Optional[date] = None


class CommunityPostOut(BaseModel):
    id: int
    type: PostType
    title: str
    content: str
    image_url: Optional[str]
    tags: Optional[str]

    author_id: int
    club_id: Optional[int]

    request_category: Optional[str]
    desired_start_date: Optional[date]
    desired_end_date: Optional[date]

    like_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CommunityPostListItem(BaseModel):
    id: int
    type: PostType
    title: str
    preview: str
    image_url: Optional[str]
    tags: Optional[str]
    like_count: int
    created_at: datetime

    class Config:
        from_attributes = True
