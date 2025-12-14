from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.club import ClubListItem
from app.repositories.club_repository import list_my_managed_clubs
from app.models.user import User
from app.dependencies.auth import get_current_user  

router = APIRouter(prefix="/me", tags=["Me"])


@router.get("/clubs", response_model=list[ClubListItem])
def get_my_clubs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clubs = list_my_managed_clubs(db, current_user)
    return clubs
