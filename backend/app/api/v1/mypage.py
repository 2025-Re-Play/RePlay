from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.repositories.performance_repository import PerformanceRepository
from app.schemas.performance import PerformanceOut

router = APIRouter(
    prefix="/mypage",
    tags=["마이페이지"],
)


@router.get(
    "/ping",
    summary="마이페이지 도메인 라우터 확인용",
    description="TODO: 실제 마이페이지 API로 대체 예정",
)
async def mypage_ping():
    return {"message": "mypage router is alive"}


@router.get(
    "/performances",
    response_model=list[PerformanceOut],
    summary="우리 동아리 공연 일정 조회",
    description="로그인한 사용자가 소속된 동아리의 공연 일정만 조회합니다.",
)
def get_my_club_performances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    - 로그인 필수
    - 사용자의 club_id 기준으로 공연 목록 조회
    """
    if not current_user.club_id:
        return []

    return PerformanceRepository.list_by_club(
        db=db,
        club_id=current_user.club_id,
    )
