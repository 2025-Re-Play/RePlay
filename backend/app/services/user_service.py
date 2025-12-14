from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.exceptions import AppException, ValidationException, NotFoundException
from app.models.user import User, UserRole
from app.config import settings

class UserService:
    def signup(self, db: Session, data: UserCreate) -> UserResponse:
        existing = UserRepository.get_by_email(db, data.email)
        if existing:
            raise ValidationException("이미 사용 중인 이메일입니다.")

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

    def login(self, db: Session, email: str, password: str) -> str:
        user = UserRepository.get_by_email(db, email)
        if not user:
            raise NotFoundException("해당 이메일을 가진 사용자가 없습니다.")

        if not verify_password(password, user.password_hash):
            raise ValidationException("비밀번호가 일치하지 않습니다.")

        return create_access_token({"sub": str(user.id), "role": user.role.value})