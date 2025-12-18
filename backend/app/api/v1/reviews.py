from __future__ import annotations

import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User, UserRole
from app.schemas.common import ok

from app.models.review import Review
from app.repositories.review_repository import ReviewRepository
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewOut

from app.models.performance import Performance  # 공연 도메인
from app.models.notification import NotificationType
from app.services.notification_service import NotificationService


router = APIRouter(tags=["Reviews"])


def _is_admin_of_performance(user: User, performance: Performance) -> bool:
    return (
        user.role == UserRole.ADMIN
        and user.club_id is not None
        and user.club_id == performance.club_id
    )


@router.post(
    "/performances/{performance_id}/reviews",
    status_code=status.HTTP_201_CREATED,
)
async def create_review(
    performance_id: int,
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    performance = db.query(Performance).filter(Performance.id == performance_id).first()
    if not performance:
        raise HTTPException(status_code=404, detail="공연 정보를 찾을 수 없습니다.")

    review = ReviewRepository.create(
        db=db,
        performance_id=performance_id,
        author_user_id=current_user.id,
        content=data.content,
        is_public=data.is_public,
        rating=data.rating,
    )

    # 🔔 알림 발행: 해당 공연 동아리 관리자에게
    admins: List[User] = (
        db.query(User)
        .filter(User.role == UserRole.ADMIN)
        .filter(User.club_id == performance.club_id)
        .all()
    )

    payload = json.dumps(
        {
            "performance_id": performance.id,
            "review_id": review.id,
            "author_user_id": current_user.id,
        },
        ensure_ascii=False,
    )

    for admin in admins:
        if admin.id == current_user.id:
            continue

        await NotificationService.notify_user(
            db=db,
            user_id=admin.id,
            type=NotificationType.POST_COMMENT,
            message="공연에 새로운 후기가 등록되었습니다.",
            entity_id=performance.id,
            payload=payload,
        )

    return ok(ReviewOut.model_validate(review))


@router.get("/performances/{performance_id}/reviews")
def list_reviews(
    performance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    performance = db.query(Performance).filter(Performance.id == performance_id).first()
    if not performance:
        raise HTTPException(status_code=404, detail="공연 정보를 찾을 수 없습니다.")

    q = db.query(Review).filter(Review.performance_id == performance_id)

    if _is_admin_of_performance(current_user, performance):
        reviews = q.order_by(Review.created_at.desc()).all()
    else:
        reviews = (
            q.filter(
                or_(
                    Review.is_public == True,  # noqa: E712
                    Review.author_user_id == current_user.id,
                )
            )
            .order_by(Review.created_at.desc())
            .all()
        )

    return ok([ReviewOut.model_validate(r) for r in reviews])


@router.patch("/reviews/{review_id}")
def update_review(
    review_id: int,
    data: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = ReviewRepository.get_by_id(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="후기를 찾을 수 없습니다.")

    if review.author_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="작성자만 수정할 수 있습니다.",
        )

    if data.content is not None:
        review.content = data.content
    if data.is_public is not None:
        review.is_public = data.is_public
    if data.rating is not None:
        review.rating = data.rating

    review = ReviewRepository.update(db, review)
    return ok(ReviewOut.model_validate(review))


@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = ReviewRepository.get_by_id(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="후기를 찾을 수 없습니다.")

    if review.author_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="작성자만 삭제할 수 있습니다.",
        )

    ReviewRepository.delete(db, review)
    return ok({"message": "삭제되었습니다."})
