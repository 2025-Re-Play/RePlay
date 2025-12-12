from fastapi import Depends, Header
from typing import Optional
from app.utils.security import decode_token
from app.services.user_service import UserService
from app.utils.exceptions import AppException
from app.schemas.user import UserResponse

def get_current_user(
    authorization: Optional[str] = Header(None),
) -> UserResponse:
    """
    JWT Authorization 헤더 파싱 및 사용자 조회
    """
    if authorization is None or not authorization.startswith("Bearer "):
        raise AppException.unauthorized("로그인이 필요합니다.")

    token = authorization.split(" ")[1]

    payload = decode_token(token)
    user_id = payload.sub

    user = UserService().get_user_by_id(user_id)
    if not user:
        raise AppException.not_found("사용자를 찾을 수 없습니다.")

    return user

def require_admin(
    current_user: UserResponse = Depends(get_current_user),
):
    """ADMIN 전용 접근 제한"""
    if current_user.role != "ADMIN":
        raise AppException.forbidden("관리자 권한이 필요합니다.")
    return current_user