from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.club import Club
from app.models.club_admin import club_admins


ADMIN_EMAIL = "admin1@test.com"


def seed_club_admin_mapping(db: Session) -> None:
    # 1) 관리자 유저 찾기
    user = db.query(User).filter(User.email == ADMIN_EMAIL).first()
    if not user:
        raise RuntimeError(f"User가 없습니다: {ADMIN_EMAIL}")

    # 2) role이 ADMIN인지 보장 (아니면 ADMIN으로 변경)
    if getattr(user, "role", None) != UserRole.ADMIN:
        user.role = UserRole.ADMIN
        db.add(user)
        db.commit()
        db.refresh(user)

    # 3) 매핑할 club 선택 (가장 첫 동아리)
    club = db.query(Club).order_by(Club.id.asc()).first()
    if not club:
        raise RuntimeError("Club 데이터가 없습니다. 먼저 학교/동아리 seed를 실행하세요.")

    # 4) 이미 매핑되어 있으면 skip (idempotent)
    exists = db.execute(
        club_admins.select().where(
            (club_admins.c.club_id == club.id) &
            (club_admins.c.user_id == user.id)
        )
    ).first()

    if exists:
        print(f"✅ 이미 매핑됨: user_id={user.id}, club_id={club.id}")
        return

    # 5) 매핑 insert
    db.execute(
        club_admins.insert().values(
            club_id=club.id,
            user_id=user.id,
        )
    )
    db.commit()
    print(f"✅ 관리자 매핑 완료: email={ADMIN_EMAIL}, user_id={user.id}, club_id={club.id}")


def main():
    db = SessionLocal()
    try:
        seed_club_admin_mapping(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
