import enum
from datetime import datetime

from sqlalchemy import ForeignKey, String, Text, DateTime, Enum, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TradeType(str, enum.Enum):
    RENT = "RENT"
    SELL = "SELL"


class TradeListing(Base):
    __tablename__ = "trade_listings"

    id: Mapped[int] = mapped_column(primary_key=True)

    inventory_item_id: Mapped[int] = mapped_column(
        ForeignKey("inventory_items.id"),
        nullable=False,
        index=True,
        unique=True,  # 물품 1개당 listing 1개(기본)
    )

    title: Mapped[str | None] = mapped_column(String(120), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    trade_type: Mapped[TradeType] = mapped_column(Enum(TradeType), index=True, nullable=False)

    price: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # SELL: 판매가 / RENT: 대여가(기본)
    deposit: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # RENT 보증금(옵션)

    is_public: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    inventory_item: Mapped["InventoryItem"] = relationship(back_populates="trade_listing")
    reservations: Mapped[list["TradeReservation"]] = relationship(
        back_populates="listing",
        cascade="all, delete-orphan",
    )
