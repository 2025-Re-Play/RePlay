from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from jose import JWTError, ExpiredSignatureError

from app.database import get_db
from app.services.user_service import UserService
from app.utils.security import decode_token
from app.utils.exceptions import AppException
from app.models.user import UserRole
from app.schemas.user import UserResponse

security = HTTPBearer(auto_error=False)


def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> UserResponse:
    """
    Authorization: Bearer <token> → 토큰 검증 → 사용자 조회
    """
    if creds is None or not creds.credentials:
        raise AppException.unauthorized("로그인이 필요합니다.")

    token = creds.credentials
    try:
        payload = decode_token(token)
    except ExpiredSignatureError:
        raise AppException.unauthorized("토큰이 만료되었습니다.")
    except JWTError:
        raise AppException.unauthorized("유효하지 않은 토큰입니다.")

    user_id = int(payload.sub)

    user = UserService().get_user_by_id(db, user_id)
    if not user:
        raise AppException.not_found("사용자를 찾을 수 없습니다.")

    return UserResponse.model_validate(user, from_attributes=True)

def require_admin(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """
    ADMIN 전용 접근 제한
    """
    if current_user.role != UserRole.ADMIN:
        raise AppException(
            status_code=403,
            code="FORBIDDEN",
            message="관리자 권한이 필요합니다.",
        )

    return current_user
