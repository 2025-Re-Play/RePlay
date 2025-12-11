from fastapi import APIRouter

router = APIRouter(
    prefix="/inventory",
    tags=["물품관리"],
)


@router.get(
    "/ping",
    summary="물품관리 도메인 라우터 확인용",
    description="TODO: 실제 물품 관리 API로 대체 예정",
)
async def inventory_ping():
    return {"message": "inventory router is alive"}