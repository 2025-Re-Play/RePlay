from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine

app = FastAPI(
    title="RePlay API",
    description="연극/영화 소품 중고거래 플랫폼 Re;Play 백엔드 API",
    version="0.1.0",
)

# CORS 설정
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # 나중에 프론트 배포 URL 생기면 여기 추가
    # "https://replay-frontend-xxxx.up.railway.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    print(f"ENV: {settings.ENV}")
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
    
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "RePlay"}
