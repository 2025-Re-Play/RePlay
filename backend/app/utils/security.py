from datetime import datetime, timedelta
from typing import Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.exc import MissingBackendError
from pydantic import BaseModel

from app.config import settings


# --------------------------------------------------------------------
# 1. 비밀번호 해시/검증 (argon2)
# --------------------------------------------------------------------
# argon2-cffi 패키지가 설치되어 있어야 동작함
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    평문 비밀번호를 argon2 해시로 변환합니다.
    """
    try:
        return pwd_context.hash(password)
    except MissingBackendError as exc:
        # argon2 backend를 못 찾는 경우 (배포 환경 설치/의존성 문제)
        raise RuntimeError(
            "argon2 backend is not available. "
            "Install 'argon2-cffi' and redeploy."
        ) from exc


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    입력된 평문 비밀번호와 DB에 저장된 해시가 일치하는지 검증합니다.
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except MissingBackendError as exc:
        raise RuntimeError(
            "argon2 backend is not available. "
            "Install 'argon2-cffi' and redeploy."
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
