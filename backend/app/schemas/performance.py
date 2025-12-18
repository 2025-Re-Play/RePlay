from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class PerformanceCreate(BaseModel):
    title: str
    description: Optional[str] = None
    region: str
    theme_category: str
    poster_image_url: Optional[str] = None
    performance_date: date
    school_id: Optional[int] = None
    club_id: Optional[int] = None


class PerformanceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    region: Optional[str] = None
    theme_category: Optional[str] = None
    poster_image_url: Optional[str] = None
    performance_date: Optional[date] = None


class PerformanceOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    region: str
    theme_category: str
    poster_image_url: Optional[str]
    performance_date: date
    club_id: Optional[int]
    school_id: Optional[int]

    class Config:
        from_attributes = True
