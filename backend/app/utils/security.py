from datetime import datetime, timedelta
from typing import Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.exc import MissingBackendError
from pydantic import BaseModel

from app.config import settings


# --------------------------------------------------------------------
# 1. 비밀번호 해시/검증
# --------------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _ensure_password_length(password: str) -> None:
    # bcrypt는 입력이 72 bytes 초과면 예외가 날 수 있음
    if len(password.encode("utf-8")) > 72:
        # 여기서는 ValueError로 두고, 서비스에서 ValidationException으로 변환하는 방식 유지
        raise ValueError("Password exceeds bcrypt 72-byte limit")


def hash_password(password: str) -> str:
    """
    평문 비밀번호를 bcrypt 해시로 변환합니다.
    """
    _ensure_password_length(password)

    try:
        return pwd_context.hash(password)
    except MissingBackendError as exc:
        # passlib이 bcrypt backend를 못 찾는 경우 (배포 환경 설치/버전 문제)
        raise RuntimeError(
            "bcrypt backend is not available. "
            "Check 'bcrypt' package compatibility with your Python version."
        ) from exc
    except AttributeError as exc:
        # 네 로그의: AttributeError: module 'bcrypt' has no attribute '__about__'
        # 이건 보통 bcrypt 패키지 버전/호환 문제로 발생
        raise RuntimeError(
            "bcrypt package appears incompatible (missing '__about__'). "
            "Pin bcrypt to a compatible version or switch hashing algorithm."
        ) from exc


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    입력된 평문 비밀번호와 DB에 저장된 해시가 일치하는지 검증합니다.
    """
    _ensure_password_length(plain_password)

    try:
        return pwd_context.verify(plain_password, hashed_password)
    except MissingBackendError as exc:
        raise RuntimeError(
            "bcrypt backend is not available. "
            "Check 'bcrypt' package compatibility with your Python version."
        ) from exc
    except AttributeError as exc:
        raise RuntimeError(
            "bcrypt package appears incompatible (missing '__about__'). "
            "Pin bcrypt to a compatible version or switch hashing algorithm."
        ) from exc


# --------------------------------------------------------------------
# 2. JWT 토큰 페이로드 정의
# --------------------------------------------------------------------
class TokenPayload(BaseModel):
    sub: int
    role: str
    exp: int


# --------------------------------------------------------------------
# 3. JWT 발급/검증
# --------------------------------------------------------------------
ALGORITHM = settings.JWT_ALGORITHM


def create_access_token(
    data: Dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    to_encode = data.copy()
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])

    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=ALGORITHM,
    )


def decode_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        return TokenPayload(**payload)
    except JWTError as exc:
        raise exc
