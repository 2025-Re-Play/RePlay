from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.user_service import UserService
from app.schemas.common import ok

router = APIRouter(
    prefix="/auth",
    tags=["인증"]
)


@router.post("/signup", summary="회원가입")
def signup(data: UserCreate, db: Session = Depends(get_db)):
    user = UserService().signup(db, data)
    return ok(user)


@router.post("/login", summary="로그인")
def login(data: UserLogin, db: Session = Depends(get_db)):
    token = UserService().login(db, data)
    return ok({"access_token": token})
