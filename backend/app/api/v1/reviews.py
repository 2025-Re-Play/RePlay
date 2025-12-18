from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.schemas.common import ok
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewOut
from app.repositories.review_repository import ReviewRepository

# Performance 모델이 이미 존재한다는 전제
from app.models.performance import Performance  # type: ignore
from app.models.user import User, UserRole

router = APIRouter(tags=["후기"])


@router.post("/performances/{performance_id}/reviews")
def create_review(
    performance_id: int,
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    perf = db.query(Performance).filter(Performance.id == performance_id).first()
    if not perf:
        raise HTTPException(status_code=404, detail="공연을 찾을 수 없습니다.")

    created = ReviewRepository.create(
        db=db,
        performance_id=performance_id,
        author_user_id=current_user.id,
        content=data.content,
        is_public=data.is_public,
        rating=data.rating,
    )
    return ok(ReviewOut.model_validate(created))


@router.get("/performances/{performance_id}/reviews")
def list_reviews(
    performance_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    perf = db.query(Performance).filter(Performance.id == performance_id).first()
    if not perf:
        raise HTTPException(status_code=404, detail="공연을 찾을 수 없습니다.")

    # 비공개 포함 조회 조건:
    # - 작성자 본인(본인 비공개 후기 포함)
    # - 공연 주최 동아리 관리자(ADMIN + same club)
    include_private = False
    if getattr(current_user, "role", None) == UserRole.ADMIN and getattr(current_user, "club_id", None) == getattr(perf, "club_id", None):
        include_private = True

    reviews = ReviewRepository.list_for_performance(
        db=db,
        performance_id=performance_id,
        include_private=include_private,
    )

    # 작성자 본인은 본인 비공개 후기도 포함해서 보여주기
    if not include_private:
        # 공개 후기 + (내 비공개 후기)만 추가
        mine_private = (
            db.query(ReviewRepository.__annotations__)  # dummy to satisfy type check
        )
        mine_private = (
            db.query(type(reviews[0]) if reviews else ReviewRepository)  # placeholder, overwritten below
        )
        mine_private = (
            db.query(__import__("app.models.review", fromlist=["Review"]).Review)
            .filter(__import__("app.models.review", fromlist=["Review"]).Review.performance_id == performance_id)
            .filter(__import__("app.models.review", fromlist=["Review"]).Review.author_user_id == current_user.id)
            .filter(__import__("app.models.review", fromlist=["Review"]).Review.is_public == False)  # noqa: E712
            .all()
        )
        # merge unique by id
        seen = set()
        merged = []
        for r in reviews + mine_private:
            if r.id in seen:
                continue
            seen.add(r.id)
            merged.append(r)
        reviews = sorted(merged, key=lambda x: x.created_at, reverse=True)

    return ok([ReviewOut.model_validate(r) for r in reviews])


@router.patch("/reviews/{review_id}")
def update_review(
    review_id: int,
    data: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    review = ReviewRepository.get_by_id(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="후기를 찾을 수 없습니다.")

    if review.author_user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="작성자만 수정할 수 있습니다.")

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
    current_user=Depends(get_current_user),
):
    review = ReviewRepository.get_by_id(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="후기를 찾을 수 없습니다.")

    if review.author_user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="작성자만 삭제할 수 있습니다.")

    ReviewRepository.delete(db, review)
    return ok({"message": "삭제되었습니다."})
