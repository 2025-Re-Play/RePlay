from pydantic import BaseModel


class SchoolListItem(BaseModel):
    id: int
    name: str
    region: str | None = None
    code: str | None = None

    class Config:
        from_attributes = True
