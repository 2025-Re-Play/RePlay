from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import require_admin, get_current_user
from app.schemas.common import ok
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup(data: UserCreate, db: Session = Depends(get_db)):
    user = UserService().signup(db, data)
    return ok(user)


@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    token = UserService().login(db, data.email, data.password)
    return ok(token)


@router.post("/logout")
def logout(
    current_user: UserResponse = Depends(get_current_user),
):
    return ok({
        "message": "로그아웃 되었습니다."
    })


@router.get("/admin-test")
def admin_test(
    current_user: UserResponse = Depends(require_admin),
):
    return ok({
        "message": "관리자만 접근 가능",
        "user_id": current_user.id,
        "role": current_user.role,
    })
