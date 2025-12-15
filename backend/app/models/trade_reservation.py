import enum
from datetime import datetime

from sqlalchemy import ForeignKey, DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.trade_listing import TradeType


class ReservationStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELED = "CANCELED"


class TradeReservation(Base):
    __tablename__ = "trade_reservations"

    id: Mapped[int] = mapped_column(primary_key=True)

    listing_id: Mapped[int] = mapped_column(ForeignKey("trade_listings.id"), index=True, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)

    trade_type: Mapped[TradeType] = mapped_column(Enum(TradeType), index=True, nullable=False)

    # RENT일 때만 기간 사용(SELL이면 None 가능)
    start_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    end_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    message: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[ReservationStatus] = mapped_column(Enum(ReservationStatus), default=ReservationStatus.PENDING, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    listing: Mapped["TradeListing"] = relationship(back_populates="reservations")
    user: Mapped["User"] = relationship()  # 필요시 back_populates 확장 가능
