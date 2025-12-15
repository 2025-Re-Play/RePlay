from sqlalchemy.orm import Session
from app.models.inventory_item import InventoryItem, ItemStatus
from app.utils.pagination import paginate_query, apply_keyword_filter, apply_sort


class InventoryRepository:

    @staticmethod
    def create(db: Session, item: InventoryItem) -> InventoryItem:
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def get(db: Session, item_id: int) -> InventoryItem | None:
        return db.query(InventoryItem).filter(InventoryItem.id == item_id).first()

    @staticmethod
    def update(db: Session, item: InventoryItem) -> InventoryItem:
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item: InventoryItem) -> None:
        db.delete(item)
        db.commit()

    @staticmethod
    def list(
        db: Session,
        club_id: int | None,
        status: ItemStatus | None,
        keyword: str | None,
        sort: str | None,
        page: int,
        size: int,
    ):
        query = db.query(InventoryItem)

        if club_id is not None:
            query = query.filter(InventoryItem.club_id == club_id)

        if status is not None:
            query = query.filter(InventoryItem.status == status)

        query = apply_keyword_filter(
            query,
            keyword,
            [InventoryItem.name, InventoryItem.category, InventoryItem.tags],
        )

        query = apply_sort(query, sort, InventoryItem)

        return paginate_query(query, page, size)
