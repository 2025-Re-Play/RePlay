from sqlalchemy.orm import Session

from app.models.user import User
from app.models.club import Club


def list_my_managed_clubs(db: Session, user: User) -> list[Club]:
    # relationship 기반으로 가장 단순/안전하게 처리
    # user.managed_clubs 는 Club 리스트
    return sorted(user.managed_clubs, key=lambda c: c.id)
