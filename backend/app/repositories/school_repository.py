from sqlalchemy.orm import Session

from app.models.school import School
from app.models.club import Club


def list_schools(db: Session) -> list[School]:
    return db.query(School).order_by(School.id.asc()).all()


def list_clubs_by_school(db: Session, school_id: int) -> list[Club]:
    return (
        db.query(Club)
        .filter(Club.school_id == school_id)
        .order_by(Club.id.asc())
        .all()
    )
