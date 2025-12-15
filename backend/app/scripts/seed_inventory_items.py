from datetime import datetime

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.inventory_item import InventoryItem, ItemStatus
from app.models.club import Club


def seed_inventory(db: Session) -> None:
    # 1) club 하나라도 있는지 확인
    club = db.query(Club).order_by(Club.id.asc()).first()
    if not club:
        raise RuntimeError("Club 데이터가 없습니다. 먼저 학교/동아리 seed를 실행하세요.")

    club_id = club.id

    # 2) 중복 방지용 키(이름 기준)로 이미 존재하면 skip
    seeds = [
        {
            "name": "무대 조명 스탠드",
            "category": "가구",
            "tags": "조명,무대",
            "size": "120cm",
            "contact": "010-1111-2222",
            "image_path": "/images/items/light-stand.png",
            "purchased_at": datetime(2024, 3, 1),
            "status": ItemStatus.AVAILABLE,
            "is_deal_done": False,
            "description": "무대 조명 설치용 스탠드",
        },
        {
            "name": "남성 정장 의상",
            "category": "의상",
            "tags": "정장,의상",
            "size": "L",
            "contact": "010-1111-2222",
            "image_path": "/images/items/suit.png",
            "purchased_at": datetime(2023, 10, 10),
            "status": ItemStatus.RENTED,
            "is_deal_done": False,
            "description": "공연용 남성 정장",
        },
        {
            "name": "소품 검",
            "category": "소품",
            "tags": "무기,소품",
            "size": "90cm",
            "contact": "010-1111-2222",
            "image_path": "/images/items/sword.png",
            "purchased_at": datetime(2022, 5, 20),
            "status": ItemStatus.AVAILABLE,
            "is_deal_done": False,
            "description": "무대용 소품 검(안전재질)",
        },
        {
            "name": "버스킹 마이크",
            "category": "장비",
            "tags": "음향,마이크,버스킹",
            "size": "표준",
            "contact": "010-1111-2222",
            "image_path": "/images/items/mic.png",
            "purchased_at": datetime(2024, 7, 1),
            "status": ItemStatus.RESERVED,
            "is_deal_done": False,
            "description": "버스킹용 유선 마이크",
        },
        {
            "name": "무대 커튼",
            "category": "가구",
            "tags": "커튼,무대",
            "size": "3m",
            "contact": "010-1111-2222",
            "image_path": "/images/items/curtain.png",
            "purchased_at": datetime(2021, 11, 11),
            "status": ItemStatus.UNAVAILABLE,
            "is_deal_done": False,
            "description": "노후화로 사용 불가",
        },
        {
            "name": "소품 의자",
            "category": "가구",
            "tags": "의자,소품",
            "size": "1인용",
            "contact": "010-1111-2222",
            "image_path": "/images/items/chair.png",
            "purchased_at": datetime(2020, 1, 1),
            "status": ItemStatus.SOLD,
            "is_deal_done": True,
            "description": "거래 완료된 소품 의자",
        },
    ]

    inserted = 0
    for s in seeds:
        exists = (
            db.query(InventoryItem)
            .filter(InventoryItem.club_id == club_id)
            .filter(InventoryItem.name == s["name"])
            .first()
        )
        if exists:
            continue

        item = InventoryItem(club_id=club_id, **s)
        db.add(item)
        inserted += 1

    db.commit()
    print(f"✅ inventory seed 완료: club_id={club_id}, inserted={inserted}")


def main():
    db = SessionLocal()
    try:
        seed_inventory(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
