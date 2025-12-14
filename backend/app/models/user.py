from __future__ import annotations

import enum
from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship

from app.database import Base

if TYPE_CHECKING:
    from .club import Club  # 타입 힌트용(실행 시 import 안 됨)


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(50), nullable=False)

    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)

    # 일단 기존 유지 (추후 FK/관계로 개선 가능)
    school_id = Column(Integer, nullable=True)
    club_id = Column(Integer, nullable=True)

    managed_clubs = relationship(
        "Club",
        secondary="club_admins",
        back_populates="admins",
    )
