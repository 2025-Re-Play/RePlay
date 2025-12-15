import enum
from datetime import datetime

from sqlalchemy import ForeignKey, String, Text, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ItemStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    RENTED = "RENTED"
    SOLD = "SOLD"
    UNAVAILABLE = "UNAVAILABLE"


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    club_id: Mapped[int] = mapped_column(ForeignKey("clubs.id"), index=True, nullable=False)

    name: Mapped[str] = mapped_column(String(120), index=True, nullable=False)
    category: Mapped[str | None] = mapped_column(String(80), index=True, nullable=True)
    tags: Mapped[str | None] = mapped_column(String(255), index=True, nullable=True)
    size: Mapped[str | None] = mapped_column(String(80), nullable=True)
    contact: Mapped[str | None] = mapped_column(String(120), nullable=True)
    image_path: Mapped[str | None] = mapped_column(String(500), nullable=True)

    purchased_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    status: Mapped[ItemStatus] = mapped_column(
        Enum(ItemStatus),
        default=ItemStatus.AVAILABLE,
        index=True,
        nullable=False,
    )

    is_deal_done: Mapped[bool] = mapped_column(default=False, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    club: Mapped["Club"] = relationship("Club", back_populates="inventory_items")

    trade_listing: Mapped["TradeListing | None"] = relationship(
        back_populates="inventory_item",
        uselist=False,
    )