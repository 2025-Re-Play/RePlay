import json
import logging
from typing import Any, Dict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.utils.websocket_manager import WebSocketManager

router = APIRouter(
    prefix="/ws",
    tags=["실시간"],
)

logger = logging.getLogger("replay.websocket")
manager = WebSocketManager()


@router.websocket("/echo")
async def websocket_echo(websocket: WebSocket) -> None:
    """
    기본 WebSocket echo 엔드포인트.

    - 클라이언트가 보낸 메시지를 그대로 돌려주거나
    - type = "broadcast" 인 경우 모든 클라이언트에 브로드캐스트

    메시지 포맷 예시:
    {
        "type": "echo",        # 또는 "broadcast"
        "payload": "hello"
    }
    """
    await manager.connect(websocket)
    logger.info("Client connected to /ws/echo")

    try:
        while True:
            raw = await websocket.receive_text()
            logger.info("Received raw message: %s", raw)

            # JSON 파싱 시도
            try:
                payload: Dict[str, Any] = json.loads(raw)
            except json.JSONDecodeError:
                # JSON이 아니면 기본 echo 포맷으로 감싸서 처리
                payload = {"type": "echo", "payload": raw}

            msg_type = payload.get("type", "echo")
            data = payload.get("payload")

            if msg_type == "broadcast":
                response = {"type": "broadcast", "payload": data}
                logger.info("Broadcasting message: %s", response)
                await manager.broadcast_json(response)
            else:
                response = {"type": "echo", "payload": data}
                logger.info("Echoing message: %s", response)
                await manager.send_personal_json(websocket, response)

    except WebSocketDisconnect:
        logger.info("WebSocketDisconnect on /ws/echo")
        manager.disconnect(websocket)
    except Exception as e:
        logger.exception("Unexpected WebSocket error: %s", e)
        manager.disconnect(websocket)
