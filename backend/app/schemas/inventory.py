from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, Literal

from app.models.inventory_item import ItemStatus


class InventoryItemBase(BaseModel):
    name: str = Field(..., max_length=120)
    category: Optional[str] = Field(None, max_length=80)
    tags: Optional[str] = Field(None, max_length=255)
    size: Optional[str] = Field(None, max_length=80)
    contact: Optional[str] = Field(None, max_length=120)
    image_path: Optional[str] = Field(None, max_length=500)
    purchased_at: Optional[datetime] = None
    status: ItemStatus = ItemStatus.AVAILABLE
    is_deal_done: bool = False
    description: Optional[str] = None


class InventoryItemCreate(InventoryItemBase):
    club_id: int


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=120)
    category: Optional[str] = Field(None, max_length=80)
    tags: Optional[str] = Field(None, max_length=255)
    size: Optional[str] = Field(None, max_length=80)
    contact: Optional[str] = Field(None, max_length=120)
    image_path: Optional[str] = Field(None, max_length=500)
    purchased_at: Optional[datetime] = None
    status: Optional[ItemStatus] = None
    is_deal_done: Optional[bool] = None
    description: Optional[str] = None


class InventoryItemOut(BaseModel):
    id: int
    club_id: int
    name: str
    category: Optional[str]
    tags: Optional[str]
    size: Optional[str]
    contact: Optional[str]
    image_path: Optional[str]
    purchased_at: Optional[datetime]
    status: ItemStatus
    is_deal_done: bool
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
