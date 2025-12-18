from __future__ import annotations

import enum
from datetime import datetime, date

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Date
from app.database import Base


class CommunityPostType(str, enum.Enum):
    general = "general"
    request = "request"


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)

    type = Column(Enum(CommunityPostType), nullable=False, index=True)

    title = Column(String(200), nullable=False, index=True)
    content = Column(Text, nullable=False)

    image_url = Column(String(500), nullable=True)
    tags = Column(String(500), nullable=True, index=True)

    author_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=True, index=True)

    request_category = Column(String(100), nullable=True, index=True)
    desired_start_date = Column(Date, nullable=True)
    desired_end_date = Column(Date, nullable=True)

    like_count = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
