from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List

from app.models.trade_listing import TradeType
from app.models.trade_reservation import ReservationStatus


class TradeListItem(BaseModel):
    id: int
    trade_type: TradeType
    price: int
    deposit: int
    is_public: bool

    # InventoryItem에서 내려줄 최소 정보
    item_id: int
    club_id: int
    name: str
    category: Optional[str]
    tags: Optional[str]
    image_path: Optional[str]

    class Config:
        from_attributes = True


class TradeDetail(BaseModel):
    id: int
    trade_type: TradeType
    price: int
    deposit: int
    is_public: bool
    title: Optional[str]
    description: Optional[str]

    # InventoryItem 상세
    item_id: int
    club_id: int
    name: str
    category: Optional[str]
    tags: Optional[str]
    size: Optional[str]
    contact: Optional[str]
    image_path: Optional[str]
    purchased_at: Optional[datetime]
    status: str
    is_deal_done: bool
    item_description: Optional[str]

    class Config:
        from_attributes = True


class ReserveCreate(BaseModel):
    trade_type: TradeType
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    message: Optional[str] = None


class ReservationOut(BaseModel):
    id: int
    listing_id: int
    user_id: int
    trade_type: TradeType
    start_at: Optional[datetime]
    end_at: Optional[datetime]
    status: ReservationStatus
    message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ReservationCalendarRange(BaseModel):
    start_at: Optional[datetime]
    end_at: Optional[datetime]
    trade_type: TradeType
    status: ReservationStatus
