import json
import logging
from typing import Any, Dict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.utils.ws import ws_manager

router = APIRouter(
    prefix="/ws",
    tags=["실시간"],
)

logger = logging.getLogger("replay.websocket")


@router.websocket("/echo")
async def websocket_echo(websocket: WebSocket) -> None:
    """
    WebSocket echo / broadcast / notification 수신 엔드포인트

    지원 메시지 타입:
    - echo        : 개인 echo
    - broadcast   : 전체 브로드캐스트
    - NOTIFICATION: 서버 push 전용 (클라이언트 송신 무시)
    """
    await ws_manager.connect(websocket)
    logger.info("Client connected to /ws/echo")

    try:
        while True:
            raw = await websocket.receive_text()
            logger.debug("Received raw message: %s", raw)

            # JSON 파싱
            try:
                payload: Dict[str, Any] = json.loads(raw)
            except json.JSONDecodeError:
                payload = {"type": "echo", "payload": raw}

            msg_type = payload.get("type", "echo")
            data = payload.get("payload")

            # 서버 알림 push 타입은 클라이언트 송신 무시
            if msg_type == "NOTIFICATION":
                continue

            # broadcast
            if msg_type == "broadcast":
                await ws_manager.broadcast_json(
                    {
                        "type": "broadcast",
                        "payload": data,
                    }
                )
            # echo
            else:
                await ws_manager.send_personal_json(
                    websocket,
                    {
                        "type": "echo",
                        "payload": data,
                    }
                )

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected from /ws/echo")
        ws_manager.disconnect(websocket)

    except Exception:
        logger.exception("Unexpected WebSocket error")
        ws_manager.disconnect(websocket)
