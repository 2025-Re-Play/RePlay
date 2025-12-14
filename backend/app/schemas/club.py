from pydantic import BaseModel


class ClubListItem(BaseModel):
    id: int
    school_id: int
    name: str
    description: str | None = None
    genre: str | None = None

    class Config:
        from_attributes = True
