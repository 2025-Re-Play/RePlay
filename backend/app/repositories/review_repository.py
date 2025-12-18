from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models.review import Review


class ReviewRepository:
    @staticmethod
    def create(
        db: Session,
        performance_id: int,
        author_user_id: int,
        content: str,
        is_public: bool,
        rating: Optional[int],
    ) -> Review:
        r = Review(
            performance_id=performance_id,
            author_user_id=author_user_id,
            content=content,
            is_public=is_public,
            rating=rating,
        )
        db.add(r)
        db.commit()
        db.refresh(r)
        return r

    @staticmethod
    def get_by_id(db: Session, review_id: int) -> Optional[Review]:
        return db.query(Review).filter(Review.id == review_id).first()

    @staticmethod
    def list_for_performance(
        db: Session,
        performance_id: int,
        include_private: bool,
    ) -> List[Review]:
        q = db.query(Review).filter(Review.performance_id == performance_id)
        if not include_private:
            q = q.filter(Review.is_public == True)  # noqa: E712
        return q.order_by(desc(Review.created_at)).all()

    @staticmethod
    def update(db: Session, review: Review) -> Review:
        review.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(review)
        return review

    @staticmethod
    def delete(db: Session, review: Review) -> None:
        db.delete(review)
        db.commit()
