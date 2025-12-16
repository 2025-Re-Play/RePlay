from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1.router import api_router
from app.api.v1 import realtime

from app.schemas.common import fail, ok
from app.utils.exceptions import AppException
from fastapi.exceptions import HTTPException

import sqlalchemy as sa
from app.database import engine


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
    openapi_tags=tags_metadata,  
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content=fail(exc.code, exc.message).dict(),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=fail("HTTP_ERROR", exc.detail).dict(),
    )


# CORS 설정
LOCAL_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

PROD_ORIGINS = ["https://replay.vercel.app"]

if getattr(settings, "ENV", "local") == "local":
    allow_origins = LOCAL_ORIGINS
    allow_origin_regex = r"^http://(localhost|127\.0\.0\.1)(:\d+)?$"
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
app.include_router(api_router)      # /api/v1/...
app.include_router(realtime.router) # /ws/...


@app.get(
    "/health",
    summary="헬스 체크",
    description="기본 시스템 헬스 체크. 필요 시 DB 연결 상태 검사도 포함 가능.",
    tags=["health"],
)
async def health():
    # 기본은 서비스 살아있음만 반환 (마이그레이션 깨져도 서버는 뜨게)
    payload = {"service": "RePlay"}

    return ok(payload)
