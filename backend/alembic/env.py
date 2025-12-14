from __future__ import annotations

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# -----------------------------
# Alembic Config
# -----------------------------
config = context.config

# logging 설정
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# -----------------------------
# ✅ 프로젝트 설정 / 모델 로딩
# -----------------------------
# 중요:
# - env.py는 backend/에서 실행되므로, app 패키지를 import 할 수 있어야 함.
# - PYTHONPATH가 backend를 포함하면 보통 문제 없음.
# - 아래 import가 실패하면: `cd backend`에서 실행 중인지 확인

from app.config import settings  # settings.DATABASE_URL 사용 (네 프로젝트에 맞춤)
from app.database import Base
import app.models  # ★ 이 한 줄이 School/Club/User 등을 로드해서 metadata에 등록하게 함

# ✅ alembic.ini 대신 settings에서 URL을 주입
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# ✅ autogenerate가 비교할 메타데이터
target_metadata = Base.metadata


# -----------------------------
# Migrations
# -----------------------------
def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,  # 타입 변경 감지
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # 타입 변경 감지
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
