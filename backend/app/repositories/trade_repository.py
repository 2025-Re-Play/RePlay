from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.trade_listing import TradeListing, TradeType
from app.models.trade_reservation import TradeReservation, ReservationStatus
from app.models.inventory_item import InventoryItem, ItemStatus
from app.utils.pagination import paginate_query


class TradeRepository:

    @staticmethod
    def list(
        db: Session,
        page: int,
        size: int,
        keyword: str | None,
        trade_type: TradeType | None,
        category: str | None,
        tag: str | None,
        price_min: int | None,
        price_max: int | None,
        sort: str | None,
    ):
        # 공개 + 인벤토리 공개 가능 조건(AVAILABLE + 거래미완료)
        query = (
            db.query(TradeListing, InventoryItem)
            .join(InventoryItem, TradeListing.inventory_item_id == InventoryItem.id)
            .filter(TradeListing.is_public.is_(True))
            .filter(InventoryItem.status == ItemStatus.AVAILABLE)
            .filter(InventoryItem.is_deal_done.is_(False))
        )

        if trade_type:
            query = query.filter(TradeListing.trade_type == trade_type)

        if category:
            query = query.filter(InventoryItem.category == category)

        if tag:
            # tags 문자열에 포함되는지(간단 LIKE)
            query = query.filter(InventoryItem.tags.ilike(f"%{tag}%"))

        if keyword:
            query = query.filter(
                (InventoryItem.name.ilike(f"%{keyword}%")) |
                (InventoryItem.category.ilike(f"%{keyword}%")) |
                (InventoryItem.tags.ilike(f"%{keyword}%"))
            )

        if price_min is not None:
            query = query.filter(TradeListing.price >= price_min)

        if price_max is not None:
            query = query.filter(TradeListing.price <= price_max)

        # 정렬: sort=name, -price 등
        # Listing 필드 우선, 없으면 InventoryItem 필드에서 찾음
        if sort:
            desc = False
            field = sort
            if sort.startswith("-"):
                desc = True
                field = sort[1:]

            if hasattr(TradeListing, field):
                col = getattr(TradeListing, field)
            elif hasattr(InventoryItem, field):
                col = getattr(InventoryItem, field)
            else:
                col = TradeListing.id

            query = query.order_by(col.desc() if desc else col.asc())
        else:
            query = query.order_by(TradeListing.id.asc())

        # paginate_query는 Query.count()를 쓰므로, (TradeListing, InventoryItem) 튜플이어도 동작함
        items, meta = paginate_query(query, page, size)
        return items, meta

    @staticmethod
    def get_detail(db: Session, listing_id: int):
        return (
            db.query(TradeListing, InventoryItem)
            .join(InventoryItem, TradeListing.inventory_item_id == InventoryItem.id)
            .filter(TradeListing.id == listing_id)
            .first()
        )

    @staticmethod
    def list_reservations(db: Session, listing_id: int):
        return (
            db.query(TradeReservation)
            .filter(TradeReservation.listing_id == listing_id)
            .filter(TradeReservation.status != ReservationStatus.CANCELED)
            .order_by(TradeReservation.created_at.asc())
            .all()
        )

    @staticmethod
    def create_reservation(db: Session, reservation: TradeReservation) -> TradeReservation:
        db.add(reservation)
        db.commit()
        db.refresh(reservation)
        return reservation
