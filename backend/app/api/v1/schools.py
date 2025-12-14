from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.school import SchoolListItem
from app.schemas.club import ClubListItem
from app.repositories.school_repository import list_schools, list_clubs_by_school

router = APIRouter(prefix="/schools", tags=["Schools"])


@router.get("", response_model=list[SchoolListItem])
def get_schools(db: Session = Depends(get_db)):
    schools = list_schools(db)
    return schools


@router.get("/{school_id}/clubs", response_model=list[ClubListItem])
def get_school_clubs(school_id: int, db: Session = Depends(get_db)):
    clubs = list_clubs_by_school(db, school_id)
    return clubs
