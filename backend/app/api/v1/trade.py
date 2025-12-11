from fastapi import APIRouter

router = APIRouter(
    prefix="/trade",
    tags=["거래"],
)


@router.get(
    "/ping",
    summary="거래 도메인 라우터 확인용",
    description="TODO: 실제 거래 관련 API로 대체 예정",
)
async def trade_ping():
    return {"message": "trade router is alive"}