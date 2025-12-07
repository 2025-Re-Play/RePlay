from fastapi import FastAPI

app = FastAPI(
    title="RePlay API",
    description="연극/영화 소품 중고거래 플랫폼 Re;Play 백엔드 API",
    version="0.1.0",
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "RePlay"}
