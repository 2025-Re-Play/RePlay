from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User, UserRole
from app.repositories.performance_repository import PerformanceRepository
from app.schemas.mypage import MyProfileOut, MyProfileUpdate
from app.schemas.performance import PerformanceOut

router = APIRouter(
    prefix="/mypage",
    tags=["마이페이지"],
)

# --------------------
# 5.1 프로필
# --------------------

@router.get(
    "/profile",
    response_model=MyProfileOut,
    summary="내 프로필 조회",
)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.patch(
    "/profile",
    response_model=MyProfileOut,
    summary="내 프로필 수정",
)
def update_my_profile(
    data: MyProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.name is not None:
        current_user.name = data.name

    db.commit()
    db.refresh(current_user)
    return current_user


# --------------------
# 5.2 우리 공연 관리
# --------------------

@router.get(
    "/performances",
    response_model=list[PerformanceOut],
    summary="내가 관리자(ADMIN)로 속한 동아리의 공연 조회",
)
def get_admin_club_performances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 필요합니다.",
        )

    if not current_user.club_id:
        return []

    return PerformanceRepository.list_by_club(
        db=db,
        club_id=current_user.club_id,
    )
