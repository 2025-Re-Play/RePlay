from fastapi import FastAPI
from app.config import settings
from app.database import engine

app = FastAPI(
    title="RePlay API",
    description="연극/영화 소품 중고거래 플랫폼 Re;Play 백엔드 API",
    version="0.1.0",
)
@app.on_event("startup")
def on_startup():
    print(f"ENV: {settings.ENV}")
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
    
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "RePlay"}
