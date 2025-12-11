from fastapi import APIRouter

router = APIRRouter(
    prefix="/community",
    tags=["커뮤니티"],
)


@router.get(
    "/ping",
    summary="커뮤니티 도메인 라우터 확인용",
    description="TODO: 실제 커뮤니티 API로 대체 예정",
)
async def community_ping():
    return {"message": "community router is alive"}