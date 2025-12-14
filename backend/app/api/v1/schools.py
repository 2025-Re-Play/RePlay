from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.school import SchoolListItem
from app.schemas.club import ClubListItem
from app.schemas.common import ApiResponse, PageData, ok
from app.repositories.school_repository import SchoolRepository

router = APIRouter(prefix="/schools", tags=["Schools"])


@router.get(
    "",
    response_model=ApiResponse[PageData[SchoolListItem]],
)
def get_schools(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    keyword: str | None = None,
    sort: str | None = None,
    db: Session = Depends(get_db),
):
    items, meta = SchoolRepository.list_schools(
        db=db,
        page=page,
        size=size,
        keyword=keyword,
        sort=sort,
    )

    return ok(
        PageData(
            items=items,
            meta=meta,
        )
    )


@router.get(
    "/{school_id}/clubs",
    response_model=ApiResponse[PageData[ClubListItem]],
)
def get_school_clubs(
    school_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    keyword: str | None = None,
    sort: str | None = None,
    db: Session = Depends(get_db),
):
    items, meta = SchoolRepository.list_clubs_by_school(
        db=db,
        school_id=school_id,
        page=page,
        size=size,
        keyword=keyword,
        sort=sort,
    )

    return ok(
        PageData(
            items=items,
            meta=meta,
        )
    )

