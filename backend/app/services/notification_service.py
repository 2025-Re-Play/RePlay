from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from app.models.notification import NotificationType
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationOut
from app.utils.ws import ws_manager


class NotificationService:
    @staticmethod
    async def notify_user(
        db: Session,
        user_id: int,
        type: NotificationType,
        message: str,
        entity_id: Optional[int] = None,
        payload: Optional[str] = None,
    ):
        """
        1) 알림 DB 저장
        2) WebSocket 실시간 push (broadcast)
        """
        notification = NotificationRepository.create(
            db=db,
            recipient_user_id=user_id,
            type=type,
            message=message,
            entity_id=entity_id,
            payload=payload,
        )

        await ws_manager.broadcast_json(
            {
                "type": "NOTIFICATION",
                "data": NotificationOut.model_validate(notification).model_dump(),
            }
        )

        return notification
