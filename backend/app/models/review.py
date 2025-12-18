from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index
from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    performance_id = Column(Integer, ForeignKey("performances.id"), nullable=False, index=True)
    author_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    content = Column(String(2000), nullable=False)

    # 비공개 후기 지원
    is_public = Column(Boolean, nullable=False, default=True, index=True)

    # 평점은 선택(1~5). 없으면 NULL
    rating = Column(Integer, nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_reviews_performance_created", "performance_id", "created_at"),
    )
