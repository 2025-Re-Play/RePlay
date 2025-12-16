from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.exceptions import ValidationException, NotFoundException
from app.models.user import User, UserRole
from app.config import settings


class UserService:
    def signup(self, db: Session, data: UserCreate) -> UserResponse:
        existing = UserRepository.get_by_email(db, data.email)
        if existing:
            raise ValidationException("이미 사용 중인 이메일입니다.")

        # bcrypt는 72 bytes 제한이 있음 (utf-8 기준 bytes)
        # 길면 서버 500이 아니라 4xx로 떨어지게 막음
        pw_bytes = data.password.encode("utf-8")
        if len(pw_bytes) > 72:
            raise ValidationException("비밀번호가 너무 깁니다. (최대 72바이트)")

        role = UserRole.USER

        # 관리자 가입 처리
        if data.role == UserRole.ADMIN:
            if not data.admin_code:
                raise ValidationException("관리자 가입 코드를 입력해주세요.")
            if data.admin_code != settings.ADMIN_SIGNUP_CODE:
                raise ValidationException("관리자 가입 코드가 올바르지 않습니다.")
            role = UserRole.ADMIN

        new_user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            name=data.name,
            role=role,
            school_id=data.school_id,
            club_id=data.club_id,
        )

        saved = UserRepository.create(db, new_user)
        return UserResponse.from_orm(saved)

    def get_user_by_id(self, db: Session, user_id: int):
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise NotFoundException("사용자를 찾을 수 없습니다.")
        return user

    def login(self, db: Session, email: str, password: str) -> str:
        user = UserRepository.get_by_email(db, email)
        if not user:
            raise NotFoundException("해당 이메일을 가진 사용자가 없습니다.")

        # 로그인도 동일하게 길이 제한 (불필요한 500 방지)
        pw_bytes = password.encode("utf-8")
        if len(pw_bytes) > 72:
            raise ValidationException("비밀번호가 너무 깁니다. (최대 72바이트)")

        if not verify_password(password, user.password_hash):
            raise ValidationException("비밀번호가 일치하지 않습니다.")

        return create_access_token({"sub": str(user.id), "role": user.role.value})
