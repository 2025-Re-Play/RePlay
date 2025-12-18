from __future__ import annotations

from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, Tuple, List

from app.models.notification import Notification, NotificationType


class NotificationRepository:
    @staticmethod
    def create(
        db: Session,
        recipient_user_id: int,
        type: NotificationType,
        message: str,
        entity_id: Optional[int] = None,
        payload: Optional[str] = None,
    ) -> Notification:
        n = Notification(
            recipient_user_id=recipient_user_id,
            type=type,
            message=message,
            entity_id=entity_id,
            payload=payload,
            is_read=False,
        )
        db.add(n)
        db.commit()
        db.refresh(n)
        return n

    @staticmethod
    def get_by_id(db: Session, notification_id: int) -> Optional[Notification]:
        return db.query(Notification).filter(Notification.id == notification_id).first()

    @staticmethod
    def list_for_user(
        db: Session,
        user_id: int,
        is_read: Optional[bool],
        page: int,
        size: int,
    ) -> Tuple[List[Notification], int]:
        q = db.query(Notification).filter(Notification.recipient_user_id == user_id)
        if is_read is not None:
            q = q.filter(Notification.is_read == is_read)

        total = q.count()
        items = (
            q.order_by(desc(Notification.created_at))
            .offset((page - 1) * size)
            .limit(size)
            .all()
        )
        return items, total

    @staticmethod
    def mark_read(db: Session, notification: Notification) -> Notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return notification
