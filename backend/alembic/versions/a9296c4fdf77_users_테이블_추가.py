"""users 테이블 추가

Revision ID: a9296c4fdf77
Revises: 75b17e3dc042
Create Date: 2025-12-16 01:34:00.326911

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "a9296c4fdf77"
down_revision: Union[str, Sequence[str], None] = "75b17e3dc042"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()

    # 1) Postgres에서 enum 타입은 '있으면 스킵'으로 먼저 보장
    if bind.dialect.name == "postgresql":
        enum_create = postgresql.ENUM("ADMIN", "USER", name="userrole")
        enum_create.create(bind, checkfirst=True)

        role_enum = postgresql.ENUM("ADMIN", "USER", name="userrole", create_type=False)
    else:
        # MySQL 등에서는 sa.Enum 그대로 사용
        role_enum = sa.Enum("ADMIN", "USER", name="userrole")

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),

        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),

        sa.Column("role", role_enum, nullable=False, server_default="USER"),

        sa.Column("school_id", sa.Integer(), nullable=True),
        sa.Column("club_id", sa.Integer(), nullable=True),

        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )

    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")

    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        # 타입을 다른 테이블이 쓰고 있을 가능성도 있으니 안전하게 IF EXISTS
        op.execute("DROP TYPE IF EXISTS userrole")
