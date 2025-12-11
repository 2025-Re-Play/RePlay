from fastapi import APIRouter

router = APIRouter(
    prefix="/mypage",
    tags=["마이페이지"],
)


@router.get(
    "/ping",
    summary="마이페이지 도메인 라우터 확인용",
    description="TODO: 실제 마이페이지 API로 대체 예정",
)
async def mypage_ping():
    return {"message": "mypage router is alive"}