"""users 테이블 추가

Revision ID: a9296c4fdf77
Revises: 75b17e3dc042
Create Date: 2025-12-16 01:34:00.326911

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a9296c4fdf77"
down_revision: Union[str, Sequence[str], None] = "75b17e3dc042"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # dialect별로 안전하게 Enum 타입을 준비
    bind = op.get_bind()
    dialect = bind.dialect.name  # "postgresql" | "mysql" | ...

    userrole_enum = sa.Enum("ADMIN", "USER", name="userrole")

    # PostgreSQL은 enum type을 명시적으로 생성해두는 게 안전
    if dialect == "postgresql":
        userrole_enum.create(bind, checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),

        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),

        sa.Column(
            "role",
            userrole_enum,
            nullable=False,
            server_default=sa.text("'USER'"),  # DB에서 안전한 default 표현
        ),

        sa.Column("school_id", sa.Integer(), nullable=True),
        sa.Column("club_id", sa.Integer(), nullable=True),

        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )

    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)


def downgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")

    # PostgreSQL만 enum type drop 수행 (MySQL에서는 DROP TYPE 문법 자체가 없음)
    if dialect == "postgresql":
        op.execute("DROP TYPE IF EXISTS userrole")
