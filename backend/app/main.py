from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine
from app.api.v1.router import api_router
from app.api.v1 import realtime, auth

from app.schemas.common import fail, ok
from app.utils.exceptions import AppException
from fastapi.exceptions import HTTPException

tags_metadata = [
    {
        "name": "health",
        "description": "배포된 RePlay 백엔드 서버의 상태를 확인하는 헬스 체크 엔드포인트입니다.",
    },
]

app = FastAPI(
    title="RePlay API",
    description="연극/영화 소품 중고거래 플랫폼 Re;Play 백엔드 API",
    version="0.1.0",
)

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content=fail(exc.code, exc.message).dict()
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=fail("HTTP_ERROR", exc.detail).dict()
    )

# CORS 설정
LOCAL_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

PROD_ORIGINS = [
    # "https://replay-frontend.vercel.app",
    # "https://replay-frontend-xxxx.up.railway.app",
]

if getattr(settings, "ENV", "local") == "local":
    allow_origins = LOCAL_ORIGINS
    allow_origin_regex = r"^http://(localhost|127\.0\.0\.1)(:\d+)?$"  # 포트 바뀌어도 OK
else:
    allow_origins = PROD_ORIGINS
    allow_origin_regex = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HTTP + WebSocket 라우터 등록
app.include_router(api_router)          # /api/v1/...
app.include_router(realtime.router)     # /ws/...

@app.get(
    "/health",
    summary="헬스 체크",
    description="기본 시스템 헬스 체크. TODO: DB 연결 상태 검사 추가 예정.",
    tags=["시스템"],
)
async def health():
    return ok({"service": "RePlay"})