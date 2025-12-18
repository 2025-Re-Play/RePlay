from typing import Optional
from pydantic import BaseModel


class MyProfileOut(BaseModel):
    id: int
    email: str
    name: str
    role: str
    school_id: Optional[int]
    club_id: Optional[int]

    class Config:
        from_attributes = True


class MyProfileUpdate(BaseModel):
    name: Optional[str] = None
