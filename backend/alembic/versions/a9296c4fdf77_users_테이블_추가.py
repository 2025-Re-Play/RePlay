"""users 테이블 추가

Revision ID: a9296c4fdf77
Revises: 75b17e3dc042
Create Date: 2025-12-16 01:34:00.326911

"""
from typing import Sequence, Union
from sqlalchemy.dialects import postgresql
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a9296c4fdf77"
down_revision: Union[str, Sequence[str], None] = "75b17e3dc042"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1) Postgres enum 타입은 별도로 생성 (이미 있으면 스킵)
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
                CREATE TYPE userrole AS ENUM ('ADMIN', 'USER');
            END IF;
        END$$;
        """)

    # 2) 컬럼은 이미 존재하는 enum 타입을 "사용만" 하도록 create_type=False
    role_enum = sa.Enum("ADMIN", "USER", name="userrole", create_type=False)

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
        op.execute("DROP TYPE IF EXISTS userrole")