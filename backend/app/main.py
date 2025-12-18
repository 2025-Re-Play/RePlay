from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

from app.config import settings
from app.api.v1.router import api_router
from app.api.v1 import realtime

from app.schemas.common import fail, ok
from app.utils.exceptions import AppException

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


# -----------------------------
# CORS 설정 (OPTIONS 400 해결)
# -----------------------------
LOCAL_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

PROD_ORIGINS = [
    "https://replay.vercel.app",
]

# prod(Railway)에서도 로컬 프론트로 테스트할 수 있게 local origin을 같이 허용
allow_origins = LOCAL_ORIGINS + PROD_ORIGINS

allow_origin_regex = r"^https://.*\.vercel\.app$"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(api_router)       # /api/v1/...
app.include_router(realtime.router)  # /ws/...
