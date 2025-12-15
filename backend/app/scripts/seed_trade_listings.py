from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.inventory_item import InventoryItem, ItemStatus
from app.models.trade_listing import TradeListing, TradeType


def seed_trade_listings(db: Session) -> None:
    # 공개 가능한 인벤토리(AVAILABLE + 거래미완료)에서 listing 생성
    inv_items = (
        db.query(InventoryItem)
        .filter(InventoryItem.status == ItemStatus.AVAILABLE)
        .filter(InventoryItem.is_deal_done.is_(False))
        .order_by(InventoryItem.id.asc())
        .all()
    )

    inserted = 0
    for inv in inv_items:
        exists = db.query(TradeListing).filter(TradeListing.inventory_item_id == inv.id).first()
        if exists:
            continue

        # 간단 규칙: category/태그에 따라 RENT/SELL 섞기
        ttype = TradeType.RENT if (inv.category and "의상" in inv.category) else TradeType.SELL

        listing = TradeListing(
            inventory_item_id=inv.id,
            title=f"{inv.name} 거래",
            description=inv.description,
            trade_type=ttype,
            price=10000 if ttype == TradeType.RENT else 30000,
            deposit=20000 if ttype == TradeType.RENT else 0,
            is_public=True,
        )
        db.add(listing)
        inserted += 1

    db.commit()
    print(f"✅ trade listing seed 완료: inserted={inserted}, total_inventory={len(inv_items)}")


def main():
    db = SessionLocal()
    try:
        seed_trade_listings(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
