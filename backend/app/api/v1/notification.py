from fastapi import APIRouter

router = APIRouter(
    prefix="/notifications",
    tags=["알림"],
)


@router.get(
    "/ping",
    summary="알림 도메인 라우터 확인용",
    description="TODO: 실제 알림 API로 대체 예정",
)
async def notification_ping():
    return {"message": "notification router is alive"}