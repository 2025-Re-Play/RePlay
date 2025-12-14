from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from app.config import settings

# --------------------------------------------------------------------
# 1. DATABASE_URL 검증
# --------------------------------------------------------------------
if not getattr(settings, "DATABASE_URL", None):
    raise ValueError("DATABASE_URL is not set in environment variables")

# --------------------------------------------------------------------
# 2. SQLAlchemy Engine / Session 설정
# --------------------------------------------------------------------
is_dev = getattr(settings, "ENV", "production") != "production"

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=is_dev,
    future=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=Session,
)

# --------------------------------------------------------------------
# 3. Base 선언
# --------------------------------------------------------------------
Base = declarative_base()


# --------------------------------------------------------------------
# 4. FastAPI Dependency - get_db
# --------------------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------------------------
# 5. (선택) DB 연결 테스트 함수
# --------------------------------------------------------------------
def check_db_connection() -> None:
    """
    DB 연결이 되는지만 확인.
    테이블 생성(create_all)은 Alembic으로만 관리하는 것을 권장.
    """
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))  # MySQL/Postgres 모두 동작
