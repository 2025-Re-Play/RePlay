from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.club_admin import club_admins
from app.dependencies.auth import get_current_user


def assert_club_admin(
    club_id: int,
    db: Session,
    user: User,
) -> None:
    """
    user가 club_id의 관리자인지 확인.
    아니면 예외를 던지도록 호출부에서 처리.
    """
    # club_admins association table 조회
    q = db.execute(
        club_admins.select().where(
            (club_admins.c.club_id == club_id) &
            (club_admins.c.user_id == user.id)
        )
    ).first()

    if q is None:
        raise PermissionError("해당 동아리의 관리자만 접근할 수 있습니다.")


def get_current_admin_user(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if getattr(user, "role", None) != "ADMIN":
        raise PermissionError("관리자만 접근할 수 있습니다.")
    return user
