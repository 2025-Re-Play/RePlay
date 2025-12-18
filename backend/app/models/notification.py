from __future__ import annotations

import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text, ForeignKey, Index
from app.database import Base


class NotificationType(str, enum.Enum):
    ITEM_CHECK = "ITEM_CHECK"
    TRADE_STATUS = "TRADE_STATUS"
    POST_COMMENT = "POST_COMMENT"
    POST_REPLY = "POST_REPLY"
    REQUEST_RESPONSE = "REQUEST_RESPONSE"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    recipient_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    type = Column(Enum(NotificationType), nullable=False, index=True)

    # 관련 엔티티 식별자(게시글 id, 거래 id, 물품 id 등)
    entity_id = Column(Integer, nullable=True, index=True)

    # payload를 json으로 저장하고 싶으면 JSON 컬럼으로 바꾸면 됨
    payload = Column(Text, nullable=True)

    message = Column(String(500), nullable=False)

    is_read = Column(Boolean, nullable=False, default=False, index=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_notifications_recipient_created", "recipient_user_id", "created_at"),
    )
