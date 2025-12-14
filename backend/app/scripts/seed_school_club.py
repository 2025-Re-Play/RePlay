from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.school import School
from app.models.club import Club


SCHOOLS = [
    {"name": "서울대학교", "region": "서울", "code": "SNU"},
    {"name": "연세대학교 신촌", "region": "서울", "code": "YU-SINCHON"},
    {"name": "고려대학교", "region": "서울", "code": "KU"},
]

CLUBS = [
    # 서울대학교
    {"school_code": "SNU", "name": "밴드동아리1", "description": "교내 밴드 동아리", "genre": "밴드"},
    {"school_code": "SNU", "name": "버스킹동아리1", "description": "캠퍼스 버스킹 동아리", "genre": "버스킹"},

    # 연세대학교 신촌
    {"school_code": "YU-SINCHON", "name": "밴드동아리2", "description": "연세 신촌 밴드 동아리", "genre": "밴드"},
    {"school_code": "YU-SINCHON", "name": "버스킹동아리1", "description": "신촌 버스킹 동아리", "genre": "버스킹"},

    # 고려대학교
    {"school_code": "KU", "name": "밴드동아리1", "description": "고려대 밴드 동아리", "genre": "밴드"},
]


def upsert_school(db: Session, name: str, region: str | None, code: str | None) -> School:
    q = db.query(School)
    school = None

    # code가 있으면 code 우선으로 찾고, 없으면 name으로 찾기
    if code:
        school = q.filter(School.code == code).first()
    if not school:
        school = q.filter(School.name == name).first()

    if not school:
        school = School(name=name, region=region, code=code)
        db.add(school)
        db.flush()
    else:
        # 필요 시 정보 업데이트 (안전하게 최소 업데이트)
        updated = False
        if region is not None and school.region != region:
            school.region = region
            updated = True
        if code is not None and school.code != code:
            school.code = code
            updated = True
        if updated:
            db.flush()

    return school


def upsert_club(db: Session, school_id: int, name: str, description: str | None, genre: str | None) -> Club:
    club = (
        db.query(Club)
        .filter(Club.school_id == school_id, Club.name == name)
        .first()
    )

    if not club:
        club = Club(
            school_id=school_id,
            name=name,
            description=description,
            genre=genre,
        )
        db.add(club)
        db.flush()
    else:
        # 필요 시 업데이트
        updated = False
        if description is not None and club.description != description:
            club.description = description
            updated = True
        if genre is not None and club.genre != genre:
            club.genre = genre
            updated = True
        if updated:
            db.flush()

    return club


def run():
    db: Session = SessionLocal()
    try:
        # 1) 학교 upsert
        code_to_school = {}
        for s in SCHOOLS:
            school = upsert_school(db, s["name"], s.get("region"), s.get("code"))
            if school.code:
                code_to_school[school.code] = school

        # 2) 동아리 upsert
        for c in CLUBS:
            school_code = c["school_code"]
            school = code_to_school.get(school_code)
            if not school:
                raise ValueError(f"학교 코드({school_code})에 해당하는 학교가 없습니다.")

            upsert_club(
                db,
                school_id=school.id,
                name=c["name"],
                description=c.get("description"),
                genre=c.get("genre"),
            )

        db.commit()
        print("✅ seed 완료: 학교/동아리 더미 데이터 삽입(중복 실행 안전)")
    finally:
        db.close()


if __name__ == "__main__":
    run()
