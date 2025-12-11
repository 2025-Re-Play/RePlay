from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(
    prefix="/ws",
    tags=["실시간"],
)


@router.websocket("/notifications")
async def notifications_websocket(websocket: WebSocket):
    """
    알림용 WebSocket 엔드포인트 뼈대.
    현재는 echo 수준으로만 동작하며, 추후 실제 알림/채팅 로직으로 교체 예정.
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # TODO: 실제 알림/채팅 브로드캐스트 로직으로 교체
            await websocket.send_text(f"echo: {data}")
    except WebSocketDisconnect:
        # 연결 종료 시 특별한 처리는 아직 없음
        pass