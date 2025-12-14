from sqlalchemy import Table, Column, ForeignKey, UniqueConstraint
from app.database import Base

club_admins = Table(
    "club_admins",
    Base.metadata,
    Column("club_id", ForeignKey("clubs.id"), primary_key=True),
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    UniqueConstraint("club_id", "user_id", name="uq_club_admins_club_user"),
)